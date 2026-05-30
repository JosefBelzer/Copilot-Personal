/**
 * Tests for LM Studio integration as primary provider + model detection.
 */
import { ProviderManager } from "../LLMProviders/providerManager";
import { LmStudioService } from "../services/lmStudioService";
import { DEFAULT_SETTINGS } from "../settings";

const obsidian = require("../../__mocks__/obsidian");

describe("LM Studio as Primary Provider", () => {
  test("auto-detects LM Studio from localhost:1234 URL", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "http://localhost:1234/v1",
      providerType: "auto" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("lmstudio");
  });

  test("auto-detects LM Studio from 127.0.0.1 URL", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "http://127.0.0.1:1234/v1",
      providerType: "auto" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("lmstudio");
  });

  test("auto-detects LM Studio from URL containing 'lmstudio'", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "http://my-lmstudio-server:1234/v1",
      providerType: "auto" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("lmstudio");
  });

  test("respects explicit providerType 'lmstudio'", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "https://api.deepseek.com",
      providerType: "lmstudio" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("lmstudio");
  });

  test("LM Studio provider can chat (uses OpenAI-compatible API)", async () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "http://localhost:1234/v1",
      chatModel: "qwen2.5-vl-27b-instruct",
      providerType: "lmstudio" as const,
    };
    const pm = new ProviderManager(settings);
    const provider = pm.getActiveProvider();

    // Mock the chat response (normalizeUrl strips trailing /v1 then adds /v1/chat/completions)
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/chat/completions", {
      status: 200,
      json: {
        choices: [{ message: { role: "assistant", content: "Hello from LM Studio!" } }],
      },
    });

    const response = await provider.chat([
      { role: "user", content: "Hi" },
    ]);
    expect(response).toBe("Hello from LM Studio!");
  });

  test("LM Studio provider can generate embeddings", async () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "http://localhost:1234/v1",
      embeddingModel: "text-embedding-nomic-embed-text-v1.5",
      providerType: "lmstudio" as const,
    };
    const pm = new ProviderManager(settings);
    const provider = pm.getActiveProvider();

    obsidian.setRequestUrlResponse("http://localhost:1234/v1/embeddings", {
      status: 200,
      json: {
        data: [
          { embedding: [0.1, 0.2, 0.3] },
          { embedding: [0.4, 0.5, 0.6] },
        ],
      },
    });

    const vectors = await provider.embed(["text1", "text2"]);
    expect(vectors).toHaveLength(2);
    expect(vectors[0]).toEqual([0.1, 0.2, 0.3]);
  });

  test("setActiveProvider can switch to lmstudio at runtime", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiUrl: "https://api.deepseek.com",
      providerType: "auto" as const,
    };
    const pm = new ProviderManager(settings);
    expect(pm.getActiveProvider().providerType).toBe("deepseek");

    pm.setActiveProvider("lmstudio");
    expect(pm.getActiveProvider().providerType).toBe("lmstudio");
  });
});

describe("LmStudioService - Model Detection", () => {
  beforeEach(() => {
    obsidian.resetRequestUrl();
  });

  test("fetchModels returns sorted model IDs from LM Studio", async () => {
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/models", {
      status: 200,
      json: {
        object: "list",
        data: [
          { id: "qwen2.5-vl-27b-instruct", object: "model", owned_by: "lmstudio" },
          { id: "deepseek-r1-distill-qwen-7b", object: "model", owned_by: "lmstudio" },
          { id: "gemma-3-12b-it", object: "model", owned_by: "lmstudio" },
        ],
      },
    });

    const models = await LmStudioService.fetchModels("http://localhost:1234/v1");
    expect(models).toEqual([
      "deepseek-r1-distill-qwen-7b",
      "gemma-3-12b-it",
      "qwen2.5-vl-27b-instruct",
    ]);
  });

  test("fetchModels returns empty array when no models loaded", async () => {
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/models", {
      status: 200,
      json: { object: "list", data: [] },
    });

    const models = await LmStudioService.fetchModels("http://localhost:1234/v1");
    expect(models).toEqual([]);
  });

  test("fetchModels handles missing data field gracefully", async () => {
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/models", {
      status: 200,
      json: { object: "list" },
    });

    const models = await LmStudioService.fetchModels("http://localhost:1234/v1");
    expect(models).toEqual([]);
  });

  test("isReachable returns true when LM Studio responds", async () => {
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/models", {
      status: 200,
      json: { object: "list", data: [{ id: "test-model", object: "model", owned_by: "lmstudio" }] },
    });

    const reachable = await LmStudioService.isReachable("http://localhost:1234/v1");
    expect(reachable).toBe(true);
  });

  test("isReachable returns false when LM Studio is down", async () => {
    obsidian.setRequestUrlResponse("http://localhost:1234/v1/models", {
      status: 500,
      json: {},
    });

    // The requestUrl mock does NOT throw on non-200, only the status is non-200.
    // The fetchModels function checks response.status !== 200 and throws.
    // isReachable catches all errors and returns false.
    const reachable = await LmStudioService.isReachable("http://localhost:1234/v1");
    expect(reachable).toBe(false);
  });
});
