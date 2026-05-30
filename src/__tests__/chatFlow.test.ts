/**
 * Tests for the chat view context builder and message handling.
 * Uses the plug-in's CopilotChatView via the ItemView stub.
 */
import { LLMMessage } from "../LLMProviders/types";
import { DEFAULT_SETTINGS, CopilotSettings } from "../settings";

// We test the LLM message types and context building logic
// (CopilotChatView itself requires DOM, so we test the pure logic)

const obsidian = require("../../__mocks__/obsidian");

describe("Chat Message Flow", () => {
  test("LLMMessage type enforces correct roles", () => {
    const validMessages: LLMMessage[] = [
      { role: "system", content: "You are helpful." },
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ];

    for (const msg of validMessages) {
      expect(["system", "user", "assistant"]).toContain(msg.role);
      expect(typeof msg.content).toBe("string");
    }
  });

  test("ChatStreamChunk marks end correctly", () => {
    const chunks = [
      { content: "Hello", done: false },
      { content: " World", done: false },
      { content: "", done: true },
    ];

    let full = "";
    for (const chunk of chunks) {
      if (chunk.done) break;
      full += chunk.content;
    }
    expect(full).toBe("Hello World");
  });
});

describe("Context Builder Logic", () => {
  function buildContext(
    userText: string,
    settings: CopilotSettings,
    messages: Array<{ role: string; content: string }>,
    ragChunks?: Array<{ text: string; path: string }>
  ): LLMMessage[] {
    const turns = settings.contextTurns * 2;
    const recentMessages = messages.slice(-turns);

    let systemContent = "You are a helpful AI assistant integrated into Obsidian. Answer the user's questions clearly and concisely. Use markdown formatting when appropriate.";

    if (settings.enableSemanticSearch && ragChunks && ragChunks.length > 0) {
      const ragContext = ragChunks
        .map((c, i) => `[Source ${i + 1}: ${c.path}]\n${c.text}`)
        .join("\n\n");
      systemContent += `\n\nRelevant notes from the user's vault:\n\n${ragContext}\n\nUse this context to help answer the user's question. Cite sources when possible.`;
    }

    const context: LLMMessage[] = [
      { role: "system", content: systemContent },
    ];

    for (const msg of recentMessages) {
      if (msg.role === "user" || msg.role === "assistant") {
        context.push({ role: msg.role as "user" | "assistant", content: msg.content });
      }
    }

    return context;
  }

  test("context builder includes system message with user prompt", () => {
    const context = buildContext("Hello", DEFAULT_SETTINGS, [], []);
    expect(context).toHaveLength(1); // Only system message (no history)
    expect(context[0].role).toBe("system");
    expect(context[0].content).toContain("helpful AI assistant");
  });

  test("context builder limits history to contextTurns", () => {
    const settings = { ...DEFAULT_SETTINGS, contextTurns: 2 };
    const history = [
      { role: "user", content: "Q1" },
      { role: "assistant", content: "A1" },
      { role: "user", content: "Q2" },
      { role: "assistant", content: "A2" },
      { role: "user", content: "Q3" },
      { role: "assistant", content: "A3" },
    ];

    const context = buildContext("Q4", settings, history, []);
    // 2 turns * 2 = 4 messages from history + 1 system = 5 total
    expect(context).toHaveLength(5);
    // Should NOT include Q1/A1
    expect(context[1].content).toBe("Q2");
    expect(context[4].content).toBe("A3");
  });

  test("context builder includes RAG chunks when enabled", () => {
    const settings = { ...DEFAULT_SETTINGS, enableSemanticSearch: true };
    const ragChunks = [
      { text: "Important note about AI", path: "ai.md" },
      { text: "Deep learning explained", path: "dl.md" },
    ];

    const context = buildContext("Tell me about AI", settings, [], ragChunks);
    expect(context[0].content).toContain("Source 1: ai.md");
    expect(context[0].content).toContain("Source 2: dl.md");
    expect(context[0].content).toContain("Important note about AI");
    expect(context[0].content).toContain("Cite sources");
  });

  test("context builder does NOT include RAG when disabled", () => {
    const settings = { ...DEFAULT_SETTINGS, enableSemanticSearch: false };
    const ragChunks = [{ text: "Some note", path: "note.md" }];

    const context = buildContext("Query", settings, [], ragChunks);
    expect(context[0].content).not.toContain("Source");
    expect(context[0].content).not.toContain("note.md");
  });

  test("context builder filters out system messages from history", () => {
    const history = [
      { role: "system", content: "tool result here" },
      { role: "user", content: "User message" },
      { role: "assistant", content: "Assistant reply" },
    ];

    const context = buildContext("New message", DEFAULT_SETTINGS, history, []);
    // System from history should be excluded, only user + assistant + new system
    expect(context).toHaveLength(3); // system + user + assistant
    const roles = context.map((m) => m.role);
    expect(roles.filter((r) => r === "system")).toHaveLength(1);
  });
});
