/**
 * Tests for AgentModeRunner — tool calling loop.
 */
import { AgentModeRunner, AgentEvent } from "../agent/AgentModeRunner";
import { ToolRegistry } from "../agent/ToolRegistry";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { LLMMessage, ChatStreamChunk } from "../LLMProviders/types";

// Fake LLM provider that returns controlled responses
class FakeProvider implements LLMProvider {
  readonly providerType = "openai" as const;
  config: any = { enableThinking: false, chatModel: "", maxTokens: 4096, temperature: 0.7, topP: 0.8, topK: 20, presencePenalty: 0, reasoningEffort: "high" as const, apiKey: "", apiUrl: "", embeddingModel: "", visionModel: "" };
  responses: string[] = [];
  callCount = 0;
  lastMessages: LLMMessage[][] = [];

  updateConfig() {}

  async chat(messages: LLMMessage[]): Promise<string> {
    this.lastMessages.push(messages);
    // First call is always the LLM classifier → return generic categories
    if (this.callCount === 0) {
      this.callCount++;
      return '["read","search","write"]';
    }
    const resp = this.responses[this.callCount - 1] ?? "No response configured";
    this.callCount++;
    return resp;
  }

  async *chatStream(messages: LLMMessage[]): AsyncGenerator<ChatStreamChunk> {
    const resp = await this.chat(messages);
    yield { content: resp, done: true };
  }

  async embed(texts: string[]): Promise<number[][]> {
    return texts.map(() => []);
  }

  async embedSingle(text: string): Promise<number[]> {
    return [];
  }
}

describe("AgentModeRunner", () => {
  let provider: FakeProvider;
  let runner: AgentModeRunner;
  let registry: ToolRegistry;

  beforeEach(() => {
    (ToolRegistry as any).instance = undefined;
    provider = new FakeProvider();
    runner = new AgentModeRunner(provider);
    registry = ToolRegistry.getInstance();
  });

  test("returns LLM response when no tool calls needed", async () => {
    provider.responses = ["This is a simple answer. No tools needed."];

    const result = await runner.run(
      [{ role: "user", content: "Hello" }],
      registry
    );

    expect(result).toBe("This is a simple answer. No tools needed.");
    expect(provider.callCount).toBe(2); // +1 for LLM classification
  });

  test("executes tool and returns final response", async () => {
    // Register a tool
    registry.register({
      name: "weather",
      description: "Get weather for a city",
      parameters: {
        type: "object",
        properties: { city: { type: "string" } },
        required: ["city"],
      },
      execute: async (p) => `Weather in ${p.city}: sunny, 22°C`,
    });

    // First call: LLM requests tool
    provider.responses = [
      JSON.stringify({
        tool_call: { name: "weather", arguments: { city: "Madrid" } },
      }),
      "Based on the weather in Madrid being sunny and 22°C, I recommend going outside.",
    ];

    const events: AgentEvent[] = [];
    runner.on((e) => events.push(e));

    const result = await runner.run(
      [{ role: "user", content: "What's the weather like in Madrid?" }],
      registry
    );

    expect(result).toContain("sunny");
    expect(provider.callCount).toBe(3); // +1 for LLM classification

    // Check events
    const startEvents = events.filter((e) => e.type === "tool-start");
    const endEvents = events.filter((e) => e.type === "tool-end");
    expect(startEvents).toHaveLength(1);
    expect(startEvents[0].toolName).toBe("weather");
    expect(endEvents).toHaveLength(1);
    expect(endEvents[0].toolName).toBe("weather");
    expect(endEvents[0].data).toContain("sunny");
  });

  test("stops after maxIterations", async () => {
    registry.register({
      name: "loop",
      description: "Always calls itself",
      parameters: { type: "object", properties: {}, required: [] },
      execute: async () => "looping",
    });

    // Always return a tool call to loop forever
    const toolCall = JSON.stringify({
      tool_call: { name: "loop", arguments: {} },
    });
    provider.responses = Array(20).fill(toolCall);

    const result = await runner.run(
      [{ role: "user", content: "Start looping" }],
      registry,
      3 // small max to prevent hanging
    );

    // Should have run at most 3 iterations + 1 final call = 4 calls
    expect(provider.callCount).toBeLessThanOrEqual(7); // +1 for LLM classification + estimate may increase
  });

  test("merges original system message with runner's system prompt", async () => {
    provider.responses = ["Answer with context."];

    const result = await runner.run(
      [
        { role: "system", content: "User lives in Barcelona." },
        { role: "user", content: "Where do I live?" },
      ],
      registry
    );

    // Check that the system message was passed through
    // firstMessages[0] is classification call, [1] is the real agent call
    const firstCall = provider.lastMessages[1];
    const systemMsg = firstCall.find((m) => m.role === "system");
    expect(systemMsg).toBeDefined();
    expect(systemMsg!.content).toContain("Barcelona");
    expect(systemMsg!.content).toContain("tool-using agent inside Obsidian");
  });

  test("handles tool execution errors gracefully", async () => {
    registry.register({
      name: "flaky",
      description: "Sometimes fails",
      parameters: { type: "object", properties: {}, required: [] },
      execute: async () => {
        throw new Error("network down");
      },
    });

    provider.responses = [
      JSON.stringify({ tool_call: { name: "flaky", arguments: {} } }),
      "The tool failed, but I'll try to help anyway.",
    ];

    const result = await runner.run(
      [{ role: "user", content: "Use the flaky tool" }],
      registry
    );

    expect(result).toContain("failed");
    expect(provider.callCount).toBe(3); // +1 for LLM classification
  });

  test("listeners can be removed via off()", async () => {
    provider.responses = ["Simple answer."];

    const events: AgentEvent[] = [];
    const listener = (e: AgentEvent) => events.push(e);
    runner.on(listener);
    runner.off(listener);

    await runner.run(
      [{ role: "user", content: "Hello" }],
      registry
    );

    expect(events).toHaveLength(0);
  });

  test("parseResponse detects JSON tool_call in mixed text", () => {
    const response = 'Some text before {"tool_call": {"name": "foo", "arguments": {"x": 1}}} and after';
    const parsed = (runner as any).parseResponse(response);
    expect(parsed.toolCalls).toHaveLength(1);
    expect(parsed.toolCalls![0].function.name).toBe("foo");
    expect(parsed.toolCalls![0].function.arguments).toBe('{"x":1}');
  });

  test("parseResponse returns content when no tool_call found", () => {
    const response = "Just a normal answer.";
    const parsed = (runner as any).parseResponse(response);
    expect(parsed.toolCalls).toBeNull();
    expect(parsed.content).toBe("Just a normal answer.");
  });
});
