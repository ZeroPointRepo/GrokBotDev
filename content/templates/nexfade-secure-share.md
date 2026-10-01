---
type: "template"
name: "NexFade Secure Share"
slug: "nexfade-secure-share"
tagline: "Turns files and notes into one-time encrypted NexFade links you can revoke"
description: "Ask it to share something sensitive and it wraps the file or note in a one-time NexFade link instead of pasting the content into the chat. Encryption happens locally, so NexFade only ever receives ciphertext, and you can check a link's status or revoke it. Requires a NexFade account."
sharer:
  handle: "rynmark-repo"
  name: "NexFade"
  url: "https://github.com/rynmark-repo"
  platform: "github"
share_url: "https://x.ai/bot/s9i2gj-picjq7jFrNWwQt"
tags: ["business", "productivity", "data", "on-demand"]
primary_category: "business"
includes: ["instructions", "memories", "skills"]
includes_note: "Needs a NexFade account; free and paid plan limits apply. No custom MCP or plugin install is involved."
integrations: []
related_use_cases: []
featured: false
added_at: "2026-10-01T17:06:21.000Z"
updated_at: "2026-10-01T17:06:21.000Z"
verified_at: "2026-10-01T17:06:21.000Z"
status: "live"
---

## What it does

NexFade Secure Share is for the moment you have something sensitive to hand over — a document, a credential, a private note — and a plain paste feels too permanent. Ask for a secure share and the bot creates an encrypted NexFade link that works once. It can also report a link's status or revoke one if you change your mind, and it asks for confirmation before delivering anything or carrying out a revoke, rather than claiming success on its own.

The design point is who sees what: encryption happens locally, so NexFade receives ciphertext only, while the original content and the returned links stay with Grok under its own privacy terms. A NexFade account is required, and free and paid plan limits apply.

## Before you install

Open the share link and read the instructions it carries before you add it. This one came straight from its maker through the repo's issue queue, after the /submit/ form rejected their request; adding it copies the setup into your own account rather than giving you access to theirs. We verified the install link and NexFade's integration, pricing and privacy pages are live — we have not run an authenticated end-to-end test of the flow ourselves.
