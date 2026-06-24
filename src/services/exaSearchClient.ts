import { requestUrl } from "obsidian";
import { CopilotSettings } from "../settings";
import { t } from "../i18n";
import type { WebSearchResult, WebSearchResponse } from "./webSearchClient";

/**
 * Exa search client that implements the same interface as WebSearchClient
 * but calls the Exa API directly instead of requiring a local Python server.
 */
export class ExaSearchClient {
  private static instance: ExaSearchClient;
  private settings: CopilotSettings;

  private constructor(settings: CopilotSettings) {
    this.settings = settings;
  }

  static getInstance(settings?: CopilotSettings): ExaSearchClient {
    if (!ExaSearchClient.instance && settings) {
      ExaSearchClient.instance = new ExaSearchClient(settings);
    }
    if (settings) {
      ExaSearchClient.instance.settings = settings;
    }
    return ExaSearchClient.instance;
  }

  static resetInstance(): void {
    ExaSearchClient.instance = undefined as unknown as ExaSearchClient;
  }

  updateSettings(settings: CopilotSettings): void {
    this.settings = settings;
  }

  async search(query: string, _maxSteps?: number, maxResults?: number): Promise<WebSearchResponse> {
    const apiKey = this.settings.exaApiKey;
    if (!apiKey) {
      throw new Error(t("webSearch.exaKeyNotConfigured"));
    }

    const numResults = maxResults ?? this.settings.webSearchMaxResults;

    const response = await requestUrl({
      url: "https://api.exa.ai/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        query,
        numResults,
        type: "auto",
        contents: {
          highlights: true,
        },
      }),
    });

    if (response.status !== 200) {
      throw new Error(t("webSearch.serverError", { status: response.status, text: response.text }));
    }

    const data = response.json as {
      results: Array<{
        title?: string;
        url: string;
        text?: string;
        highlights?: string[];
        publishedDate?: string;
      }>;
      autopromptString?: string;
    };

    const results: WebSearchResult[] = (data.results || []).map((r) => {
      const snippetParts: string[] = [];
      if (r.highlights && r.highlights.length > 0) {
        snippetParts.push(r.highlights[0] ?? "");
      } else if (r.text) {
        snippetParts.push(r.text.slice(0, 200));
      }
      return {
        title: r.title || r.url,
        url: r.url,
        snippet: snippetParts.join(" ").trim(),
      };
    });

    return {
      query,
      results,
      summary: data.autopromptString || "",
      urls_visited: results.map((r) => r.url),
      steps_taken: 1,
    };
  }

  formatResultsForLLM(results: WebSearchResult[]): string {
    if (results.length === 0) return t("webSearch.noResults");

    return results
      .map((r, i) => t("webSearch.resultItem", { index: i + 1, title: r.title, url: r.url, snippet: r.snippet }))
      .join("\n\n");
  }
}
