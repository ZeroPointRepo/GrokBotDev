/**
 * "Is this bot already on the site?" — answered from the site's own published manifest.
 *
 * Same two-source shape as SlugRegistry (src/slug/registry.ts) and for the same reason: on
 * crhq-products the promoted build is sitting on local disk, so the cheap, always-current answer
 * is a file read, and the HTTP fetch is only the fallback for a machine that is not the web
 * host. Whichever source answers, the result is cached briefly — a submission form is not worth
 * re-parsing a 1MB manifest per request.
 *
 * DEGRADES OPEN, DELIBERATELY. If neither source is reachable the index is empty and the
 * endpoint simply skips the already-live check: the submissions table's own UNIQUE constraint
 * still catches re-submissions, and a reviewer sees the duplicate before anything publishes.
 * Failing closed would take the whole form down whenever the manifest moved.
 */
import { readFile } from 'node:fs/promises';

export interface LiveEntry {
  slug: string;
  url: string | null;
  name: string | null;
}

export interface LiveManifestOptions {
  file?: string;
  url?: string;
  ttlMs?: number;
  fetchTimeoutMs?: number;
}

interface ManifestItem {
  slug?: string;
  url?: string;
  name?: string;
  share_url?: string;
}

export class LiveTemplateManifest {
  private index = new Map<string, LiveEntry>();
  private loadedAt = 0;
  private inflight: Promise<void> | null = null;

  constructor(private readonly opts: LiveManifestOptions = {}) {}

  private get ttlMs() {
    return this.opts.ttlMs ?? 5 * 60_000;
  }

  private parse(raw: string) {
    const parsed = JSON.parse(raw) as { items?: ManifestItem[] } | ManifestItem[];
    const items = Array.isArray(parsed) ? parsed : (parsed.items ?? []);
    const next = new Map<string, LiveEntry>();
    for (const item of items) {
      const shareUrl = typeof item?.share_url === 'string' ? item.share_url : null;
      if (!shareUrl) continue;
      next.set(shareUrl, {
        slug: typeof item.slug === 'string' ? item.slug : '',
        url: typeof item.url === 'string' ? item.url : null,
        name: typeof item.name === 'string' ? item.name : null,
      });
    }
    // Only swap in a manifest that actually parsed; a truncated read never blanks the index.
    if (next.size) this.index = next;
  }

  private async loadOnce() {
    if (this.opts.file) {
      try {
        this.parse(await readFile(this.opts.file, 'utf8'));
        this.loadedAt = Date.now();
        return;
      } catch {
        // fall through to the URL source
      }
    }
    if (this.opts.url) {
      try {
        const res = await fetch(this.opts.url, {
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(this.opts.fetchTimeoutMs ?? 2500),
        });
        if (res.ok) {
          this.parse(await res.text());
          this.loadedAt = Date.now();
          return;
        }
      } catch {
        // degrade open — see the header note
      }
    }
    // Back off for a full TTL even on failure, so an unreachable manifest cannot turn every
    // submission into a fresh 2.5s timeout.
    this.loadedAt = Date.now();
  }

  private async refreshIfStale() {
    if (Date.now() - this.loadedAt < this.ttlMs) return;
    if (!this.inflight) {
      this.inflight = this.loadOnce().finally(() => {
        this.inflight = null;
      });
    }
    await this.inflight;
  }

  /** The live entry for a share link, or null when it is not published (or unknown). */
  async lookup(shareUrl: string): Promise<LiveEntry | null> {
    await this.refreshIfStale();
    return this.index.get(shareUrl) ?? null;
  }

  /** Test seam: preload an index without touching disk or the network. */
  seed(entries: Array<{ share_url: string } & Partial<LiveEntry>>) {
    this.index = new Map(
      entries.map((entry) => [
        entry.share_url,
        { slug: entry.slug ?? '', url: entry.url ?? null, name: entry.name ?? null },
      ])
    );
    this.loadedAt = Date.now();
  }

  get size() {
    return this.index.size;
  }
}
