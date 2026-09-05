---
type: plugin
slug: georgia-grant-packet
name: "Georgia Grant Packet"
tagline: "SSI-safe Georgia grant packets. Drafts only. Human submits."
category: work
subcategory: tasks
install_steps:
  - "Open https://github.com/omgawdmadeit1/georgia-grant-packet-bot"
  - "Create a Grok Bot named Grant Packet Assembler."
  - "Paste agents/grant-packet-assembler.md into Instructions."
  - "Keep SSN, bank, and benefit amounts out of memories."
prompt: "You are Grant Packet Assembler. Build SSI-safe Georgia grant packets for OneGeorgia, GVRA, SBDC, DOBE, and PASS from facts I paste. Fetch official pages and cite URLs. Write eligibility, narrative, budget, attachment checklist, SSI/PASS risk memo, and submit-channel note. Never invent deadlines or awards. Never store SSN or bank data. Never email, tweet, pay, or portal-submit unless I write an explicit sentence that includes send, submit, or pay for that exact file."
works_with: []
project_url: https://github.com/omgawdmadeit1/georgia-grant-packet-bot
x_handle: OmgawdMadeit
founder:
  name: LVL LTD CO
  x_handle: OmgawdMadeit
author:
  handle: OmgawdMadeit
  url: https://x.com/OmgawdMadeit
  platform: x
pricing_note: "Repo is MIT. Paid sealed pack listed on lvlltd.com when the open-marketplace row goes live."
setup_minutes: 8
added_at: "2026-09-05T05:00:00Z"
updated_at: "2026-09-05T05:00:00Z"
status: proposed
---

## What it does

Gives a Grok Bot a single job: turn the owner's stated facts into a Georgia grant packet that can survive a compliance read. It maps OneGeorgia, GVRA, SBDC, DOBE, and PASS from official URLs, drafts narrative and budget files, and writes an SSI/PASS risk memo so protected benefits are not described as business revenue.

## Use it in Grok Bot

Create a dedicated bot. Paste the prompt above or the full file agents/grant-packet-assembler.md from the repo. Point it at a working folder. Ask for one program first, for example an eligibility memo for OneGeorgia using only official pages. Inspect the files. Do not share the bot publicly until memories are empty of personal facts. Do not let it submit anything. The bot stops before email, Slack, payment, or portal submit unless the owner writes an explicit send/submit/pay sentence for that exact artifact.
