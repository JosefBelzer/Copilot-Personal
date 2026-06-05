/**
 * Shared path utilities — normalize slashes, extract dirnames/basenames,
 * and handle .md extension auto-detection consistently across all tools.
 */

/** Normalize backslashes to forward slashes and collapse duplicate slashes. */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "");
}

/** Ensure a path ends with .md (for Obsidian notes). */
export function ensureMd(path: string): string {
  return path.endsWith(".md") ? path : `${path}.md`;
}

/** Extract the directory portion of a path (no trailing slash, empty = root). */
export function dirname(path: string): string {
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash > 0 ? normalized.substring(0, lastSlash) : "";
}

/** Extract the filename without extension (e.g., "MyNote" from "folder/MyNote.md"). */
export function basenameNoExt(path: string): string {
  const normalized = normalizePath(path);
  const name = normalized.split("/").pop() ?? normalized;
  return name.replace(/\.md$/i, "");
}

/**
 * Normalize German characters for fuzzy matching.
 * Converts both directions to a canonical ASCII form so that
 * "Qualitäts" matches "Qualitaets" (model often uses ae instead of ä).
 *   ä/ae → a,  ö/oe → o,  ü/ue → u,  ß/ss → s
 * This is lossy but sufficient for name-lookup matching.
 */
/**
 * Normalizes an API URL for OpenAI-compatible endpoints.
 * Strips trailing slashes, removes /v1 suffix, and re-appends /v1.
 */
/**
 * Fetch with fallback to Obsidian's requestUrl when the global fetch
 * is unavailable (e.g., Obsidian mobile). On desktop/Electron, uses
 * native fetch() for real SSE streaming. On mobile, falls back to
 * requestUrl() which loads the full response.
 */
export function fetchWithFallback(url: string, options: RequestInit): Promise<Response> {
  if (typeof fetch !== "undefined") {
    return fetch(url, options);
  }
  // Fallback: use Obsidian's requestUrl (no streaming but works everywhere)
  return import("obsidian").then(({ requestUrl }) => {
    const method = (options.method ?? "POST") as string;
    const headers = options.headers as Record<string, string> | undefined;
    const body = options.body as string | undefined;
    return requestUrl({ url, method, headers, body })
      .then(r => {
        const respHeaders = new Headers(r.headers as Record<string, string>);
        return new Response(r.text, { status: r.status, headers: respHeaders });
      });
  });
}

/**
 * Normalizes an API URL for OpenAI-compatible endpoints.
 */
export function normalizeApiUrl(url: string): string {
  let normalized = url.replace(/\/+$/, "");
  if (normalized.endsWith("/v1")) normalized = normalized.slice(0, -3);
  return `${normalized}/v1`;
}

/**
 * Normalize German characters for fuzzy matching.
 */
export function normalizeGerman(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä|ae/gi, "a")
    .replace(/ö|oe/gi, "o")
    .replace(/ü|ue/gi, "u")
    .replace(/ß|ss/gi, "s");
}

/**
 * Wraps a Promise with a timeout. Rejects with TimeoutError if the
 * operation takes longer than `ms` milliseconds.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label: string = "Operation"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}
