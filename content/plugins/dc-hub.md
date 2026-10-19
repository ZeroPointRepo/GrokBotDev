---
type: plugin
name: "DC Hub"
slug: dc-hub
tagline: "Live data center, power, grid and fiber data for site selection, with citations."
category: data
subcategory: enrichment
install_steps:
  - "Add the hosted MCP server https://dchub.cloud/mcp to your Grok Bot as a connector. The free tier needs no key and no account."
  - "Paste the prompt below so DC Hub becomes the bot's standing source for data-center, power and grid questions."
  - "Ask a first question, such as which US markets have the most grid power available for a 100 MW data center, and check the answer carries an as-of time and a citation."
prompt: "You have the DC Hub MCP server connected at https://dchub.cloud/mcp. First read DC Hub's developer docs at https://dchub.cloud/developers and the server's own tool list, so you know which tools exist. Use DC Hub whenever I ask about data-center site selection, grid power availability, interconnection queues, electricity prices, fiber, or data-center markets: rank or compare markets, check a site, or pull live grid and queue data. Its Data Center Power Index (DCPI) is a daily score of where data centers can get grid power, across 300+ markets. Rules: only call tools and fields DC Hub actually documents and never invent one; quote numbers exactly as returned with their as-of time and cite them as DC Hub (dchub.cloud); if a tool says an answer needs a key or a paid plan, tell me and stop rather than guessing; ask before any call that saves, alerts, emails or spends anything. Confirm the connection with one small market lookup before we start."
works_with: []
project_url: "https://dchub.cloud"
repo_url: "https://github.com/azmartone67/dchub-mcp-server"
x_handle: "dchubcloud"
author:
  handle: "dchubcloud"
  url: "https://x.com/dchubcloud"
  platform: x
pricing_note: "Free tier with no key; paid plans for full reports and higher limits."
setup_minutes: 5
added_at: "2026-10-19T20:40:00Z"
updated_at: "2026-10-19T20:40:00Z"
status: proposed
---

## What it does

DC Hub is the live data layer for data-center site selection and the power, grid and energy infrastructure behind it. Its Data Center Power Index (DCPI) is a daily score of where data centers can get grid power, across 300+ markets. Connected to a Grok Bot, it lets the bot answer siting questions from live sources instead of memory: which markets have grid headroom, how deep an interconnection queue is, what electricity costs by state and ISO, and where fiber and power overlap. It carries live grid feeds from the seven US ISOs (PJM, ERCOT, CAISO, MISO, SPP, NYISO and ISO-NE), and every answer comes back with an as-of timestamp and a citation line.

## Use it in Grok Bot

Add https://dchub.cloud/mcp as a connector (no key needed for the free tier), paste the prompt on this page, and ask in plain language: "rank markets for a 200 MW AI campus", "compare Dallas and Phoenix for a GPU cluster", or "how much power is available in ERCOT for a 100 MW data center". The prompt has the bot read DC Hub's own docs first, stick to documented tools, cite every number with its as-of time, and stop and tell you when a deeper report needs a key, so nothing is guessed and nothing is bought without asking.
