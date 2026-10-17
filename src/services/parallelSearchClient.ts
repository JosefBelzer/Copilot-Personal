import { requestUrl } from "obsidian";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";
import type { WebSearchResponse, WebSearchResult } from "./webSearchClient";

const ENDPOINT = "https://search.parallel.ai/mcp";
const USER_AGENT = "Copilot-Personal/1.6.2 (+https://github.com/JosefBelzer/Copilot-Personal)";
const TIMEOUT_MS = 30_000;

/** Native HTTP avoids browser CORS restrictions and sends the project User-Agent. */
const nativeFetch: typeof fetch = async (input, init) => {
  // Search needs only POST responses. Obsidian buffers HTTP bodies, so do not
  // open the transport's optional, indefinitely-lived GET notification stream.
  if (init?.method === "GET") return new Response(null, { status: 405 });
  const headers = new Headers(init?.headers);
  headers.set("User-Agent", USER_AGENT);
  const nativeHeaders: Record<string, string> = {};
  headers.forEach((value, name) => { nativeHeaders[name] = value; });
  const signal = init?.signal;
  return new Promise<Response>((resolve, reject) => {
    const abort = () => reject(signal?.reason ?? new Error("Parallel search cancelled"));
    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener("abort", abort, { once: true });
    // requestUrl cannot abort its underlying socket. Stop awaiting it on abort;
    // a late response is discarded and cannot start another MCP request.
    requestUrl({
      url: input.toString(),
      method: init?.method ?? "POST",
      headers: nativeHeaders,
      body: init?.body as string | undefined,
      throw: false,
    }).then(response => new Response(response.status === 204 ? null : response.text, {
        status: response.status,
        headers: response.headers,
      })).then(resolve, reject).finally(() => signal?.removeEventListener("abort", abort));
  });
};

export class ParallelSearchClient {
  // Stable across searches in this plugin session, including failed requests.
  private readonly sessionId = crypto.randomUUID();

  async search(query: string, maxResults: number, signal?: AbortSignal): Promise<WebSearchResponse> {
    const client = new Client({ name: "copilot-personal", version: "1.6.2" });
    const transport = new StreamableHTTPClientTransport(new URL(ENDPOINT), { fetch: nativeFetch });
    const controller = new AbortController();
    const abort = () => controller.abort(signal?.reason ?? new Error("Parallel search cancelled"));
    const timer = setTimeout(() => controller.abort(new Error("Parallel search timed out after 30 seconds")), TIMEOUT_MS);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
    // Also bound initialization, not just the tool call. Closing the SDK
    // transport aborts pending nativeFetch waits without retrying the search.
    const cancelled = new Promise<never>((_, reject) => {
      controller.signal.addEventListener("abort", () => {
        void client.close();
        reject(controller.signal.reason);
      }, { once: true });
    });
    try {
      if (controller.signal.aborted) throw controller.signal.reason;
      const run = async () => {
        await client.connect(transport);
        if (controller.signal.aborted) throw controller.signal.reason;
        const result = CallToolResultSchema.parse(await client.callTool({ name: "web_search", arguments: {
          objective: query, search_queries: [query], session_id: this.sessionId,
        } }, undefined, { signal: controller.signal, timeout: TIMEOUT_MS }));
        if (result.isError) {
          const message = result.content.filter(c => c.type === "text").map(c => c.text).join("\n");
          throw new Error(`Parallel search: ${message || "tool request failed"}`);
        }
        const data = result.structuredContent ?? JSON.parse(
          result.content.filter(c => c.type === "text").map(c => c.text).join("\n")
        );
        if (!data || !Array.isArray(data.results)) throw new Error("Invalid Parallel search response");
        const results: WebSearchResult[] = data.results.slice(0, maxResults).map((r: {
          url?: unknown; title?: unknown; excerpts?: unknown;
        }) => {
          if (typeof r?.url !== "string" || !/^https?:\/\//i.test(r.url) ||
              !Array.isArray(r.excerpts) || !r.excerpts.every(e => typeof e === "string")) {
            throw new Error("Invalid Parallel search result");
          }
          return { title: typeof r.title === "string" && r.title ? r.title : r.url,
            url: r.url, snippet: r.excerpts.join("\n\n") };
        });
        return { query, results, summary: "", urls_visited: [], steps_taken: 1 };
      };
      return await Promise.race([run(), cancelled]);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      await client.close();
    }
  }
}
