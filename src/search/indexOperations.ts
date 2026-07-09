import { TFile, Vault } from "obsidian";
import { VectorStoreManager } from "./vectorStoreManager";
import { LLMProvider } from "../LLMProviders/providerTypes";
import { CopilotSettings } from "../settings";
import { RateLimiter } from "../rateLimiter";
import { HybridRetriever } from "./hybridRetriever";
import { Reranker } from "./reranker";
import { t } from "../i18n";

interface ChunkResult {
  text: string;
  path: string;
  score: number;
}

export class IndexOperations {
  private vault: Vault;
  private vsm: VectorStoreManager;
  private llmProvider: LLMProvider;
  private settings: CopilotSettings;
  private rateLimiter: RateLimiter;
  private hybridRetriever: HybridRetriever;
  private reranker: Reranker;

  constructor(vault: Vault, vsm: VectorStoreManager, llmProvider: LLMProvider, settings: CopilotSettings) {
    this.vault = vault;
    this.vsm = vsm;
    this.llmProvider = llmProvider;
    this.settings = settings;
    this.rateLimiter = new RateLimiter(60);
    this.hybridRetriever = new HybridRetriever(vsm, llmProvider);
    this.reranker = new Reranker();
  }

  /**
   * Split text into chunks of approximately `chunkSize` tokens.
   * Uses a simple word-based split with overlap.
   */
  private splitIntoChunks(text: string, path: string): Array<{ text: string; path: string }> {
    const chunkSize = this.settings.chunkSize;
    const words = text.split(/\s+/);
    const chunks: Array<{ text: string; path: string }> = [];

    if (words.length === 0) return chunks;

    // Approximate: 1 token ≈ 0.75 words (English)
    const wordsPerChunk = Math.floor(chunkSize * 0.75);
    const overlapWords = Math.floor(wordsPerChunk * 0.1); // 10% overlap

    let start = 0;
    while (start < words.length) {
      const end = Math.min(start + wordsPerChunk, words.length);
      const chunkText = words.slice(start, end).join(" ");
      if (chunkText.trim()) {
        chunks.push({ text: chunkText.trim(), path });
      }
      start += wordsPerChunk - overlapWords;
      if (end >= words.length) break;
    }

    return chunks;
  }

  /**
   * Index all markdown files in the vault.
   */
  async indexVaultToVectorStore(onProgress?: (current: number, total: number) => void): Promise<void> {
    if (this.vsm.getIsIndexing()) return;

    this.vsm.setIsIndexing(true);
    this.vsm.resetCancellation();

    try {
      const files = this.vault.getMarkdownFiles();
      const excludedFolders = this.settings.excludedFolders
        .split(",")
        .map((f) => f.trim().toLowerCase())
        .filter((f) => f.length > 0);

      // Filter out excluded folders
      const filesToIndex = files.filter((f) => {
        const lowerPath = f.path.toLowerCase();
        return !excludedFolders.some((folder) => lowerPath.startsWith(folder));
      });

      const indexedFiles = await this.vsm.getIndexedFiles();
      const indexedSet = new Set(indexedFiles);

      // Find new or modified files
      const filesNeedingIndex: TFile[] = [];
      for (const file of filesToIndex) {
        if (!indexedSet.has(file.path)) {
          filesNeedingIndex.push(file);
        } else {
          const indexedMtime = await this.getStoredModifiedTime(file.path);
          if (indexedMtime < file.stat.mtime) {
            filesNeedingIndex.push(file);
          }
        }
      }

      if (filesNeedingIndex.length === 0) {
        this.vsm.setIsIndexing(false);
        return;
      }

      const total = filesNeedingIndex.length;
      let processed = 0;
      const batchSize = 10;
      const embeddingBatchSize = 20;

      // Process files in batches
      for (let i = 0; i < filesNeedingIndex.length; i += batchSize) {
        if (this.vsm.getIsCancelled()) break;

        while (this.vsm.getIsPaused()) {
          await this.sleep(500);
          if (this.vsm.getIsCancelled()) break;
        }

        const batch = filesNeedingIndex.slice(i, i + batchSize);

        // Read and chunk all files in the batch
        const allChunks: Array<{ text: string; path: string }> = [];
        const removedPaths: string[] = [];

        for (const file of batch) {
          try {
            const content = await this.vault.read(file);
            const chunks = this.splitIntoChunks(content, file.path);
            allChunks.push(...chunks);
            removedPaths.push(file.path);
          } catch (err) {
            console.error(`Error reading file ${file.path}:`, err);
          }
        }

        if (allChunks.length === 0) {
          processed += batch.length;
          if (onProgress) onProgress(processed, total);
          continue;
        }

        // Remove old chunks for these files
        for (const path of removedPaths) {
          await this.vsm.removeFileChunks(path);
        }

        // Embed chunks in sub-batches
        for (let j = 0; j < allChunks.length; j += embeddingBatchSize) {
          if (this.vsm.getIsCancelled()) break;

          const embedBatch = allChunks.slice(j, j + embeddingBatchSize);
          const texts = embedBatch.map((c) => c.text);

          try {
            const vectors = await this.rateLimiter.enqueue(() => this.llmProvider.embed(texts));

            // Validate: if all vectors are empty, embeddings are broken
            const allEmpty = vectors.every((v) => !v || v.length === 0 || v.every((n) => n === 0));
            if (allEmpty && vectors.length > 0) {
              throw new Error(
                t("notices.indexEmptyVectors")
              );
            }

            const records = embedBatch.map((chunk, idx) => ({
              id: `${chunk.path}-${i + j + idx}`,
              vector: vectors[idx] ?? [],
              text: chunk.text,
              path: chunk.path,
              modified: Date.now(),
            }));

            await this.vsm.upsertChunks(records);
          } catch (err) {
            console.error("Error embedding batch:", err);
          }
        }

        processed += batch.length;
        if (onProgress) onProgress(processed, total);
      }
    } finally {
      this.vsm.setIsIndexing(false);
    }
  }

  /**
   * Search for chunks similar to the query.
   */
  async searchSimilar(query: string, limit?: number): Promise<ChunkResult[]> {
    const maxChunks = limit ?? this.settings.maxSourceChunks;
    const isEmpty = await this.vsm.isIndexEmpty();
    if (isEmpty) return [];

    try {
      // Hybrid search: vector similarity + full-text matching
      const hybridResults = await this.hybridRetriever.search(query, maxChunks * 2);

      // Rerank for better precision
      const reranked = await this.reranker.rerank(query, hybridResults);
      return reranked.slice(0, maxChunks);
    } catch (err) {
      console.error("Error searching:", err);
      return [];
    }
  }

  /**
   * Index a single file.
   */
  async indexFile(file: TFile): Promise<void> {
    try {
      const content = await this.vault.read(file);
      const chunks = this.splitIntoChunks(content, file.path);

      await this.vsm.removeFileChunks(file.path);

      if (chunks.length === 0) return;

      const texts = chunks.map((c) => c.text);
      if (!this.llmProvider?.embed) {
        console.warn(`Skipping indexing of ${file.path}: no embed provider available`);
        return;
      }
      const vectors = await this.llmProvider.embed(texts);

      const records = chunks.map((chunk, idx) => ({
        id: `${chunk.path}-${idx}`,
        vector: vectors[idx] ?? [],
        text: chunk.text,
        path: chunk.path,
        modified: Date.now(),
      }));

      await this.vsm.upsertChunks(records);
    } catch (err) {
      console.error(`Error indexing file ${file.path}:`, err);
    }
  }

  /**
   * Remove a file from the index.
   */
  async removeFile(path: string): Promise<void> {
    await this.vsm.removeFileChunks(path);
  }

  private async getStoredModifiedTime(path: string): Promise<number> {
    const chunks = this.vsm.getChunksByPath(path);
    if (chunks.length > 0) {
      return chunks[0].modified;
    }
    return 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
