-- 003 — public bot submissions (the /submit/ form).
--
-- One link is all a submitter has to give us. `share_url` is therefore the identity of a
-- submission and carries the UNIQUE constraint: the same bot filed twice is the same row, and
-- the endpoint answers "duplicate" instead of growing a review queue full of the same install
-- link. `bot_name` / `bot_author` are NOT submitter-supplied — the API fetches the share page
-- itself and reads them out of `og:title` ("<Bot> by <Author>"), so what we store about the bot
-- comes from xAI, not from whoever pasted the link. They stay nullable because a share page
-- that answers 200 without OpenGraph tags is still a real bot; only the 200 is load-bearing.
--
-- Everything else is OPTIONAL and exists only to credit the submitter. No accounts, no login:
-- `ip_hash` is the same peppered HMAC the vote ledger uses (src/security/ip.ts) so abuse can be
-- traced across rows without a raw IP ever reaching this table, and `user_agent` is truncated by
-- the app before it gets here.
--
-- NOTHING PUBLISHES FROM THIS TABLE. `status` starts at 'pending' and only bin/review-submissions.ts
-- moves it; the approve step emits a templates.jsonl record for the existing authoring →
-- generator.py → gate → promote pipeline, and the row becomes 'published' once that lands.
create table if not exists submissions (
  id uuid primary key,
  created_at timestamptz not null default now(),
  share_url text not null unique,
  bot_name text null check (char_length(bot_name) <= 200),
  bot_author text null check (char_length(bot_author) <= 200),
  submitter_x_handle text null check (char_length(submitter_x_handle) <= 15),
  submitter_website text null check (char_length(submitter_website) <= 300),
  submitter_note text null check (char_length(submitter_note) <= 500),
  source_post_url text null check (char_length(source_post_url) <= 300),
  status text not null default 'pending' check (status in ('pending','approved','rejected','published')),
  review_note text null check (char_length(review_note) <= 1000),
  ip_hash bytea not null,
  user_agent text null check (char_length(user_agent) <= 300),
  reviewed_at timestamptz null,
  published_at timestamptz null
);

-- The review CLI's only read pattern: the pending queue, oldest first, then per-status history.
create index if not exists idx_submissions_status_created_at on submissions(status, created_at);
-- Abuse tracing: "what else came from this network" without storing a network address.
create index if not exists idx_submissions_ip_hash on submissions(ip_hash, created_at desc);

-- Grants, in the same shape as 002_grants.sql. The app INSERTs and SELECTs (dedupe) and can do
-- nothing else — it must never be able to approve, publish, or erase a submission. Only the
-- admin role (the review CLI) can move `status`.
grant select, insert on submissions to votes_app;
revoke update, delete on submissions from votes_app;

grant select, insert, update, delete on submissions to votes_admin;
