import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { connect } from './db/client.js';
import { createLogger } from './logger.js';
import { SlugRegistry } from './slug/registry.js';
import { createTurnstileVerifier } from './turnstile.js';
import { LiveTemplateManifest } from './submissions/live-manifest.js';
import { createShareLinkVerifier } from './submissions/share-link.js';

const cfg = loadConfig();
const logger = createLogger(cfg.logLevel);
const db = connect(cfg.databaseUrl);
const slugRegistry = new SlugRegistry({
  contentDir: cfg.useCaseContentDir,
  slugsFile: cfg.slugsFile,
  slugsUrl: cfg.slugsUrl,
  refreshMs: cfg.slugRefreshMs,
});

await slugRegistry.load(true);
const app = createApp({
  db,
  slugRegistry,
  turnstileVerifier: createTurnstileVerifier(cfg.turnstileSecret),
  shareLinkVerifier: createShareLinkVerifier(cfg.shareLinkTimeoutMs),
  liveManifest: new LiveTemplateManifest({
    file: cfg.submissionsManifestFile,
    url: cfg.submissionsManifestUrl,
    ttlMs: cfg.submissionsManifestTtlMs,
  }),
  pepper: cfg.pepper,
  logger,
});

const server = serve({ fetch: app.fetch, hostname: cfg.host, port: cfg.port }, (info) => {
  logger.info('listening', { host: info.address, port: info.port });
});

process.on('SIGTERM', async () => {
  logger.info('shutdown', { signal: 'SIGTERM' });
  server.close();
  await db.end({ timeout: 5 });
});

process.on('SIGINT', async () => {
  logger.info('shutdown', { signal: 'SIGINT' });
  server.close();
  await db.end({ timeout: 5 });
});
