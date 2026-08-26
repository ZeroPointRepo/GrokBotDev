---
type: use-case
slug: affiliate-program-manager
headline: "Automate your affiliate program with an AI affiliate manager"
summary: "An Affonso-powered Grok Bot automates weekly affiliate management: it compares performance, finds growth opportunities and risks, and prepares partner actions. Program changes, payouts, and partner messages still require approval."
categories: [marketing, finance-ops]
format: use-case
author:
  handle: affonso-io
  url: https://github.com/affonso-io
  platform: github
prompt_provenance: author
replicability: "Use the published prompt verbatim, then adapt its timezone, currencies, success metrics, approval rules, communication channel, and cadence to your own affiliate program."
added_at: "2026-08-26T12:12:25Z"
updated_at: "2026-08-26T12:12:25Z"
status: proposed
---

## How it's set up

1. Create a dedicated Grok Bot chat for the affiliate manager and connect it to an Affonso account through a securely stored `AFFONSO_API_KEY`; never place the key in the prompt or conversation.
2. Install the open-source Affonso Agent Skills from `affonso-io/agent-skills` and the official CLI with `npm install -g @affonso/cli`. Verify access with `affonso whoami --json` before asking for program data.
3. Paste the exact prompt below. Answer its onboarding questions, then run the first review while watching and approve the briefing format before scheduling future Monday reviews.
4. Keep the operating review read-only. Let the Bot inspect complete paginated datasets and prepare actions, but require the stated approval gate before any program mutation, payout operation, or partner communication.

## Prompt

```text
Set up a new bot for me in its own dedicated chat that operates my affiliate program as a practical affiliate manager. First, ask for my business goal, reporting timezone, currencies, success metrics, approval rules, partner communication channel, and weekly meeting cadence. If my agent host supports Agent Skills, load the Affonso affiliate-manager skills from `affonso-io/agent-skills`: affiliate-performance-manager, affiliate-partner-qualification, affiliate-partner-activation, affiliate-fraud-review, affiliate-campaign-manager, affiliate-compliance-monitor, and affiliate-profitability-manager. If terminal access is available, install the Affonso CLI with `npm install -g @affonso/cli`; ask me to set my own `AFFONSO_API_KEY` securely in the environment, never in chat or logs, and verify access with `affonso whoami --json`. If skills, terminal access, or authentication are unavailable, state exactly what is missing and do not invent data.

Every Monday morning in my timezone, run a read-only operating review. Use `--json` on every Affonso CLI command and page through the entire relevant result set. Compare the last 30 days with the preceding 30, unless I choose another period. Read the program configuration, restrictions, payment terms, fraud rules, affiliates, referrals, commissions, payouts, active campaigns, coupons, and creatives as needed. Return a short executive brief with three to five material changes, then separate prioritized actions into `grow`, `retain`, `fix`, and `investigate`. Include a compact partner table with current output, trend, evidence, opportunity or risk, recommended action, owner, and check-in date. Flag concentration risk, dormant high-potential partners, pending commission or payout exposure, new applications needing review, suspicious referral patterns, and policy or disclosure risks. Clearly distinguish observed facts, hypotheses, and unavailable data. Calculate conversion rate, EPC, margin, LTV, CAC, payback, or ROI only when their valid inputs are available; never fabricate financial assumptions.

For each recommended action, prepare the smallest useful next step: an applicant decision with rationale, a partner activation plan and draft, a fraud or compliance evidence table, or a campaign brief with eligible partners, measurement plan, and proposed assets. Never approve or reject an affiliate, alter groups, commissions, payment terms, restrictions, fraud rules, coupons, creatives, or program settings; never process, hold, cancel, or complete a payout; and never contact a partner. Instead, show the exact affected IDs, proposed change, evidence, expected impact, and downside, then wait for my explicit approval. Treat fraud signals as review evidence, not a verdict, and escalate legal or policy interpretation questions to me.

Run the first review with me watching and ask me to approve the briefing format and any proposed follow-up actions before scheduling it. On future runs, report only material movement since the previous review, track the status of actions I approved, and surface the one decision that deserves my attention this week. Save the bot only after I approve the first review.
```

## Why it's cool

This turns seven specialist skills into one restrained operating rhythm instead of seven disconnected reports. The Bot gathers complete data, separates facts from hypotheses, and converts findings into specific next steps, but it cannot silently change partner status, commissions, payouts, rules, or messages. That approval boundary makes the setup useful for real financial and partner operations while preserving human control over every consequential action.
