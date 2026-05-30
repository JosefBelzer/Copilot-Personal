/**
 * Tests for singleton resetInstance methods — ensures reload safety.
 */
import { ToolRegistry } from "../agent/ToolRegistry";
import { VectorStoreManager } from "../search/vectorStoreManager";
import { WebSearchClient } from "../services/webSearchClient";

describe("Singleton Lifecycle — resetInstance", () => {
  test("ToolRegistry.resetInstance creates a fresh singleton", () => {
    const a = ToolRegistry.getInstance();
    a.register({
      name: "stale",
      description: "From old session",
      parameters: {},
      execute: async () => "old",
    });

    ToolRegistry.resetInstance();

    const b = ToolRegistry.getInstance();
    // Fresh instance should have no tools
    expect(b.getTool("stale")).toBeUndefined();
  });

  test("ToolRegistry singleton identity after reset", () => {
    const a = ToolRegistry.getInstance();
    ToolRegistry.resetInstance();
    const b = ToolRegistry.getInstance();
    const c = ToolRegistry.getInstance();

    // b and c should be the same instance
    expect(b).toBe(c);
    // a and b should be different instances
    expect(a).not.toBe(b);
  });

  test("VectorStoreManager.resetInstance creates fresh state", () => {
    const a = VectorStoreManager.getInstance();
    a.configure({} as any, {} as any, "/test");
    a.setIsIndexing(true);

    VectorStoreManager.resetInstance();

    const b = VectorStoreManager.getInstance();
    // Fresh instance should not be indexing
    expect(b.getIsIndexing()).toBe(false);
  });

  test("VectorStoreManager.resetInstance clears chunks", async () => {
    const a = VectorStoreManager.getInstance();
    await a.upsertChunks([
      { id: "x", vector: [1, 2, 3], text: "data", path: "f.md", modified: 1 },
    ]);

    VectorStoreManager.resetInstance();

    const b = VectorStoreManager.getInstance();
    expect(await b.isIndexEmpty()).toBe(true);
  });

  test("WebSearchClient.resetInstance reinitializes with new settings", () => {
    const oldSettings = { webSearchServerUrl: "http://old:8000/search", webSearchMaxResults: 3 } as any;
    const a = WebSearchClient.getInstance(oldSettings);

    WebSearchClient.resetInstance();

    const newSettings = { webSearchServerUrl: "http://new:8000/search", webSearchMaxResults: 5 } as any;
    const b = WebSearchClient.getInstance(newSettings);

    // Should be different instances
    expect(a).not.toBe(b);
  });
});
