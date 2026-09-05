# grokbot votes API runbook

P1 local-only service for anonymous use-case upvotes **and the public /submit/ bot form**. The API binds `127.0.0.1:4391`; nginx exposes only `/api/v1/*` on the review vhost. Port `4390` remains reserved for the existing `grokbot-services` waitlist/MCP service.

## Local start / stop

```bash
cd /opt/projects/grokbotdev-upvotes/services/votes-api
npm install
npm run db:start      # creates /opt/projects/grokbot-votes-data and .env if missing
npm run db:migrate
npm run build
pm2 start ecosystem.config.cjs --update-env
pm2 logs grokbot-votes-api --lines 100
```

Stop without deleting data:

```bash
pm2 stop grokbot-votes-api
# optional DB stop
docker stop grokbot-votes-pg
```

## Database

- Container: `grokbot-votes-pg` (Postgres 16)
- Host port: `127.0.0.1:54390`
- Data volume: `/opt/projects/grokbot-votes-data`
- App role: `votes_app` (no `UPDATE`/`DELETE` on `vote_events`; **INSERT + SELECT only** on `submissions`)
- Admin role: `votes_admin` (CLI maintenance — the only role that can move a submission's `status`)

Apply migrations:

```bash
cd /opt/projects/grokbotdev-upvotes/services/votes-api
npm run db:migrate
```

## Production slug registry

Production must not load voteable slugs from the votes-api service checkout, because that checkout can lag behind newly promoted content. The production env file (outside git) must force the registry to fall back to the deployed site's manifest:

```dotenv
# Slug registry sync: force fallback to the deployed site manifest so new content publishes need no votes-api redeploy.
USE_CASE_CONTENT_DIR=/nonexistent-force-fallback
SLUGS_FILE=/opt/projects/user/grokbot/current/api-meta/use-case-slugs.json
```

### Shareable Bots (templates) — repoint required

Templates are votable too, and their slugs are NOT in `use-case-slugs.json`. The site emits
`api-meta/votable-slugs.json` (use cases + templates, deduped). Point `SLUGS_FILE` at that file
instead:

```dotenv
SLUGS_FILE=/opt/projects/user/grokbot/current/api-meta/votable-slugs.json
```

Promote the site FIRST, then repoint — `loadFallbacks()` silently falls through to the service
checkout's own content dir if the path does not exist yet. Note also that `loadFromContentDir()`
wins over `SLUGS_FILE`, which is why `USE_CASE_CONTENT_DIR` must stay pointed at a nonexistent
path; a dev instance that forgets this knows use-case slugs only.

Remember that `/api/v1/votes/counts` is fail-closed PER REQUEST: one unknown slug 400s the whole
batch. The site's `vote-counts.ts` splits requests by kind and bisects rejected chunks so this
degrades to "counts read 0" rather than breaking a page, but the feature is not live until the
repoint lands.

`current/api-meta/use-case-slugs.json` is updated atomically with each site promote. The API refreshes its slug registry on the default `SLUG_REFRESH_MS` cadence (10 minutes), so content publishes do not require a votes-api redeploy.

## Backups

Nightly cron example (operator adjusts retention/storage):

```cron
17 3 * * * cd /opt/projects/grokbotdev-upvotes/services/votes-api && \
  /usr/bin/env bash -lc 'set -a; . ./.env; set +a; mkdir -p /opt/backups/grokbot-votes; pg_dump "$ADMIN_DATABASE_URL" | gzip > /opt/backups/grokbot-votes/grokbot_votes_$(date -u +\%Y\%m\%dT\%H\%M\%SZ).sql.gz'
```

## Restore drill

1. Stop API writes: `pm2 stop grokbot-votes-api`.
2. Restore into a fresh database/container from the selected dump.
3. Run `npm run recount` and confirm `hash_chain: "clean"`.
4. Point `.env` URLs at the restored DB.
5. Restart API: `pm2 start ecosystem.config.cjs --update-env`.

## Recount / ledger verification

`vote_events` is append-only and hash-chained. Rebuild materialized `votes` and `vote_counts` from the ledger:

```bash
cd /opt/projects/grokbotdev-upvotes/services/votes-api
npm run recount
```

Expected clean output includes `"ok": true` and `"hash_chain": "clean"`.

## Flag review

```bash
npm run review-flags -- list
npm run review-flags -- bless --slug account-expert --flag velocity --reason "operator reviewed campaign"
npm run review-flags -- bury  --slug account-expert --flag velocity --reason "bot cluster"
```

The CLI records the decision in `audit_log`, verifies the hash chain, and rebuilds materialized `votes`/`vote_counts`; the ledger remains append-only.

## Daily digest

```bash
npm run digest
```

Shows 24h event totals, top slugs, and flag counts.

## Weighting notes

Young first-vote identities are recorded as `signals.young_identity` but are still visible (`weight=1`). Zero-weight shadowing remains for stronger abuse signals such as same-/24 slug clusters, velocity surges, and datacenter ASN flags.

## Pepper/key rotation

The `VOTES_HMAC_PEPPER` signs voter cookies and HMACs IP/UA signals. Rotation invalidates existing anonymous cookies and changes future IP hashes.

1. Schedule a quiet window.
2. Stop API writes.
3. Update `.env` with a fresh `openssl rand -hex 32` pepper.
4. Restart API. Existing votes remain in the ledger/counts, but returning users receive new identities when they vote again.
5. Keep old `.env` in secure operator secret storage only if forensic verification of old IP hashes is required.

## Surge alert checklist

1. Check API health: `curl -s https://grokbot-upvotes.anacreon.ai/api/v1/health`.
2. Check nginx 429s and pm2 logs.
3. Run `npm run digest` and `npm run review-flags -- list`.
4. If abuse is clear, tighten nginx `limit_req` temporarily and/or stop `grokbot-votes-api`.
5. Do not mutate `vote_events`. Use `review-flags` + `recount` after operator review.

## Bot submissions (`/submit/`)

`POST /api/v1/submissions` is the public form's endpoint. One required field: the
`https://x.ai/bot/<21 chars>` share link. Everything else is optional attribution.

### Layers between a POST and a row

1. strict field allowlist + length caps + the exact share-link grammar
2. honeypot field (`website`) and a minimum 2s time-on-form
3. per-IP rate limit — nginx `limit_req zone=grokbot_submissions` (5r/m) and the service's own
   `submissionIp` window (5/hour), keyed on the peppered hash
4. Cloudflare Turnstile (the same verifier `/api/v1/identity` uses)
5. dedupe against the queue (`share_url` is UNIQUE) and against the live site
   (`SUBMISSIONS_MANIFEST_FILE`, else `SUBMISSIONS_MANIFEST_URL`, cached 5 min, degrades open)
6. **server-side link verification** — the share page must answer `200`; its `og:title`
   ("<Bot> by <Author>") is where `bot_name` / `bot_author` come from
7. nothing publishes: the row lands `pending`

Responses: `200 accepted` (echoes the resolved bot name), `409 duplicate` (+ `live_url` when we
know it), `400 invalid_link` (`detail: shape | unreachable | http_<code>`), `400 bad_field`,
`403 turnstile_failed`, `429 rate_limited`.

There is deliberately **no public endpoint that lists submissions**.

### Reviewing

Local checkout (a `.env` is present, so dotenv finds the credentials):

```bash
npm run review-submissions -- list                      # pending queue, oldest first
npm run review-submissions -- list --status all
npm run review-submissions -- show     --id <uuid>
npm run review-submissions -- approve  --id <uuid> --tags personal,productivity [--sharer-handle h] [--note "why"]
npm run review-submissions -- reject   --id <uuid> --note "why"
npm run review-submissions -- published --id <uuid>
```

**Production has no `.env`** — pm2 starts the service with
`--env-file=/opt/projects/user/grokbot/secrets/votes-api.env`, so `npm run review-submissions`
there dies with `password authentication failed for user "votes_admin"`. Run the compiled CLI and
give node the same env file:

```bash
cd /opt/projects/user/grokbot/votes-api-src/services/votes-api
sudo -u agent node --env-file=/opt/projects/user/grokbot/secrets/votes-api.env \
  dist/bin/review-submissions.js list
```

`dist/bin/review-submissions.js` comes out of the service's own `npm run build`, so it can never
drift from the deployed code. Every subcommand and flag above is identical.

`approve` validates the tags against `src/data/template-tags.json`, records the decision in
`audit_log`, and prints a ready-to-use `templates.jsonl` record — the entry point of the existing
authoring → `generator.py` → build gate → `promote.sh` pipeline. Set `TEMPLATES_JSONL` (or pass
`--jsonl`) to append it to the marketplace corpus directly; the append is skipped if that
`share_url` is already in the file, so re-running is safe.

It REFUSES to approve a submission with no X handle: the site schema requires `sharer`, and a
bot author's display name is not a handle. Find who to credit and pass `--sharer-handle`.

### Privacy

`submissions` never stores a raw IP. `ip_hash` is the same peppered HMAC the vote ledger uses, and
`user_agent` is truncated to 300 characters. Rotating `VOTES_HMAC_PEPPER` (above) makes old
submission hashes uncorrelatable with new ones, exactly as it does for votes.
