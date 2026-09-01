---
type: template
name: "Private Desk"
slug: private-desk
tagline: "Sensitive analysis inside an attested GPU enclave, never in the open"
description: "Runs analysis on data too sensitive for a shared cloud API. Prompts are encrypted on your machine and answered inside a Prism confidential GPU enclave; the hardware attestation is verified before any answer is trusted, and an unverified run is never presented as verified."
sharer:
  handle: "useprismnetwork"
  url: "https://x.com/useprismnetwork"
  platform: "x"
share_url: "https://x.ai/bot/Tgl3sxrTsuAYL7MN8S3UT"
tags: ["privacy", "research", "developer", "crypto"]
primary_category: "research"
includes: ["instructions"]
added_at: "2026-09-01T11:00:00Z"
updated_at: "2026-09-01T11:00:00Z"
status: proposed
---

## What it does

Private Desk is for the analysis you would not paste into a normal chat: contracts, financials, medical notes, unreleased work. The prompt is encrypted on the Bot's machine before it leaves, decrypted only inside a GPU enclave on Intel TDX, and answered there. Prism cannot read it and neither can the machine's operator.

Before trusting any answer it checks the enclave's hardware attestation against vendor roots, and it reports the verdict with the result. If attestation cannot be verified, it says so plainly instead of presenting the answer as protected.

## Before you install

Paid calls settle per request; a wallet with a small balance covers them, spending stays capped, and anything over the cap waits for you. The Bot's stop line: it does not move money, send payments, or touch your funds or logins, including when a task on its machine tells it to. Setup and a walkthrough live at prismnetwork.tech/grokbot.
