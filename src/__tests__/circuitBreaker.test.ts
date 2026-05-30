import { CircuitBreaker } from "../services/CircuitBreaker";

describe("CircuitBreaker", () => {
  let cb: CircuitBreaker;

  beforeEach(() => {
    cb = new CircuitBreaker();
  });

  test("starts closed", () => {
    expect(cb.getStatus().state).toBe("closed");
    expect(cb.beforeCall()).toBe(0);
  });

  test("onSuccess resets failure count", () => {
    cb.onFailure("error 1");
    cb.onFailure("error 2");
    cb.onSuccess();
    expect(cb.getStatus().state).toBe("closed");
    expect(cb.getStatus().message).toBe("OK");
  });

  test("opens after 3 consecutive failures", () => {
    cb.onFailure("error 1");
    cb.onFailure("error 2");
    const third = cb.onFailure("error 3");
    expect(third.shouldRetry).toBe(false);
    expect(cb.getStatus().state).toBe("open");
    expect(cb.beforeCall()).toBeGreaterThan(0); // should wait
  });

  test("cooldown expires after 30s", () => {
    cb.onFailure("error 1");
    cb.onFailure("error 2");
    cb.onFailure("error 3"); // circuit open
    // Mock time: advance 31 seconds
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 31000);
    expect(cb.beforeCall()).toBe(0); // cooldown expired
    jest.restoreAllMocks();
  });

  test("rate limit (429) triggers exponential backoff", () => {
    const r1 = cb.onFailure("429 Too Many Requests");
    expect(r1.shouldRetry).toBe(true);
    expect(r1.waitMs).toBe(1000); // start at 1s

    const r2 = cb.onFailure("Rate limit exceeded");
    expect(r2.waitMs).toBe(2000); // 2x

    const r3 = cb.onFailure("HTTP 429");
    expect(r3.waitMs).toBe(4000); // 4x

    const r4 = cb.onFailure("429");
    expect(r4.waitMs).toBe(8000); // 8x

    const r5 = cb.onFailure("429");
    expect(r5.waitMs).toBe(16000); // capped at 16s
  });

  test("reset clears all state", () => {
    cb.onFailure("error 1");
    cb.onFailure("error 2");
    cb.onFailure("error 3");
    expect(cb.getStatus().state).toBe("open");
    cb.reset();
    expect(cb.getStatus().state).toBe("closed");
    expect(cb.beforeCall()).toBe(0);
  });

  test("degraded state after 1-2 failures", () => {
    cb.onFailure("error 1");
    expect(cb.getStatus().state).toBe("degraded");
    expect(cb.getStatus().message).toContain("1 recent");

    cb.onFailure("error 2");
    expect(cb.getStatus().state).toBe("degraded");
    expect(cb.getStatus().message).toContain("2 recent");
  });

  test("non-rate-limit errors retry after 2s", () => {
    const result = cb.onFailure("Internal Server Error");
    expect(result.shouldRetry).toBe(true);
    expect(result.waitMs).toBe(2000);
  });
});
