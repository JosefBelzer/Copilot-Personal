/**
 * Tests for VectorStoreManager — in-memory cosine similarity search.
 */
import { VectorStoreManager } from "../search/vectorStoreManager";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { DEFAULT_SETTINGS } from "../settings";

// Fake embedding provider
class FakeEmbedProvider implements LLMProvider {
  readonly providerType = "deepseek" as const;
  config: any = {} as any;
  updateConfig() {}

  async chat() { return ""; }
  async *chatStream(): AsyncGenerator<any> { yield { content: "", done: true }; }
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((_, i) => [i + 0.1, 0.5, 0.9]);
  }
  async embedSingle(text: string): Promise<number[]> {
    return [text.length * 0.01, 0.5, 0.3];
  }
}

describe("VectorStoreManager", () => {
  let vsm: VectorStoreManager;

  beforeEach(() => {
    (VectorStoreManager as any).instance = undefined;
    vsm = VectorStoreManager.getInstance();
    vsm.configure(new FakeEmbedProvider(), { ...DEFAULT_SETTINGS } as any, "/test-vault");
  });

  test("starts empty", async () => {
    expect(await vsm.isIndexEmpty()).toBe(true);
    expect(await vsm.getIndexedFiles()).toEqual([]);
  });

  test("upsertChunks adds entries", async () => {
    await vsm.upsertChunks([
      { id: "a-1", vector: [0.1, 0.2, 0.3], text: "Hello world", path: "note.md", modified: 1000 },
      { id: "a-2", vector: [0.4, 0.5, 0.6], text: "Second chunk", path: "note.md", modified: 1000 },
    ]);

    expect(await vsm.isIndexEmpty()).toBe(false);
    expect(await vsm.getIndexedFiles()).toEqual(["note.md"]);
  });

  test("upsertChunks replaces duplicate IDs", async () => {
    await vsm.upsertChunks([
      { id: "a-1", vector: [1, 2, 3], text: "Old", path: "x.md", modified: 1 },
    ]);
    await vsm.upsertChunks([
      { id: "a-1", vector: [4, 5, 6], text: "New", path: "x.md", modified: 2 },
    ]);

    const docs = await vsm.getDocumentsByPath("x.md");
    expect(docs).toEqual(["New"]);
    expect(vsm.getChunks()).toHaveLength(1);
  });

  test("removeFileChunks deletes all chunks for a path", async () => {
    await vsm.upsertChunks([
      { id: "a-1", vector: [1], text: "A", path: "a.md", modified: 1 },
      { id: "b-1", vector: [2], text: "B", path: "b.md", modified: 1 },
    ]);
    await vsm.removeFileChunks("a.md");

    expect(await vsm.getDocumentsByPath("a.md")).toEqual([]);
    expect(await vsm.getDocumentsByPath("b.md")).toEqual(["B"]);
  });

  test("cosine similarity returns 1 for identical vectors", () => {
    const sim = (vsm as any).cosineSimilarity(
      [1, 2, 3],
      [1, 2, 3]
    ) as number;
    expect(sim).toBeCloseTo(1.0, 5);
  });

  test("cosine similarity returns 0 for orthogonal vectors", () => {
    const sim = (vsm as any).cosineSimilarity(
      [1, 0, 0],
      [0, 1, 0]
    ) as number;
    expect(sim).toBeCloseTo(0, 5);
  });

  test("cosine similarity handles zero vector", () => {
    const sim = (vsm as any).cosineSimilarity(
      [0, 0, 0],
      [1, 2, 3]
    ) as number;
    expect(sim).toBe(0);
  });

  test("cosine similarity handles mismatched lengths", () => {
    const sim = (vsm as any).cosineSimilarity(
      [1, 2],
      [1, 2, 3, 4]
    ) as number;
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
  });

  test("searchSimilar returns top results filtered by threshold", async () => {
    await vsm.upsertChunks([
      { id: "c-1", vector: [0.9, 0.1, 0.05], text: "Relevant content about AI", path: "ai.md", modified: 1 },
      { id: "c-2", vector: [0.1, 0.9, 0.05], text: "Cooking recipes", path: "food.md", modified: 1 },
      { id: "c-3", vector: [0.85, 0.15, 0.1], text: "Machine learning intro", path: "ml.md", modified: 1 },
    ]);

    // Query similar to AI-related vectors
    const results = await vsm.searchSimilar([0.9, 0.1, 0.05], 3);
    expect(results.length).toBeGreaterThanOrEqual(1);
    // The closest match should be the AI note
    expect(results[0].path).toBe("ai.md");
  });

  test("clearIndex removes all chunks", async () => {
    await vsm.upsertChunks([
      { id: "d-1", vector: [1], text: "Data", path: "d.md", modified: 1 },
    ]);
    await vsm.clearIndex();
    expect(await vsm.isIndexEmpty()).toBe(true);
  });

  test("indexing status tracking", () => {
    expect(vsm.getIsIndexing()).toBe(false);
    vsm.setIsIndexing(true);
    expect(vsm.getIsIndexing()).toBe(true);
    expect(vsm.getIsPaused()).toBe(false);
    vsm.pauseIndexing();
    expect(vsm.getIsPaused()).toBe(true);
    vsm.resumeIndexing();
    expect(vsm.getIsPaused()).toBe(false);
    vsm.cancelIndexing();
    expect(vsm.getIsCancelled()).toBe(true);
    vsm.resetCancellation();
    expect(vsm.getIsCancelled()).toBe(false);
  });
});
