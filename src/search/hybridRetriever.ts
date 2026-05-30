import { VectorStoreManager } from "./vectorStoreManager";
import { LLMProvider } from "../LLMProviders/providerTypes";

/**
 * HybridRetriever — combines vector similarity with full-text search.
 * Falls back to simple text matching when embeddings aren't available.
 */
export class HybridRetriever {
  private vsm: VectorStoreManager;
  private llmProvider: LLMProvider;

  constructor(vsm: VectorStoreManager, llmProvider: LLMProvider) {
    this.vsm = vsm;
    this.llmProvider = llmProvider;
  }

  async search(
    query: string,
    maxResults: number = 5,
    vectorWeight: number = 0.7
  ): Promise<Array<{ text: string; path: string; score: number }>> {
    const results: Map<string, { text: string; path: string; vectorScore: number; textScore: number }> = new Map();

    // Vector search
    try {
      const queryVector = await this.llmProvider.embedSingle(query);
      if (queryVector && queryVector.length > 0 && queryVector.some(n => n !== 0)) {
        const vectorResults = await this.vsm.searchSimilar(queryVector, maxResults * 2);
        for (const r of vectorResults) {
          results.set(r.path + r.text.substring(0, 40), {
            text: r.text, path: r.path,
            vectorScore: r.score, textScore: 0,
          });
        }
      }
    } catch (err) {
      console.warn("[HybridRetriever] Embedding generation failed, falling back to text-only:", err);
    }

    // Full-text search (case-insensitive)
    const queryLower = query.toLowerCase();
    const chunks = this.vsm.getChunks();
    for (const chunk of chunks) {
      const textLower = chunk.text.toLowerCase();
      if (textLower.includes(queryLower)) {
        const key = chunk.path + chunk.text.substring(0, 40);
        const existing = results.get(key);
        const textScore = this.calculateTextScore(query, chunk.text);
        if (existing) {
          existing.textScore = textScore;
        } else {
          results.set(key, {
            text: chunk.text, path: chunk.path,
            vectorScore: 0, textScore,
          });
        }
      }
    }

    // Combine scores
    const combined = Array.from(results.values()).map(r => ({
      text: r.text,
      path: r.path,
      score: r.vectorScore * vectorWeight + r.textScore * (1 - vectorWeight),
    }));

    combined.sort((a, b) => b.score - a.score);
    return combined.slice(0, maxResults);
  }

  private calculateTextScore(query: string, text: string): number {
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return 0;
    let matches = 0;
    for (const word of words) {
      if (textLower.includes(word)) matches++;
    }
    return matches / words.length;
  }
}
