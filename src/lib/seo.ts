// §6.3 title/description templates and §6.4 structured data.
// Copy pack rows applied here: CP-072/073 (home), CP-074 (plugin), CP-075 (use case,
// KEEP), CP-076 (collection), CP-077/078 (hubs, KEEP + harmonised), CP-079 (integration
// hub), CP-080/081 (plugin builder), CP-082 (agent, KEEP), CP-083…CP-091 (the nine index
// and utility descriptions the PRD left to the executor).

export const SITE = 'https://grokbot.dev';

// The project's own X account — advertised in the footer and on every entry via ShareBar
// (both the "share on X" intent `via=` credit and the "follow" link). Handle only, no leading @.
export const SITE_X = 'GrokBotDev';
export const SITE_X_URL = `https://x.com/${SITE_X}`;

// OG image cache-buster. Appended as `?v=` to every og:image so X/LinkedIn/etc. re-fetch a
// changed card instead of serving a stale copy from their scrape cache. BUMP THIS whenever an
// OG image is regenerated (default.png, hub cards, or the entry-card renderer).
export const OG_VERSION = '20260828';

/** §6.3: descriptions are ≤155 by construction; truncate at a word boundary if not. */
export function clampDescription(value: string, max = 155): string {
  if (value.length <= max) return value;
  const cut = value.slice(0, 152);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export const META = {
  home: {
    title: 'grokbot.dev — ready-to-use Grok Bot prompts, plugins & collections',
    // CP-073 — the sentence-cased twin of the hero subline (CP-002).
    description:
      'Ready-to-use Grok Bot prompts, plugins and collections, all in one place. Plug your Bot in and it keeps its own list fresh.',
  },
  plugins: {
    title: 'Plugins | grokbot.dev',
    description:
      'Every plugin people have built for Grok Bot, each with its own page, a setup time and links to the source.',
  },
  useCases: {
    title: 'Awesome Use Cases | grokbot.dev',
    description:
      'Real things people got their Grok Bot to do, rewritten and verified, with the original post credited.',
  },
  news: {
    title: 'News | grokbot.dev',
    description:
      'Short, factual updates for Grok Bot users: releases, deals, opportunities and platform changes.',
  },
  collections: {
    title: 'Collections | grokbot.dev',
    description:
      'Whole Grok Bot setups — plugins and use cases that work as one, put together by the Curator.',
  },
  categories: {
    title: 'Categories | grokbot.dev',
    description:
      'Browse Grok Bot plugins and use cases by what they do — ten categories, each with its own page.',
  },
  integrations: {
    title: 'Integrations | grokbot.dev',
    description:
      'Browse Grok Bot plugins and use cases by the tool they sign into — Slack, Gmail, GitHub and more.',
  },
  contribute: {
    title: 'Contribute | grokbot.dev',
    description:
      'Add your plugin or a build you spotted on X. One markdown file, one pull request, live in minutes.',
  },
  submit: {
    title: 'Submit | grokbot.dev',
    description:
      'Share your Grok Bot in one step: paste the share link. No account, no login — a human reviews every submission.',
  },
  search: {
    title: 'Search | grokbot.dev',
    description: 'Search every Grok Bot plugin, use case and collection on grokbot.dev.',
  },
  about: {
    title: 'About | grokbot.dev',
    description:
      'Who runs grokbot.dev, and how a team of bots keeps it current. An independent community project.',
  },
  privacy: {
    title: 'Privacy | grokbot.dev',
    description:
      'What grokbot.dev collects and why: cookieless analytics, one functional cookie if you upvote, and nothing sold to anyone.',
  },
  pluginBuilder: {
    title: 'Plugin Builder Bot — build a Grok Bot plugin | grokbot.dev',
    description:
      "One prompt that turns your Grok Bot into a plugin builder. It checks what's already here first, so you don't rebuild something that exists.",
  },
  agent: {
    title: 'Point your Grok Bot at grokbot.dev | grokbot.dev',
    description:
      'Paste this contract into your Grok Bot and it pulls new plugins and prompts from grokbot.dev on your schedule.',
  },
  wall: {
    title: 'wall of posts — grokbot.dev',
    description:
      'Every entry here started as someone’s post on X. The wall of them, newest first, with the credit kept.',
  },
  subscribed: {
    title: 'Subscribed | grokbot.dev',
    description: "You're on the list. We'll email you when there's something worth your inbox.",
  },
  marketplace: {
    title: 'Shareable Bots — ready-made Grok Bot templates | grokbot.dev',
    description:
      'Grok Bot setups people shared on X, each credited and one link away from your own Bot. Browse, filter, install.',
  },
} as const;

export const entryTitle = (name: string, kind: 'plugin' | 'use-case' | 'collection') =>
  kind === 'plugin'
    ? `${name} — Grok Bot plugin | grokbot.dev`
    : kind === 'use-case'
      ? `${name} — Grok Bot prompt | grokbot.dev`
      : `${name} — Grok Bot collection | grokbot.dev`;

export const entryDescription = (tagline: string, kind: 'plugin' | 'use-case' | 'collection') =>
  clampDescription(
    kind === 'plugin'
      ? `${tagline} How to set it up, and where it came from.`
      : kind === 'use-case'
        ? `${tagline} Copy the prompt and paste it into Grok.`
        : `${tagline} Everything you need for it, in one setup.`
  );

/** Shareable Bots. "Grok Bot template" is the SERP phrase people actually search for. */
export const templateTitle = (name: string) => `${name} — Grok Bot template | grokbot.dev`;
export const templateDescription = (description: string) => clampDescription(description);

export const newsEntryTitle = (title: string) => `${title} | News | grokbot.dev`;
export const newsEntryDescription = (summary: string) => clampDescription(summary);

export const categoryHubTitle = (label: string) =>
  `${label} Grok Bots — plugins & use cases | grokbot.dev`;
export const categoryHubDescription = (label: string) =>
  clampDescription(
    `Verified ${label} plugins and use cases for Grok Bot — with copy-paste prompts, setup time, and what each one signs into.`
  );
export const subcategoryHubTitle = (subLabel: string, catLabel: string) =>
  `${subLabel} — ${catLabel} Grok Bots | grokbot.dev`;
export const subcategoryHubDescription = (subLabel: string, catLabel: string) =>
  clampDescription(
    `Verified ${subLabel} Grok Bots — ${catLabel} plugins and use cases, each with a copy-paste prompt, a setup time, and what it signs into.`
  );
export const integrationHubTitle = (name: string) =>
  `Grok Bot prompts & plugins for ${name} | grokbot.dev`;
export const integrationHubDescription = (name: string) =>
  clampDescription(
    `Ready-to-use Grok Bot prompts and plugins for ${name} — verified, with setup time and what you'll need to connect.`
  );

/** §6.3 pagination rule: page-N titles/descriptions, self-canonicalising. */
export const paginate = (base: { title: string; description: string }, page: number, total: number) =>
  page <= 1
    ? base
    : {
        title: `${base.title} — page ${page}`,
        description: clampDescription(`${base.description} (page ${page} of ${total})`),
      };

// ---------------------------------------------------------------- structured data

type Json = Record<string, unknown>;

/** Sitewide graph members — present on every page (§6.4). */
export function baseGraph(): Json[] {
  return [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'grokbot.dev',
      url: `${SITE}/`,
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: 'grokbot.dev',
      url: `${SITE}/`,
      logo: `${SITE}/og/logo-512.png`,
    },
  ];
}

export function breadcrumbList(items: Array<{ label: string; href?: string }>): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE}${item.href}` } : {}),
    })),
  };
}

export function itemList(entries: Array<{ url: string; name?: string }>): Json {
  return {
    '@type': 'ItemList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE}${entry.url}`,
      name: entry.name ?? '',
    })),
  };
}

export function collectionPage(url: string, name: string, description: string): Json {
  return {
    '@type': 'CollectionPage',
    '@id': `${SITE}${url}#page`,
    url: `${SITE}${url}`,
    name,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
  };
}

export function webPage(url: string, name: string, description: string): Json {
  return {
    '@type': 'WebPage',
    '@id': `${SITE}${url}#page`,
    url: `${SITE}${url}`,
    name,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
  };
}
