import type { WebSearchResult, WebSearchResponse } from "./webSearchClient";

/**
 * Common interface for web search clients (browser-use and Exa).
 */
export interface SearchClient {
  search(query: string, maxSteps?: number, maxResults?: number): Promise<WebSearchResponse>;
  formatResultsForLLM(results: WebSearchResult[]): string;
  updateSettings(settings: unknown): void;
}
