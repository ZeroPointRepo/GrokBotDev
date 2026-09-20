---
type: plugin
name: "Kampalo"
slug: kampalo
tagline: "Brief synced Google and Meta ads, then pause a weak campaign only after you confirm."
category: marketing
subcategory: ads
install_steps:
  - "Create a Kampalo account at kampalo.com and connect Google Ads and/or Meta Ads. SEO and GA4 are optional extras."
  - "Set KAMPALO_MCP_API_KEY to the same secret as backend MCP_API_KEY. Starter and Enterprise include MCP; Free does not."
  - "Point Grok Bot at the hosted MCP server https://be.kampalo.com/mcp with Authorization Bearer plus that key."
  - "Paste the prompt below and give it your Kampalo user email so every tool call is scoped to you."
prompt: "You are setting up a Kampalo integration for me inside Grok Bot. First read Kampalo's Grok Bot docs at https://kampalo.com/kai/grok-bot and the plugin README at https://github.com/Tekreign/kampalo-cursor-plugin so you understand the hosted FastMCP server at https://be.kampalo.com/mcp (Bearer auth with my Kampalo MCP API key — never invent a URL or header). Kampalo tools read synced Postgres: Google Ads, Meta Ads, Search Console, GA4, and Meta organic. Writes exist only as automate_* tools: propose a pause, then confirm with confirm=true; ads and SEO alerts; ROAS automation rules that stay dry-run unless I say to go live with confirm_live=true; and report JSON. Then let me drive it in plain language: brief Google vs Meta, name weak campaigns, and act only with the catalog tools. Rules: follow those docs exactly and NEVER invent a tool, field, campaign, or metric Kampalo did not return. Pausing a campaign or enabling a live ROAS rule stops or spends money — always show the campaign, platform, reason, and action_id and get my explicit approval before confirm=true or confirm_live=true. Confirm the connection by calling overview_get_account with my user_email."
works_with: []
project_url: "https://kampalo.com"
repo_url: "https://github.com/Tekreign/kampalo-cursor-plugin"
x_handle: "kampalo"
author:
  handle: "kampalo"
  url: "https://kampalo.com"
  platform: web
pricing_note: "MCP access is on the Starter and Enterprise plans, not the Free tier."
setup_minutes: 10
added_at: "2026-09-20T00:00:00Z"
updated_at: "2026-09-20T00:00:00Z"
verified_at: "2026-09-20T00:00:00Z"
status: live
---

## What it does

Kampalo is a marketing workspace that syncs Google Ads, Meta Ads, Search Console, GA4, and Meta organic into Postgres. Its hosted MCP server at be.kampalo.com/mcp lets a Grok Bot brief those synced numbers, then run the automations the product already has: propose pausing a weak selected campaign, confirm that pause only after you say so, set ads or SEO alert rules, keep ROAS auto-pause in dry-run until you enable live, and return performance report JSON. It does not connect OAuth, change budgets, create campaigns, or write Shopify or TikTok.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it your Kampalo MCP API key plus the email of the Kampalo user. The bot reads Kampalo's own docs first, then you drive the workspace in plain language — briefs from synced data, a proposal before any live pause, and no invented metrics if MCP is down or the database has no rows.
