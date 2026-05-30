import { requestUrl } from "obsidian";

/**
 * External reranker — improves search result precision when vector scores are low.
 */
export class Reranker {
  private apiUrl: string;

  constructor(apiUrl: string = "") {
    this.apiUrl = apiUrl;
  }

  async rerank(
    query: string,
    results: Array<{ text: string; path: string; score: number }>,
    threshold: number = 0.5
  ): Promise<Array<{ text: string; path: string; score: number }>> {
    // If all scores are above threshold, no reranking needed
    if (results.every(r => r.score >= threshold)) return results;

    // If no external API, do a simple text-based re-scoring
    if (!this.apiUrl) {
      return this.rerankLocally(query, results);
    }

    try {
      const response = await requestUrl({
        url: this.apiUrl,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, documents: results.map(r => r.text) }),
      });
      const data = response.json;
      if (data.scores && Array.isArray(data.scores)) {
        return results.map((r, i) => ({
          ...r,
          score: data.scores[i] ?? r.score,
        })).sort((a, b) => b.score - a.score);
      }
    } catch (err) {
      console.warn("[Reranker] External reranker failed, falling back to local scoring:", err);
    }

    return this.rerankLocally(query, results);
  }

  private rerankLocally(
    query: string,
    results: Array<{ text: string; path: string; score: number }>
  ): Array<{ text: string; path: string; score: number }> {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    return results.map(r => {
      const textLower = r.text.toLowerCase();
      let matches = 0;
      for (const word of queryWords) {
        if (textLower.includes(word)) matches++;
      }
      const textScore = queryWords.length > 0 ? matches / queryWords.length : 0;
      return { ...r, score: Math.max(r.score, textScore) };
    }).sort((a, b) => b.score - a.score);
  }
}
