import type { Context, Next } from 'hono';

/**
 * Per-route request budget. The default 5s is right for a vote (one local DB round trip), but
 * a submission legitimately makes three outbound calls — Turnstile siteverify, the share-page
 * fetch, and (cold) the live manifest — so it gets its own, longer budget. Sharing the 5s
 * would return a 504 while the handler carried on and wrote the row: the user sees a failure
 * for a submission we actually accepted, which is the worst possible outcome on this form.
 */
export function createRequestTimeout(ms: number) {
  return async function requestTimeoutMiddleware(c: Context, next: Next) {
    const timeout = new Promise<Response>((resolve) => {
      setTimeout(() => resolve(c.json({ ok: false, error: 'request_timeout' }, 504)), ms).unref();
    });
    return Promise.race([next().then(() => c.res), timeout]);
  };
}

export const requestTimeout = createRequestTimeout(5000);

export function jsonError(c: Context, status: number, error: string, extra: Record<string, unknown> = {}) {
  return c.json({ ok: false, error, ...extra }, status as never);
}
