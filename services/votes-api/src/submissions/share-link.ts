/**
 * Server-side verification of an "Add to Grok Bot" share link.
 *
 * This is the load-bearing spam filter on the /submit/ form, and it is the reason the form can
 * ask for ONE field. A share link is not a claim we have to trust: we fetch it. A dead id, a
 * typo, a made-up 21-character string and a link to somebody's marketing page all answer
 * something other than 200 and are rejected before a row is written. A real one answers 200 and
 * hands us the bot's own name and author in `og:title` — so the bot metadata we store comes from
 * xAI rather than from whoever pasted the link.
 *
 * The URL is NOT free-form: callers pass a string already matched against SHARE_URL_RE
 * (`https://x.ai/bot/<21 url-safe base64 chars>`), so there is no host, port, scheme or path an
 * attacker can steer this fetch at. Redirects are still declined — a 3xx away from x.ai means
 * the link is not the thing it claims to be.
 */

/** The site schema's regex, byte-for-byte (src/content.config.ts SHARE_URL_RE). */
export const SHARE_URL_RE = /^https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]{21}$/;

/** Share pages are ~120KB of app shell; the tags we want are in the first few KB of <head>. */
const MAX_BYTES = 262_144;

export interface ShareLinkOk {
  ok: true;
  status: number;
  botName: string | null;
  botAuthor: string | null;
  ogTitle: string | null;
}

export interface ShareLinkFail {
  ok: false;
  /** `http` — the page answered, but not 200. `unreachable` — DNS/TLS/timeout/abort. */
  reason: 'http' | 'unreachable';
  status: number | null;
}

export type ShareLinkResult = ShareLinkOk | ShareLinkFail;
export type ShareLinkVerifier = (shareUrl: string) => Promise<ShareLinkResult>;

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/** Minimal, allocation-cheap entity decode — og:title is a plain attribute value, not markup. */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

/** `<meta property="og:title" content="…">` in either attribute order, either quote style. */
export function extractOgTitle(html: string): string | null {
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const meta of metas) {
    if (!/\b(?:property|name)\s*=\s*["']og:title["']/i.test(meta)) continue;
    const content = /\bcontent\s*=\s*"([^"]*)"/i.exec(meta) ?? /\bcontent\s*=\s*'([^']*)'/i.exec(meta);
    if (content) return decodeEntities(content[1]).trim();
  }
  return null;
}

/**
 * `og:title` is "<Bot Name> by <Author>". Split on the LAST " by ", because bot names contain
 * the word themselves ("Day by Day by Priya"); the author never does — it is one X display name.
 * A title with no " by " is still a usable bot name, so it returns `{ name, author: null }`
 * rather than failing: the 200 is what verifies the link, not our ability to parse a string.
 */
export function splitOgTitle(title: string | null): { name: string | null; author: string | null } {
  if (!title) return { name: null, author: null };
  const clean = title.replace(/\s+/g, ' ').trim();
  if (!clean) return { name: null, author: null };
  const at = clean.toLowerCase().lastIndexOf(' by ');
  if (at <= 0) return { name: clean.slice(0, 200), author: null };
  const name = clean.slice(0, at).trim();
  const author = clean.slice(at + 4).trim();
  if (!name || !author) return { name: clean.slice(0, 200), author: null };
  return { name: name.slice(0, 200), author: author.slice(0, 200) };
}

async function readCapped(response: Response): Promise<string> {
  const body = response.body;
  if (!body) return await response.text();
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  let seen = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      seen += value.byteLength;
      out += decoder.decode(value, { stream: true });
      if (seen >= MAX_BYTES) break;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return out;
}

export function createShareLinkVerifier(timeoutMs = 2500): ShareLinkVerifier {
  return async (shareUrl: string) => {
    if (!SHARE_URL_RE.test(shareUrl)) return { ok: false, reason: 'http', status: null };
    let response: Response;
    try {
      response = await fetch(shareUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          // Named, contactable, and honest about why we are asking for the page.
          'user-agent': 'grokbot.dev-submissions/1.0 (+https://grokbot.dev/submit/)',
          accept: 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      return { ok: false, reason: 'unreachable', status: null };
    }
    if (response.status !== 200) {
      await response.body?.cancel().catch(() => {});
      return { ok: false, reason: 'http', status: response.status };
    }
    let html = '';
    try {
      html = await readCapped(response);
    } catch {
      return { ok: false, reason: 'unreachable', status: 200 };
    }
    const ogTitle = extractOgTitle(html);
    const { name, author } = splitOgTitle(ogTitle);
    return { ok: true, status: 200, botName: name, botAuthor: author, ogTitle };
  };
}
