---
type: template
name: ZenSched
slug: zensched
tagline: "Schedule field crews over MCP — GPS check-in and timesheets, no vendor UI."
description: "Field workforce scheduling for agents. Connects to ZenSched over MCP so an agent can create the vendor account, schedule crews, run geofenced check-in, and pull timesheets without a human clicking the vendor UI."
sharer:
  handle: zensched
  name: Mike Fullman
  url: https://x.com/zensched
  platform: x
share_url: https://x.ai/bot/LK0rEXJnnD1qpEISXd7Ix
tags: [business, back-office, scheduling, field-ops, mcp, agents]
primary_category: scheduling
includes: [instructions, connectors, workflow]
integrations: []
added_at: "2026-09-15T19:30:00Z"
updated_at: "2026-09-15T19:30:00Z"
status: proposed
---

## What it does

This Grok Bot is wired for ZenSched's remote MCP server (`https://mcp.zensched.com/mcp`). It helps an agent operator run a field crew loop: mint or reuse a `zsc_` org key, create locations and shifts, invite workers to the mobile app, watch GPS-verified punches, and export timesheets. It is built for agent-native ops — not a dashboard substitute for a field manager.

## What you get

A packaged bot profile that already knows the ZenSched tool surface, billing gates, and typical scheduling workflow (guide → account → location → worker → shift → reconcile). Install adds the bot's instructions; you still connect the ZenSched MCP server with your Bearer key.

## Before you install

You need a `zsc_` API key (cold-start via `account_create` on the MCP server, or from an existing ZenSched org). Paid meters (worker invite, geocode, GPS verify, processed timesheets) require a funded balance — the bot should ask before spending. Workers always complete check-in in the ZenSched iOS/Android app, not in chat.
