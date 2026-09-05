#!/usr/bin/env tsx
/**
 * Review queue for the public /submit/ form. Mirrors bin/review-flags.ts: a small, explicit CLI
 * over the admin role, with every decision written down.
 *
 * NOTHING ON grokbot.dev PUBLISHES FROM THE DATABASE. This CLI is the only thing that moves a
 * submission out of `pending`, and approving does not publish either — it EMITS a templates.jsonl
 * record, which is the entry point of the pipeline that already exists (authored copy →
 * generator.py → the full build gate → promote.sh). So a submitted bot goes live through exactly
 * the same gate as a harvested one, and `published` is recorded here only once it actually is.
 *
 *   npm run review-submissions -- list
 *   npm run review-submissions -- show     --id <uuid>
 *   npm run review-submissions -- approve  --id <uuid> --tags personal,productivity [--sharer-handle h] [--note "why"]
 *   npm run review-submissions -- reject   --id <uuid> --note "why"
 *   npm run review-submissions -- published --id <uuid>
 *
 * `approve` prints the JSONL record and, when TEMPLATES_JSONL (or --jsonl) points at the
 * marketplace corpus, appends it there — skipping the append if that share_url is already in the
 * file, so re-running is safe.
 */
import { appendFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadConfig } from '../src/config.js';
import { connect } from '../src/db/client.js';
import { normaliseHandle } from '../src/submissions/schema.js';

const args = process.argv.slice(2);
const get = (name: string, short?: string) => {
  const i = args.indexOf(name);
  if (i >= 0) return args[i + 1];
  if (short) {
    const j = args.indexOf(short);
    if (j >= 0) return args[j + 1];
  }
  return undefined;
};
const command = (args[0] ?? 'list').replace(/^--/, '');
const cfg = loadConfig();
const db = connect(cfg.adminDatabaseUrl, 1);

const REPO_ROOT = resolve(new URL('.', import.meta.url).pathname, '../../..');
const TAGS_FILE = resolve(REPO_ROOT, 'src/data/template-tags.json');

interface SubmissionRow {
  id: string;
  createdAt: Date;
  shareUrl: string;
  botName: string | null;
  botAuthor: string | null;
  submitterXHandle: string | null;
  submitterWebsite: string | null;
  submitterNote: string | null;
  sourcePostUrl: string | null;
  status: string;
  reviewNote: string | null;
  userAgent: string | null;
  reviewedAt: Date | null;
  publishedAt: Date | null;
}

const COLUMNS = db`
  id, created_at, share_url, bot_name, bot_author, submitter_x_handle, submitter_website,
  submitter_note, source_post_url, status, review_note, user_agent, reviewed_at, published_at
`;

async function knownTags(): Promise<Set<string>> {
  if (!existsSync(TAGS_FILE)) return new Set();
  const facets = JSON.parse(await readFile(TAGS_FILE, 'utf8')) as Array<{ tags: Array<{ slug: string }> }>;
  return new Set(facets.flatMap((facet) => facet.tags.map((tag) => tag.slug)));
}

function describe(row: SubmissionRow): string {
  const bot = row.botName ? `${row.botName}${row.botAuthor ? ` by ${row.botAuthor}` : ''}` : '(no og:title on the share page)';
  const credit = row.submitterXHandle
    ? `@${row.submitterXHandle}`
    : row.submitterWebsite
      ? row.submitterWebsite
      : 'anonymous - no attribution given';
  const lines = [
    `${row.id}  [${row.status}]  ${new Date(row.createdAt).toISOString()}`,
    `  bot        ${bot}`,
    `  install    ${row.shareUrl}`,
    `  credit     ${credit}`,
  ];
  if (row.submitterWebsite && row.submitterXHandle) lines.push(`  website    ${row.submitterWebsite}`);
  if (row.sourcePostUrl) lines.push(`  post       ${row.sourcePostUrl}`);
  if (row.submitterNote) lines.push(`  note       ${row.submitterNote}`);
  if (row.reviewNote) lines.push(`  review     ${row.reviewNote}`);
  return lines.join('\n');
}

async function list() {
  const status = get('--status', '-s') ?? 'pending';
  const limit = Number(get('--limit') ?? 100);
  const rows = await db<SubmissionRow[]>`
    select ${COLUMNS} from submissions
    where ${status === 'all' ? db`true` : db`status = ${status}`}
    order by created_at asc
    limit ${Number.isFinite(limit) ? limit : 100}
  `;
  if (!rows.length) {
    console.log(`no ${status} submissions.`);
    return;
  }
  console.log(`${rows.length} ${status} submission(s), oldest first:\n`);
  for (const row of rows) console.log(`${describe(row)}\n`);
  console.log('approve:  npm run review-submissions -- approve --id <id> --tags tag1,tag2');
  console.log('reject:   npm run review-submissions -- reject  --id <id> --note "why"');
}

async function loadRow(id: string): Promise<SubmissionRow> {
  const [row] = await db<SubmissionRow[]>`select ${COLUMNS} from submissions where id = ${id}`;
  if (!row) throw new Error(`no submission with id ${id}`);
  return row;
}

async function show() {
  const id = get('--id', '-i');
  if (!id) throw new Error('show requires --id');
  console.log(describe(await loadRow(id)));
}

async function approve() {
  const id = get('--id', '-i');
  if (!id) throw new Error('approve requires --id');
  const row = await loadRow(id);

  const tags = (get('--tags', '-t') ?? '').split(',').map((t) => t.trim()).filter(Boolean);
  if (!tags.length) {
    throw new Error(
      'approve requires --tags (comma separated, from src/data/template-tags.json) — the site schema needs at least one'
    );
  }
  const vocabulary = await knownTags();
  const unknown = vocabulary.size ? tags.filter((tag) => !vocabulary.has(tag)) : [];
  if (unknown.length) throw new Error(`unknown tag(s): ${unknown.join(', ')} — see ${TAGS_FILE}`);
  if (tags.length > 8) throw new Error('at most 8 tags (site schema TPL-4)');

  // ATTRIBUTION IS NOT OPTIONAL AT PUBLISH TIME, even though it is optional at submit time.
  // The site schema requires `sharer`, and §10.1 is explicit that nothing publishes without a
  // traceable sharer. A submitter who left the field blank is fine — the reviewer is the one who
  // decides who gets the credit, and has to say so here rather than have the tool guess from a
  // display name that is not a handle.
  const handle = normaliseHandle(get('--sharer-handle') ?? row.submitterXHandle ?? '');
  if (!handle) {
    throw new Error(
      `submission ${id} carries no X handle (bot author reads "${row.botAuthor ?? 'unknown'}", which is a display name, not a handle).\n` +
        '  Find who to credit, then re-run with --sharer-handle <handle>.'
    );
  }
  const sharerUrl = get('--sharer-url') ?? `https://x.com/${handle}`;

  const record = {
    name: row.botName,
    bot_title_official: row.botName ? `${row.botName}${row.botAuthor ? ` by ${row.botAuthor}` : ''}` : null,
    sharer_handle: `@${handle}`,
    sharer_url: sharerUrl,
    source_tweet_url: row.sourcePostUrl,
    // The generator uses this for added_at/updated_at/verified_at, i.e. where the bot sorts. A
    // submission has no post date, so it is dated by when it was submitted — true, and it puts a
    // freshly submitted bot where a reader expects to find it.
    posted_at: new Date(row.createdAt).toISOString(),
    share_url: row.shareUrl,
    share_url_status: 200,
    one_line: row.submitterNote,
    official_description: null,
    proposed_tags: tags,
    safe: true,
    times_shared: 1,
    notes: `submitted via grokbot.dev/submit/ on ${new Date(row.createdAt).toISOString().slice(0, 10)}; link verified 200 server-side at submit time${row.submitterWebsite ? `; submitter site ${row.submitterWebsite}` : ''}`,
    section: 'Community submissions',
  };
  if (!record.name) {
    throw new Error(
      `submission ${id} has no bot name (the share page served no og:title). Open ${row.shareUrl}, then add the name by hand — the generator emits \`name\` verbatim and the schema needs 3-60 chars.`
    );
  }

  const line = JSON.stringify(record);
  const target = get('--jsonl') ?? process.env.TEMPLATES_JSONL;
  let appended: string | null = null;
  if (target) {
    const existing = existsSync(target) ? await readFile(target, 'utf8') : '';
    if (existing.includes(`"share_url": "${row.shareUrl}"`) || existing.includes(`"share_url":"${row.shareUrl}"`)) {
      appended = `already present in ${target} — not appended again`;
    } else {
      await appendFile(target, `${existing && !existing.endsWith('\n') ? '\n' : ''}${line}\n`, 'utf8');
      appended = target;
    }
  }

  const note = get('--note', '-n') ?? null;
  await db`
    update submissions
    set status = 'approved', reviewed_at = now(), review_note = ${note}
    where id = ${id}
  `;
  await db`
    insert into audit_log (actor, action, target, detail)
    values ('submissions_review_cli', 'approve_submission', ${row.shareUrl}, ${db.json({ id, tags, handle, note })})
  `;

  console.log(`approved ${id} — ${record.name}, credited to @${handle}`);
  console.log(appended ? `templates.jsonl: ${appended}` : 'templates.jsonl record (append it to the marketplace corpus):');
  console.log(line);
  console.log('\nnext: author its copy in build-provenance/authored-by-share-url.json, run the');
  console.log('publish pipeline, then: npm run review-submissions -- published --id ' + id);
}

async function reject() {
  const id = get('--id', '-i');
  const note = get('--note', '-n');
  if (!id || !note) throw new Error('reject requires --id and --note (the reason is the point)');
  const row = await loadRow(id);
  await db`
    update submissions set status = 'rejected', reviewed_at = now(), review_note = ${note} where id = ${id}
  `;
  await db`
    insert into audit_log (actor, action, target, detail)
    values ('submissions_review_cli', 'reject_submission', ${row.shareUrl}, ${db.json({ id, note })})
  `;
  console.log(`rejected ${id} (${row.botName ?? row.shareUrl}) — ${note}`);
}

async function published() {
  const id = get('--id', '-i');
  if (!id) throw new Error('published requires --id');
  const row = await loadRow(id);
  await db`update submissions set status = 'published', published_at = now() where id = ${id}`;
  await db`
    insert into audit_log (actor, action, target, detail)
    values ('submissions_review_cli', 'publish_submission', ${row.shareUrl}, ${db.json({ id })})
  `;
  console.log(`marked ${id} published (${row.botName ?? row.shareUrl})`);
}

try {
  if (command === 'list') await list();
  else if (command === 'show') await show();
  else if (command === 'approve') await approve();
  else if (command === 'reject') await reject();
  else if (command === 'published' || command === 'publish') await published();
  else {
    throw new Error(
      'usage: review-submissions.ts [list|show|approve|reject|published] [--status s] [--id uuid] [--tags a,b] [--sharer-handle h] [--note "why"]'
    );
  }
} catch (error) {
  console.error(`review-submissions: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await db.end({ timeout: 5 });
}
