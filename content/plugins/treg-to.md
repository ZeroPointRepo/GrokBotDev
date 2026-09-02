---
type: plugin
name: "treg.to"
slug: treg-to
tagline: "2,745 external APIs your Grok Bot can call with no provider keys, at the provider's rate"
category: marketing
subcategory: seo
install_steps:
  - "In Grok Bot, click Plugins at the bottom of the left sidebar."
  - "Search for treg and click Add — it is listed simply as \"treg\", under the MCP category."
  - "Sign in when it asks. Your first team starts with $1.00 of free calls — no provider accounts to open, no card."
  - "Paste the prompt below in a chat. Grok searches the catalog for the job, quotes the price, and calls the endpoint — you never hold a provider key."
prompt: "You are connected to treg.to: one MCP server that gives you 2,745 ready-to-call external API endpoints across 82 platforms — SEO and keyword data, SERPs, backlinks, LinkedIn and people enrichment, Reddit, YouTube, ads, e-commerce, finance, scraping. Read https://treg.to/llms.txt once so you know how the catalog works. When I ask for external or live data, search the catalog by the job I want done (not by vendor name), read the chosen endpoint's parameters, then make the call. Never invent an endpoint, parameter, or price — use only what the catalog reports. When several providers do the same job, show them to me side by side with their prices and let me choose; treg compares, it does not route for you. Calls on treg's keys are metered from our prepaid balance at the provider's own rate: tell me the price before every paid call, and get my OK before anything over $0.05 or any batch of calls. Calls that run on keys our team connected ourselves are never metered. Never ask me to paste a provider API key into chat — credentials live in treg, not in this conversation."
works_with: [X, GitHub]
project_url: https://treg.to/agents/grok-bot
repo_url: https://github.com/superdesigndev/treg
x_handle: "treg_ai"
founder:
  name: "Jason Zhou"
  x_handle: "jasonzhou1993"
pricing_note: "$1.00 free per new team, then the provider's own rate with $0.000 markup. Your own connected keys are never metered."
setup_minutes: 5
author:
  handle: JayZeeDesign
  url: https://github.com/JayZeeDesign
  platform: github
added_at: "2026-08-31T00:00:00Z"
updated_at: "2026-08-31T00:00:00Z"
verified_at: "2026-09-02T18:00:00Z"
status: live
---

## What it does

treg.to is a tool catalog for agents: one MCP connection that gives a Grok Bot 2,745 curated endpoints across 82 platforms — keyword volume, SERPs, backlinks and site audits; LinkedIn, people and company enrichment; Reddit, YouTube, Instagram and TikTok listening; ads and e-commerce data; finance; scraping. Eligible endpoints run on treg.to's own provider keys, metered per call from a prepaid team balance at the provider's own rate with $0.000 markup — no provider accounts to open. A team can also connect its own keys and OAuth accounts (Google Analytics, Search Console, ad accounts); a team's own key always wins over treg's, and those calls are never metered. Where several providers do one job, the bot sees them side by side with measured success rates and prices — choosing stays with the caller; treg does not route automatically. Under the hood the agent makes the real upstream request and the proxy injects the credential server-side, so the bot never holds a secret.

## Use it in Grok Bot

Add the plugin from the Plugins sidebar (MCP category), sign in, and paste the prompt on this page. From then on Grok starts any data task by searching the catalog for the job — "find the work email for this person", "keyword volume for these ten terms", "what's trending on Reddit about X" — reads the endpoint's parameters, quotes the price, and makes the call. The first $1.00 of calls on every new team is free, so a lead-list build or a rank-tracking run works end to end before any top-up. The page at [treg.to/agents/grok-bot](https://treg.to/agents/grok-bot) walks the install with screenshots and prints per-step receipts from real runs, not rate cards.
