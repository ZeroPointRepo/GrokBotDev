---
type: plugin
name: "Jobkeepr"
slug: jobkeepr
tagline: "Give your Grok Bot your field service business: jobs, schedule, estimates, invoices."
category: work
subcategory: scheduling
install_steps:
  - "Create a Jobkeepr account at jobkeepr.com. It is field service software for contractor crews of one to ten: job tracking, scheduling, estimates, invoices and customer history. 14-day trial, no card."
  - "In your Grok Bot's connector / MCP settings, add a custom connector at https://jobkeepr.com/mcp (Streamable HTTP). A browser opens and you sign in with your normal Jobkeepr login. It uses OAuth 2.1 with PKCE, so there is no API key to paste."
  - "For a stdio-only client instead, run npx -y github:dandyer/jobkeepr-mcp with JOBKEEPR_API_KEY set to a key from Settings -> API Keys. The package is on GitHub, not npm."
  - "Paste the prompt below into your Grok Bot so checking the schedule, booking jobs and pulling job profitability become standing capabilities."
prompt: "You are setting up a Jobkeepr integration for me inside Grok Bot. Connect to Jobkeepr's hosted MCP server at https://jobkeepr.com/mcp (Streamable HTTP, OAuth 2.1 with PKCE, so a browser window will open for me to sign in; there is no API key). Read the tools Jobkeepr exposes and the docs at github.com/dandyer/jobkeepr-mcp so you understand the real surface before you act. Never invent an endpoint, a tool, a customer, a job or a price that the server does not return. Jobkeepr is field service management for a small contractor crew, so you can read business context, jobs, customers, the schedule, estimates, invoices, payments, line items and the price catalog, and you can create customers, create and reschedule jobs, create estimates, add line items, add catalog items, cancel jobs and close jobs. Then let me drive it in plain language: 'what is on my schedule tomorrow', 'book Sarah Chen for a TV mount Thursday at 2pm', 'which service made me the most money last month', 'mark today's jobs complete'. Rules: writes take effect immediately with no staging and no undo, so before any create, reschedule, cancel or close you show me exactly what you are about to change and wait for my explicit go-ahead. close_jobs can act on many jobs at once, so read the full set back to me first. You cannot text my customers and must not try to. If I ask you to message someone, draft the text and tell me to send it from Jobkeepr myself. Confirm the connection by reading my business context and telling me what is on my schedule today."
project_url: https://jobkeepr.com
founder:
  name: "Dan Dyer"
  x_handle: "dandyer"
source_url: https://github.com/dandyer/jobkeepr-mcp
author:
  handle: jobkeepr
  url: https://jobkeepr.com
  platform: web
pricing_note: "$39/mo for the owner plus $10/mo per additional user. 14-day free trial, no card required. See jobkeepr.com."
setup_minutes: 5
added_at: "2026-09-03T00:00:00Z"
updated_at: "2026-09-03T00:00:00Z"
status: proposed
---

## What it does

Jobkeepr is field service management software for small contractor crews: handymen, TV installers, plumbers, electricians and HVAC techs running one to ten people. Its hosted MCP server hands a Grok Bot the whole operational picture of that business. Reading, it can pull business context (name, timezone, working hours, and resolved date ranges like "this week"), jobs by date or status or customer, customer records with job counts and totals, the schedule with open time slots, estimates, invoices and unpaid balances, payments, line items for margin and mix analysis, and the price catalog. Writing, it can create a customer, book a job, create an estimate, add billable line items, add a catalog item, record a job source, reschedule, cancel, and mark jobs complete. Permissions are enforced per tool, so a bot connected under a crew member's login only sees what that person is allowed to see, and financial tools stay behind the VIEW_FINANCIALS permission.

One capability is deliberately missing: nothing here can text a customer. SMS is the one action that reaches a real person and cannot be undone, so it is excluded from the tool surface entirely. The bot drafts, you send.

## Use it in Grok Bot

Connect your Bot to https://jobkeepr.com/mcp (OAuth sign-in with your Jobkeepr login, no API key to paste), then paste the prompt on this page. From then on "what's on my schedule tomorrow", "book Sarah Chen for a TV mount Thursday at 2pm" and "which service made me the most money last month" are things your bot can actually answer and do against your real business, not a summary you pasted in. Because writes land immediately with no undo, the prompt keeps you in the loop: the bot shows you exactly what it is about to create, reschedule, cancel or close and waits for your go-ahead, and it reads the full set back to you before closing jobs in bulk. Clients that only speak stdio can use the GitHub package with an API key instead, which is a thin proxy to the same hosted tools.
