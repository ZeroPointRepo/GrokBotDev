---
type: plugin
name: "AnalyticLunch"
slug: analyticlunch
tagline: "Give your Grok Bot your site traffic, UTM link builder and weekly competitor intel."
category: marketing
subcategory: analytics
install_steps:
  - "Create a free AnalyticLunch account at analyticlunch.com. It does website traffic tracking ($6/mo or $15/yr per site) plus pay-per-report SEO and competitive intelligence reports ($19 each, no subscription)."
  - "Add the tracking snippet to any site you want measured, using the site ID from your dashboard: <script src=\"https://analyticlunch.com/t.js\" data-id=\"site_XXXXX\" defer></script>"
  - "Subscribe to traffic tracking for at least one site. API access is gated on an active subscription, so a free-only account cannot mint a key (the endpoint returns 402)."
  - "Open Settings, click New Key under API Keys, and copy the al_live_ key it shows you. It is displayed once and cannot be retrieved again, so paste it somewhere safe now."
  - "Add the MCP server to your Grok Bot as a stdio connector: command npx, args -y analyticlunch-mcp, with environment variable ANALYTICLUNCH_API_KEY set to that key."
  - "Paste the prompt below so traffic questions, UTM link creation and weekly competitor reports become standing capabilities."
prompt: "You are setting up an AnalyticLunch integration for me inside Grok Bot. Connect to the analyticlunch-mcp server (stdio: npx -y analyticlunch-mcp) with my API key in ANALYTICLUNCH_API_KEY. Here is my key: [API KEY]. Read the tools the server exposes and the docs at analyticlunch.com before you act, and never invent a site, a metric, an endpoint or a number the server does not actually return. AnalyticLunch tracks website traffic and produces competitive intelligence, so you can list my tracked sites and their site IDs, pull a traffic summary for a site (visitors, sources, top pages, trends over a date range), create UTM tracking links, list existing tracking links with their click counts, and fetch my latest weekly competitive intelligence report. Then let me drive it in plain language: 'how did the site do last week', 'where is the traffic coming from', 'make me a tracking link for the Facebook ad', 'which of my links actually got clicks', 'what changed in the competitor report'. Rules: when you report numbers, always name the site and the exact date range you pulled, and say so plainly when a range has too little data to draw a conclusion from rather than narrating noise as a trend. Do not attribute a traffic change to a cause the data does not support. Creating a tracking link is a write, so show me the destination URL and the full set of UTM parameters and get my go-ahead before you create it. Confirm the connection by listing my tracked sites."
project_url: https://analyticlunch.com
founder:
  name: "Dan Dyer"
  x_handle: "dandyer"
source_url: https://www.npmjs.com/package/analyticlunch-mcp
author:
  handle: analyticlunch
  url: https://analyticlunch.com
  platform: web
pricing_note: "API access needs a paid plan: tracking $6/mo or $15/yr per site, SEO reports $19 each. See analyticlunch.com/pricing."
setup_minutes: 10
added_at: "2026-09-03T00:00:00Z"
updated_at: "2026-09-03T00:00:00Z"
status: live
verified_at: "2026-09-04T05:01:16Z"
---

## What it does

AnalyticLunch is two things a small operator usually pays for separately: lightweight website traffic tracking, and pay-per-report SEO and competitive intelligence. Its MCP server puts both inside a Grok Bot. The bot can list the sites you track and their IDs, pull a traffic summary for any of them (visitors, referral sources, top pages, trends across a date range you name), build UTM tracking links so a campaign is attributable before you spend on it, list the links you already made along with their click counts, and fetch the latest weekly competitive intelligence report on the competitors you are watching.

That last one is the part a generic analytics connector cannot do. Traffic numbers tell you what happened on your own site; the weekly report tells you what moved on someone else's. Having both behind the same conversation means "traffic dipped last week" and "here is who started outranking you" are one question instead of two tools and a spreadsheet.

## Use it in Grok Bot

Add the tracking snippet to your site, subscribe a site, mint an API key in Settings, and register analyticlunch-mcp as a stdio connector with ANALYTICLUNCH_API_KEY set. Paste the prompt on this page and your bot can answer "how did the site do last week", "where is that traffic coming from" and "which of my tracking links actually got clicks" from live data instead of a screenshot you pasted in. The prompt makes the bot name the site and the exact date range behind every number it quotes, say plainly when a window is too thin to read a trend from, and refuse to pin a traffic change on a cause the data does not support. Creating a tracking link is the one write in the set, so it shows you the destination and the full UTM string and waits for your go-ahead first.
