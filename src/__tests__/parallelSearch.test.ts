import { requestUrl } from "obsidian";
import { WebSearchClient } from "../services/webSearchClient";
import { DEFAULT_SETTINGS } from "../settings";
import { createWebSearchTool } from "../tools/webSearchTool";
import { ToolRegistry } from "../agent/ToolRegistry";
import { setLanguage } from "../i18n";
import { webcrypto } from "crypto";

jest.mock("obsidian", () => ({ requestUrl: jest.fn() }));
const request = requestUrl as jest.Mock;
const result = { url: "https://obsidian.md/help", title: "Obsidian Help", excerpts: ["Local notes", "Link your research"] };
const settings = () => ({ ...DEFAULT_SETTINGS, webSearchProvider: "parallel" as const,
  apiKey: "model-secret", webSearchToken: "local-secret", webSearchServerUrl: "http://localhost:9999/search" });

function reply(body: unknown, status = 200, type = "application/json") {
  return { status, headers: { "content-type": type, "mcp-session-id": "transport-session" },
    text: type === "text/event-stream" ? `event: message\ndata: ${JSON.stringify(body)}\n\n` : JSON.stringify(body) };
}

function serve(toolResult: unknown = { content: [], structuredContent: { results: [result] } }, sse = false) {
  request.mockImplementation(async (options: { body: string }) => {
    const message = JSON.parse(options.body);
    if (message.method === "initialize") return reply({ jsonrpc: "2.0", id: message.id, result: {
      protocolVersion: "2025-03-26", capabilities: { tools: {} }, serverInfo: { name: "Parallel fixture", version: "1" },
    } });
    if (message.method.startsWith("notifications/")) return reply(null, 202);
    return reply({ jsonrpc: "2.0", id: message.id, result: toolResult }, 200, sse ? "text/event-stream" : "application/json");
  });
}

beforeEach(() => {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
  WebSearchClient.resetInstance();
  ToolRegistry.resetInstance();
  request.mockReset();
  setLanguage("en");
});
afterEach(() => jest.useRealTimers());

test.each([false, true])("selected provider feeds real registered search_web tool (SSE=%s)", async sse => {
  serve({ content: [], structuredContent: { results: [result] } }, sse);
  const client = WebSearchClient.getInstance(settings());
  const registry = ToolRegistry.getInstance();
  registry.register(createWebSearchTool(client));
  const output = await registry.executeTool("search_web", { query: "Obsidian linking research notes" });
  expect(output).toContain("Obsidian Help");
  expect(output).toContain(result.url);
  expect(output).toContain("Local notes\n\nLink your research");
  expect(request).toHaveBeenCalledTimes(3);
  for (const [options] of request.mock.calls) {
    expect(options.url).toBe("https://search.parallel.ai/mcp");
    expect(options.method).toBe("POST");
    expect(options.headers["user-agent"]).toBe("Copilot-Personal/1.6.2 (+https://github.com/JosefBelzer/Copilot-Personal)");
    expect(JSON.stringify(options)).not.toMatch(/model-secret|local-secret|Authorization|X-Copilot-Token/);
  }
  const [init, notify, call] = request.mock.calls.map(([o]) => JSON.parse(o.body));
  expect(init.method).toBe("initialize");
  expect(notify.method).toBe("notifications/initialized");
  expect(call.params).toMatchObject({ name: "web_search", arguments: {
    objective: "Obsidian linking research notes", search_queries: ["Obsidian linking research notes"],
  } });
  expect(call.params.arguments.session_id).toMatch(/^[a-f0-9-]{36}$/);
  expect(request.mock.calls[2][0].headers["mcp-session-id"]).toBe("transport-session");
});

test("text JSON results, title fallback, result limits and response contract", async () => {
  serve({ content: [{ type: "text", text: JSON.stringify({ results: [{ ...result, title: null }, result] }) }] });
  const response = await WebSearchClient.getInstance(settings()).search("notes", 15, 1);
  expect(response).toEqual({ query: "notes", results: [{ title: result.url, url: result.url,
    snippet: "Local notes\n\nLink your research" }], summary: "", urls_visited: [], steps_taken: 1 });
});

test("empty results are consumed by the existing tool", async () => {
  serve({ content: [], structuredContent: { results: [] } });
  const output = await createWebSearchTool(WebSearchClient.getInstance(settings())).execute({ query: "missing" });
  expect(output).toContain("missing");
  expect(output).toContain("No results found");
});

test.each([
  { content: [{ type: "text", text: "quota exceeded" }], isError: true },
  { content: [], structuredContent: { results: [{ url: "javascript:alert(1)", excerpts: [] }] } },
  { content: [{ type: "text", text: "not JSON" }] },
  { content: [], structuredContent: { wrong: [] } },
])("tool and malformed-response errors reach the caller", async toolResult => {
  serve(toolResult);
  const output = await createWebSearchTool(WebSearchClient.getInstance(settings())).execute({ query: "notes" });
  expect(output).toMatch(/Error/i);
});

test.each([401, 429, 500])("HTTP %s fails without local fallback or retry", async status => {
  request.mockResolvedValue(reply({ error: "unavailable" }, status));
  await expect(WebSearchClient.getInstance(settings()).search("notes")).rejects.toThrow();
  expect(request).toHaveBeenCalledTimes(1);
});

test("network errors reach the existing agent tool", async () => {
  request.mockRejectedValue(new Error("Offline"));
  const output = await createWebSearchTool(WebSearchClient.getInstance(settings())).execute({ query: "notes" });
  expect(output).toContain("Offline");
});

test("initialization timeout stops waiting and does not search after a late response", async () => {
  jest.useFakeTimers();
  let complete!: (r: ReturnType<typeof reply>) => void;
  request.mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  const pending = WebSearchClient.getInstance(settings()).search("notes");
  const check = expect(pending).rejects.toThrow(/timed out|closed/i);
  await jest.advanceTimersByTimeAsync(30_000);
  await check;
  complete(reply({ jsonrpc: "2.0", id: 0, result: {} }));
  await Promise.resolve();
  expect(request).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});

test("abort during a tool request stops waiting without retrying", async () => {
  serve();
  const handler = request.getMockImplementation()!;
  const controller = new AbortController();
  request.mockImplementation(async options => {
    if (JSON.parse(options.body).method === "tools/call") {
      queueMicrotask(() => controller.abort(new Error("User cancelled")));
      return new Promise(() => {});
    }
    return handler(options);
  });
  await expect(WebSearchClient.getInstance(settings()).search("notes", 15, 3, controller.signal)).rejects.toThrow(/cancelled|closed/i);
  const calls = request.mock.calls.map(([o]) => JSON.parse(o.body));
  expect(calls.filter(c => c.method === "tools/call")).toHaveLength(1);
});

test("pre-aborted search makes no request", async () => {
  const controller = new AbortController();
  controller.abort(new Error("User cancelled"));
  await expect(WebSearchClient.getInstance(settings()).search("notes", 15, 3, controller.signal)).rejects.toThrow("User cancelled");
  expect(request).not.toHaveBeenCalled();
});

test("switching provider preserves saved local request and stable Parallel session", async () => {
  serve();
  const configured = settings();
  const client = WebSearchClient.getInstance(configured);
  await client.search("first");
  await client.search("second");
  const ids = request.mock.calls.map(([o]) => JSON.parse(o.body)).filter(m => m.method === "tools/call")
    .map(m => m.params.arguments.session_id);
  expect(ids[1]).toBe(ids[0]);
  client.updateSettings({ ...configured, webSearchProvider: "browser-use" });
  request.mockResolvedValue({ status: 200, json: { results: [] } });
  await client.search("local", 7, 2);
  expect(request).toHaveBeenLastCalledWith({ url: "http://localhost:9999/search", method: "POST",
    headers: { "Content-Type": "application/json", "X-Copilot-Token": "local-secret" },
    body: JSON.stringify({ query: "local", max_steps: 7, max_results: 2, headless: true }) });
  expect(DEFAULT_SETTINGS.webSearchEnabled).toBe(false);
  expect(DEFAULT_SETTINGS.webSearchProvider).toBe("browser-use");
});

test("legacy saved settings still use the local service", async () => {
  const { webSearchProvider: unused, ...legacy } = DEFAULT_SETTINGS;
  request.mockResolvedValue({ status: 200, json: { results: [] } });
  await WebSearchClient.getInstance(legacy as typeof DEFAULT_SETTINGS).search("local");
  expect(request.mock.calls[0][0].url).toBe(DEFAULT_SETTINGS.webSearchServerUrl);
});
