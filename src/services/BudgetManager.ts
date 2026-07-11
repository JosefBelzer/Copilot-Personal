/**
 * BudgetManager — Pro-only budget API provider proxied through Cloudflare Worker.
 *
 * Architecture:
 *   - API key stored ONLY in Worker (wrangler secret) — never exposed to client.
 *   - Usage tracking is SERVER-SIDE per license key (KV: budget:{key}).
 *   - Persists across devices and plugin reinstalls.
 *   - The plugin's BudgetManager is a thin client: fetch usage from Worker, call Worker proxy.
 *
 * Limits (enforced server-side):
 *   - 250K tokens/day, 50 queries/day
 *   - Reset at midnight UTC
 */

export interface BudgetUsage {
  dailyTokens: number;
  limitTokens: number;
  dailyQueries: number;
  limitQueries: number;
  dailyCost: number;
  dailyCostLimit: number;
  tokenPercent: number;
  queryPercent: number;
  resetsInHours: number;
  /** Free trial info — present when using the budget provider without a Pro license */
  freeTrial?: { used: number; limit: number };
}

export interface BudgetChatResponse {
  content: string;
  usage?: { total_tokens: number };
  toolCalls?: Array<{ id: string; type: string; function: { name: string; arguments: string } }>;
  model?: string;
  budget?: BudgetUsageResponse;
}

export interface BudgetUsageResponse {
  dailyTokens: number;
  limitTokens: number;
  dailyQueries: number;
  limitQueries: number;
  resetsAt?: string;
  /** Free trial flag + counter from budget-usage endpoint (worker returns freeTrial: true + freeUsed/freeLimit) */
  freeTrial?: boolean | { used: number; limit: number };
  freeUsed?: number;
  freeLimit?: number;
}

import { requestUrl } from "obsidian";
import { WORKER_URL } from "./workerConfig";

export class BudgetManager {
  private enabled = false;
  private workerUrl = WORKER_URL;

  // Cached usage for UI polling
  private cachedUsage: BudgetUsage | null = null;
  private lastFetch = 0;

  setEnabled(enabled: boolean): void { this.enabled = enabled; }
  isEnabled(): boolean { return this.enabled; }
  getCachedUsage(): BudgetUsage | null { return this.cachedUsage; }

  /**
   * Fetch current budget usage from Worker (server-side tracking).
   * Results are cached for 30 seconds to avoid excessive API calls.
   */
  async fetchUsage(licenseKey: string, fingerprint?: string): Promise<BudgetUsage> {
    if (this.cachedUsage && Date.now() - this.lastFetch < 30_000) {
      return this.cachedUsage;
    }

    const resp = await requestUrl({
      url: `${this.workerUrl}/v1/budget-usage`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey, fingerprint }),
    });

    const data = JSON.parse(resp.text) as BudgetUsageResponse;

    // Free trial response (worker returns freeTrial:true + freeUsed/freeLimit)
    if (data.freeTrial) {
      this.cachedUsage = this.buildBudgetUsage({
        dailyTokens: 0, limitTokens: 0,
        dailyQueries: data.freeUsed ?? 0, limitQueries: data.freeLimit ?? 5,
        freeTrial: { used: data.freeUsed ?? 0, limit: data.freeLimit ?? 5 },
      });
      this.lastFetch = Date.now();
      return this.cachedUsage;
    }

    this.cachedUsage = this.buildBudgetUsage(data);
    this.lastFetch = Date.now();
    return this.cachedUsage;
  }

  /** Check if budget is available (server-side). Uses cached value for speed. */
  canUse(): boolean {
    if (!this.enabled || !this.cachedUsage) return false;
    return this.cachedUsage.tokenPercent < 100 && this.cachedUsage.queryPercent < 100;
  }

  /** Clear cached usage so next fetch() goes to the Worker. */
  clearCache(): void { this.cachedUsage = null; this.lastFetch = 0; }

  /** Build BudgetUsage from raw worker response data (shared by fetchUsage and chat). */
  private buildBudgetUsage(data: BudgetUsageResponse): BudgetUsage {
    const avgCost = 0.06 / 1_000_000;
    const cost = data.dailyTokens * avgCost;
    const base = {
      dailyTokens: data.dailyTokens, limitTokens: data.limitTokens,
      dailyQueries: data.dailyQueries, limitQueries: data.limitQueries,
      dailyCost: Math.round(cost * 10000) / 10000, dailyCostLimit: 0.03,
      tokenPercent: Math.round((data.dailyTokens / data.limitTokens) * 100),
      queryPercent: Math.round((data.dailyQueries / data.limitQueries) * 100),
      resetsInHours: Math.ceil(this.hoursUntilMidnightUTC()),
    };
    const ft = data.freeTrial;
    if (ft && typeof ft === "object") {
      return { ...base, freeTrial: ft };
    }
    return base;
  }

  getWarningLevel(): "none" | "warn" | "critical" | "blocked" {
    if (!this.cachedUsage) return "none";
    const mp = Math.max(this.cachedUsage.tokenPercent, this.cachedUsage.queryPercent);
    if (mp >= 100) return "blocked";
    if (mp >= 95) return "critical";
    if (mp >= 75) return "warn";
    return "none";
  }

  /**
   * Call budget API through Worker proxy.
   * Worker handles auth, tracking, and limits.
   */
  async chat(
    messages: Array<{ role: string; content: string; tool_calls?: Array<{ id?: string; type?: string; function: { name: string; arguments: string } }>; tool_call_id?: string }>,
    licenseKey: string,
    fingerprint?: string,
    tools?: Array<{ type: string; function: { name: string; description?: string; parameters: Record<string, unknown> } }>,
  ): Promise<BudgetChatResponse> {
    const body: Record<string, unknown> = { messages, licenseKey };
    if (fingerprint) body["fingerprint"] = fingerprint;
    if (tools) body["tools"] = tools;
    const resp = await requestUrl({
      url: `${this.workerUrl}/v1/budget-chat`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = JSON.parse(resp.text) as BudgetChatResponse;
    // Update cache from Worker response
    if (data.budget) {
      this.cachedUsage = this.buildBudgetUsage(data.budget);
      this.lastFetch = Date.now();
    }
    return data;
  }

  /**
   * Stream budget API through Worker proxy.
   * Uses native fetch() for true SSE streaming (available in Obsidian Electron).
   * Falls back to requestUrl on mobile where fetch() is unavailable.
   */
  async *chatStream(
    messages: Array<{ role: string; content: string }>,
    licenseKey: string,
    fingerprint?: string,
  ): AsyncGenerator<{ content: string; done?: boolean }> {
    const body: Record<string, unknown> = { messages, licenseKey };
    if (fingerprint) body["fingerprint"] = fingerprint;

    // Try native fetch for true SSE streaming (desktop Electron)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (typeof fetch !== "undefined") {
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 30000);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const response = await fetch(`${this.workerUrl}/v1/budget-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, stream: true }),
          signal: controller.signal,
        });
        window.clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          const err = parseWorkerError(errText);
          throw new Error(err.error || `Budget API error (${response.status})`);
        }

        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            // Parse SSE events: look for "data:" lines followed by double newlines
            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              const dataLine = part.startsWith("data: ") ? part.slice(6) : part;
              if (dataLine === "[DONE]") break;
              try {
                const parsed = JSON.parse(dataLine) as Record<string, unknown>;
                const choices = parsed.choices as Array<{ delta?: { content?: string }; text?: string }> | undefined;
                const content = choices?.[0]?.delta?.content || choices?.[0]?.text || "";
                if (content) yield { content };
              } catch { /* skip malformed SSE chunks */ }
            }
          }
          // Flush remaining buffer
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer.startsWith("data: ") ? buffer.slice(6) : buffer) as Record<string, unknown>;
              const choices = parsed.choices as Array<{ delta?: { content?: string }; text?: string }> | undefined;
              const content = choices?.[0]?.delta?.content || choices?.[0]?.text || "";
              if (content) yield { content };
            } catch { /* skip malformed SSE chunks */ }
          }
          yield { content: "", done: true };
          return;
        }
      } catch {
        // fetch/streaming failed — fall through to requestUrl below
        console.warn("[BudgetManager] Streaming failed, falling back to requestUrl");
      }
    }

    // Fallback: requestUrl (no streaming — full response at once)
    const resp = await requestUrl({
      url: `${this.workerUrl}/v1/budget-chat`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (resp.status < 200 || resp.status >= 300) {
      const err = parseWorkerError(resp.text);
      throw new Error(err.error || `Budget API error (${resp.status})`);
    }

    const data = JSON.parse(resp.text) as BudgetChatResponse;
    if (data.content) {
      if (data.budget) {
        const cost = data.budget.dailyTokens * (0.06 / 1_000_000);
        this.cachedUsage = {
          dailyTokens: data.budget.dailyTokens, limitTokens: data.budget.limitTokens,
          dailyQueries: data.budget.dailyQueries, limitQueries: data.budget.limitQueries,
          dailyCost: Math.round(cost * 10000) / 10000, dailyCostLimit: 0.03,
          tokenPercent: Math.round((data.budget.dailyTokens / data.budget.limitTokens) * 100),
          queryPercent: Math.round((data.budget.dailyQueries / data.budget.limitQueries) * 100),
          resetsInHours: 24,
          freeTrial: typeof data.budget.freeTrial === "object" ? data.budget.freeTrial : undefined,
        };
        this.lastFetch = Date.now();
      }
      yield { content: data.content };
    }
  }

  private hoursUntilMidnightUTC(): number {
    const now = new Date();
    const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    return (midnight.getTime() - now.getTime()) / 3600000;
  }
}

/* ─── Helper: type-safe error response parsing ────────────────────── */

interface WorkerErrorResponse {
  error?: string;
  [key: string]: unknown;
}

function parseWorkerError(text: string): WorkerErrorResponse {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as WorkerErrorResponse;
    }
    return { error: String(parsed) };
  } catch {
    return { error: "Unknown error" };
  }
}
