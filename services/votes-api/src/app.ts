import { Hono, type Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { getCookie } from 'hono/cookie';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { Db } from './db/client.js';
import { appendVoteEvent } from './db/events.js';
import { clientIp, ip24Hash, ipHash, uaHash } from './security/ip.js';
import { makeVoterCookie, verifyVoterCookie } from './security/cookies.js';
import { decideWeight } from './weighting.js';
import { createLogger, type Logger } from './logger.js';
import { createRequestTimeout, jsonError } from './http.js';
import { defaultLimits, MemoryRateLimiter } from './rate/limiter.js';
import type { SlugRegistry } from './slug/registry.js';
import type { TurnstileVerifier } from './turnstile.js';
import type { LiveTemplateManifest } from './submissions/live-manifest.js';
import type { ShareLinkVerifier } from './submissions/share-link.js';
import {
  MIN_TIME_ON_FORM_MS,
  normaliseSubmission,
  submissionBodySchema,
} from './submissions/schema.js';

const identityBodySchema = z.object({ turnstileToken: z.string().min(1).max(2048) }).strict();
const voteBodySchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,95}$/),
    action: z.enum(['cast', 'uncast']),
  })
  .strict();
const slugParamSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,95}$/);

/** Declared once: the middleware stack, the rate limiter and the route all have to agree. */
const SUBMISSIONS_PATH = '/api/v1/submissions';

type Variables = {
  requestId: string;
  clientIp: string;
  ipHash: Buffer;
  ip24Hash: Buffer;
  uaHash: Buffer;
  identityId: string | null;
  identityCookiePresent: boolean;
};

type AppEnv = { Variables: Variables };

type Limits = typeof defaultLimits;

export interface CreateAppDeps {
  db: Db;
  slugRegistry: SlugRegistry;
  turnstileVerifier: TurnstileVerifier;
  pepper: string;
  logger?: Logger;
  limiter?: MemoryRateLimiter;
  limits?: Partial<Limits>;
  /** Fetches an x.ai share page and reads the bot's name/author out of `og:title`. */
  shareLinkVerifier?: ShareLinkVerifier;
  /** Already-published bots, so a submission cannot re-file something that is live. */
  liveManifest?: LiveTemplateManifest;
}

function mergeLimits(overrides: Partial<Limits> | undefined): Limits {
  return {
    identityIp: overrides?.identityIp ?? defaultLimits.identityIp,
    voteIp: overrides?.voteIp ?? defaultLimits.voteIp,
    voteIdentity: overrides?.voteIdentity ?? defaultLimits.voteIdentity,
    submissionIp: overrides?.submissionIp ?? defaultLimits.submissionIp,
  };
}

async function jsonBody(c: Context) {
  try {
    return await c.req.json();
  } catch {
    return undefined;
  }
}

function cacheHeaders(c: any, value: string) {
  c.header('Cache-Control', value);
}

async function aggregateCount(sql: Db, slug: string) {
  const [row] = await sql<{ visibleCount: number; rawCount: number }[]>`
    select coalesce(sum(weight), 0)::int as visible_count, count(*)::int as raw_count
    from votes
    where slug = ${slug}
  `;
  return { visible_count: Number(row?.visibleCount ?? 0), raw_count: Number(row?.rawCount ?? 0) };
}

async function storedCount(sql: Db, slug: string) {
  const [row] = await sql<{ visibleCount: number; rawCount: number }[]>`
    select visible_count, raw_count from vote_counts where slug = ${slug}
  `;
  return { visible_count: Number(row?.visibleCount ?? 0), raw_count: Number(row?.rawCount ?? 0) };
}

async function upsertAggregateCount(sql: any, slug: string) {
  const [agg] = await sql<{ visibleCount: number; rawCount: number }[]>`
    select coalesce(sum(weight), 0)::int as visible_count, count(*)::int as raw_count
    from votes
    where slug = ${slug}
  `;
  const visible = Number(agg?.visibleCount ?? 0);
  const raw = Number(agg?.rawCount ?? 0);
  await sql`
    insert into vote_counts (slug, visible_count, raw_count, updated_at)
    values (${slug}, ${visible}, ${raw}, now())
    on conflict (slug) do update set
      visible_count = excluded.visible_count,
      raw_count = excluded.raw_count,
      updated_at = excluded.updated_at
  `;
  return { visible_count: visible, raw_count: raw };
}

async function ensureKnownSlug(slugRegistry: SlugRegistry, slug: string) {
  const parsed = slugParamSchema.safeParse(slug);
  return parsed.success && (await slugRegistry.has(parsed.data));
}

export function createApp(deps: CreateAppDeps) {
  const app = new Hono<AppEnv>();
  const logger = deps.logger ?? createLogger('info');
  const limiter = deps.limiter ?? new MemoryRateLimiter();
  const limits = mergeLimits(deps.limits);

  app.use('*', async (c, next) => {
    const requestId = crypto.randomUUID();
    c.set('requestId', requestId);
    const started = Date.now();
    try {
      await next();
    } catch (error) {
      logger.error('request_error', {
        request_id: requestId,
        method: c.req.method,
        path: new URL(c.req.url).pathname,
        error: error instanceof Error ? error.message : String(error),
      });
      return jsonError(c, 500, 'internal_error');
    } finally {
      logger.info('request', {
        request_id: requestId,
        method: c.req.method,
        path: new URL(c.req.url).pathname,
        status: c.res.status,
        duration_ms: Date.now() - started,
      });
    }
  });

  // Submissions get their own budgets on both axes. They make outbound calls the vote path
  // never makes (Turnstile + the share-page fetch), and they carry a Turnstile token AND up to
  // 500 characters of optional note, which does not fit the 1KB vote body. Everything else is
  // unchanged — this is a second, wider lane, not a widening of the existing one.
  const defaultTimeout = createRequestTimeout(5000);
  const submissionTimeout = createRequestTimeout(12_000);
  const defaultBodyLimit = bodyLimit({ maxSize: 1024, onError: (c) => jsonError(c, 413, 'body_too_large') });
  const submissionBodyLimit = bodyLimit({ maxSize: 8192, onError: (c) => jsonError(c, 413, 'body_too_large') });
  const isSubmissionPost = (c: Context) =>
    c.req.method === 'POST' && new URL(c.req.url).pathname === SUBMISSIONS_PATH;

  app.use('/api/v1/*', (c, next) => (isSubmissionPost(c) ? submissionTimeout(c, next) : defaultTimeout(c, next)));
  app.use('/api/v1/*', (c, next) => (isSubmissionPost(c) ? submissionBodyLimit(c, next) : defaultBodyLimit(c, next)));

  // rateLimit layer (route-aware; identity-specific vote limit runs after cookie verification).
  app.use('/api/v1/*', async (c, next) => {
    const ip = clientIp(c);
    const ipH = ipHash(ip, deps.pepper);
    const ip24H = ip24Hash(ip, deps.pepper);
    const uaH = uaHash(c.req.header('user-agent'), deps.pepper);
    c.set('clientIp', ip);
    c.set('ipHash', ipH);
    c.set('ip24Hash', ip24H);
    c.set('uaHash', uaH);

    const path = new URL(c.req.url).pathname;
    if (c.req.method === 'POST' && path === '/api/v1/identity') {
      const result = limiter.check(`identity:ip:${ipH.toString('hex')}`, limits.identityIp.max, limits.identityIp.windowMs);
      if (!result.allowed) {
        c.header('Retry-After', String(result.retryAfterSeconds));
        return jsonError(c, 429, 'rate_limited');
      }
    }
    if (c.req.method === 'POST' && path === '/api/v1/votes') {
      const result = limiter.check(`votes:ip:${ipH.toString('hex')}`, limits.voteIp.max, limits.voteIp.windowMs);
      if (!result.allowed) {
        c.header('Retry-After', String(result.retryAfterSeconds));
        return jsonError(c, 429, 'rate_limited');
      }
    }
    if (c.req.method === 'POST' && path === SUBMISSIONS_PATH) {
      const result = limiter.check(
        `submissions:ip:${ipH.toString('hex')}`,
        limits.submissionIp.max,
        limits.submissionIp.windowMs
      );
      if (!result.allowed) {
        c.header('Retry-After', String(result.retryAfterSeconds));
        return jsonError(c, 429, 'rate_limited', { retry_after_seconds: result.retryAfterSeconds });
      }
    }
    await next();
  });

  // identity layer (HMAC cookie parse only; handlers decide whether it is required).
  app.use('/api/v1/*', async (c, next) => {
    const cookie = getCookie(c, 'voter');
    c.set('identityCookiePresent', Boolean(cookie));
    c.set('identityId', verifyVoterCookie(cookie, deps.pepper));
    await next();
  });

  // reserved bearerAuth V2 seam. Human cookie auth is the only v1 path.
  app.use('/api/v1/*', async (_c, next) => {
    await next();
  });

  app.get('/api/v1/health', async (c) => {
    try {
      await deps.db`select 1`;
      return c.json({ ok: true, service: 'grokbot-votes-api', db: 'ok' });
    } catch {
      return c.json({ ok: false, service: 'grokbot-votes-api', db: 'down' }, 503);
    }
  });

  app.post('/api/v1/identity', async (c) => {
    const parsed = identityBodySchema.safeParse(await jsonBody(c));
    if (!parsed.success) return jsonError(c, 400, 'bad_request');

    const turnstile = await deps.turnstileVerifier(parsed.data.turnstileToken, c.get('clientIp'));
    if (!turnstile.success) return jsonError(c, 403, 'turnstile_failed');

    const id = uuidv7();
    await deps.db`
      insert into identities (id, kind, created_at, turnstile_passed_at)
      values (${id}, 'human', now(), now())
    `;
    const response = c.json({ ok: true });
    // Spec requires a 2-year Max-Age; Hono's helper enforces the browser 400-day recommendation,
    // so this cookie is serialized explicitly.
    response.headers.append(
      'Set-Cookie',
      `voter=${makeVoterCookie(id, deps.pepper)}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${60 * 60 * 24 * 365 * 2}`
    );
    return response;
  });

  app.post('/api/v1/votes', async (c) => {
    const identityId = c.get('identityId');
    if (!identityId) return jsonError(c, 401, 'unauthorized');

    const identityLimit = limiter.check(`votes:identity:${identityId}`, limits.voteIdentity.max, limits.voteIdentity.windowMs);
    if (!identityLimit.allowed) {
      c.header('Retry-After', String(identityLimit.retryAfterSeconds));
      return jsonError(c, 429, 'rate_limited');
    }

    const parsed = voteBodySchema.safeParse(await jsonBody(c));
    if (!parsed.success) return jsonError(c, 400, 'bad_request');
    const { slug, action } = parsed.data;
    if (!(await deps.slugRegistry.has(slug))) return jsonError(c, 400, 'unknown_slug');

    const result = await deps.db.begin(async (tx) => {
      const [identity] = await tx<{ id: string; createdAt: Date }[]>`
        select id, created_at from identities where id = ${identityId} and kind = 'human'
      `;
      if (!identity) return { unauthorized: true } as const;

      const [current] = await tx<{ weight: number }[]>`
        select weight from votes where identity_id = ${identityId} and slug = ${slug}
      `;

      if (action === 'cast' && current) {
        return { noOp: true as const, voted: true, counts: await upsertAggregateCount(tx, slug) };
      }
      if (action === 'uncast' && !current) {
        return { noOp: true as const, voted: false, counts: await upsertAggregateCount(tx, slug) };
      }

      if (action === 'cast') {
        const [identityEventCount] = await tx<{ n: number }[]>`
          select count(*)::int as n from vote_events where identity_id = ${identityId} and action = 'cast'
        `;
        const [ip24Casts] = await tx<{ n: number }[]>`
          select count(*)::int as n from vote_events where slug = ${slug} and action = 'cast' and ip24_hash = ${c.get('ip24Hash')}
        `;
        const [recent] = await tx<{ n: number }[]>`
          select count(*)::int as n from vote_events where slug = ${slug} and action = 'cast' and at >= now() - interval '10 minutes'
        `;
        const [baseline] = await tx<{ baseline: number | null }[]>`
          select (count(*)::float / 143.0)::float as baseline
          from vote_events
          where slug = ${slug}
            and action = 'cast'
            and at < now() - interval '10 minutes'
            and at >= now() - interval '24 hours'
        `;
        const decision = decideWeight({
          identityAgeSeconds: (Date.now() - new Date(identity.createdAt).getTime()) / 1000,
          firstVoteForIdentity: Number(identityEventCount?.n ?? 0) === 0,
          ip24SlugCastsBefore: Number(ip24Casts?.n ?? 0),
          slugRecentCasts10mIncludingThis: Number(recent?.n ?? 0) + 1,
          slugTrailingBaseline10m: Number(baseline?.baseline ?? 0),
          asn: null,
        });
        await appendVoteEvent(tx as any, {
          identityId,
          slug,
          action: 'cast',
          weight: decision.weight,
          ipHash: c.get('ipHash'),
          ip24Hash: c.get('ip24Hash'),
          uaHash: c.get('uaHash'),
          asn: null,
          signals: decision.signals,
        });
        await tx`
          insert into votes (identity_id, slug, weight, at)
          values (${identityId}, ${slug}, ${decision.weight}, now())
          on conflict (identity_id, slug) do update set weight = excluded.weight, at = excluded.at
        `;
        return {
          noOp: false as const,
          voted: true,
          weight: decision.weight,
          shadowed: decision.weight === 0,
          signals: decision.signals,
          counts: await upsertAggregateCount(tx, slug),
        };
      }

      await appendVoteEvent(tx as any, {
        identityId,
        slug,
        action: 'uncast',
        weight: 0,
        ipHash: c.get('ipHash'),
        ip24Hash: c.get('ip24Hash'),
        uaHash: c.get('uaHash'),
        asn: null,
        signals: { flags: [], reason: 'user_uncast' },
      });
      await tx`delete from votes where identity_id = ${identityId} and slug = ${slug}`;
      return { noOp: false as const, voted: false, weight: 0, shadowed: false, counts: await upsertAggregateCount(tx, slug) };
    });

    if ('unauthorized' in result) return jsonError(c, 401, 'unauthorized');
    return c.json({
      ok: true,
      slug,
      my_vote: result.voted,
      count: result.counts.visible_count,
      voted: result.voted,
      no_op: result.noOp,
      visible_count: result.counts.visible_count,
      raw_count: result.counts.raw_count,
      ...('weight' in result ? { weight: result.weight, shadowed: result.shadowed } : {}),
    });
  });

  app.get('/api/v1/votes/counts', async (c) => {
    const slugsRaw = c.req.query('slugs') ?? '';
    const slugs = [...new Set(slugsRaw.split(',').map((s) => s.trim()).filter(Boolean))];
    if (!slugs.length || slugs.length > 50) return jsonError(c, 400, 'bad_request');
    for (const slug of slugs) {
      if (!(await ensureKnownSlug(deps.slugRegistry, slug))) return jsonError(c, 400, 'unknown_slug');
    }
    const rows = await deps.db<{ slug: string; visibleCount: number }[]>`
      select slug, visible_count from vote_counts where slug in ${deps.db(slugs)}
    `;
    const counts: Record<string, number> = Object.fromEntries(slugs.map((slug) => [slug, 0]));
    for (const row of rows) counts[row.slug] = Number(row.visibleCount ?? 0);
    cacheHeaders(c, 'public, max-age=60, stale-while-revalidate=300');
    return c.json({ counts });
  });

  app.get('/api/v1/votes/mine', async (c) => {
    const identityId = c.get('identityId');
    if (!identityId) {
      cacheHeaders(c, 'private, no-store');
      return jsonError(c, 401, 'unauthorized');
    }
    const rows = await deps.db<{ slug: string }[]>`
      select slug from votes where identity_id = ${identityId} order by slug asc
    `;
    cacheHeaders(c, 'private, no-store');
    return c.json({ slugs: rows.map((row) => row.slug) });
  });


  /**
   * POST /api/v1/submissions — the public "submit your bot" form.
   *
   * NO ACCOUNTS. The only thing a submitter has to give us is the share link; everything else is
   * attribution they may keep to themselves. What replaces a login is a stack of cheap checks
   * that a person passes without noticing and a script does not, in ascending order of cost:
   *
   *   1. shape          — strict field allowlist, length caps, exact share-link grammar
   *   2. honeypot       — `website` is invisible to a human, so any value is a bot
   *   3. time-on-form   — a sub-2s submit never rendered the page
   *   4. rate limit     — per-IP, above; nginx `limit_req` is the same limit one layer out
   *   5. Turnstile      — the same verifier POST /api/v1/identity uses (there is no shared
   *                       middleware to add this to: v1 gates Turnstile inline, per route)
   *   6. dedupe         — already pending here, or already live on the site
   *   7. link fetch     — the share page must answer 200, and it tells us the bot's real name
   *
   * And then: nothing publishes. The row lands `pending` and only bin/review-submissions.ts
   * moves it. Steps 1-3 are free, so the enormous, dumb share of junk costs us no outbound call
   * at all; the two calls we do make (5 and 7) only happen for a well-formed, patient submitter.
   */
  app.post(SUBMISSIONS_PATH, async (c) => {
    const raw = await jsonBody(c);
    const parsed = submissionBodySchema.safeParse(raw);
    if (!parsed.success) {
      const badLink = parsed.error.issues.some((issue) => issue.path[0] === 'share_url');
      return badLink
        ? jsonError(c, 400, 'invalid_link', { detail: 'shape' })
        : jsonError(c, 400, 'bad_request');
    }
    const body = parsed.data;

    // Honeypot and time-on-form. Both answer `bad_request` rather than naming the check: a bot
    // author reading our error strings should not be handed the fix.
    if (body.website) return jsonError(c, 400, 'bad_request');
    if (body.elapsed_ms !== undefined && body.elapsed_ms < MIN_TIME_ON_FORM_MS) {
      return jsonError(c, 400, 'bad_request');
    }

    const normalised = normaliseSubmission(body);
    if (!normalised.ok) return jsonError(c, 400, 'bad_field', { field: normalised.field });
    const submission = normalised.value;

    const turnstile = await deps.turnstileVerifier(body.turnstileToken, c.get('clientIp'));
    if (!turnstile.success) return jsonError(c, 403, 'turnstile_failed');

    // Cheapest dedupe first: our own queue. UNIQUE on share_url backs this up, so a race
    // between two identical submissions still ends as one row (see the insert below).
    const [existing] = await deps.db<{ status: string }[]>`
      select status from submissions where share_url = ${submission.shareUrl}
    `;
    if (existing) {
      return jsonError(c, 409, 'duplicate', {
        already: existing.status === 'published' ? 'live' : 'pending',
      });
    }

    const live = (await deps.liveManifest?.lookup(submission.shareUrl)) ?? null;
    if (live) {
      return jsonError(c, 409, 'duplicate', {
        already: 'live',
        live_url: live.url,
        bot_name: live.name,
      });
    }

    // The verification step, and the best spam filter we have: a link nobody can install is not
    // a submission. A real one hands back the bot's own name and author from `og:title`.
    const verifier = deps.shareLinkVerifier;
    let botName: string | null = null;
    let botAuthor: string | null = null;
    if (verifier) {
      const check = await verifier(submission.shareUrl);
      if (!check.ok) {
        return jsonError(c, 400, 'invalid_link', {
          detail: check.reason === 'unreachable' ? 'unreachable' : `http_${check.status ?? 'error'}`,
        });
      }
      botName = check.botName;
      botAuthor = check.botAuthor;
    }

    const id = uuidv7();
    const userAgent = (c.req.header('user-agent') ?? '').slice(0, 300) || null;
    try {
      await deps.db`
        insert into submissions (
          id, share_url, bot_name, bot_author,
          submitter_x_handle, submitter_website, submitter_note, source_post_url,
          ip_hash, user_agent
        ) values (
          ${id}, ${submission.shareUrl}, ${botName}, ${botAuthor},
          ${submission.submitterXHandle}, ${submission.submitterWebsite},
          ${submission.submitterNote}, ${submission.sourcePostUrl},
          ${c.get('ipHash')}, ${userAgent}
        )
      `;
    } catch (error) {
      // 23505 = unique_violation: two submitters raced on the same link. Same answer as above.
      if ((error as { code?: string }).code === '23505') {
        return jsonError(c, 409, 'duplicate', { already: 'pending' });
      }
      throw error;
    }

    logger.info('submission_accepted', {
      request_id: c.get('requestId'),
      share_url: submission.shareUrl,
      bot_name: botName,
      credited: Boolean(submission.submitterXHandle),
    });

    return c.json({
      ok: true,
      status: 'accepted',
      share_url: submission.shareUrl,
      bot_name: botName,
      bot_author: botAuthor,
      credit_handle: submission.submitterXHandle,
    });
  });

  app.notFound((c) => jsonError(c, 404, 'not_found'));

  return app;
}
