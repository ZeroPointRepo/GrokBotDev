---
type: plugin
name: "CentricMem"
slug: centricmem
tagline: "Hosted librarian so every agent cites the same Markdown cards."
category: engineering
subcategory: agents-ops
install_steps:
  - "Sign up at https://centricmem.com and copy the default key shown once. Never paste that key into a chat."
  - "Install the Skill in the agent you already use: npx skills add zeyu-j/centricmem-skill --skill centricmem-agent -g"
  - "Ask the agent to connect. It should send only a /connect?device= link (ten minutes). Enter the key on that page, then start a new chat."
  - "Keep talking. When work is real the agent files cards on the hosted librarian via host MCP at https://mem.centricmem.com/mcp. Search and download originals on the dashboard."
prompt: "You are connecting this Grok Bot to the hosted CentricMem librarian. Read the Skill at https://github.com/zeyu-j/centricmem-skill/blob/main/skills/centricmem-agent/SKILL.md and REFERENCE.md before you invent a flow. Capture stays in this agent's own memory. CentricMem is the organise/retrieve layer: Markdown cards on https://mem.centricmem.com/mcp. If MCP tools are missing, run centricmem connect --device and send only the printed https://centricmem.com/connect?device= URL. I enter the default key or an extra key on that page. Never ask me to paste a key, token, or transcript jsonl into chat. Never curl librarian HTTP. Never bootstrap a local hub. Sweep into a named shelf, never Inbox. Confirm setup with health then ambient, then search for a recent decision if I have any."
works_with: [GitHub]
project_url: https://centricmem.com
repo_url: https://github.com/zeyu-j/centricmem-skill
source_url: https://github.com/zeyu-j/centricmem-skill
author:
  handle: zeyu-j
  url: https://github.com/zeyu-j
  platform: github
pricing_note: "Lite is free (100MB attachments, unlimited Markdown). Pro £4.99 and Ultra £9.99 monthly. Education for UCL emails."
setup_minutes: 10
featured: false
sponsor: false
added_at: "2026-09-06T23:20:00Z"
updated_at: "2026-09-06T23:20:00Z"
status: proposed
---

## What it does

CentricMem is a hosted librarian for AI agents. Capture stays in the agent you already use (Grok Bot memory, Cursor memories, and similar). When work is real, the agent files Markdown cards — decisions, notes, session units — onto one Library with many Shelves. Later agents search those cards instead of re-deriving the same architecture from model weights. Originals sit in object storage; humans download them from the dashboard. Agents never get `/download`, delete, or billing over MCP.

The public package is the Skill, not the librarian: `npx skills add zeyu-j/centricmem-skill --skill centricmem-agent -g`. Host MCP is Streamable HTTP at `https://mem.centricmem.com/mcp`. Authentication is a ten-minute `/connect?device=` page so keys never land in chat. Lite is free for Markdown; attachments are metered.

## Use it in Grok Bot

Install the Skill, then ask the Bot to connect. It should print only the authenticate URL. Enter the default key (every shelf) or an extra key (the shelves you granted). After that, ordinary work is enough: search for a past decision, file a note when something durable happened, keep the chat transcript as an original. Do not treat Grok Bot as a second memory product. Do not paste keys, tokens, or transcript files into chat. Never curl the librarian. Never bootstrap a local hub. Sweep into a named shelf, never Inbox. If MCP tools are missing, send a new authenticate link and start a new chat on that machine.
