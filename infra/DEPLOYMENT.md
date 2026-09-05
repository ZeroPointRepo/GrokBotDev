# Production deployment — grokbot.dev

grokbot.dev is a **static Astro build served by nginx** on **crhq-products**
(`root@2.28.9.79`, a.k.a. products.crhq.ai), **behind Cloudflare (Full mode)**.
There is **no CI/CD** — deploys are a single self-contained script on the box.

## Layout — `/opt/projects/user/grokbot/`
| Path | What |
|---|---|
| `repo/` | Canonical checkout of `github.com/ZeroPointRepo/GrokBotDev` (public), owned `agent`. |
| `releases/<UTC-ts>/` | Each build's `dist/` snapshot. Last 5 kept. |
| `current` | Symlink → the active release. **nginx `root` points here** (both the public vhost and the preview). |
| `deploy.sh` | The deploy script. Kept **outside** `repo/` so `git reset` can't clobber it mid-run. |
| `secrets/votes-api.env` | External votes-api/static-build env file. Never commit it; keep it `chmod 600`. |
| `_archive/` | `coming-soon-dist.tgz` (the pre-launch landing) + the retired AM2studio placeholder checkout. |

## Deploy — publish the `production` branch
Production serves the **`production`** branch, not `main`. Normal flow is `infra/promote.sh` from
the dev box (fast-forwards `production` to a reviewed `main`, then runs this). Manual prod deploy:
```bash
ssh crhq-products
sudo -u agent /opt/projects/user/grokbot/deploy.sh
```
`deploy.sh`: `git reset --hard origin/production` → `npm ci` → `npm run build` (the **full gate** —
a red build aborts **before** anything is swapped, so the live site is never a broken release)
→ snapshot `dist/` to `releases/<ts>/` → atomically `ln -sfn` the `current` symlink → prune to 5.
Zero-downtime: the swap is a single symlink flip.

## Rollback — instant, no rebuild
```bash
sudo -u agent ln -sfn "$(ls -1dt /opt/projects/user/grokbot/releases/*/ | sed -n 2p)" \
  /opt/projects/user/grokbot/current
```
Points `current` at the previous release.

## nginx
- **Public** vhost `/etc/nginx/sites-available/grokbot.dev` (archived: `nginx-grokbot.dev.prod.conf`):
  §10.7 security headers on every location; every `.json`/`.xml`/`.txt` served with
  `Access-Control-Allow-Origin: *` + a **CF-real-IP machine access log** (`/var/log/nginx/grokbot-machine.log`);
  `/api/waitlist` → the services process on `:4390`; `80 → 301 https`; `404 → /404.html`.
  TLS reuses the generatespecs LE cert (CF Full does not validate the origin cert name — swap to a
  grokbot.dev Origin/LE cert later, no behaviour change).
- **Preview** vhost `/etc/nginx/projects.d/grokbot.conf` (archived: `nginx-grokbot-preview.crhq.conf`):
  `products-grokbot.crhq.ai`, serves the **same `current` symlink** so preview == production.
- Snippets on the box: `security-headers.conf` → `/etc/nginx/snippets/grokbot-security-headers.conf`;
  the machine `log_format` → `/etc/nginx/conf.d/grokbot-machine-log.conf`.

## Waitlist service
`grokbot-services` (pm2, user `agent`, `:4390`) is the newsletter POST endpoint. DB at
`/opt/data/grokbot/waitlist.sqlite`. Independent of the static site — the site works if it's down.

## Dynamic port map
- `127.0.0.1:4390` = existing `grokbot-services` waitlist/MCP service (`/api/waitlist`, `/mcp`, `/healthz`).
- `127.0.0.1:4391` = `grokbot-votes-api` service — `/api/v1/*` votes endpoints **and**
  `POST /api/v1/submissions` (the public /submit/ bot form).


## Upvotes P1 rollout / production notes

The upvotes stack adds a same-origin votes API and keeps the static build invariant. Production rollout is manual and review-gated:

1. Review and merge/promote only after `npm run build`, `services/votes-api npm test`, E2E, and `npm run recount` are green.
2. Provision Postgres 16 on crhq-products with an external data volume equivalent to `/opt/projects/grokbot-votes-data`; create a `grokbot_votes` database.
3. Create production secrets outside git: `VOTES_HMAC_PEPPER` (`openssl rand -hex 32`), Postgres passwords/URLs for `votes_app`, `votes_admin`, and the migration role, and Cloudflare Turnstile production `TURNSTILE_SECRET_KEY`. The browser gets only `PUBLIC_TURNSTILE_SITEKEY`.
   Required prod slug-registry lines:
   ```dotenv
   # Slug registry sync: force fallback to the deployed site manifest so new content publishes need no votes-api redeploy.
   USE_CASE_CONTENT_DIR=/nonexistent-force-fallback
   SLUGS_FILE=/opt/projects/user/grokbot/current/api-meta/use-case-slugs.json
   ```
   Production must use the deployed `current/api-meta/use-case-slugs.json` manifest as the permanent slug source. The `current` symlink is atomically updated on every promote and the API re-reads the manifest on the default `SLUG_REFRESH_MS` cadence (10 minutes), so newly published use cases become voteable without redeploying the service checkout.
4. Install and migrate on the production checkout: `cd services/votes-api && npm ci && npm run db:migrate && npm run build`.
5. Start `pm2` app `grokbot-votes-api` bound to `127.0.0.1:4391` with the external production env file.
6. Apply the nginx changes from `infra/nginx-grokbot.dev.votes.snippet.conf` (http-level `limit_req_zone` once, then server-level exact `/api/v1/identity`, `/api/v1/votes`, `/api/v1/votes/*`, and `/api/v1/health` proxy locations). Keep existing static `.json` handling untouched.
7. Copy the updated `infra/security-headers.conf` into `/etc/nginx/snippets/grokbot-security-headers.conf`; this consciously adds `https://challenges.cloudflare.com` for Turnstile script/frame/connect. Confirm `nginx -t` before reload.
8. No DNS change is expected for `grokbot.dev`; Cloudflare already fronts the origin. Do not change Cloudflare except to create/provision Turnstile production keys.
9. After reload, smoke-test: `/api/v1/health`, `/api/v1/votes/counts?slugs=<known>`, one Turnstile-backed vote, `npm run recount`, then monitor `pm2 logs grokbot-votes-api` and nginx 429s.

## REQUIRED at the Shareable Bots release — repoint the votes-api slug registry

**One line of env, and it is a hard prerequisite for template upvotes.**

The votes-api validates every slug against a registry loaded from a manifest. Until that manifest
includes template slugs, `/api/v1/votes/counts` rejects them — and it rejects them
**per request, not per slug**: one unknown slug returns `400 unknown_slug` for the WHOLE batch.
The site now emits a combined manifest for exactly this reason:

| path (in `current/`) | contents |
|---|---|
| `api-meta/use-case-slugs.json` | use-case slugs only — **unchanged**, byte for byte |
| `api-meta/template-slugs.json` | template slugs only |
| `api-meta/votable-slugs.json` | **the union — point production at this one** |

In the external votes-api env file (`secrets/votes-api.env`), change the one line:

```dotenv
USE_CASE_CONTENT_DIR=/nonexistent-force-fallback                              # unchanged
-SLUGS_FILE=/opt/projects/user/grokbot/current/api-meta/use-case-slugs.json
+SLUGS_FILE=/opt/projects/user/grokbot/current/api-meta/votable-slugs.json
```

No votes-api code change, no rebuild, and no restart: the registry re-reads on the default
`SLUG_REFRESH_MS` (10 minutes) and `current/` is swapped atomically by the promote.

**ORDER MATTERS — promote the site FIRST, then repoint.** Repointing first aims the registry at a
path that does not exist yet, and `SlugRegistry.loadFallbacks()` would silently fall through to the
service checkout's own `content/use-cases` — i.e. quietly back to use-cases only, with no error.

**Getting the order wrong is survivable.** `src/scripts/vote-counts.ts` requests each kind in its
own batch (`data-vote-kind`) and bisects any chunk the service rejects, so unknown template slugs
read `0` instead of zeroing out the use-case counts sitting beside them on the same page. The
feature is simply not live until the repoint lands.

**Smoke test after the repoint:**

```bash
curl -s 'https://grokbot.dev/api/v1/votes/counts?slugs=<a-template-slug>' | jq
# expect {"counts":{"<a-template-slug>":0}}, NOT {"error":"unknown_slug"}
```

**Local/dev note:** `SlugRegistry.load()` tries `loadFromContentDir()` FIRST and only falls back to
`SLUGS_FILE` when that yields nothing. Any dev votes-api must therefore set **both**
`USE_CASE_CONTENT_DIR=/nonexistent-force-fallback` **and** `SLUGS_FILE`, or it will silently know
use-case slugs only no matter what the manifest says.

---

## Public bot submissions (`/submit/`) — shipped 2026-09-05

The /submit/ page leads with a form whose only required field is the bot's `https://x.ai/bot/…`
share link. It is the **same service, same database, same nginx vhost** as upvotes — no new
process, no new port, no accounts.

### What was added

| piece | where |
|---|---|
| table `submissions` | `services/votes-api/migrations/003_submissions.sql` (table + indexes + grants in one file) |
| endpoint `POST /api/v1/submissions` | `services/votes-api/src/app.ts` + `src/submissions/{schema,share-link,live-manifest}.ts` |
| review CLI | `services/votes-api/bin/review-submissions.ts` (`npm run review-submissions`) |
| form + island | `src/components/SubmitBotForm.astro` + `src/scripts/submit-form.ts` (bundled, zero inline JS) |
| nginx | `location = /api/v1/submissions` + `limit_req_zone grokbot_submissions` — `infra/nginx-grokbot.dev.votes.snippet.conf` |

`submissions` stores a peppered `ip_hash` (never a raw IP), a truncated user-agent, the link, the
bot name/author read server-side from the share page's `og:title`, and whatever optional
attribution the submitter chose to give. `votes_app` has **INSERT + SELECT only** — the service
literally cannot approve, publish, or delete a submission; only `votes_admin` (the review CLI) can.

### Env (production `secrets/votes-api.env`)

Both lines are OPTIONAL — the defaults work — but the file path is much cheaper than the fetch on
the web host, because the promoted manifest is already on local disk:

```dotenv
# Live-bot dedupe. File is tried first, URL is the fallback; if neither answers, the check is
# skipped (the table's UNIQUE constraint and the reviewer still catch duplicates).
SUBMISSIONS_MANIFEST_FILE=/opt/projects/user/grokbot/current/api/v1/templates.json
SUBMISSIONS_MANIFEST_URL=https://grokbot.dev/api/v1/templates.json
# SUBMISSIONS_MANIFEST_TTL_MS=300000   # default 5 min
# SHARE_LINK_TIMEOUT_MS=2500           # budget for the server-side share-page fetch
```

No new secret. Turnstile reuses the existing `TURNSTILE_SECRET_KEY` / `PUBLIC_TURNSTILE_SITEKEY`.

### Deploy order (the API must be reachable BEFORE the form is live)

```bash
# 1 — nginx (root on crhq-products)
#     zones file: add   limit_req_zone $binary_remote_addr zone=grokbot_submissions:10m rate=5r/m;
#     vhost:      add   the `location = /api/v1/submissions` block from the infra snippet
nginx -t && systemctl reload nginx

# 2 — service
cd /opt/projects/user/grokbot/votes-api-src && sudo -u agent git fetch origin && sudo -u agent git reset --hard origin/main
cd services/votes-api && sudo -u agent npm ci && sudo -u agent npm run db:migrate && sudo -u agent npm run build
sudo -u agent pm2 restart grokbot-votes-api --update-env
curl -s https://grokbot.dev/api/v1/health

# 3 — site
bash infra/promote.sh
```

Migrations are re-runnable: `003_submissions.sql` is `create table if not exists` + idempotent
grants, exactly like 001/002.

### Reviewing what comes in

The production checkout has **no `.env`** — the service is started by pm2 with
`--env-file=/opt/projects/user/grokbot/secrets/votes-api.env`, and `npm run review-submissions`
(which loads `./.env` via dotenv) therefore fails with `password authentication failed for user
"votes_admin"`. On production run the **compiled** CLI and hand node the same env file pm2 uses:

```bash
cd /opt/projects/user/grokbot/votes-api-src/services/votes-api
R="sudo -u agent node --env-file=/opt/projects/user/grokbot/secrets/votes-api.env dist/bin/review-submissions.js"

$R list                                                        # pending queue, oldest first
$R list --status all
$R show      --id <uuid>
$R approve   --id <uuid> --tags personal,productivity [--sharer-handle h] [--note "why"]
$R reject    --id <uuid> --note "why"
$R published --id <uuid>
```

`dist/bin/review-submissions.js` is produced by the same `npm run build` step as the service, so
it is always in step with the deployed code. `npm run review-submissions -- …` is the equivalent
for a **local** checkout, where `.env` exists.

`approve` prints a `templates.jsonl` record (and appends it to `$TEMPLATES_JSONL` when set), which
is the entry point of the existing authoring → `generator.py` → build gate → `promote.sh`
pipeline. It REFUSES to approve without an X handle to credit — pass `--sharer-handle` when the
submitter left the field blank. Mark the row `published` once the bot is actually live.

### Schema change that shipped with it

`source` (the announcing X post) is now **optional on a live template** in both
`src/content.config.ts` and `scripts/validate.mjs` (TPL-6) — relaxed together, and backstopped by
a floor that did not exist before: a live template must carry `share_url`, `source`, or both.
A submitted bot may never have been posted about; `sharer` still carries §10.1's traceable credit.
See the long note on the field in `src/content.config.ts`.

**Open item for whoever owns `generator.py`.** That script is not in this repository and is not on
the build host, so it could not be changed here: it still writes the `source:` block
unconditionally, i.e. `url: <source_tweet_url>`, and `review-submissions approve` emits
`source_tweet_url: null` for a bot that was never posted about. The one-line change is to emit the
`source:` block only when `source_tweet_url` is truthy. **This fails safe until then** — the
generated front matter would carry `source.url: null`, which `templateSource` (`url` must match
`X_STATUS_RE`, `excerpt` 20-280 chars) rejects, so the build gate stops it loudly rather than
publishing a broken entry. The first sourceless approval will hit this.
