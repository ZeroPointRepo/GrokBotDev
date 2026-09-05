#!/usr/bin/env node
// `npm run validate` — §8.5's content gate, enforcing the §5.6 integrity rules.
//
// Astro's content layer runs the canonical Zod schemas (src/content.config.ts) at build.
// This script runs FIRST and standalone, and covers the two things Zod cannot:
//   · cross-file rules (global slug uniqueness, URL dedupe, member resolution)
//   · file-level rules (filename === slug, body contracts, raw-HTML rejection)
// It also re-checks the field-level basics so a contributor gets a helpful message in one
// second instead of a Zod stack trace after a full build.
//
// Every failure names the file, the rule (§5.6 #n / §8.5 check n) and, for vocabulary
// misses, the closest canonical match.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parse as parseYaml } from 'yaml';
// F17 — the SAME parser the schema and the renderer use. `src/lib/sources.js` is plain JS
// with JSDoc types precisely so this file can import it: a second copy of the YouTube URL
// pattern here would be a licence for the validator and the site to disagree.
import { TIMESTAMP_RE, YOUTUBE_URL_RE, youtubeVideoId } from '../src/lib/sources.js';

// Default root is the live corpus. `--root scripts/fixtures` runs the same rules against
// the deliberately-invalid golden fixtures (§11 M2.5) — every failure class must trip.
const rootIndex = process.argv.indexOf('--root');
const ROOT = rootIndex === -1 ? 'content' : process.argv[rootIndex + 1];

const CONTENT_DIRS = {
  plugin: `${ROOT}/plugins`,
  'use-case': `${ROOT}/use-cases`,
  collection: `${ROOT}/collections`,
  news: `${ROOT}/news`,
  template: `${ROOT}/templates`,
};

const categories = JSON.parse(readFileSync('src/data/categories.json', 'utf8'));
const integrations = JSON.parse(readFileSync('src/data/integrations.json', 'utf8'));
const templateTagFacets = JSON.parse(readFileSync('src/data/template-tags.json', 'utf8'));
const TEMPLATE_TAGS = templateTagFacets.flatMap((facet) => facet.tags.map((t) => t.slug));
const TEMPLATE_PARTS = [
  'instructions',
  'memories',
  'workflow',
  'schedule',
  'skills',
  'connectors',
  'agent-team',
  'files',
];
// The twin of content.config.ts's SHARE_URL_RE. CONFIRMED grammar (2026-08-28): a share link
// is always https://x.ai/bot/<21 url-safe base64 chars>. grok.com/bot does not exist.
// Change BOTH copies together.
const SHARE_URL_RE = /^https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]{21}$/;
// `/marketplace/featured/` is a real route, so a template slugged `featured` would shadow it.
// `index` and `rss` are reserved for the same class of reason.
const RESERVED_TEMPLATE_SLUGS = new Set(['featured', 'index', 'rss']);

const errors = [];
const fail = (file, rule, message) => errors.push(`${file}\n    [${rule}] ${message}`);

// ---------- helpers ----------
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
const TWEET_RE = /^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/;
const NAMED_CHARACTER_RE = /^[^·]+ · .+$/u;

/** §5.6 rule 3 normalization: lowercase scheme+host, strip trailing slash, drop query + fragment. */
function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    const host = parsed.host.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.protocol.toLowerCase()}//${host}${path}`;
  } catch {
    return String(url).toLowerCase();
  }
}

function levenshtein(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) rows[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return rows[a.length][b.length];
}

/** §5.5 — exact canonical match required; alias or near-miss produces a "did you mean". */
function suggestIntegration(value) {
  const lower = String(value).toLowerCase();
  const byAlias = integrations.find((i) => (i.aliases ?? []).some((a) => a.toLowerCase() === lower));
  if (byAlias) return byAlias.canonical_name;
  let best = null;
  let bestScore = Infinity;
  for (const entry of integrations) {
    const score = levenshtein(lower, entry.canonical_name.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      best = entry.canonical_name;
    }
  }
  return bestScore <= Math.max(2, Math.round(lower.length / 3)) ? best : null;
}

function splitFrontmatter(raw, file) {
  if (!raw.startsWith('---')) {
    fail(file, '§5.2', 'file does not start with a YAML frontmatter block');
    return null;
  }
  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    fail(file, '§5.2', 'frontmatter block is never closed');
    return null;
  }
  const yamlText = raw.slice(3, end);
  const body = raw.slice(end + 4).replace(/^\r?\n/, '');
  // Astro parses frontmatter with a YAML 1.1 loader, which turns an UNQUOTED ISO
  // timestamp into a Date — and §5.2's schema is `z.string().datetime()`, so the build
  // fails with a type error. This parser (yaml 2.x, YAML 1.2) would happily pass it, so
  // catch the divergence here rather than letting it surface 20 seconds later.
  for (const match of yamlText.matchAll(
    /^\s*(added_at|published_at|updated_at|verified_at|posted_at):\s*(?!["'])(\d{4}-\d{2}-\d{2}T[^\s#]+)/gm
  )) {
    fail(
      file,
      '§5.2',
      `\`${match[1]}\` must be QUOTED ("${match[2]}") — an unquoted timestamp is parsed as a YAML date and fails the string schema`
    );
  }
  try {
    return { data: parseYaml(yamlText) ?? {}, body };
  } catch (error) {
    fail(file, '§5.2', `frontmatter is not valid YAML: ${error.message}`);
    return null;
  }
}

// ---------- load ----------
const entries = [];
for (const [type, dir] of Object.entries(CONTENT_DIRS)) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()) {
    const file = join(dir, name);
    const parsed = splitFrontmatter(readFileSync(file, 'utf8'), file);
    if (!parsed) continue;
    entries.push({ type, file, name, data: parsed.data, body: parsed.body });
  }
}

// ---------- per-entry checks ----------
const seenSlugs = new Map();
const projectUrls = new Map();
const repoUrls = new Map();
const sourceUrls = new Map();
const tweetUrls = new Map();
// Two templates pointing at the same install link are the same shared bot filed twice.
const shareUrls = new Map();
// F17 — keyed on VIDEO ID, deliberately not on URL. See the note on `youtubeVideoId`:
// `normalizeUrl()` strips the query string, and a watch URL keeps its id there, so URL
// dedupe would collapse every youtube.com/watch?v=… in the corpus into one key and report
// every entry after the first as a duplicate. The id also catches the same video submitted
// once as youtu.be/X and once as youtube.com/watch?v=X, which no URL normalisation can.
const youtubeIds = new Map();

for (const entry of entries) {
  const { file, data, body, type } = entry;
  const d = data ?? {};

  // §5.6 rule 1 — filename must equal slug
  const expected = basename(entry.name, '.md');
  if (d.slug !== expected) {
    fail(file, '§5.6 #1', `filename must equal slug — file is "${expected}.md" but slug is "${d.slug}"`);
  }
  if (typeof d.slug !== 'string' || !SLUG_RE.test(d.slug ?? '')) {
    fail(file, '§5.2', `slug "${d.slug}" is not kebab-case ([a-z0-9] joined by single hyphens)`);
  }

  // §5.6 rule 2 — one slug namespace across all three types
  if (d.slug) {
    if (seenSlugs.has(d.slug)) {
      fail(file, '§5.6 #2', `duplicate slug "${d.slug}" — already used by ${seenSlugs.get(d.slug)}`);
    } else {
      seenSlugs.set(d.slug, file);
    }
  }

  if (d.type && d.type !== type) {
    fail(file, '§5.2', `type "${d.type}" does not match its directory (${CONTENT_DIRS[type]})`);
  }

  // Every entry needs timestamps. Plugins also need the human fields as primary; use cases
  // carry those as an OPTIONAL machine mirror (reviewer-supplied) and use the final model
  // (headline/summary/categories) instead — enforced in the use-case block below.
  const requiredCommon =
    type === 'plugin'
      ? ['name', 'tagline', 'category', 'subcategory', 'added_at', 'updated_at']
      : type === 'news'
        ? ['title', 'summary', 'kind', 'published_at', 'updated_at']
        : type === 'template'
          ? ['name', 'tagline', 'description', 'sharer', 'tags', 'primary_category', 'added_at', 'updated_at']
          : ['added_at', 'updated_at'];
  for (const field of requiredCommon) {
    if (!d[field]) fail(file, '§5.2', `missing required field \`${field}\``);
  }
  if (typeof d.tagline === 'string' && (d.tagline.length < 10 || d.tagline.length > 90)) {
    fail(file, '§5.2', `tagline must be 10–90 chars (is ${d.tagline.length})`);
  }

  // §5.6 rule 4 — category/subcategory pair validity. Only when `category` is present: use
  // cases carry the legacy category/subcategory optionally (they use `categories` — checked in
  // the use-case block); plugins always have it (required above).
  const category = d.category ? categories.find((c) => c.slug === d.category) : null;
  if (d.category && !category) {
    fail(file, '§5.6 #4', `unknown category "${d.category}" — see src/data/categories.json`);
  } else if (d.category && category && !category.subcategories.some((s) => s.slug === d.subcategory)) {
    const options = category.subcategories.map((s) => s.slug).join(', ');
    fail(
      file,
      '§5.6 #4',
      `subcategory "${d.subcategory}" is not valid inside "${d.category}" — valid: ${options}`
    );
  }

  // §5.6 rule 7 — date sanity
  for (const field of ['added_at', 'published_at', 'updated_at', 'verified_at']) {
    if (d[field] && !ISO_RE.test(String(d[field]))) {
      fail(file, '§5.6 #7', `\`${field}\` must be ISO 8601 UTC ending in Z (got "${d[field]}")`);
    }
  }
  if (d.added_at && d.updated_at && String(d.updated_at) < String(d.added_at)) {
    fail(file, '§5.6 #7', 'updated_at must be ≥ added_at');
  }
  if (d.published_at && d.updated_at && String(d.updated_at) < String(d.published_at)) {
    fail(file, '§5.6 #7', 'updated_at must be ≥ published_at');
  }
  if (d.added_at && d.verified_at && String(d.verified_at) < String(d.added_at)) {
    fail(file, '§5.6 #7', 'verified_at must be ≥ added_at');
  }

  // §5.6 rule 8 + Addendum B4 — status semantics
  const status = d.status ?? (type === 'news' ? 'draft' : 'proposed');
  if (type === 'news') {
    if (!['live', 'draft'].includes(status)) {
      fail(file, 'NEWS-5', `news status must be "live" or "draft" (got "${status}")`);
    }
    if (d.verified_at) fail(file, 'NEWS-5', 'news entries do not use verified_at');
  } else {
    if (!['proposed', 'live', 'needs-update', 'deprecated', 'demo'].includes(status)) {
      fail(file, '§5.6 #8', `unknown status "${status}"`);
    }
    if (status === 'demo' && d.verified_at) {
      fail(
        file,
        'Addendum B4',
        'demo entries must not carry verified_at - nothing fictional ever carries a verification claim'
      );
    }
    // A SUBMITTER writes status: proposed and leaves verified_at empty; a reviewer sets both
    // verified_at and status: live. So verified_at is required only for the published states.
    if (!['deprecated', 'demo', 'proposed'].includes(status) && !d.verified_at) {
      fail(file, '§10.1', `verified_at is required for status "${status}" - a reviewer sets it; submitters use status: proposed (§10.1)`);
    }
  }

  // §5.5 — controlled integration vocabulary
  const vocabField = type === 'plugin' ? 'works_with' : 'integrations';
  const used = Array.isArray(d[vocabField]) ? d[vocabField] : [];
  for (const value of used) {
    if (!integrations.some((i) => i.canonical_name === value)) {
      const hint = suggestIntegration(value);
      fail(
        file,
        '§5.5',
        `unknown integration "${value}"${hint ? ` — did you mean \`${hint}\`?` : ''} (must match a canonical_name exactly)`
      );
    }
  }

  // §8.5 check 7 — no raw HTML in bodies (the stored-XSS vector)
  const rawHtml = body.match(/<\s*(script|iframe|style|form|object|embed|meta|link|base|svg)\b/i);
  if (rawHtml) {
    fail(file, '§8.5 check 7', `raw HTML <${rawHtml[1]}> in the body — markdown only (§5.3, §10.2)`);
  }
  const onAttr = body.match(/\son[a-z]+\s*=\s*["']/i);
  if (onAttr) {
    fail(file, '§8.5 check 7', `inline event handler "${onAttr[0].trim()}" in the body — markdown only`);
  }
  // §8.5 check 10 — images in bodies need alt text (§4.6)
  if (/!\[\s*\]\(/.test(body)) fail(file, '§8.5 check 10', 'image with empty alt text in the body');

  // §5.6 rule 3 — URL dedupe (per the documented normalization)
  const track = (map, url, label) => {
    if (!url) return;
    const key = normalizeUrl(url);
    if (map.has(key)) {
      fail(file, '§5.6 #3', `duplicate ${label} "${url}" — already used by ${map.get(key)}`);
    } else {
      map.set(key, file);
    }
  };

  if (type === 'plugin') {
    if (!d.project_url) fail(file, '§5.2', 'plugins require `project_url`');
    if (!d.author?.handle || !d.author?.url) {
      fail(file, '§5.2', 'plugins require an `author` with handle + url');
    }
    if (!Array.isArray(d.install_steps) || d.install_steps.length < 1) {
      fail(file, '§5.2', 'plugins require at least one `install_steps` entry');
    }
    track(projectUrls, d.project_url, 'project_url');
    track(repoUrls, d.repo_url, 'repo_url');
    if (body.trim().length < 400) {
      fail(file, '§5.3', `plugin body (description) must be ≥400 chars (is ${body.trim().length})`);
    }
  }

  if (type === 'news') {
    if (typeof d.title !== 'string' || d.title.length < 10 || d.title.length > 100) {
      fail(file, 'NEWS-1', 'title is required, 10–100 chars');
    }
    if (typeof d.summary !== 'string' || d.summary.length < 80 || d.summary.length > 320) {
      fail(file, 'NEWS-2', 'summary is required, 80–320 chars');
    }
    if (!['release', 'deal', 'update', 'announcement'].includes(d.kind)) {
      fail(file, 'NEWS-3', `kind must be release, deal, update, or announcement (got "${d.kind}")`);
    }
    if (d.important !== undefined && typeof d.important !== 'boolean') {
      fail(file, 'NEWS-4', 'important must be boolean when present');
    }
    if (d.external_url && !String(d.external_url).startsWith('https://')) {
      fail(file, 'NEWS-6', `external_url must be https:// (got "${d.external_url}")`);
    }
    if (d.cta_label !== undefined) {
      if (typeof d.cta_label !== 'string' || d.cta_label.length > 40) {
        fail(file, 'NEWS-6', 'cta_label must be a string ≤40 chars when present');
      }
      if (!d.external_url) fail(file, 'NEWS-6', 'cta_label requires external_url');
    }

    const tweets = Array.isArray(d.source_tweets) ? d.source_tweets : [];
    if (tweets.length > 5) fail(file, '§5.2', 'source_tweets is capped at 5');
    for (const tweet of tweets) {
      if (!TWEET_RE.test(tweet?.url ?? '')) {
        fail(file, '§5.2', `source_tweets url "${tweet?.url}" is not an x.com/<handle>/status/<id> URL`);
      }
      if (
        typeof tweet?.excerpt !== 'string' ||
        tweet.excerpt.length < 20 ||
        tweet.excerpt.length > 280
      ) {
        fail(file, '§5.6 #10', 'source_tweets excerpt must be a partial quote of 20–280 chars');
      }
      if (String(tweet?.author_handle ?? '').startsWith('@')) {
        fail(file, '§5.2', `author_handle "${tweet.author_handle}" must not include the leading @`);
      }
      track(tweetUrls, tweet?.url, 'source_tweets url');
    }
    if (!body.trim()) fail(file, 'NEWS-7', 'news body must not be empty');
  }

  if (type === 'use-case') {
    // ── FINAL MODEL (2026-08-21): the fields a submitter actually writes, mirroring
    // content.config.ts and CONTRIBUTING.md §3. headline / summary / categories are required.
    if (typeof d.headline !== 'string' || d.headline.length < 10 || d.headline.length > 100) {
      fail(file, 'UC-1', 'headline is required, 10–100 chars (the hook)');
    }
    if (typeof d.summary !== 'string' || d.summary.length < 80 || d.summary.length > 320) {
      fail(file, 'UC-2', 'summary is required, 80–320 chars');
    }
    if (!Array.isArray(d.categories) || d.categories.length < 1 || d.categories.length > 3) {
      fail(file, 'UC-3', 'categories is required — 1–3 slugs from the taxonomy');
    } else {
      for (const c of d.categories) {
        if (!categories.some((cat) => cat.slug === c)) {
          fail(file, 'UC-3', `unknown category "${c}" in categories — see src/data/categories.json`);
        }
      }
    }
    if (d.format && !['use-case', 'guide'].includes(d.format)) {
      fail(file, 'UC-4', `format must be "use-case" or "guide" (got "${d.format}")`);
    }
    // ── OPTIONAL machine mirror + legacy fields: validated only when present (a reviewer may
    // add name/tagline/category; schedule/autonomy/difficulty are no longer required).
    if (typeof d.name === 'string' && !NAMED_CHARACTER_RE.test(d.name)) {
      fail(file, '§5.2', `name must use "<Bot name> · <Role>" (got "${d.name}")`);
    }
    if (d.what_it_does !== undefined && (typeof d.what_it_does !== 'string' || d.what_it_does.length < 80 || d.what_it_does.length > 300)) {
      fail(file, '§5.2', 'what_it_does, when present, must be 80–300 chars');
    }
    if (d.replicability !== undefined && (typeof d.replicability !== 'string' || d.replicability.length < 40 || d.replicability.length > 300)) {
      fail(file, 'UC-8', 'replicability, when present, must be 40–300 chars');
    }
    if (d.prompt_provenance && !['author', 'curator'].includes(d.prompt_provenance)) {
      fail(file, '§5.2', `prompt_provenance must be "author" or "curator" (got "${d.prompt_provenance}")`);
    }
    // ── F17 · primary source ───────────────────────────────────────────────────────────
    // The schema is the authority on SHAPE; these checks are the ones Zod structurally
    // cannot make — cross-file uniqueness, and the cross-field tie to source_tweets.
    const primary = d.primary_source;
    if (primary) {
      if (!['x-post', 'youtube-video'].includes(primary.kind)) {
        fail(file, '§5.2', `primary_source.kind must be "x-post" or "youtube-video" (got "${primary.kind}")`);
      } else if (primary.kind === 'youtube-video') {
        if (!YOUTUBE_URL_RE.test(primary.url ?? '')) {
          fail(
            file,
            '§5.2',
            `primary_source url "${primary.url}" is not a YouTube video URL — accepted shapes are youtube.com/watch?v=…, youtu.be/… and youtube.com/shorts/…`
          );
        } else {
          // Keyed on video id + timestamp: a compilation video (e.g. "11 use cases in one
          // walkthrough") legitimately sources several distinct use cases, each pointing at a
          // different moment. Same video AND same moment still collides — that is a real dup.
          const id = youtubeVideoId(primary.url);
          const key = `${id}@${primary.timestamp ?? ''}`;
          if (youtubeIds.has(key)) {
            fail(
              file,
              '§5.6 #3',
              `duplicate youtube source "${id}${primary.timestamp ? ' @ ' + primary.timestamp : ''}" — already used by ${youtubeIds.get(key)} (same video and same timestamp)`
            );
          } else {
            youtubeIds.set(key, file);
          }
        }
        if (!primary.title || !primary.channel) {
          fail(
            file,
            '§5.2',
            'a youtube-video primary_source requires `title` and `channel` — the fallback card is also the permanent failure state, and a failure state that cannot name the video is not attribution'
          );
        }
        if (primary.timestamp && !TIMESTAMP_RE.test(primary.timestamp)) {
          fail(file, '§5.2', `primary_source.timestamp "${primary.timestamp}" must be mm:ss or h:mm:ss`);
        }
      } else if (!(d.source_tweets ?? []).some((t) => t?.url === primary.url)) {
        fail(
          file,
          '§5.6 #10',
          `primary_source points at ${primary.url}, which is not in source_tweets[] — an x-post primary must be one of this entry's own credited posts`
        );
      }
    }

    const tweets = Array.isArray(d.source_tweets) ? d.source_tweets : [];
    if (tweets.length > 5) fail(file, '§5.2', 'source_tweets is capped at 5');
    for (const tweet of tweets) {
      if (!TWEET_RE.test(tweet?.url ?? '')) {
        fail(file, '§5.2', `source_tweets url "${tweet?.url}" is not an x.com/<handle>/status/<id> URL`);
      }
      if (
        typeof tweet?.excerpt !== 'string' ||
        tweet.excerpt.length < 20 ||
        tweet.excerpt.length > 280
      ) {
        fail(file, '§5.6 #10', 'source_tweets excerpt must be a partial quote of 20–280 chars');
      }
      if (String(tweet?.author_handle ?? '').startsWith('@')) {
        fail(file, '§5.2', `author_handle "${tweet.author_handle}" must not include the leading @`);
      }
      track(tweetUrls, tweet?.url, 'source_tweets url');
    }

    // §5.3 body contract
    const required = ["## How it's set up", '## Prompt', "## Why it's cool"];
    const positions = required.map((heading) => body.indexOf(heading));
    required.forEach((heading, index) => {
      if (positions[index] === -1) fail(file, '§5.3', `missing required body section \`${heading}\``);
    });
    if (positions.every((p) => p !== -1)) {
      const ordered = positions.every((p, i) => i === 0 || p > positions[i - 1]);
      if (!ordered) fail(file, '§5.3', 'body sections must appear in the documented order');

      const sectionText = (index) => {
        const start = positions[index] + required[index].length;
        const end = index + 1 < positions.length ? positions[index + 1] : body.length;
        return body.slice(start, end).trim();
      };

      const setup = sectionText(0);
      if (setup.length < 300) {
        fail(file, '§5.3', `"## How it's set up" must be ≥300 chars (is ${setup.length})`);
      }

      const promptSection = sectionText(1);
      const fences = promptSection.match(/```text\n[\s\S]*?```/g) ?? [];
      if (fences.length !== 1) {
        fail(
          file,
          '§5.3',
          `"## Prompt" must contain exactly one \`\`\`text fenced block (found ${fences.length})`
        );
      } else {
        const promptBody = fences[0].replace(/^```text\n/, '').replace(/```$/, '').trim();
        if (promptBody.length < 200) {
          fail(file, '§5.3', `the prompt block must be ≥200 chars (is ${promptBody.length})`);
        }
      }

      const why = sectionText(2).replace(/## Example output[\s\S]*$/, '').trim();
      if (why.length < 150) {
        fail(file, '§5.3', `"## Why it's cool" must be ≥150 chars (is ${why.length})`);
      }
    }
  }

  // ---------- TEMPLATE (Shareable Bots) ----------
  // TPL-numbered rules. This branch exists because the status/required-field logic above is
  // "plugin / news / everything else", and letting templates fall through the `else` would
  // silently apply use-case-shaped assumptions to a type that shares none of them.
  if (type === 'template') {
    if (RESERVED_TEMPLATE_SLUGS.has(d.slug)) {
      fail(
        file,
        'TPL-9',
        `slug "${d.slug}" is reserved — it would shadow the /marketplace/${d.slug}/ route`
      );
    }
    if (typeof d.name !== 'string' || d.name.length < 3 || d.name.length > 60) {
      fail(file, 'TPL-1', 'name is required, 3–60 chars');
    }
    if (
      typeof d.description !== 'string' ||
      d.description.length < 80 ||
      d.description.length > 320
    ) {
      fail(file, 'TPL-2', 'description is required, 80–320 chars');
    }

    // TPL-3 — the sharer. Credit is the whole premise of the section, so it is never optional.
    const s = d.sharer;
    if (!s || typeof s.handle !== 'string' || typeof s.url !== 'string') {
      fail(file, 'TPL-3', 'sharer is required with `handle` and `url`');
    } else {
      if (String(s.handle).startsWith('@')) {
        fail(file, 'TPL-3', `sharer.handle "${s.handle}" must not include the leading @`);
      }
      if (!String(s.url).startsWith('https://')) {
        fail(file, 'TPL-3', `sharer.url must be https:// (got "${s.url}")`);
      }
    }

    // TPL-4 — tags against the controlled vocabulary, with a "did you mean".
    const tags = Array.isArray(d.tags) ? d.tags : [];
    if (!tags.length || tags.length > 8) {
      fail(file, 'TPL-4', 'tags is required — 1–8 slugs from src/data/template-tags.json');
    }
    for (const tag of tags) {
      if (!TEMPLATE_TAGS.includes(tag)) {
        let best = null;
        let bestScore = Infinity;
        for (const known of TEMPLATE_TAGS) {
          const score = levenshtein(String(tag).toLowerCase(), known);
          if (score < bestScore) {
            bestScore = score;
            best = known;
          }
        }
        const hint = bestScore <= Math.max(2, Math.round(String(tag).length / 3)) ? best : null;
        fail(
          file,
          'TPL-4',
          `unknown tag "${tag}"${hint ? ` — did you mean \`${hint}\`?` : ''} (see src/data/template-tags.json)`
        );
      }
    }
    if (d.primary_category && !tags.includes(d.primary_category)) {
      fail(
        file,
        'TPL-5',
        `primary_category "${d.primary_category}" is not in tags[] — it must be one of them`
      );
    }

    // TPL-6 — the source post, when there is one, and the reachability floor.
    //
    // RELAXED 2026-09-05 alongside src/content.config.ts (read the long note on `source` there):
    // a live template no longer HAS to carry `source`. A bot submitted at /submit/ may never
    // have been posted about, and §10.1's traceable sharer is `sharer`, which is still required.
    // What did NOT relax: a live entry must still give the reader somewhere to go, so `source`
    // and `share_url` may not BOTH be missing. The shape rules below are untouched.
    const src = d.source;
    if ((status === 'live' || status === 'needs-update') && !src && d.share_url === undefined) {
      fail(
        file,
        'TPL-6',
        'a live template needs `share_url`, `source`, or both — the install link or the post it was shared in (§10.1)'
      );
    }
    if (src) {
      if (!TWEET_RE.test(src.url ?? '')) {
        fail(file, 'TPL-6', `source.url "${src.url}" is not an x.com/<handle>/status/<id> URL`);
      }
      if (
        typeof src.excerpt !== 'string' ||
        src.excerpt.length < 20 ||
        src.excerpt.length > 280
      ) {
        fail(
          file,
          '§5.6 #10',
          'source.excerpt must be a partial quote of 20–280 chars — the embed fallback is also its permanent failure state'
        );
      }
      // NOT deduped on source.url, deliberately. A single post routinely announces several
      // bots at once (three pairs in the launch corpus do), so "one post, one template" is a
      // false assumption — the same one F17 rejected for compilation videos, where the key had
      // to become video id + timestamp. A template's identity is its INSTALL LINK, which is
      // deduped below: two entries sharing a share_url are the same bot filed twice, whereas two
      // entries sharing a post are two bots announced together.
    }

    // TPL-7 — the install link. Optional, but when present it must be a real share host.
    if (d.share_url !== undefined) {
      if (!SHARE_URL_RE.test(String(d.share_url))) {
        fail(
          file,
          'TPL-7',
          `share_url "${d.share_url}" must be an "Add to Grok Bot" link: https://x.ai/bot/<id> with a 21-character id`
        );
      }
      track(shareUrls, d.share_url, 'share_url');
    }

    // TPL-8 — `includes` vocabulary + the free-text escape hatch.
    for (const part of Array.isArray(d.includes) ? d.includes : []) {
      if (!TEMPLATE_PARTS.includes(part)) {
        fail(file, 'TPL-8', `unknown includes value "${part}" — valid: ${TEMPLATE_PARTS.join(', ')}`);
      }
    }
    if (d.includes_note !== undefined && (typeof d.includes_note !== 'string' || d.includes_note.length > 200)) {
      fail(file, 'TPL-8', 'includes_note must be a string ≤200 chars when present');
    }

    // TPL-10 — body contract.
    if (body.trim().length < 300) {
      fail(file, 'TPL-10', `template body must be ≥300 chars (is ${body.trim().length})`);
    }
    const whatIndex = body.indexOf('## What it does');
    if (whatIndex === -1) {
      fail(file, 'TPL-10', 'missing required body section `## What it does`');
    } else {
      const nextHeading = body.indexOf('\n## ', whatIndex + 1);
      const section = body.slice(whatIndex + '## What it does'.length, nextHeading === -1 ? body.length : nextHeading).trim();
      if (section.length < 200) {
        fail(file, 'TPL-10', `"## What it does" must be ≥200 chars (is ${section.length})`);
      }
    }
  }

  if (type === 'collection') {
    const members = Array.isArray(d.members) ? d.members : [];
    if (members.length < 2) fail(file, '§5.6 #9', 'collections need at least 2 members');
    if (members.length > 10) fail(file, '§5.6 #9', 'collections are capped at 10 members');
    const slugs = members.map((m) => m?.slug);
    if (new Set(slugs).size !== slugs.length) fail(file, '§5.2', 'duplicate member slugs');
    for (const member of members) {
      if (
        typeof member?.reason !== 'string' ||
        member.reason.length < 20 ||
        member.reason.length > 200
      ) {
        fail(file, '§5.2', `member "${member?.slug}" needs a reason of 20–200 chars`);
      }
    }
    if (body.trim().length < 200) {
      fail(file, '§5.3', `collection body (rationale) must be ≥200 chars (is ${body.trim().length})`);
    }
  }

  track(sourceUrls, d.source_url, 'source_url');
}

// ---------- cross-file: §5.6 rule 9, member resolution ----------
// MEMBER CORPUS (2026-08-30): plugins, use cases AND templates. A collection is a curated
// bundle of whatever the site holds, and the site now holds Shareable Bots — the X desk is a
// collection made entirely of them. Collections still may not contain other collections: that
// is the one recursion this rule exists to prevent, and it is the check that stayed.
const COLLECTABLE = new Set(['plugin', 'use-case', 'template']);
const byType = new Map(entries.map((e) => [e.data?.slug, e.type]));
for (const entry of entries.filter((e) => e.type === 'collection')) {
  for (const member of entry.data?.members ?? []) {
    const memberType = byType.get(member?.slug);
    if (!memberType) {
      fail(
        entry.file,
        '§5.6 #9',
        `dangling member "${member?.slug}" — no plugin, use case or shareable bot has that slug`
      );
    } else if (!COLLECTABLE.has(memberType)) {
      fail(
        entry.file,
        '§5.6 #9',
        `member "${member.slug}" is a ${memberType} - collections contain plugins, use cases and shareable bots only`
      );
    }
  }
}

// ---------- cross-file: TPL-11, related_use_cases resolution ----------
// Same shape as the collection member check above, and for the same reason: a cross-link that
// names a slug nothing owns renders as a link to a 404, and check-links only catches that once
// the page is built. Catching it here names the file and the field instead.
for (const entry of entries.filter((e) => e.type === 'template')) {
  for (const ref of entry.data?.related_use_cases ?? []) {
    const refType = byType.get(ref);
    if (!refType) {
      fail(entry.file, 'TPL-11', `dangling related_use_cases slug "${ref}" — no entry has that slug`);
    } else if (refType !== 'use-case') {
      fail(entry.file, 'TPL-11', `related_use_cases "${ref}" is a ${refType} — it must be a use case`);
    }
  }
}

// ---------- report ----------
const counts = {
  plugins: entries.filter((e) => e.type === 'plugin').length,
  'use-cases': entries.filter((e) => e.type === 'use-case').length,
  collections: entries.filter((e) => e.type === 'collection').length,
  news: entries.filter((e) => e.type === 'news').length,
  templates: entries.filter((e) => e.type === 'template').length,
};
const demo = entries.filter((e) => (e.data?.status ?? 'live') === 'demo').length;

console.log(
  `validate: ${entries.length} entries - ${counts.plugins} plugins, ${counts['use-cases']} use cases, ${counts.collections} collections, ${counts.news} news, ${counts.templates} templates (${demo} demo)`
);

if (errors.length) {
  console.error(`\nvalidate: ${errors.length} problem(s)\n`);
  for (const error of errors) console.error(`  ${error}\n`);
  process.exit(1);
}

console.log('validate: OK');
