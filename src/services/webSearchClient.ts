import { requestUrl } from "obsidian";
import { CopilotSettings } from "../settings";

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface WebSearchResponse {
  query: string;
  results: WebSearchResult[];
  summary: string;
  urls_visited: string[];
  steps_taken: number;
}

export class WebSearchClient {
  private static instance: WebSearchClient;
  private settings: CopilotSettings;

  private constructor(settings: CopilotSettings) {
    this.settings = settings;
  }

  static getInstance(settings?: CopilotSettings): WebSearchClient {
    if (!WebSearchClient.instance && settings) {
      WebSearchClient.instance = new WebSearchClient(settings);
    }
    if (settings) {
      WebSearchClient.instance.settings = settings;
    }
    return WebSearchClient.instance;
  }

  static resetInstance(): void {
    WebSearchClient.instance = undefined as any;
  }

  updateSettings(settings: CopilotSettings) {
    this.settings = settings;
  }

  async search(query: string, maxSteps: number = 15, maxResults?: number): Promise<WebSearchResponse> {
    const url = this.settings.webSearchServerUrl;
    if (!url) {
      throw new Error("Web search server URL not configured.");
    }

    const response = await requestUrl({
      url,
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Copilot-Token": this.settings.webSearchToken || "copilot-default-token-change-me" },
      body: JSON.stringify({
        query,
        max_steps: maxSteps,
        max_results: maxResults ?? this.settings.webSearchMaxResults,
        headless: true,
      }),
    });

    if (response.status !== 200) {
      throw new Error(`Search server returned ${response.status}: ${response.text}`);
    }

    return response.json as WebSearchResponse;
  }

  /**
   * Format search results as a string for LLM context.
   */
  formatResultsForLLM(results: WebSearchResult[]): string {
    if (results.length === 0) return "No results found.";

    return results
      .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`)
      .join("\n\n");
  }
}
