---
type: plugin
name: "BulkPublish"
slug: bulkpublish
tagline: "Let your agent schedule and publish social posts across 15 networks."
category: marketing
subcategory: social
install_steps:
  - "Create a BulkPublish account at bulkpublish.com and connect the social accounts you want the bot to post to."
  - "Generate an API key at app.bulkpublish.com/developer — every plan including the free tier has API and MCP access."
  - "Point your bot at the hosted MCP server https://mcp.bulkpublish.com/mcp with that key, or call the REST API documented at app.bulkpublish.com/docs."
  - "Paste the prompt below into your Grok Bot so scheduling and publishing become a standing capability."
prompt: "You are setting up a BulkPublish integration for me inside Grok Bot. First, read the BulkPublish API reference at https://app.bulkpublish.com/docs and the machine-readable spec at https://app.bulkpublish.com/openapi.json so you understand how it actually works — authentication with an API key from app.bulkpublish.com/developer, and the operations it exposes: listing my connected channels and their health, checking each platform's posting rules and limits, uploading media, creating drafts, scheduling posts for a future time, publishing immediately, and reading back analytics and quota. Then connect to my BulkPublish account — either through the hosted MCP server at https://mcp.bulkpublish.com/mcp or the REST API — so that whenever I ask you to draft, schedule, or publish across my social accounts, you use BulkPublish to do it. Rules: follow the documentation exactly and never invent an endpoint, parameter, or platform that BulkPublish does not list; per-platform requirements are real constraints, so check them before composing (YouTube and TikTok require video, Pinterest and YouTube require a title, and every network has its own character limit). If I ask for something BulkPublish cannot do, tell me instead of guessing. Confirm the connection first by listing my connected channels, and always show me the exact post text, the target accounts, and the scheduled time before anything is published."
works_with: ["X", "Discord", "Telegram"]
project_url: "https://www.bulkpublish.com"
x_handle: "usebulkpublish"
author:
  handle: "azeemkafridi"
  url: "https://github.com/azeemkafridi"
  platform: github
pricing_note: "Free tier with API and MCP access; paid plans from $13.99/mo."
setup_minutes: 10
added_at: "2026-08-29T00:00:00Z"
updated_at: "2026-08-29T00:00:00Z"
status: proposed
---

## What it does

BulkPublish is a social media scheduler built to be driven by an agent as easily as by a human. It publishes to 15 networks — Facebook, Instagram, X, TikTok, YouTube, Threads, Bluesky, Pinterest, Google Business Profile, LinkedIn, Mastodon, Discord, Telegram, Tumblr and Snapchat — from one composer, one queue and one API.

The whole product surface is reachable programmatically: a REST API with a published OpenAPI spec, and a hosted MCP server at `mcp.bulkpublish.com/mcp` exposing tools for posts, channels, media, labels, recurring schedules, analytics and quota. API and MCP access are on every plan, including the free one, so a bot can be wired up without a subscription.

What makes it practical for an agent rather than just possible: the API reports each platform's real constraints — character limits, required fields, which networks demand video — so a bot can check the rules before it composes instead of discovering them in a rejection. Posts can be held for human approval before they go out, recurring schedules and RSS feeds can post on their own, and analytics come back per platform, including outbound link clicks that the social networks themselves no longer report.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it a BulkPublish API key. The bot reads the BulkPublish documentation and OpenAPI spec first, connects through the hosted MCP server or the REST API, and from then on you drive your whole posting workflow in plain language — "draft this for LinkedIn and X, schedule it for Tuesday morning, and show me before it goes."

It follows the documented contract rather than guessing, respects each platform's posting rules, lists your connected channels to confirm the connection works, and shows you the exact text, accounts and time before publishing anything. If you would rather a human sign off on every post, turn on approvals and the bot's posts wait for review instead of going straight out.
