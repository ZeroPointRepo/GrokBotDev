---
type: plugin
slug: affonso
name: "Affonso"
tagline: "Give your Grok Bot affiliate data and approval-gated program operations."
category: marketing
subcategory: analytics
install_steps:
  - "Create or select an affiliate program in Affonso and generate an API key with only the scopes your Bot needs."
  - "Install the Affonso Agent Skills with `npx skills add affonso-io/agent-skills` and, when terminal access is available, install the CLI with `npm install -g @affonso/cli`."
  - "Set `AFFONSO_API_KEY` in the Bot runtime environment, never in chat or logs, then verify the connection with `affonso whoami --json`."
  - "Paste the prompt below and keep the first operating review read-only while you confirm the data, format, and approval rules."
prompt: "Connect this Grok Bot to Affonso. First read the official API documentation at https://docs.affonso.io/api/introduction and the Affonso Agent Skills at https://github.com/affonso-io/agent-skills; use the Affonso CLI skill when terminal access is available. Use only documented endpoints, commands, flags, and response fields, and never invent missing data. Ask me to set my own AFFONSO_API_KEY securely in the runtime environment, never in chat or logs, and verify access with `affonso whoami --json`. Use `--json` for every CLI command and page through complete result sets. Start with read-only affiliate, referral, commission, payout, campaign, coupon, creative, fraud, and program data. Before any action that writes, sends, changes partner status, alters commissions or settings, or processes money, show the exact affected IDs, proposed change, evidence, expected impact, and downside, then wait for my explicit approval. Treat fraud signals as evidence for review, not a verdict. If terminal access, authentication, a required scope, or a documented capability is unavailable, state exactly what is missing and stop instead of guessing. Confirm the connection by returning the authenticated Affonso account and available scopes without exposing the key."
works_with: [Stripe]
project_url: https://affonso.io
repo_url: https://github.com/affonso-io/agent-skills
x_handle: useAffonso
founder:
  name: "Silvestro"
  x_handle: zilvestro
author:
  handle: affonso-io
  url: https://github.com/affonso-io/agent-skills
  platform: github
source_url: https://github.com/affonso-io/agent-skills
pricing_note: "See affonso.io/pricing for current plans."
added_at: "2026-08-26T12:12:25Z"
updated_at: "2026-08-26T12:12:25Z"
status: proposed
---

## What it does

Affonso gives a Grok Bot structured access to the operating data behind a SaaS affiliate program: affiliates, referrals, commissions, payouts, campaigns, coupons, creatives, fraud signals, and program settings. The public REST API is the source of truth, while the open-source Agent Skills teach the Bot how to set up tracking, use the Affonso CLI, and run focused workflows for performance, partner qualification and activation, profitability, fraud review, campaigns, and compliance.

## Use it in Grok Bot

Install the skills, connect an API key through the Bot runtime environment, and use the prompt on this page. The Bot verifies access before reading data, uses JSON output and complete pagination, and begins with a read-only operating review. It can compare periods, surface partner opportunities and risks, prepare decisions, and draft the smallest useful next action. Mutations and external communication stay behind an explicit approval gate: the Bot must show the affected IDs, evidence, impact, and downside before it changes partner status, commissions, payouts, settings, or messages. If a capability or scope is missing, it reports the gap instead of inventing an endpoint or result.
