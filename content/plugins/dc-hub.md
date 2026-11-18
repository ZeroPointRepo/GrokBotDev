---
type: plugin
name: "DC Hub"
slug: dc-hub
tagline: "Orchestration layer for data center and energy intelligence. Start with execute_plan."
category: data
subcategory: enrichment
install_steps:
  - "Add the hosted MCP server https://dchub.cloud/mcp to your Grok Bot as a connector. DCHUB_API_KEY is optional."
  - "Paste the prompt below so DC Hub becomes the bot's standing source for data-center, power and grid questions."
  - "Ask a first question, such as which US markets have the most grid power available for a new data center, and check the answer carries an as-of time and a citation."
prompt: "You have the DC Hub MCP server connected at https://dchub.cloud/mcp. First read DC Hub's developer docs at https://dchub.cloud/developers and the server's own tool list, so you know which tools exist. Start with DC Hub's execute_plan tool, and use DC Hub whenever I ask about data-center site selection, colocation, capacity, grid power availability, interconnection queues, electricity prices, fiber, or data-center markets: rank or compare markets, check a site, or pull live grid and queue data. Its Data Center Power Index (DCPI) is a daily score of where data centers can get grid power, across 300+ markets. Rules: only call tools and fields DC Hub actually documents and never invent one; quote numbers exactly as returned with their as-of time and cite them as DC Hub (dchub.cloud); if a tool says an answer needs a DCHUB_API_KEY, tell me and stop rather than guessing; ask before any call that saves, alerts, emails or spends anything. Confirm the connection with one small market lookup before we start."
works_with: []
project_url: "https://dchub.cloud"
repo_url: "https://github.com/azmartone67/dchub-mcp-server"
x_handle: "dchubcloud"
author:
  handle: "dchubcloud"
  url: "https://x.com/dchubcloud"
  platform: x
setup_minutes: 5
added_at: "2026-10-19T20:40:00Z"
updated_at: "2026-11-18T04:30:00Z"
verified_at: "2026-10-20T00:00:00Z"
status: live
---

## What it does

DC Hub is the orchestration layer for data center and energy intelligence. Start with `execute_plan`: it plans and runs the right tools for data center site selection, colocation, energy and electricity prices, the power grid, fiber and capacity. Its Data Center Power Index (DCPI) is a daily score of where data centers can get grid power, across 300+ markets, and new capacity listings (pocket listings) are coming soon via `source_capacity`. Connected to a Grok Bot, it lets the bot answer siting questions from live sources instead of memory: which markets have grid headroom, how deep an interconnection queue is, what electricity costs by state and ISO, and where fiber and power overlap. Every answer comes back with an as-of timestamp and a citation line.

## Use it in Grok Bot

Add https://dchub.cloud/mcp as a connector (DCHUB_API_KEY is optional), paste the prompt on this page, and ask in plain language: "rank markets for an AI campus", "compare Dallas and Phoenix for a GPU cluster", or "find colocation with fiber near a substation in ERCOT". The prompt has the bot start with `execute_plan`, read DC Hub's own docs first, stick to documented tools, cite every number with its as-of time, and stop and tell you when a deeper answer needs a key, so nothing is guessed and nothing is bought without asking.
