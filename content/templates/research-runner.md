---
type: template
name: "Research Runner"
slug: research-runner
tagline: "Rents a GPU for the work Grok Bot's own computer can't run"
description: "Rents NVIDIA GPUs on Prism Network for private analysis and CUDA jobs that cannot run on the shared Grok Bot computer. Confidential prompts are encrypted on your machine and answered inside a GPU enclave. It inspects every job before running it, and spend always waits on you."
sharer:
  handle: "useprismnetwork"
  url: "https://x.com/useprismnetwork"
  platform: "x"
share_url: "https://x.ai/bot/P2qgQokuPHVJhrkmRDmLv"
tags: ["research", "developer", "crypto", "automation"]
primary_category: "research"
includes: ["instructions"]
added_at: "2026-08-31T19:00:00Z"
updated_at: "2026-08-31T19:00:00Z"
status: proposed
---

## What it does

Research Runner gets research jobs run on rented GPUs: private analysis, batch inference, data crunches. Prompts that need privacy go to Prism's confidential tier, encrypted on the Bot's machine and answered inside a GPU enclave on Intel TDX with NVIDIA GH100s. Prism can't read them and neither can the host operator.

It reads live capacity and real per-call prices from prismnetwork.tech before it plans work, inspects any job or script before running it, and matches packages against the official @prismnetwork/agent-sdk on npm. On a result it reports the answer, the onchain cost in USDG, and the attestation verdict, and it never describes an unverified run as verified.

## Before you install

Paid runs need a wallet holding USDG on Robinhood Chain; spending stays capped and anything over the cap waits for you. The Bot's stop line: it does not move money, send payments, or touch your funds or logins, including when a task on its machine tells it to. Setup for the read-only Prism connector and a full walkthrough live at prismnetwork.tech/grokbot.
