/**
 * The submission request contract.
 *
 * ONE required field. `share_url` is the whole submission; every other field exists so we can
 * credit the person who sent it, and the form says so. That asymmetry is enforced here rather
 * than in the UI: a caller that sends only a share link is valid, and a caller that sends a
 * dozen unknown keys is not (`.strict()` — a strict allowlist, so a scraped-and-replayed form
 * body with extra junk in it is rejected instead of quietly stored).
 *
 * The two cheap bot filters live here too, because they cost nothing and run before Turnstile:
 *   · `website` is a HONEYPOT — a real browser never fills it, so any value at all is a bot.
 *   · `elapsed_ms` is time-on-form. It is client-supplied and therefore only a speed bump, not
 *     a proof; Turnstile and the server-side link fetch are the layers that actually hold. It
 *     still catches the large, dumb class of scripted POSTs that never render the page.
 */
import { z } from 'zod';
import { SHARE_URL_RE } from './share-link.js';

/** Mirrors the site schema's X_STATUS_RE — the source post, when there is one. */
export const X_STATUS_RE = /^https:\/\/(?:x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/;

export const MIN_TIME_ON_FORM_MS = 2000;

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

/** `@handle`, `handle`, or a full profile URL all normalise to the bare handle. */
export function normaliseHandle(raw: string): string | null {
  let value = raw.trim();
  const asUrl = /^(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/(@?[A-Za-z0-9_]{1,15})\/?$/i.exec(value);
  if (asUrl) value = asUrl[1];
  value = value.replace(/^@+/, '').trim();
  if (!/^[A-Za-z0-9_]{1,15}$/.test(value)) return null;
  return value;
}

export const submissionBodySchema = z
  .object({
    turnstileToken: z.string().min(1).max(2048),
    share_url: z.string().trim().regex(SHARE_URL_RE),
    submitter_x_handle: z.preprocess(emptyToUndefined, z.string().max(120).optional()),
    submitter_website: z.preprocess(emptyToUndefined, z.string().max(300).optional()),
    submitter_note: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
    source_post_url: z.preprocess(emptyToUndefined, z.string().max(300).optional()),
    /** Honeypot. Must be absent or empty. */
    website: z.preprocess(emptyToUndefined, z.string().max(300).optional()),
    elapsed_ms: z.number().int().min(0).max(86_400_000).optional(),
  })
  .strict();

export type SubmissionBody = z.infer<typeof submissionBodySchema>;

export interface NormalisedSubmission {
  shareUrl: string;
  submitterXHandle: string | null;
  submitterWebsite: string | null;
  submitterNote: string | null;
  sourcePostUrl: string | null;
}

export type NormaliseResult =
  | { ok: true; value: NormalisedSubmission }
  | { ok: false; field: 'submitter_x_handle' | 'submitter_website' | 'source_post_url' };

/**
 * Optional fields are attribution, so a malformed one is a real error rather than something to
 * silently drop: crediting the wrong @handle is worse than asking the submitter to fix it.
 */
export function normaliseSubmission(body: SubmissionBody): NormaliseResult {
  let handle: string | null = null;
  if (body.submitter_x_handle) {
    handle = normaliseHandle(body.submitter_x_handle);
    if (!handle) return { ok: false, field: 'submitter_x_handle' };
  }

  let website: string | null = null;
  if (body.submitter_website) {
    const raw = body.submitter_website.trim();
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let parsed: URL;
    try {
      parsed = new URL(withScheme);
    } catch {
      return { ok: false, field: 'submitter_website' };
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { ok: false, field: 'submitter_website' };
    }
    if (!parsed.hostname.includes('.') || parsed.hostname.endsWith('.')) {
      return { ok: false, field: 'submitter_website' };
    }
    website = parsed.toString().slice(0, 300);
  }

  let sourcePostUrl: string | null = null;
  if (body.source_post_url) {
    const raw = body.source_post_url.trim().split('?')[0].replace(/\/$/, '');
    if (!X_STATUS_RE.test(raw)) return { ok: false, field: 'source_post_url' };
    sourcePostUrl = raw.replace('https://twitter.com/', 'https://x.com/');
  }

  const note = body.submitter_note?.trim().slice(0, 500) || null;

  return {
    ok: true,
    value: {
      shareUrl: body.share_url.trim(),
      submitterXHandle: handle,
      submitterWebsite: website,
      submitterNote: note,
      sourcePostUrl,
    },
  };
}
