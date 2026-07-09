/**
 * Tests for CopilotSettings defaults and loading.
 */
import { DEFAULT_SETTINGS, CopilotSettings } from "../settings";

describe("CopilotSettings", () => {
  test("DEFAULT_SETTINGS has all required fields", () => {
    expect(DEFAULT_SETTINGS.apiKey).toBe("");
    expect(DEFAULT_SETTINGS.apiUrl).toBe("https://api.deepseek.com");
    expect(DEFAULT_SETTINGS.providerType).toBe("budget");
    expect(DEFAULT_SETTINGS.chatModel).toBe("deepseek-v4-flash");
    expect(DEFAULT_SETTINGS.embeddingModel).toBe("deepseek-embedding");
    expect(DEFAULT_SETTINGS.maxTokens).toBe(4096);
    expect(DEFAULT_SETTINGS.temperature).toBe(0.7);
    expect(DEFAULT_SETTINGS.contextTurns).toBe(5);
    expect(DEFAULT_SETTINGS.streamEnabled).toBe(true);
    expect(DEFAULT_SETTINGS.enableSemanticSearch).toBe(false);
    expect(DEFAULT_SETTINGS.maxSourceChunks).toBe(5);
    expect(DEFAULT_SETTINGS.chunkSize).toBe(500);
    expect(DEFAULT_SETTINGS.webSearchEnabled).toBe(false);
    expect(DEFAULT_SETTINGS.enableAgentMode).toBe(false);
    expect(DEFAULT_SETTINGS.agentMaxIterations).toBe(8);
    expect(DEFAULT_SETTINGS.lmStudioUrl).toBe("http://localhost:1234/v1");
    expect(DEFAULT_SETTINGS.lmStudioModel).toBe("qwen2.5-vl-27b-instruct");
  });

  test("DEFAULT_SETTINGS merged with partial data preserves defaults", () => {
    const data = { apiKey: "sk-123", temperature: 1.0 };
    const merged = Object.assign({}, DEFAULT_SETTINGS, data);
    expect(merged.apiKey).toBe("sk-123");
    expect(merged.temperature).toBe(1.0);
    expect(merged.maxTokens).toBe(4096); // from defaults
    expect(merged.chatModel).toBe("deepseek-v4-flash"); // from defaults
  });

  test("providerType accepts valid values", () => {
    const types: CopilotSettings["providerType"][] = [
      "auto",
      "deepseek",
      "openai",
      "anthropic",
      "openrouter",
    ];
    for (const t of types) {
      const s = { ...DEFAULT_SETTINGS, providerType: t };
      expect(s.providerType).toBe(t);
    }
  });
});
