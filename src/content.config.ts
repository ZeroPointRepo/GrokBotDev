// src/content.config.ts — CANONICAL. §5 of the PRD owns this file.
// Copied from §5.2 with exactly one documented amendment: Addendum B4 adds `demo` to the
// status enum and forbids `verified_at` on demo entries ("nothing fictional ever carries a
// verification claim"). Everything else is verbatim §5.2.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import categories from './data/categories.json';
import integrations from './data/integrations.json';
import templateTagFacets from './data/template-tags.json';
import { TIMESTAMP_RE, X_STATUS_RE, YOUTUBE_URL_RE } from './lib/sources';

// ---------- shared primitives ----------
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z.string().regex(SLUG_RE, 'kebab-case only').max(64);
const isoDate = z.string().datetime(); // ISO 8601, UTC "Z" only (no offsets)
const httpsUrl = z.string().url().startsWith('https://');
const tagline = z.string().min(10).max(90); // hand-written, ≤90 chars — also the meta-description base (§6.3)

const categorySlugs = categories.map((c) => c.slug) as [string, ...string[]];

const integrationName = z.string().refine(
  (v) => integrations.some((i) => i.canonical_name === v),
  (v) => ({
    message: `Unknown integration "${v}" — must exactly match a canonical_name in src/data/integrations.json (§5.5)`,
  })
);

const author = z
  .object({
    handle: z.string().min(1).max(40), // no leading @
    url: httpsUrl, // rendered DOFOLLOW when verified (§6.10, §5.6 rule 8)
    platform: z.enum(['x', 'github', 'web']).default('x'),
  })
  .strict();

const scoutedBy = z
  .object({
    handle: z.string().min(1).max(40),
    platform: z.enum(['x', 'github']).default('x'),
  })
  .strict();

const sourceTweet = z
  .object({
    // F17: the pattern moved to lib/sources.js so the schema and the primary-source
    // union validate an X URL with the same regex rather than two copies of it.
    url: z.string().regex(X_STATUS_RE),
    author_handle: z.string().min(1).max(15), // no leading @
    excerpt: z.string().min(20).max(280), // short attributed quote — NEVER the full post (§10.6, §5.6 rule 10)
    posted_at: isoDate.optional(),
  })
  .strict();

// Addendum B4: `demo` joins the enum. A demo entry is an explicitly-labelled example —
// it never carries verified_at and is excluded from the API, feeds, wall and sitemap.
// `proposed` (2026-08-22) is the state a SUBMITTER writes: it validates without verified_at, and
// stays invisible (isListable/included exclude it) until a reviewer flips it to `live` and sets
// verified_at. This resolves the old catch-22 where the rulebook said "leave status: live" but
// the validator then demanded a reviewer-only verified_at. Default is `proposed` (fail-safe:
// an entry never publishes until a human verifies it).
const status = z.enum(['proposed', 'live', 'needs-update', 'deprecated', 'demo']).default('proposed');

// ---------- PRIMARY SOURCE (F17) ----------
// The ONE thing an entry was found in. A discriminated union rather than a `kind` field
// beside optional siblings, for one reason: it makes "a YouTube source without a title" and
// "an X source carrying a channel name" UNREPRESENTABLE instead of merely discouraged. Zod
// also reports the right error — it narrows on `kind` first and then complains about that
// branch's fields, rather than listing every field of both shapes.
//
// EXACTLY ONE per entry is structural: it is an object, not an array. Nothing to enforce.
//
// ADDITIVE BY DESIGN — the whole field is `.optional()`. Absent means `{ kind: 'x-post', url:
// source_tweets[0].url }`, which is precisely the rule the codebase already followed
// implicitly, so every existing content file keeps its current behaviour untouched and NOT
// ONE of them had to be edited to land F17. `primarySourceOf()` in lib/entries.ts is the one
// place that fallback lives.
const primarySource = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('x-post'),
      // Points AT one of the entry's own source_tweets — see `primaryIsCredited` below. It
      // carries no excerpt or handle of its own precisely so the two can never disagree:
      // the credit line stays the single source of that text.
      url: z.string().regex(X_STATUS_RE, 'must be a post URL like https://x.com/<handle>/status/<id>'),
    })
    .strict(),
  z
    .object({
      kind: z.literal('youtube-video'),
      url: z
        .string()
        .regex(
          YOUTUBE_URL_RE,
          'must be a YouTube video URL — youtube.com/watch?v=…, youtu.be/…, or youtube.com/shorts/… (playlist, channel and /embed/ URLs are not accepted)'
        ),
      // REQUIRED, both of them. The embed's fallback card is also its permanent failure
      // state, and a failure state that cannot name the video is not attribution — it is a
      // dead rectangle. Making these optional would let an entry ship a source that
      // disappears the moment Google is unreachable.
      title: z.string().min(3).max(140),
      channel: z.string().min(1).max(60), // display name, no leading @
      channel_url: httpsUrl.optional(),
      // A receipt, written the way a human reads it off the video: "4:12", "1:02:03".
      // Converted to `start=` seconds at render (lib/sources.js).
      timestamp: z
        .string()
        .regex(TIMESTAMP_RE, 'must be mm:ss or h:mm:ss — e.g. "4:12" or "1:02:03"')
        .optional(),
      posted_at: isoDate.optional(),
    })
    .strict(),
]);

// An `x-post` primary must be one of the entry's OWN credited posts. Without this an entry
// could name a primary source that appears nowhere in its credit line — the reader would see
// an embed attributed to a post the page never claims to be sourced from, which is the exact
// kind of quiet attribution drift §10.1 exists to prevent.
function primaryIsCredited(
  data: { primary_source?: { kind: string; url: string }; source_tweets: Array<{ url: string }> },
  ctx: z.RefinementCtx
) {
  const primary = data.primary_source;
  if (!primary || primary.kind !== 'x-post') return;
  if (!data.source_tweets.some((tweet) => tweet.url === primary.url)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['primary_source', 'url'],
      message: `primary_source points at ${primary.url}, which is not in source_tweets[] — an x-post primary source must be one of this entry's own credited posts (§5.6 rule 10)`,
    });
  }
}

// cross-field checks
function validCategoryPair(
  data: { category?: string; subcategory?: string },
  ctx: z.RefinementCtx
) {
  // FINAL model: legacy category/subcategory are optional. Only validate the pair when present.
  if (!data.category || !data.subcategory) return;
  const cat = categories.find((c) => c.slug === data.category);
  if (!cat || !cat.subcategories.some((s) => s.slug === data.subcategory)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `subcategory "${data.subcategory}" is not valid inside category "${data.category}" (see src/data/categories.json)`,
    });
  }
}

// FINAL Awesome Use Case essentials — enforce what the card + integrity need, independent of
// the legacy field names. See CONTRIBUTING.md (the public rulebook) and
// documents/grokbot-dev/awesome-use-case-model.md.
function useCaseEssentials(
  data: {
    headline?: string;
    name?: string;
    summary?: string;
    what_it_does?: string;
    tagline?: string;
    categories?: string[];
    category?: string;
    source_tweets?: unknown[];
    primary_source?: unknown;
    author?: unknown;
    scouted_by?: unknown;
  },
  ctx: z.RefinementCtx
) {
  const fail = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  if (!data.headline && !data.name) fail('needs a `headline` (the hook) — see CONTRIBUTING.md');
  if (!data.summary && !data.what_it_does && !data.tagline) fail('needs a `summary` — see CONTRIBUTING.md');
  if (!(data.categories && data.categories.length) && !data.category)
    fail('needs at least one entry in `categories` — see CONTRIBUTING.md');
  // Must trace to a real source or creator: an embeddable post/video, or an `author` credit
  // (curator reconstructions of a named person's published build are credited via `author`).
  if (
    !(data.source_tweets && data.source_tweets.length) &&
    !data.primary_source &&
    !data.author &&
    !data.scouted_by
  )
    fail('needs a real source or author credit — see CONTRIBUTING.md');
}

function datesSane(
  data: { added_at: string; updated_at: string; verified_at?: string },
  ctx: z.RefinementCtx
) {
  if (data.updated_at < data.added_at)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'updated_at must be ≥ added_at' });
  if (data.verified_at && data.verified_at < data.added_at)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'verified_at must be ≥ added_at' });
}

function newsDatesSane(
  data: { published_at: string; updated_at: string },
  ctx: z.RefinementCtx
) {
  if (data.updated_at < data.published_at)
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'updated_at must be ≥ published_at' });
}

// no unverified entry ever publishes (§10.1) — deprecated pages are kept but were verified once
function verifiedWhenLive(data: { status: string; verified_at?: string }, ctx: z.RefinementCtx) {
  // Addendum B4: a demo entry must NEVER carry a verification claim.
  if (data.status === 'demo' && data.verified_at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'demo entries must not carry verified_at — nothing fictional ever carries a verification claim (Addendum B4, §10.1)',
    });
    return;
  }
  // verified_at is required only for the PUBLISHED states. `proposed` (submitter) and
  // `deprecated` are exempt; `demo` is handled above.
  if (
    data.status !== 'deprecated' &&
    data.status !== 'demo' &&
    data.status !== 'proposed' &&
    !data.verified_at
  )
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'verified_at is required for a live entry — a reviewer sets it (submitters use status: proposed) (§10.1)',
    });
}

// ---------- PLUGIN ----------
const plugins = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/plugins' }),
  schema: z
    .object({
      type: z.literal('plugin').default('plugin'),
      name: z.string().min(3).max(60),
      slug, // MUST equal filename (§8 CI)
      tagline,
      category: z.enum(categorySlugs),
      subcategory: z.string(), // pair-validated below
      install_steps: z.array(z.string().min(10).max(300)).min(1).max(12),
      prompt: z.string().min(120).max(8000).optional(), // verbatim copy-paste prompt (§4.3.3 region 5). Optional — a plugin may ship install steps only.
      works_with: z.array(integrationName).default([]), // controlled vocab (§5.5); API field `integrations` (§7)
      project_url: httpsUrl, // rendered DOFOLLOW when verified (§6.10); dedupe key (§5.6)
      repo_url: httpsUrl.optional(), // rendered DOFOLLOW when verified (§6.10)
      // Standardized social fields (operator, 2026-08-22): the PRODUCT's X handle and the
      // FOUNDER's X handle — advertised in the detail side card to give listed tools and the
      // people behind them real visibility (personal-brand incentive for founders).
      x_handle: z.string().min(1).max(15).optional(), // product X handle, no leading @
      founder: z
        .object({
          name: z.string().min(1).max(60).optional(),
          x_handle: z.string().min(1).max(15), // no leading @
        })
        .strict()
        .optional(),
      author, // required for plugins
      scouted_by: scoutedBy.optional(),
      source_url: httpsUrl.optional(), // provenance (usually an X post); rendered as a link
      pricing_note: z.string().max(120).optional(), // honest cost line, e.g. "Free tier; API key ~$5/mo"
      setup_minutes: z.number().int().min(1).max(240).optional(), // setup-time chip (§4.2.10, §4.3.3)
      featured: z.boolean().default(false),
      sponsor: z.boolean().default(false), // operator: marks a sponsor tool — badged in listings
      added_at: isoDate,
      updated_at: isoDate,
      verified_at: isoDate.optional(), // MAINTAINER-SET ONLY on community PRs (§8.5 check 9)
      status,
    })
    .strict()
    .superRefine(validCategoryPair)
    .superRefine(datesSane)
    .superRefine(verifiedWhenLive),
});

// ---------- USE CASE ----------
const useCases = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/use-cases' }),
  schema: z
    .object({
      type: z.literal('use-case').default('use-case'),
      // Named-character style is REQUIRED: "<Bot name> · <Role>", separator " · " (U+00B7)
      // LEGACY (optional since the FINAL model, 2026-08-21): the card no longer uses name /
      // tagline / single category. Kept optional so existing entries validate and machine
      // surfaces can still read them; new submissions use headline / summary / categories.
      name: z
        .string()
        .min(5)
        .max(60)
        .regex(/^[^·]+ · .+$/u, 'Use "<Bot name> · <Role>", e.g. "R2 · Chief of Staff"')
        .optional(),
      slug,
      tagline: tagline.optional(),
      category: z.enum(categorySlugs).optional(),
      subcategory: z.string().optional(),
      // ── FINAL "Awesome Use Case" model (approved 2026-08-21) ─────────────────────────────
      // The card is: score eyebrow · headline · summary · categories[] · source. See
      // documents/grokbot-dev/awesome-use-case-model.md. Added optional during rollout;
      // tightened to required once every entry is backfilled.
      // REQUIRED since 2026-08-22 (operator): every entry is backfilled, so the final-model
      // essentials are now hard schema requirements, not just the useCaseEssentials refine.
      headline: z.string().min(10).max(100), // the hook (card title)
      summary: z.string().min(80).max(320), // 2–3 lines
      categories: z.array(z.enum(categorySlugs)).min(1).max(3), // multi; the only tagging
      format: z.enum(['use-case', 'guide']).default('use-case'),
      awesome_score: z.number().int().min(0).max(100).optional(), // quality, never engagement
      score_breakdown: z
        .object({
          reproducibility: z.number().int(),
          ambition: z.number().int(),
          concreteness: z.number().int(),
          novelty: z.number().int(),
          evidence: z.number().int(),
          craft: z.number().int(),
        })
        .strict()
        .optional(),
      bot_name: z.string().min(1).max(30).optional(), // default: substring of name before " · "
      what_it_does: z.string().min(80).max(300).optional(), // legacy; superseded by `summary`
      integrations: z.array(integrationName).default([]),
      schedule: z.enum(['none', 'adhoc', 'hourly', 'daily', 'weekly', 'biweekly', 'monthly']).optional(),
      autonomy: z.enum(['readonly', 'proposes', 'acts-with-approval', 'autonomous']).optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
      setup_minutes: z.number().int().min(1).max(240).optional(),
      cost_note: z.string().max(120).optional(),
      source_tweets: z
        .array(sourceTweet)
        .max(5)
        .default([]), // embed source; see rules in §5.6 (floor 6, cap 10)
      // F17 — the ONE source this entry was found in. Optional: absent means the first
      // source_tweet, which is what every entry before F17 meant implicitly.
      primary_source: primarySource.optional(),
      author: author.optional(),
      scouted_by: scoutedBy.optional(),
      replicability: z.string().min(40).max(300).optional(), // rendered as Callout info (§4.3.5 region 7)
      // M2b: where the prompt text came from. `author` = the creator published this text
      // (a repo file, a gist, or the post itself). `curator` = grokbot.dev reconstructed it
      // from a documented setup, and the page says so above the prompt. Absent means
      // `author` — nothing ships as `curator` until the operator sanctions that path.
      prompt_provenance: z.enum(['author', 'curator']).optional(),
      featured: z.boolean().default(false),
      added_at: isoDate,
      updated_at: isoDate,
      verified_at: isoDate.optional(), // MAINTAINER-SET ONLY on community PRs (§8.5 check 9)
      status,
    })
    .strict()
    .superRefine(validCategoryPair)
    .superRefine(datesSane)
    .superRefine(verifiedWhenLive)
    .superRefine(primaryIsCredited)
    .superRefine(useCaseEssentials),
});

// ---------- NEWS ----------
const newsEntries = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/news' }),
  schema: z
    .object({
      type: z.literal('news').default('news'),
      slug,
      title: z.string().min(10).max(100),
      summary: z.string().min(80).max(320),
      kind: z.enum(['release', 'deal', 'update', 'announcement']),
      important: z.boolean().default(false),
      external_url: httpsUrl.optional(),
      cta_label: z.string().max(40).optional(),
      source_tweets: z.array(sourceTweet).max(5).default([]),
      published_at: isoDate,
      updated_at: isoDate,
      status: z.enum(['live', 'draft']).default('draft'),
    })
    .strict()
    .superRefine(newsDatesSane),
});

// ---------- COLLECTION ----------
const collectionEntries = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/collections' }),
  schema: z
    .object({
      type: z.literal('collection').default('collection'),
      name: z.string().min(3).max(60),
      slug,
      tagline,
      category: z.enum(categorySlugs), // collections ARE categorised (§6.2); not listed on category hubs
      subcategory: z.string(), // pair-validated below
      // members = slugs of plugins, use cases and/or templates ("Shareable Bots") — never
      // other collections, which is the one recursion the cross-file check in validate.mjs
      // exists to prevent. Each carries a one-line rationale; array order = display order.
      members: z
        .array(z.object({ slug, reason: z.string().min(20).max(200) }).strict())
        .min(2)
        .max(10)
        .refine((m) => new Set(m.map((x) => x.slug)).size === m.length, 'duplicate member slugs'),
      prompt: z.string().min(120).max(8000).optional(), // optional combined bootstrap prompt (§4.3.7 region 6)
      featured: z.boolean().default(false),
      added_at: isoDate,
      updated_at: isoDate,
      verified_at: isoDate.optional(), // MAINTAINER-SET ONLY on community PRs (§8.5 check 9)
      status,
    })
    .strict()
    .superRefine(validCategoryPair)
    .superRefine(datesSane)
    .superRefine(verifiedWhenLive),
});

// ---------- TEMPLATE (the "Shareable Bots" marketplace) ----------
//
// A template is a packaged Grok Bot somebody shared on X: instructions + memories + workflow,
// personal data stripped, behind one "Add to Grok Bot" install link. xAI has not shipped a
// public marketplace, so this is the aggregator.
//
// WHY THIS IS SHAPED LIKE `news` AND NOT LIKE `plugins`. `AnyDoc` (plugin | use-case |
// collection) is welded to `category` / `subcategory` and is consumed by LaneIndexPage,
// toApiItem, relatedTo, toCardEntry and sitemap-data. Templates have no category taxonomy —
// they have their own faceted TAG vocabulary. Joining AnyDoc would mean either a fake
// category on every template or making the field optional on all three existing lanes, and
// the second one weakens three shipped lanes to serve a fourth. `news` already solved exactly
// this by living in its own lib and joining only at feed.json. Templates do the same.
//
// NAMING: the machine layer says `template`; the human layer says "Shareable Bots". That split
// is deliberate and precedented (CP-032: the field is `replicability`, the label is "what you
// need"). Do not "fix" one to match the other.

const TEMPLATE_TAGS = new Set(templateTagFacets.flatMap((facet) => facet.tags.map((t) => t.slug)));

const templateTag = z.string().refine(
  (v) => TEMPLATE_TAGS.has(v),
  (v) => ({
    message: `Unknown template tag "${v}" — must be a slug in src/data/template-tags.json`,
  })
);

/** Who shared it. REQUIRED on every template: the credit IS the section's premise. */
const sharer = z
  .object({
    handle: z.string().min(1).max(15), // no leading @
    name: z.string().min(1).max(60).optional(),
    url: httpsUrl, // profile, or the post itself
    platform: z.enum(['x', 'github', 'web']).default('x'),
  })
  .strict();

/**
 * The post the template was shared in.
 *
 * `excerpt` is REQUIRED, not optional, for the same reason F17 made a YouTube source's title
 * and channel required: TweetEmbed's quote card is also its PERMANENT failure state, and a
 * failure state that cannot quote the post is not attribution.
 */
const templateSource = z
  .object({
    url: z.string().regex(X_STATUS_RE),
    excerpt: z.string().min(20).max(280), // partial quote, NEVER the full post (§10.6)
    posted_at: isoDate.optional(),
  })
  .strict();

/**
 * The "Add to Grok Bot" install link.
 *
 * CONFIRMED GRAMMAR (2026-08-28, from resolving real t.co share links): every share link is
 * `https://x.ai/bot/<id>` where the id is exactly 21 URL-safe base64 characters. `grok.com/bot`
 * does not exist and is NOT accepted — an earlier draft allowed it while the shape was unknown.
 *
 * The regex is deliberately EXACT rather than "any x.ai path": a share link is the one field on
 * this entry that sends a reader off-site to install somebody else's instructions, so a typo, a
 * truncated id, or a marketing URL that merely lives on x.ai must fail the build rather than
 * render a button that goes somewhere unexpected.
 *
 * Each share page also serves OpenGraph tags — `og:title` is "<Bot Name> by <Author>" and
 * `og:description` is the bot's own instruction summary. Those are the canonical source for
 * `name` and `description`, NOT the marketing tweet. That is a content rule (CONTRIBUTING §5b),
 * not a schema one, because only a human or a scout can read the share page.
 *
 * The twin of this pattern lives in scripts/validate.mjs. Change both together.
 */
const SHARE_URL_RE = /^https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]{21}$/;

/** What a shared bot actually carries. Enum, so it renders as chips and cannot drift. */
const TEMPLATE_PARTS = [
  'instructions',
  'memories',
  'workflow',
  'schedule',
  'skills',
  'connectors',
  'agent-team',
  'files',
] as const;

// `primary_category` must be one of the entry's OWN tags. Without this a template could lead
// with a facet the page never claims, and the row's lead chip would disagree with the filter.
function primaryTagIsTagged(
  data: { tags: string[]; primary_category: string },
  ctx: z.RefinementCtx
) {
  if (!data.tags.includes(data.primary_category)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['primary_category'],
      message: `primary_category "${data.primary_category}" is not in tags[] — it must be one of them`,
    });
  }
}

/**
 * A LIVE template must give the reader somewhere to go: the install link, the post it was
 * announced in, or both.
 *
 * This replaces `templateSourceWhenLive` (deleted 2026-09-05 — see the note on `source` below).
 * Making `source` optional was the right call for bots submitted at /submit/, which arrive as an
 * install link and nothing else; making BOTH optional would have been an accident. A live entry
 * with neither is a detail page whose only outbound link is the sharer's profile, which is not
 * an entry in a directory of installable bots — it is a stub.
 *
 * The twin of this rule lives in scripts/validate.mjs (TPL-6).
 */
function templateReachableWhenLive(
  data: { status: string; source?: unknown; share_url?: unknown },
  ctx: z.RefinementCtx
) {
  if ((data.status === 'live' || data.status === 'needs-update') && !data.source && !data.share_url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['share_url'],
      message:
        'a live template needs `share_url`, `source`, or both — the install link or the post it was shared in. `source` alone is fine (harvested bots), `share_url` alone is fine (submitted bots), neither is a stub (§10.1)',
    });
  }
}

const templates = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/templates' }),
  schema: z
    .object({
      type: z.literal('template').default('template'),
      name: z.string().min(3).max(60), // the bold row title
      slug, // MUST equal filename (§5.6 #1)
      tagline, // 10–90, the skim-list one-liner
      description: z.string().min(80).max(320), // detail lead + meta-description base
      sharer, // REQUIRED
      /**
       * The X post this bot was announced in. OPTIONAL IN EVERY STATUS, including `live`.
       *
       * RELAXED 2026-09-05, when /submit/ opened. It used to be required on a live template
       * (`templateSourceWhenLive`, now deleted), because every template arrived through the
       * harvest — which finds bots BY finding the post that shared them, so a live entry with
       * no post could only mean a missing field.
       *
       * A bot submitted at /submit/ may never have been posted about at all: somebody built it,
       * has the install link, and sends us that. Requiring `source` there forces a reviewer to
       * either reject a good bot or invent a post URL, and inventing provenance is the exact
       * failure §10.1 exists to prevent.
       *
       * §10.1 ("nothing publishes without a traceable sharer") IS UNCHANGED, because it was
       * never `source` that carried it: `sharer` above is REQUIRED in every status, and that is
       * the traceable human. What `source` adds is the post EMBED — and every consumer already
       * treats it as absent-able: `marketplace/[slug].astro` guards on `d.source &&` /
       * `d.source?.url`, `lib/templates.ts` `sourceApi()` returns null and the feed falls back
       * to `d.sharer.url`, `lib/feed.ts` reads it only for use-cases, and build-og never touches
       * it. For a submitted bot the provenance is its submissions row: the share link was
       * fetched and answered 200 before the row existed, and a reviewer approved it by hand
       * (services/votes-api — migrations/003_submissions.sql, bin/review-submissions.ts).
       *
       * The twin of this rule lives in scripts/validate.mjs (TPL-6). Both were relaxed together.
       */
      source: templateSource.optional(),
      // OPTIONAL even when live (operator): a template may list with its source only. When it
      // is absent NO install button renders — "View details" is always the working primary,
      // so a missing link can never become a dead control.
      share_url: z
        .string()
        .regex(
          SHARE_URL_RE,
          'must be an "Add to Grok Bot" share link: https://x.ai/bot/<id>, where <id> is 21 URL-safe base64 characters'
        )
        .optional(),
      tags: z.array(templateTag).min(1).max(8), // MULTI-TAG, faceted
      primary_category: templateTag, // must be one of `tags`
      includes: z.array(z.enum(TEMPLATE_PARTS)).max(8).default([]),
      includes_note: z.string().max(200).optional(),
      integrations: z.array(integrationName).default([]), // reuses the §5.5 vocabulary
      // Cross-link to the long-form write-up when one exists. Resolved cross-file by
      // validate.mjs against the use-case corpus (the same check collections get for members).
      // The REVERSE link is derived (lib/templates.ts `templatesReferencing`), so a use case
      // never has to know about a template and no existing content file is edited.
      related_use_cases: z.array(slug).max(3).default([]),
      featured: z.boolean().default(false),
      added_at: isoDate,
      updated_at: isoDate,
      verified_at: isoDate.optional(), // MAINTAINER-SET ONLY (§8.5 check 9)
      status,
    })
    .strict()
    .superRefine(datesSane)
    .superRefine(verifiedWhenLive)
    .superRefine(primaryTagIsTagged)
    .superRefine(templateReachableWhenLive),
});

export const collections = {
  plugins,
  'use-cases': useCases,
  collections: collectionEntries,
  news: newsEntries,
  templates,
};
