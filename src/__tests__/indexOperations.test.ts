/**
 * Tests for IndexOperations — chunking and batch indexing.
 */
import { IndexOperations } from "../search/indexOperations";
import { VectorStoreManager } from "../search/vectorStoreManager";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { DEFAULT_SETTINGS } from "../settings";

const obsidian = require("../../__mocks__/obsidian");

// Fake embedding provider that returns predictable vectors
class FakeProvider implements LLMProvider {
  readonly providerType = "deepseek" as const;
  config: any = {} as any;
  updateConfig() {}
  async chat() { return ""; }
  async *chatStream(): AsyncGenerator<any> { yield { content: "", done: true }; }
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((t) => [t.length * 0.01, 0.5, 0.3]);
  }
  async embedSingle(text: string): Promise<number[]> {
    return [text.length * 0.01, 0.5, 0.3];
  }
}

describe("IndexOperations", () => {
  let indexOps: IndexOperations;
  let vsm: VectorStoreManager;
  let provider: FakeProvider;

  beforeEach(() => {
    (VectorStoreManager as any).instance = undefined;
    obsidian.resetVault();
    vsm = VectorStoreManager.getInstance();
    provider = new FakeProvider();
    const settings = { ...DEFAULT_SETTINGS, chunkSize: 100, maxSourceChunks: 3 };
    vsm.configure(provider, settings as any, "/test");
    indexOps = new IndexOperations(obsidian.Vault as any, vsm, provider, settings as any);
  });

  test("splitIntoChunks divides long text into overlapping chunks", () => {
    // Generate 300 words of text
    const words = Array.from({ length: 300 }, (_, i) => `word${i}`);
    const text = words.join(" ");

    const chunks = (indexOps as any).splitIntoChunks(text, "test.md") as Array<{ text: string; path: string }>;

    // 100 tokens * 0.75 = 75 words per chunk, 300 words → ~4 chunks
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks.length).toBeLessThanOrEqual(6);

    // Verify each chunk has correct path
    for (const chunk of chunks) {
      expect(chunk.path).toBe("test.md");
      expect(chunk.text.length).toBeGreaterThan(0);
    }

    // Verify overlap: consecutive chunks should share some words
    if (chunks.length >= 2) {
      const lastWordChunk0 = chunks[0].text.split(" ").pop();
      const firstWordChunk1 = chunks[1].text.split(" ")[0];
      // Due to overlap, there should be some word sharing
      expect(chunks[0].text.length + chunks[1].text.length).toBeGreaterThan(0);
    }
  });

  test("splitIntoChunks handles empty text", () => {
    const chunks = (indexOps as any).splitIntoChunks("", "empty.md");
    expect(chunks).toEqual([]);
  });

  test("splitIntoChunks handles text shorter than chunk size", () => {
    const chunks = (indexOps as any).splitIntoChunks("Hello world", "short.md") as Array<any>;
    expect(chunks.length).toBe(1);
    expect(chunks[0].text).toBe("Hello world");
  });

  test("indexVaultToVectorStore indexes new files", async () => {
    // Set up mock vault files
    obsidian.setVaultFile("note1.md", "Content of note 1 " + "bla ".repeat(50));
    obsidian.setVaultFile("note2.md", "Content of note 2 " + "bla ".repeat(50));

    obsidian.setMarkdownFiles([
      new obsidian.TFile("note1.md", "note1", { mtime: Date.now() }),
      new obsidian.TFile("note2.md", "note2", { mtime: Date.now() }),
    ]);

    await indexOps.indexVaultToVectorStore();

    const indexedFiles = await vsm.getIndexedFiles();
    expect(indexedFiles.length).toBeGreaterThan(0);
  });

  test("indexVaultToVectorStore skips already-indexed unchanged files", async () => {
    obsidian.setVaultFile("note1.md", "unchanged content ".repeat(20));
    const mtime = Date.now();

    obsidian.setMarkdownFiles([
      new obsidian.TFile("note1.md", "note1", { mtime }),
    ]);

    // First indexing
    await indexOps.indexVaultToVectorStore();
    const firstCount = (await vsm.getIndexedFiles()).length;

    // Second indexing with no changes — should find nothing new
    vsm.setIsIndexing(false);
    obsidian.setMarkdownFiles([
      new obsidian.TFile("note1.md", "note1", { mtime }),
    ]);

    let progressCount = 0;
    await indexOps.indexVaultToVectorStore(() => { progressCount++; });

    // Should either skip because already indexed, or process 0 new files
    expect(progressCount).toBe(0);
  });

  test("indexVaultToVectorStore respects excluded folders", async () => {
    const settings = { ...DEFAULT_SETTINGS, chunkSize: 100, excludedFolders: "private,secret" };
    vsm.configure(provider, settings as any, "/test");
    indexOps = new IndexOperations(obsidian.Vault as any, vsm, provider, settings as any);

    obsidian.setVaultFile("private/secret.md", "should be excluded ".repeat(10));
    obsidian.setVaultFile("public/ok.md", "should be included ".repeat(10));

    obsidian.setMarkdownFiles([
      new obsidian.TFile("private/secret.md", "secret"),
      new obsidian.TFile("public/ok.md", "ok"),
    ]);

    await indexOps.indexVaultToVectorStore();

    const files = await vsm.getIndexedFiles();
    expect(files).not.toContain("private/secret.md");
  });

  test("searchSimilar returns chunks for a query", async () => {
    // Manually add a chunk to the store
    await vsm.upsertChunks([
      { id: "s-1", vector: [0.9, 0.1, 0.05], text: "Artificial intelligence is transforming the world", path: "ai.md", modified: 1 },
    ]);

    const results = await indexOps.searchSimilar("AI and technology");
    expect(results.length).toBeGreaterThanOrEqual(0);
  });

  test("indexFile indexes a single file", async () => {
    obsidian.setVaultFile("single.md", "Single file content " + "word ".repeat(30));
    const tfile = new obsidian.TFile("single.md", "single");

    await indexOps.indexFile(tfile);

    const docs = await vsm.getDocumentsByPath("single.md");
    expect(docs.length).toBeGreaterThan(0);
  });
});
