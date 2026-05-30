import { DataAdapter } from "obsidian";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { CopilotSettings } from "../settings";

interface ChunkRecord {
  id: string;
  vector: number[];
  text: string;
  path: string;
  modified: number;
}

interface IndexData {
  version: number;
  chunks: ChunkRecord[];
}

const TAG = "[VectorStoreManager]";

export class VectorStoreManager {
  private static instance: VectorStoreManager;
  private chunks: ChunkRecord[] = [];
  private llmProvider: LLMProvider | null = null;
  private settings: CopilotSettings | null = null;
  private isIndexing = false;
  private isPaused = false;
  private isCancelled = false;
  private dataPath: string = "";
  private dirty = false;
  private loadSucceeded = false;
  private adapter: DataAdapter | null = null;

  private constructor() {}

  static getInstance(): VectorStoreManager {
    if (!VectorStoreManager.instance) {
      VectorStoreManager.instance = new VectorStoreManager();
    }
    return VectorStoreManager.instance;
  }

  static resetInstance(): void {
    VectorStoreManager.instance = undefined as any;
  }

  configure(llmProvider: LLMProvider, settings: CopilotSettings, vaultPath: string, adapter?: DataAdapter) {
    this.llmProvider = llmProvider;
    this.settings = settings;
    this.dataPath = vaultPath ? `${vaultPath}/.obsidian/copilot-personal-index.json` : "";
    this.adapter = adapter ?? null;
  }

  async loadIndex(): Promise<void> {
    if (!this.dataPath) {
      console.warn(`${TAG} No dataPath configured — skipping index load`);
      this.loadSucceeded = false;
      return;
    }
    if (!this.adapter) {
      console.warn(`${TAG} No adapter available — skipping index load`);
      this.loadSucceeded = false;
      return;
    }
    try {
      const exists = await this.adapter.exists(this.dataPath);
      if (!exists) {
        this.loadSucceeded = true; // no index yet is not a failure
        return;
      }
      const raw = await this.adapter.read(this.dataPath);
      const data: IndexData = JSON.parse(raw);
      this.chunks = data.chunks ?? [];
      this.loadSucceeded = true;
    } catch (err) {
      console.error(`${TAG} Failed to load index:`, err);
      this.chunks = [];
      this.loadSucceeded = false;
    }
  }

  async saveIndex(): Promise<void> {
    if (!this.dirty) return;
    if (!this.dataPath || !this.adapter) {
      console.warn(`${TAG} Cannot save — no dataPath or adapter`);
      return;
    }
    try {
      const data: IndexData = {
        version: 1,
        chunks: this.chunks,
      };
      await this.adapter.write(this.dataPath, JSON.stringify(data));
      this.dirty = false;
    } catch (err) {
      console.error(`${TAG} Failed to save index:`, err);
    }
  }

  wasLoaded(): boolean {
    return this.loadSucceeded;
  }

  getChunks(): ChunkRecord[] {
    return this.chunks;
  }

  async clearIndex() {
    this.chunks = [];
    this.dirty = true;
    this.loadSucceeded = true;
    await this.saveIndex();
  }

  async isIndexEmpty(): Promise<boolean> {
    return this.chunks.length === 0;
  }

  async getIndexedFiles(): Promise<string[]> {
    const paths = new Set<string>();
    for (const chunk of this.chunks) {
      paths.add(chunk.path);
    }
    return Array.from(paths);
  }

  async getDocumentsByPath(notePath: string): Promise<string[]> {
    return this.chunks
      .filter((c) => c.path === notePath)
      .map((c) => c.text);
  }

  getChunksByPath(notePath: string): ChunkRecord[] {
    return this.chunks.filter((c) => c.path === notePath);
  }

  async searchSimilar(queryVector: number[], limit: number = 5): Promise<Array<{ text: string; path: string; score: number }>> {
    if (this.chunks.length === 0) return [];
    if (queryVector.length === 0) return [];

    const scored = this.chunks.map((chunk) => ({
      score: this.cosineSimilarity(queryVector, chunk.vector),
      text: chunk.text,
      path: chunk.path,
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).filter((s) => s.score > 0.3)
      .map(s => ({ text: s.text, path: s.path, score: s.score }));
  }

  async upsertChunks(chunks: ChunkRecord[]) {
    for (const chunk of chunks) {
      const existingIdx = this.chunks.findIndex((c) => c.id === chunk.id);
      if (existingIdx >= 0) {
        this.chunks[existingIdx] = chunk;
      } else {
        this.chunks.push(chunk);
      }
    }
    this.dirty = true;
  }

  async removeFileChunks(notePath: string) {
    const before = this.chunks.length;
    this.chunks = this.chunks.filter((c) => c.path !== notePath);
    if (this.chunks.length !== before) {
      this.dirty = true;
    }
  }

  get indexingStatus() {
    return {
      isIndexing: this.isIndexing,
      isPaused: this.isPaused,
      isCancelled: this.isCancelled,
    };
  }

  pauseIndexing() { this.isPaused = true; }
  resumeIndexing() { this.isPaused = false; }
  cancelIndexing() { this.isCancelled = true; }
  getIsIndexing(): boolean { return this.isIndexing; }
  setIsIndexing(value: boolean) { this.isIndexing = value; }
  getIsCancelled(): boolean { return this.isCancelled; }
  getIsPaused(): boolean { return this.isPaused; }
  resetCancellation() { this.isCancelled = false; this.isPaused = false; }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * (b[i] ?? 0);
      normA += a[i] * a[i];
      normB += (b[i] ?? 0) * (b[i] ?? 0);
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
