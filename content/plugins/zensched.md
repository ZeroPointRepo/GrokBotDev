---
type: plugin
name: "ZenSched"
slug: zensched
tagline: "Field workforce scheduling over MCP — shifts, GPS check-in, timesheets."
category: work
subcategory: scheduling
install_steps:
  - "Read the ZenSched quickstart at zensched.com/docs/quickstart/ — cold start is zensched_guide then account_create(org_name); the response includes your zsc_ API key (no email required)."
  - "In Grok Bot, add a custom Streamable HTTP MCP server at https://mcp.zensched.com/mcp with header Authorization: Bearer zsc_… (Plugins → add custom MCP, or ask the bot in chat to register the server)."
  - "Confirm the connection: call zensched_guide, then list available tools. Free tier includes 200 MCP calls/day without funding."
  - "Paste the prompt below so the bot knows how to schedule crews, verify GPS punches, and export timesheets without inventing fields."
  - "Fund the $5 activation deposit (credited to balance) before paid meters — worker invite, geocode, GPS verify, processed timesheets. See zensched.com pricing for current meter rates."
prompt: "You are connected to ZenSched over MCP at https://mcp.zensched.com/mcp with my zsc_ Bearer key. ZenSched is agent-first field workforce scheduling — locations, worker invites, shifts, GPS-verified check-in, forms, webhooks, and timesheets. There is no vendor dashboard; you operate through MCP tools only. Start every session by calling zensched_guide for the current workflow, then account_setup or account_activity if you need session context. Never invent tool names, parameters, or billing meters — use only what the MCP server exposes. Typical loop: location_create (or lat/lng), worker_invite, event_create, shift_create, then watch via webhook_register or shift_status. For timesheets use timesheet_export; mode=processed is metered and requires account_set_payroll_period first. Use idempotency_key on every mutating call. Before any side effect that spends balance (worker_invite, geocode, gps_verify, processed timesheet, form reads beyond free tier), tell me exactly what you are about to call and wait for my OK. Reading shift status, listing workers, and free timesheet modes are fine without asking. If you get payment_required, explain the meter and ask whether to fund before retrying. Workers complete shifts in the ZenSched mobile app (iOS/Android). Confirm setup by calling zensched_guide and summarizing the tools you can reach."
works_with: []
project_url: https://www.zensched.com
repo_url: https://github.com/zenschedmcp/zensched
source_url: https://x.ai/bot/LK0rEXJnnD1qpEISXd7Ix
pricing_note: "Free tier: 200 MCP calls/day unfunded. Then $5 deposit (credited) plus meters: invite $0.25, GPS $0.10, geocode $0.03."
setup_minutes: 15
x_handle: "zensched"
founder:
  name: Mike Fullman
  x_handle: zensched
author:
  handle: zensched
  url: https://www.zensched.com
  platform: web
featured: false
sponsor: false
added_at: "2026-09-15T19:30:00Z"
updated_at: "2026-09-15T19:30:00Z"
verified_at: "2026-09-16T00:00:00Z"
status: live
---

## What it does

ZenSched is a hosted MCP server for field crews: create locations (with geocoding and optional pin refine), invite workers to the mobile app, schedule events and shifts, collect GPS-verified check-in/out, attach forms, register webhooks, and export timesheets. Keys are org-scoped (`zsc_`); there is no separate organization ID parameter. Cold start needs no human signup form — call `zensched_guide`, then `account_create(org_name)` to mint a key. The endpoint is Streamable HTTP at `https://mcp.zensched.com/mcp` with Bearer auth.

## Use it in Grok Bot

Grok Bot does not ship a one-click ZenSched catalog connector today — add it as a **custom MCP server** (chat: "add custom MCP server" with the URL and Bearer header, or your team's plugin policy equivalent). Paste the prompt on this page after the server connects. The bot should call `zensched_guide` first, gate paid meters, and use `idempotency_key` on writes. Reference kits for vertical loops (pet care, lawn, home care) live at `github.com/zenschedmcp`. Official MCP registry namespace: `com.zensched/zensched`.
