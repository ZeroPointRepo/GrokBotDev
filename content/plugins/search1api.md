---
type: plugin
name: "Search1API"
slug: search1api
tagline: "Live web search, news, page reading, and trends for your Grok Bot."
category: data
subcategory: scraping
install_steps:
  - "Create a Search1API account at s1.dev and grab an API key from app.s1.dev — or skip the key and use the OAuth flow, which has you sign in and approve access in the browser."
  - "Point your Grok Bot at the hosted MCP server https://mcp.search1api.com/mcp — OAuth-aware clients sign in automatically; other clients use the API key as a bearer token."
  - "Paste the prompt below so Search1API becomes a standing capability: search, news, crawl, sitemap, and trending on demand."
  - "The dashboard's MCP page can generate a ready-to-paste client config with your key filled in."
prompt: "You are setting up a Search1API integration for me inside Grok Bot. First, read the Search1API MCP documentation at https://s1.dev/docs/integrations/mcp and the API docs at https://s1.dev/docs so you understand the integration: connect to the hosted MCP server at https://mcp.search1api.com/mcp with OAuth 2.1 or an API key — no local server to run. The integration exposes tools for web search (search), news search (news), reading a URL (crawl), listing a site's links (sitemap), and GitHub / Hacker News trends (trending). Then use it whenever I ask for live information: search the web, read a page, find current news, explore a site's structure, or check what is trending. Rules: never invent an endpoint, field, or tool that Search1API does not document; ask me for my API key rather than expecting one in the prompt; and if a request would spend credits or send data out, tell me what it will do first. Confirm the connection with one small search before we start."
works_with: []
project_url: "https://s1.dev"
repo_url: "https://github.com/superagents-lab/search1api-mcp"
x_handle: "search1api_dev"
founder:
  x_handle: "fatwang2ai"
author:
  handle: "search1api"
  url: "https://s1.dev"
  platform: web
pricing_note: "Free tier: 100 credits. Paid plans from $19/mo; usage-based top-ups."
setup_minutes: 10
added_at: "2026-08-26T00:00:00Z"
updated_at: "2026-08-26T00:00:00Z"
status: proposed
---

## What it does

Search1API is web access infrastructure for AI agents: one API for web search, news, page retrieval (crawl), sitemap discovery, and trending topics, with a hosted MCP server so an agent connects without writing any integration code. Connected to a Grok Bot, it replaces hand-rolled scraping and search glue with live, grounded answers — the bot can look up today's information, read a page it was sent, and cite real source URLs instead of guessing.

## Use it in Grok Bot

Point the bot at the hosted MCP endpoint (OAuth sign-in or an API key), paste the prompt below, and Search1API becomes a standing capability. Then drive it in plain language: "search the web for X", "read this page and summarize it", "what are the latest news on Y", or "what's trending on GitHub today". The prompt has the bot read Search1API's own docs first, keep to documented tools only, and confirm the connection with a test search — so you know it works before you rely on it.
