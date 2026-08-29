---
type: plugin
name: "PostOnce"
slug: postonce
tagline: "Connect a Grok bot to the socials you already run and draft posts from chat."
category: marketing
subcategory: social
install_steps:
  - "Open https://postonce.app/docs/mcp-connect and copy the Grok Bot MCP URL shown there."
  - "In Grok Bot, add a custom MCP server and paste only https://postonce.app/api/mcp?ref=grokbot"
  - "Sign in if asked and hit Allow. Do not paste API keys into the chat."
  - "Tell the bot which Instagram, Facebook page, TikTok, LinkedIn, or Pinterest you already run, then connect those. Drafts first. Nothing goes live until you say yes."
prompt: "You are connecting PostOnce as an MCP server for this Grok Bot. First read the official setup page at https://postonce.app/docs/mcp-connect and follow only what that page and the live MCP tools actually expose. Add the server URL https://postonce.app/api/mcp?ref=grokbot if it is not already connected. Sign in if asked. Then help me connect the Instagram, Facebook, TikTok, LinkedIn, or Pinterest accounts I already run. Rules: never invent an endpoint, field, or tool the server does not provide; never ask me to paste an API key into chat; never create new brand pages unless I have none; always draft first and wait for an explicit yes before anything publishes or schedules."
project_url: "https://postonce.app"
source_url: "https://postonce.app/docs/mcp-connect"
author:
  handle: "Svanst23"
  url: "https://github.com/Svanst23"
  platform: github
pricing_note: "Grok Bot connect URL on the docs page is a month free with no card. The URL without the grokbot ref is 7 days."
setup_minutes: 5
added_at: "2026-08-29T07:37:00Z"
updated_at: "2026-08-29T07:37:00Z"
status: proposed
---

## What it does

PostOnce is a remote MCP server for drafting and publishing social posts from a Grok Bot. You add one URL, sign in, and connect the Instagram, Facebook, TikTok, LinkedIn, or Pinterest accounts you already run. The bot drafts in chat. Nothing publishes until you say yes. The official connect page is https://postonce.app/docs/mcp-connect. The Grok Bot URL is https://postonce.app/api/mcp?ref=grokbot.

## Use it in Grok Bot

Add that MCP URL as a custom server, allow the sign-in, then paste the prompt on this page. The bot reads the docs first, connects only the accounts you name, and keeps a draft gate on every publish. Do not paste keys into chat.
