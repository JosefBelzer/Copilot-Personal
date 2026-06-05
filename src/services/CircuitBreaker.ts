/**
 * CircuitBreaker — protection against API failures.
 * - After 3 consecutive failures, disables the provider for 30 seconds (circuit open).
 * - On 429 (rate limit), applies exponential backoff.
 * - Reports status for UI indicators.
 */

import { t } from "../i18n";

export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private circuitOpen = false;
  private cooldownMs = 30000; // 30s circuit open
  private backoffMs = 1000;   // start at 1s
  private maxBackoffMs = 16000; // max 16s

  /** Called before each API call. Returns ms to wait, or 0 if OK. */
  beforeCall(): number {
    if (this.circuitOpen) {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed < this.cooldownMs) {
        return this.cooldownMs - elapsed;
      }
      // Cooldown expired — try again
      this.circuitOpen = false;
    }
    return 0;
  }

  /** Called after a successful API call. */
  onSuccess(): void {
    this.failureCount = 0;
    this.backoffMs = 1000;
  }

  /** Called after a failed API call. Returns ms to wait before retry. */
  onFailure(error: string): { shouldRetry: boolean; waitMs: number; message: string } {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    // Rate limit (429) — exponential backoff
    if (error.includes("429") || error.includes("rate limit") || error.includes("Rate limit")) {
      const wait = this.backoffMs;
      this.backoffMs = Math.min(this.backoffMs * 2, this.maxBackoffMs);
      return {
        shouldRetry: true,
        waitMs: wait,
        message: t("circuit.rateLimited", { seconds: (wait / 1000).toFixed(0) }),
      };
    }

    // Circuit breaker after 3 consecutive failures
    if (this.failureCount >= 3) {
      this.circuitOpen = true;
      return {
        shouldRetry: false,
        waitMs: 0,
        message: t("circuit.open", { failures: this.failureCount, cooldown: this.cooldownMs / 1000 }),
      };
    }

    return {
      shouldRetry: true,
      waitMs: 2000,
      message: t("circuit.retrying", { attempt: this.failureCount }),
    };
  }

  /** Current status for UI */
  getStatus(): { state: "closed" | "open" | "degraded"; message: string } {
    if (this.circuitOpen) {
      const remaining = Math.ceil((this.cooldownMs - (Date.now() - this.lastFailureTime)) / 1000);
      return { state: "open", message: t("circuit.statusOpen", { remaining }) };
    }
    if (this.failureCount > 0) {
      return { state: "degraded", message: t("circuit.statusDegraded", { failures: this.failureCount }) };
    }
    return { state: "closed", message: t("circuit.statusClosed") };
  }

  /** Force reset (e.g., user changed API key) */
  reset(): void {
    this.failureCount = 0;
    this.circuitOpen = false;
    this.backoffMs = 1000;
  }
}
