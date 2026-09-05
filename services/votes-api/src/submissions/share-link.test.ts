import { decodeEntities, extractOgTitle, splitOgTitle, SHARE_URL_RE } from './share-link.js';
import { normaliseHandle, normaliseSubmission, submissionBodySchema, X_STATUS_RE } from './schema.js';

const SHARE = 'https://x.ai/bot/mA4Ik2mIduPANDqFVmVMX';

describe('share link parsing', () => {
  it('accepts only the exact share-link grammar', () => {
    expect(SHARE_URL_RE.test(SHARE)).toBe(true);
    expect(SHARE_URL_RE.test('https://x.ai/bot/tooshort')).toBe(false);
    expect(SHARE_URL_RE.test('https://grok.com/bot/mA4Ik2mIduPANDqFVmVMX')).toBe(false);
    expect(SHARE_URL_RE.test('http://x.ai/bot/mA4Ik2mIduPANDqFVmVMX')).toBe(false);
    expect(SHARE_URL_RE.test('https://x.ai/bot/mA4Ik2mIduPANDqFVmVMX?utm=1')).toBe(false);
  });

  it('reads og:title in either attribute order and decodes entities', () => {
    expect(extractOgTitle('<meta property="og:title" content="Court by Don"/>')).toBe('Court by Don');
    expect(extractOgTitle('<meta content="Bo&amp;Co by Ana" property="og:title">')).toBe('Bo&Co by Ana');
    expect(extractOgTitle("<meta property='og:title' content='Tidy by Wren'>")).toBe('Tidy by Wren');
    expect(extractOgTitle('<meta property="og:description" content="nope">')).toBeNull();
    expect(decodeEntities('a &#x27;b&#x27; &quot;c&quot;')).toBe("a 'b' \"c\"");
  });

  it('splits "<Bot> by <Author>" on the LAST " by "', () => {
    expect(splitOgTitle('Court by Don')).toEqual({ name: 'Court', author: 'Don' });
    expect(splitOgTitle('Day by Day by Priya')).toEqual({ name: 'Day by Day', author: 'Priya' });
    expect(splitOgTitle('Standalone')).toEqual({ name: 'Standalone', author: null });
    expect(splitOgTitle(null)).toEqual({ name: null, author: null });
    expect(splitOgTitle('   ')).toEqual({ name: null, author: null });
  });
});

describe('submission field normalisation', () => {
  it('normalises handles from @, bare and profile-URL forms', () => {
    expect(normaliseHandle('@grokbotdev')).toBe('grokbotdev');
    expect(normaliseHandle('grokbotdev')).toBe('grokbotdev');
    expect(normaliseHandle('https://x.com/@grokbotdev')).toBe('grokbotdev');
    expect(normaliseHandle('https://twitter.com/grokbotdev/')).toBe('grokbotdev');
    expect(normaliseHandle('way_too_long_a_handle')).toBeNull();
    expect(normaliseHandle('has spaces')).toBeNull();
  });

  it('adds a scheme to a bare website and rejects a non-http one', () => {
    const base = { turnstileToken: 't', share_url: SHARE };
    const ok = normaliseSubmission({ ...base, submitter_website: 'example.com/me' });
    expect(ok.ok && ok.value.submitterWebsite).toBe('https://example.com/me');
    const bad = normaliseSubmission({ ...base, submitter_website: 'javascript:alert(1)' });
    expect(bad).toEqual({ ok: false, field: 'submitter_website' });
    const noDot = normaliseSubmission({ ...base, submitter_website: 'localhost' });
    expect(noDot).toEqual({ ok: false, field: 'submitter_website' });
  });

  it('canonicalises a source post and rejects a non-post URL', () => {
    const base = { turnstileToken: 't', share_url: SHARE };
    const ok = normaliseSubmission({
      ...base,
      source_post_url: 'https://twitter.com/someone/status/2093381689041109349?s=20',
    });
    expect(ok.ok && ok.value.sourcePostUrl).toBe('https://x.com/someone/status/2093381689041109349');
    expect(normaliseSubmission({ ...base, source_post_url: 'https://x.com/someone' })).toEqual({
      ok: false,
      field: 'source_post_url',
    });
    expect(X_STATUS_RE.test('https://x.com/a/status/12345')).toBe(true);
  });

  it('is a strict allowlist and caps every optional field', () => {
    expect(submissionBodySchema.safeParse({ turnstileToken: 't', share_url: SHARE }).success).toBe(true);
    expect(
      submissionBodySchema.safeParse({ turnstileToken: 't', share_url: SHARE, admin: true }).success
    ).toBe(false);
    expect(
      submissionBodySchema.safeParse({ turnstileToken: 't', share_url: SHARE, submitter_note: 'x'.repeat(501) })
        .success
    ).toBe(false);
    // Empty optional strings are "not given", not "given as empty".
    const blank = submissionBodySchema.safeParse({
      turnstileToken: 't',
      share_url: SHARE,
      submitter_x_handle: '  ',
      submitter_note: '',
    });
    expect(blank.success && blank.data.submitter_x_handle).toBeUndefined();
  });
});
