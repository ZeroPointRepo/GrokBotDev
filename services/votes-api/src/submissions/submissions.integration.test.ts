import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { connect, type Db } from '../db/client.js';
import { migrate } from '../db/migrate.js';
import { MemoryRateLimiter } from '../rate/limiter.js';
import { SlugRegistry } from '../slug/registry.js';
import { LiveTemplateManifest } from './live-manifest.js';
import type { ShareLinkResult } from './share-link.js';

const cfg = loadConfig({ pepper: 'test-pepper-test-pepper-test-pepper' });
const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

const SHARE_A = 'https://x.ai/bot/mA4Ik2mIduPANDqFVmVMX';
const SHARE_B = 'https://x.ai/bot/FU-Ev6_Ju4lFGWwWRD0GD';
const SHARE_LIVE = 'https://x.ai/bot/AAAAAAAAAAAAAAAAAAAAA';

let adminDb: Db;
let appDb: Db;
let slugDir: string;
let registry: SlugRegistry;

const okLink = async (): Promise<ShareLinkResult> => ({
  ok: true,
  status: 200,
  botName: 'Court',
  botAuthor: 'Don',
  ogTitle: 'Court by Don',
});
const deadLink = async (): Promise<ShareLinkResult> => ({ ok: false, reason: 'http', status: 404 });

interface AppOptions {
  limits?: Record<string, { max: number; windowMs: number }>;
  shareLink?: () => Promise<ShareLinkResult>;
  turnstile?: boolean;
  live?: Array<{ share_url: string; slug?: string; url?: string; name?: string }>;
}

function makeApp(opts: AppOptions = {}) {
  const manifest = new LiveTemplateManifest({});
  manifest.seed(opts.live ?? []);
  return createApp({
    db: appDb,
    slugRegistry: registry,
    pepper: cfg.pepper,
    logger: silentLogger,
    limiter: new MemoryRateLimiter(),
    limits: opts.limits as never,
    turnstileVerifier: async () => ({ success: opts.turnstile ?? true }),
    shareLinkVerifier: opts.shareLink ?? okLink,
    liveManifest: manifest,
  });
}

function post(app: ReturnType<typeof makeApp>, body: unknown, ip = '203.0.113.77') {
  return app.request('/api/v1/submissions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip, 'user-agent': 'vitest/1.0' },
    body: JSON.stringify(body),
  });
}

const validBody = (shareUrl = SHARE_A, extra: Record<string, unknown> = {}) => ({
  turnstileToken: 'test-token',
  share_url: shareUrl,
  elapsed_ms: 9000,
  ...extra,
});

beforeAll(async () => {
  slugDir = await mkdtemp(join(tmpdir(), 'grokbot-submissions-slugs-'));
  await writeFile(join(slugDir, 'test-use-case.md'), '---\nstatus: live\n---\n');
  registry = new SlugRegistry({ contentDir: slugDir, refreshMs: 1 });
  await migrate();
  adminDb = connect(cfg.adminDatabaseUrl, 1);
  appDb = connect(cfg.databaseUrl, 2);
  await adminDb`delete from submissions`;
});

afterAll(async () => {
  await adminDb?.end({ timeout: 5 });
  await appDb?.end({ timeout: 5 });
  await rm(slugDir, { recursive: true, force: true });
});

beforeEach(async () => {
  await adminDb`delete from submissions`;
});

async function rowCount() {
  const [row] = await adminDb<{ n: number }[]>`select count(*)::int as n from submissions`;
  return Number(row.n);
}

describe('POST /api/v1/submissions', () => {
  it('accepts a valid submission, resolves the bot name server-side, and stores it pending', async () => {
    const res = await post(
      makeApp(),
      validBody(SHARE_A, {
        submitter_x_handle: '@grokbotdev',
        submitter_website: 'example.com',
        submitter_note: 'built it for my own inbox',
        source_post_url: 'https://twitter.com/grokbotdev/status/2093381689041109349?s=46',
      })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      status: 'accepted',
      share_url: SHARE_A,
      bot_name: 'Court',
      bot_author: 'Don',
      credit_handle: 'grokbotdev',
    });

    const [row] = await adminDb<
      {
        status: string;
        botName: string;
        botAuthor: string;
        submitterXHandle: string;
        submitterWebsite: string;
        sourcePostUrl: string;
        userAgent: string;
        ipHash: Buffer;
      }[]
    >`select status, bot_name, bot_author, submitter_x_handle, submitter_website, source_post_url, user_agent, ip_hash
        from submissions where share_url = ${SHARE_A}`;
    expect(row.status).toBe('pending');
    expect(row.botName).toBe('Court');
    expect(row.botAuthor).toBe('Don');
    expect(row.submitterXHandle).toBe('grokbotdev');
    expect(row.submitterWebsite).toBe('https://example.com/');
    expect(row.sourcePostUrl).toBe('https://x.com/grokbotdev/status/2093381689041109349');
    expect(row.userAgent).toBe('vitest/1.0');
    // Peppered hash, never the address itself.
    expect(row.ipHash.length).toBe(32);
    expect(row.ipHash.toString('utf8')).not.toContain('203.0.113');
  });

  it('accepts a link-only submission — one field really is enough', async () => {
    const res = await post(makeApp(), { turnstileToken: 'test-token', share_url: SHARE_B });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, status: 'accepted', credit_handle: null });
    expect(await rowCount()).toBe(1);
  });

  it('rejects a bad share-link shape before any outbound call', async () => {
    let called = false;
    const app = makeApp({
      shareLink: async () => {
        called = true;
        return okLink();
      },
    });
    for (const bad of ['https://x.ai/bot/short', 'https://grok.com/bot/mA4Ik2mIduPANDqFVmVMX', 'not a url']) {
      const res = await post(app, validBody(bad));
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({ ok: false, error: 'invalid_link', detail: 'shape' });
    }
    expect(called).toBe(false);
    expect(await rowCount()).toBe(0);
  });

  it('rejects a well-formed link that does not resolve', async () => {
    const res = await post(makeApp({ shareLink: deadLink }), validBody());
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: 'invalid_link', detail: 'http_404' });
    expect(await rowCount()).toBe(0);
  });

  it('reports an unreachable share page distinctly from a 404', async () => {
    const app = makeApp({ shareLink: async () => ({ ok: false, reason: 'unreachable', status: null }) });
    const res = await post(app, validBody());
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'invalid_link', detail: 'unreachable' });
  });

  it('dedupes against its own queue', async () => {
    const app = makeApp();
    expect((await post(app, validBody())).status).toBe(200);
    const again = await post(app, validBody());
    expect(again.status).toBe(409);
    expect(await again.json()).toMatchObject({ ok: false, error: 'duplicate', already: 'pending' });
    expect(await rowCount()).toBe(1);
  });

  it('dedupes against bots that are already live, and says where', async () => {
    const app = makeApp({
      live: [{ share_url: SHARE_LIVE, slug: 'court', url: 'https://grokbot.dev/marketplace/court/', name: 'Court' }],
    });
    const res = await post(app, validBody(SHARE_LIVE));
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({
      error: 'duplicate',
      already: 'live',
      live_url: 'https://grokbot.dev/marketplace/court/',
      bot_name: 'Court',
    });
    expect(await rowCount()).toBe(0);
  });

  it('drops a honeypot fill without writing a row', async () => {
    const res = await post(makeApp(), validBody(SHARE_A, { website: 'http://spam.example' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: 'bad_request' });
    expect(await rowCount()).toBe(0);
  });

  it('drops a sub-2s submit', async () => {
    const res = await post(makeApp(), { turnstileToken: 'test-token', share_url: SHARE_A, elapsed_ms: 400 });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ ok: false, error: 'bad_request' });
    expect(await rowCount()).toBe(0);
  });

  it('rejects oversized and unknown fields', async () => {
    const app = makeApp();
    const long = await post(app, validBody(SHARE_A, { submitter_note: 'x'.repeat(501) }));
    expect(long.status).toBe(400);
    const unknown = await post(app, validBody(SHARE_A, { is_admin: true }));
    expect(unknown.status).toBe(400);
    const badHandle = await post(app, validBody(SHARE_A, { submitter_x_handle: 'not a handle at all' }));
    expect(badHandle.status).toBe(400);
    expect(await badHandle.json()).toMatchObject({ error: 'bad_field', field: 'submitter_x_handle' });
    expect(await rowCount()).toBe(0);
  });

  it('refuses a body over the submission size limit', async () => {
    const res = await post(makeApp(), validBody(SHARE_A, { submitter_note: 'x'.repeat(20_000) }));
    expect(res.status).toBe(413);
  });

  it('requires Turnstile', async () => {
    const res = await post(makeApp({ turnstile: false }), validBody());
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ error: 'turnstile_failed' });
    expect(await rowCount()).toBe(0);
  });

  it('rate limits by IP and says how long to wait', async () => {
    const app = makeApp({ limits: { submissionIp: { max: 2, windowMs: 60_000 } } });
    expect((await post(app, validBody(SHARE_A))).status).toBe(200);
    expect((await post(app, validBody(SHARE_B))).status).toBe(200);
    const blocked = await post(app, validBody('https://x.ai/bot/BBBBBBBBBBBBBBBBBBBBB'));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).toBeTruthy();
    expect(await blocked.json()).toMatchObject({ error: 'rate_limited' });
    // A different network is unaffected.
    expect((await post(app, validBody('https://x.ai/bot/CCCCCCCCCCCCCCCCCCCCC'), '198.51.100.9')).status).toBe(200);
  });

  it('never lists submissions publicly', async () => {
    const app = makeApp();
    await post(app, validBody());
    for (const path of ['/api/v1/submissions', '/api/v1/submissions/', '/api/v1/submissions/pending']) {
      expect((await app.request(path)).status).toBe(404);
    }
  });

  it('gives the app role insert+select only — it can never approve or erase a submission', async () => {
    await post(makeApp(), validBody());
    await expect(appDb`update submissions set status = 'published'`).rejects.toThrow(/permission denied/i);
    await expect(appDb`delete from submissions`).rejects.toThrow(/permission denied/i);
  });
});
