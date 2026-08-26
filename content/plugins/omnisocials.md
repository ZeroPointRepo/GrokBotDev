---
type: plugin
name: "OmniSocials"
slug: omnisocials
tagline: "Give your agent one API to schedule, publish, and analyze posts across 12 platforms."
category: marketing
subcategory: social
install_steps:
  - "Create an OmniSocials account at omnisocials.com and connect the social accounts you want it to reach."
  - "Get an API key from Settings > API in the OmniSocials app, or use the remote MCP URL with your key instead."
  - "Paste the prompt below into your Grok Bot and give it your OmniSocials API key so this becomes a standing capability."
prompt: "You are setting up an OmniSocials integration for me inside Grok Bot. First, read OmniSocials's API documentation at https://docs.omnisocials.com so you understand its authentication (a Bearer token API key, omsk_live_*) and the endpoints it exposes: listing connected accounts, creating and publishing or scheduling posts with media, applying saved hashtag sets, reading post and account analytics, and managing webhooks — across Instagram, Facebook, LinkedIn, YouTube, TikTok, X, Pinterest, Bluesky, Threads, Mastodon, and Google Business. You can also connect through its MCP server at https://mcp.omnisocials.com with the same key. Then use my OmniSocials API key so that whenever I ask you to draft, schedule, or publish across my social accounts, you do it through OmniSocials — pick the right accounts, respect each platform's rules, and post at the time I ask. Rules: follow the documentation exactly and never invent an endpoint, parameter, or platform OmniSocials does not list; if I ask for something it cannot do, tell me instead of guessing. Always show me the exact post text, media, target accounts, and schedule before anything is published, and confirm the connection first by listing my connected accounts."
works_with: ["X"]
project_url: "https://omnisocials.com"
source_url: "https://www.npmjs.com/package/@omnisocials/mcp-server"
x_handle: "omnisocials"
founder:
  name: "Robert Ligthart"
  x_handle: "robertligthart_"
author:
  handle: "omnisocials"
  url: "https://omnisocials.com"
  platform: web
pricing_note: "Pro is $10/mo per workspace billed yearly ($12/mo billed monthly); full API, SDKs, and MCP access included on every plan."
setup_minutes: 10
added_at: "2026-08-26T00:00:00Z"
updated_at: "2026-08-26T00:00:00Z"
status: proposed
---

## What it does

OmniSocials is a social media management platform and API. Its REST API and native MCP server let an AI agent list connected accounts, upload media, create and schedule or publish posts, apply saved hashtag sets, read post and account analytics, and manage webhooks — across 12 platforms including Instagram, Facebook, LinkedIn, YouTube, TikTok, X, Pinterest, Bluesky, Threads, Mastodon, and Google Business.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it an OmniSocials API key, or point it at the remote MCP URL. The bot reads OmniSocials's own documentation first, wires up the integration, and from then on you drive your social accounts in plain language — it follows the docs and shows you the exact post before anything goes out.
