export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

interface Bucket {
  hits: number[];
}

export class MemoryRateLimiter {
  private buckets = new Map<string, Bucket>();

  check(key: string, max: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(key) ?? { hits: [] };
    bucket.hits = bucket.hits.filter((at) => now - at < windowMs);
    if (bucket.hits.length >= max) {
      const oldest = bucket.hits[0] ?? now;
      this.buckets.set(key, bucket);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
        remaining: 0,
      };
    }
    bucket.hits.push(now);
    this.buckets.set(key, bucket);
    return { allowed: true, retryAfterSeconds: 0, remaining: Math.max(0, max - bucket.hits.length) };
  }

  reset() {
    this.buckets.clear();
  }
}

export const defaultLimits = {
  identityIp: { max: 3, windowMs: 24 * 60 * 60_000 },
  voteIp: { max: 60, windowMs: 60 * 60_000 },
  voteIdentity: { max: 30, windowMs: 24 * 60 * 60_000 },
  // Submitting a bot is a once-in-a-while act, not an interaction: five an hour is generous for
  // a person with a handful of bots to share and useless to anything trying to flood the queue.
  // nginx's `limit_req` zone is the first, cheaper copy of this same limit (infra snippet).
  submissionIp: { max: 5, windowMs: 60 * 60_000 },
};
