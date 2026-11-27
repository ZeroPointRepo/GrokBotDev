---
type: plugin
name: "FLUF Connect"
slug: fluf-connect
tagline: "Let your Grok Bot run your online shop: stock, listings, orders and fixes."
category: work
subcategory: tasks
install_steps:
  - "Create a FLUF Connect account at fluf.io/connect and connect the marketplaces and shops you sell on."
  - "In FLUF Connect, open More -> Developers and create a personal access token."
  - "In your Grok Bot's connector settings, add a Streamable HTTP MCP server with URL https://fluf.io/wp-json/fc/mcp and the header Authorization: Bearer <your token>. Enter the token there, never in chat."
  - "Paste the prompt below. The Bot lists your connected sales channels first so you both know what it can reach."
prompt: "You are connected to my FLUF Connect account through its MCP server (https://fluf.io/wp-json/fc/mcp). FLUF Connect is the multichannel selling platform I use to list my products on several marketplaces and online shops and keep stock in sync. Read the docs at https://fluf.io/developers/docs/mcp/ before your first action and use only the tools the server reports - never invent a tool, field, product id or marketplace. Start by calling list_channels and summarising which sales channels are connected and which ones you are allowed to publish to. Reading is always fine without asking: list_products, get_orders, list_drafts, get_crosslisting_tasks. For anything that publishes, relists, schedules, edits or ends a listing, or deletes a product, first show me the exact items, channels and changed fields and wait for my OK; FLUF will also return an approval link that I confirm in FLUF before anything happens. Never re-send an item already reported as queued. When a listing was refused, read the reason from list_drafts and propose a corrected value instead of retrying blindly. For open questions about why something failed, use ask_intesa, FLUF's own assistant, rather than guessing. Confirm the setup by listing my connected channels now."
project_url: https://fluf.io/developers/docs/mcp/
repo_url: https://github.com/FLUF-io/fluf-mcp
source_url: https://github.com/FLUF-io/fluf-mcp
author:
  handle: "FLUF"
  url: https://fluf.io
  platform: web
pricing_note: "See fluf.io/pricing for plans."
setup_minutes: 5
added_at: "2026-11-27T23:45:00Z"
updated_at: "2026-11-27T23:45:00Z"
status: proposed
---

## What it does

FLUF Connect is a multichannel selling platform for people who sell online: brands, shops, makers, collectors and individuals. Its hosted MCP server gives a Grok Bot the same tools the FLUF dashboard uses: search the product catalogue, see which marketplaces and shops are connected, publish products to them, read orders from every channel in one place, fix listings a marketplace refused (with the refusal reason and the editable fields), relist, and run scoped bulk listing tasks with a daily cap. It also exposes Intesa, FLUF's own assistant, which can see listing history, sync records and error text that the API does not return.

## Use it in Grok Bot

Add the server as a Streamable HTTP MCP connector with your FLUF personal access token in the connector's auth header, then paste the prompt on this page. Your Bot starts by listing your connected channels, reads stock and orders freely, and asks before anything that changes a live listing. Every publish, relist, schedule or delete also comes back as a FLUF approval link showing the exact items, channels and fields, and nothing runs until you approve it there. Typical asks: "what sold this week and where", "which items are not listed anywhere yet", "why did my last five listings fail, and fix them".
