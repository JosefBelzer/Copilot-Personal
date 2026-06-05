/**
 * Simple rate limiter for API calls (embeddings, etc.)
 */
export class RateLimiter {
  private queue: Array<{
    fn: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private processing = false;
  private requestsPerMinute: number;
  private delayBetweenRequests: number;

  constructor(requestsPerMinute: number = 60) {
    this.requestsPerMinute = requestsPerMinute;
    this.delayBetweenRequests = (60 / requestsPerMinute) * 1000;
  }

  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      void this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      try {
        const result = await item.fn();
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }
      if (this.queue.length > 0) {
        await this.sleep(this.delayBetweenRequests);
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }
}
