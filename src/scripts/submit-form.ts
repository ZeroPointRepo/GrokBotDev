// The /submit/ bot form island. Bundled to /_astro/*.js — never inline (§4.2, §10.7 CSP).
//
// Shape borrowed wholesale from `upvote-button.ts`: the same lazy, invisible Turnstile loader
// (one shared promise per page, one widget per attempt, always removed afterwards) talking to
// the same votes-api on the same origin. What is new is the state machine, and its rule is the
// one CLAUDE.md sets: a control is never dead. The form arrives `hidden` and is un-hidden here,
// the no-JS note is hidden here, and every failure the endpoint can return has a specific
// sentence and leaves the form usable.
import {
  CP_197_SUBMIT_BUTTON,
  CP_198_SUBMIT_BUTTON_BUSY,
  CP_199_SUBMIT_SUCCESS_HEADING,
  CP_200_SUBMIT_SUCCESS_BODY,
  CP_201_SUBMIT_SUCCESS_CREDITED,
  CP_202_SUBMIT_SUCCESS_ANONYMOUS,
  CP_203_SUBMIT_ERR_LINK,
  CP_204_SUBMIT_ERR_DEAD,
  CP_205_SUBMIT_ERR_PENDING,
  CP_206_SUBMIT_ERR_LIVE,
  CP_206_SUBMIT_ERR_LIVE_LINK,
  CP_207_SUBMIT_ERR_RATE,
  CP_208_SUBMIT_ERR_HUMAN,
  CP_209_SUBMIT_ERR_FIELD_HANDLE,
  CP_210_SUBMIT_ERR_FIELD_WEBSITE,
  CP_211_SUBMIT_ERR_FIELD_POST,
  CP_212_SUBMIT_ERR_DOWN,
  fillCopy,
} from '../lib/copy';

declare global {
  interface Window {
    turnstile?: {
      render: (target: HTMLElement, options: Record<string, unknown>) => string;
      execute: (widgetId: string) => void;
      remove?: (widgetId: string) => void;
    };
    __grokbotTurnstilePromise?: Promise<void>;
    grokbotTrack?: (event: string, props?: Record<string, string>) => void;
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** Mirrors the schema in src/content.config.ts and the endpoint's own check. */
const SHARE_URL_RE = /^https:\/\/x\.ai\/bot\/[A-Za-z0-9_-]{21}$/;

interface SubmitResponse {
  ok?: boolean;
  status?: string;
  error?: string;
  detail?: string;
  field?: string;
  already?: string;
  live_url?: string | null;
  bot_name?: string | null;
  bot_author?: string | null;
  credit_handle?: string | null;
}

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__grokbotTurnstilePromise) return window.__grokbotTurnstilePromise;
  window.__grokbotTurnstilePromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('turnstile_load_failed')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('turnstile_load_failed'));
    document.head.appendChild(script);
  });
  return window.__grokbotTurnstilePromise;
}

async function turnstileToken(mount: HTMLElement, sitekey: string): Promise<string> {
  await loadTurnstile();
  if (!window.turnstile) throw new Error('turnstile_unavailable');
  mount.innerHTML = '';
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('turnstile_timeout')), 15_000);
    const widgetId = window.turnstile!.render(mount, {
      sitekey,
      size: 'invisible',
      callback: (token: string) => {
        window.clearTimeout(timeout);
        resolve(token);
        window.turnstile?.remove?.(widgetId);
      },
      'error-callback': () => {
        window.clearTimeout(timeout);
        reject(new Error('turnstile_error'));
        window.turnstile?.remove?.(widgetId);
      },
      'expired-callback': () => {
        window.clearTimeout(timeout);
        reject(new Error('turnstile_expired'));
        window.turnstile?.remove?.(widgetId);
      },
    });
    window.turnstile!.execute(widgetId);
  });
}

/** Turns whatever the endpoint said into one sentence a person can act on. */
function messageFor(status: number, data: SubmitResponse | null): { text: string; href?: string } {
  if (status === 429) return { text: CP_207_SUBMIT_ERR_RATE };
  if (status === 403) return { text: CP_208_SUBMIT_ERR_HUMAN };
  if (status === 409) {
    if (data?.already === 'live') {
      return { text: CP_206_SUBMIT_ERR_LIVE, href: data.live_url ?? undefined };
    }
    return { text: CP_205_SUBMIT_ERR_PENDING };
  }
  if (data?.error === 'invalid_link') {
    return { text: data.detail === 'shape' ? CP_203_SUBMIT_ERR_LINK : CP_204_SUBMIT_ERR_DEAD };
  }
  if (data?.error === 'bad_field') {
    if (data.field === 'submitter_x_handle') return { text: CP_209_SUBMIT_ERR_FIELD_HANDLE };
    if (data.field === 'submitter_website') return { text: CP_210_SUBMIT_ERR_FIELD_WEBSITE };
    if (data.field === 'source_post_url') return { text: CP_211_SUBMIT_ERR_FIELD_POST };
  }
  return { text: CP_212_SUBMIT_ERR_DOWN };
}

function hydrate(root: HTMLElement) {
  if (root.dataset.submitReady === 'true') return;
  root.dataset.submitReady = 'true';

  const sitekey = root.dataset.sitekey;
  const form = root.querySelector<HTMLFormElement>('[data-submit-form]');
  const link = root.querySelector<HTMLInputElement>('[data-submit-link]');
  const handle = root.querySelector<HTMLInputElement>('[data-submit-handle]');
  const website = root.querySelector<HTMLInputElement>('[data-submit-website]');
  const post = root.querySelector<HTMLInputElement>('[data-submit-post]');
  const note = root.querySelector<HTMLTextAreaElement>('[data-submit-note]');
  const trap = root.querySelector<HTMLInputElement>('input[name="website"]');
  const button = root.querySelector<HTMLButtonElement>('[data-submit-button]');
  const live = root.querySelector<HTMLElement>('[data-submit-live]');
  const error = root.querySelector<HTMLElement>('[data-submit-error]');
  const mount = root.querySelector<HTMLElement>('[data-submit-turnstile]');
  const success = root.querySelector<HTMLElement>('[data-submit-success]');
  const successHeading = root.querySelector<HTMLElement>('[data-submit-success-heading]');
  const successBody = root.querySelector<HTMLElement>('[data-submit-success-body]');
  if (!sitekey || !form || !link || !button || !live || !error || !mount || !success || !successHeading || !successBody) {
    return;
  }

  // Only now is the form real. The no-JS note goes at the same moment, so there is never a
  // frame where the page offers both.
  root.hidden = false;
  document.querySelectorAll<HTMLElement>('[data-submit-nojs]').forEach((el) => {
    el.hidden = true;
  });

  const openedAt = Date.now();
  let busy = false;

  const clearError = () => {
    error.textContent = '';
    error.classList.add('hidden');
    link.removeAttribute('aria-invalid');
  };

  const fail = (text: string, href?: string) => {
    error.textContent = text;
    if (href) {
      error.append(' ');
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.textContent = CP_206_SUBMIT_ERR_LIVE_LINK;
      anchor.className = 'underline underline-offset-4';
      error.append(anchor);
    }
    error.classList.remove('hidden');
    live.textContent = '';
  };

  const setBusy = (value: boolean) => {
    busy = value;
    button.disabled = value;
    button.setAttribute('aria-busy', value ? 'true' : 'false');
    button.textContent = value ? CP_198_SUBMIT_BUTTON_BUSY : CP_197_SUBMIT_BUTTON;
    live.textContent = value ? CP_198_SUBMIT_BUTTON_BUSY : '';
  };

  link.addEventListener('input', clearError);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    clearError();

    const shareUrl = link.value.trim();
    if (!SHARE_URL_RE.test(shareUrl)) {
      link.setAttribute('aria-invalid', 'true');
      fail(CP_203_SUBMIT_ERR_LINK);
      link.focus();
      return;
    }

    setBusy(true);
    let token: string;
    try {
      token = await turnstileToken(mount, sitekey);
    } catch {
      setBusy(false);
      fail(CP_208_SUBMIT_ERR_HUMAN);
      return;
    }

    const payload: Record<string, unknown> = {
      turnstileToken: token,
      share_url: shareUrl,
      elapsed_ms: Date.now() - openedAt,
      website: trap?.value ?? '',
    };
    if (handle?.value.trim()) payload.submitter_x_handle = handle.value.trim();
    if (website?.value.trim()) payload.submitter_website = website.value.trim();
    if (post?.value.trim()) payload.source_post_url = post.value.trim();
    if (note?.value.trim()) payload.submitter_note = note.value.trim();

    let status = 0;
    let data: SubmitResponse | null = null;
    try {
      const response = await fetch('/api/v1/submissions', {
        method: 'POST',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      status = response.status;
      try {
        data = (await response.json()) as SubmitResponse;
      } catch {
        data = null;
      }
    } catch {
      setBusy(false);
      fail(CP_212_SUBMIT_ERR_DOWN);
      return;
    }

    if (status !== 200 || !data?.ok) {
      setBusy(false);
      const message = messageFor(status, data);
      fail(message.text, message.href);
      return;
    }

    // Success: the confirmation names the bot we actually resolved, which is also the proof
    // that the link worked. The form goes, so there is nothing left to double-submit.
    const botName = data.bot_name?.trim() || shareUrl.split('/').pop() || 'your bot';
    const credited = data.credit_handle
      ? fillCopy(CP_201_SUBMIT_SUCCESS_CREDITED, { handle: data.credit_handle })
      : CP_202_SUBMIT_SUCCESS_ANONYMOUS;
    successHeading.textContent = fillCopy(CP_199_SUBMIT_SUCCESS_HEADING, { bot: botName });
    successBody.textContent = `${CP_200_SUBMIT_SUCCESS_BODY} ${credited}`;
    form.classList.add('hidden');
    success.classList.remove('hidden');
    success.classList.add('flex');
    success.focus({ preventScroll: true });
    window.grokbotTrack?.('bot_submitted', { credited: data.credit_handle ? 'yes' : 'no' });
  });
}

export function initSubmitForm() {
  document.querySelectorAll<HTMLElement>('[data-submit-root]').forEach(hydrate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubmitForm, { once: true });
} else {
  initSubmitForm();
}
