import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as dotenv } from 'dotenv';

export const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';
export const TURNSTILE_TEST_SITEKEY = '1x00000000000000000000AA';

function findServiceRoot(start: string): string {
  let dir = start;
  for (;;) {
    const pkg = resolve(dir, 'package.json');
    if (existsSync(pkg)) {
      try {
        const parsed = JSON.parse(readFileSync(pkg, 'utf8')) as { name?: string };
        if (parsed.name === 'grokbot-votes-api') return dir;
      } catch {
        // keep walking
      }
    }
    const parent = dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

const moduleDir = dirname(fileURLToPath(import.meta.url));
const serviceRoot = findServiceRoot(moduleDir);
dotenv({ path: resolve(serviceRoot, '.env'), quiet: true });

/**
 * `services/votes-api/`, resolved by walking up to this package's own package.json.
 *
 * Anything that reads a file off disk must anchor here rather than count directory levels from
 * `import.meta.url`, because the level count DIFFERS between running the TypeScript with tsx
 * (`src/db/migrate.ts`) and running the build output (`dist/src/db/migrate.js`) — one extra
 * `dist/` segment. Counting levels gives you a tool that works in development and cannot find
 * its own files in production. `findServiceRoot` walks until it sees `grokbot-votes-api`, so it
 * is right from both.
 */
export const SERVICE_ROOT = serviceRoot;

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`missing required env ${name}`);
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`invalid number env ${name}`);
  return n;
}

export interface VotesConfig {
  host: string;
  port: number;
  databaseUrl: string;
  adminDatabaseUrl: string;
  migrateDatabaseUrl: string;
  appRolePassword: string;
  adminRolePassword: string;
  pepper: string;
  turnstileSecret: string;
  useCaseContentDir: string;
  slugsFile?: string;
  slugsUrl?: string;
  slugRefreshMs: number;
  logLevel: string;
  /** Live-template manifest used to dedupe a submission against what is already published. */
  submissionsManifestFile?: string;
  submissionsManifestUrl?: string;
  submissionsManifestTtlMs: number;
  /** Budget for the server-side share-link fetch that verifies a submission. */
  shareLinkTimeoutMs: number;
}

export function loadConfig(overrides: Partial<VotesConfig> = {}): VotesConfig {
  const cfg: VotesConfig = {
    host: process.env.VOTES_HOST ?? '127.0.0.1',
    port: numberEnv('VOTES_PORT', 4391),
    databaseUrl: required('DATABASE_URL', 'postgres://votes_app:local_votes_app_password@127.0.0.1:54390/grokbot_votes'),
    adminDatabaseUrl: required('ADMIN_DATABASE_URL', 'postgres://votes_admin:local_votes_admin_password@127.0.0.1:54390/grokbot_votes'),
    migrateDatabaseUrl: required('MIGRATE_DATABASE_URL', 'postgres://postgres:local_postgres_password@127.0.0.1:54390/grokbot_votes'),
    appRolePassword: required('VOTES_APP_PASSWORD', 'local_votes_app_password'),
    adminRolePassword: required('VOTES_ADMIN_PASSWORD', 'local_votes_admin_password'),
    pepper: required('VOTES_HMAC_PEPPER', 'local-dev-only-replace-me'),
    turnstileSecret: required('TURNSTILE_SECRET_KEY', TURNSTILE_TEST_SECRET),
    useCaseContentDir: resolve(serviceRoot, process.env.USE_CASE_CONTENT_DIR ?? '../../content/use-cases'),
    slugsFile: process.env.SLUGS_FILE ? resolve(serviceRoot, process.env.SLUGS_FILE) : resolve(serviceRoot, '../../dist/api-meta/use-case-slugs.json'),
    slugsUrl: process.env.SLUGS_URL,
    slugRefreshMs: numberEnv('SLUG_REFRESH_MS', 10 * 60_000),
    logLevel: process.env.LOG_LEVEL ?? 'info',
    // Same file-then-URL shape as the slug registry: on the web host the promoted manifest is
    // already on local disk, so prefer it and keep the fetch as the fallback for any other box.
    submissionsManifestFile: process.env.SUBMISSIONS_MANIFEST_FILE
      ? resolve(serviceRoot, process.env.SUBMISSIONS_MANIFEST_FILE)
      : resolve(serviceRoot, '../../dist/api/v1/templates.json'),
    submissionsManifestUrl: process.env.SUBMISSIONS_MANIFEST_URL ?? 'https://grokbot.dev/api/v1/templates.json',
    submissionsManifestTtlMs: numberEnv('SUBMISSIONS_MANIFEST_TTL_MS', 5 * 60_000),
    shareLinkTimeoutMs: numberEnv('SHARE_LINK_TIMEOUT_MS', 2500),
  };
  return { ...cfg, ...overrides };
}
