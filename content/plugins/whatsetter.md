---
type: plugin
name: "WhatSetter"
slug: whatsetter
tagline: "Run your WhatsApp AI setter from the agent: inbox, leads, bookings, campaigns"
category: sales
subcategory: outreach
install_steps:
  - "Create a WhatSetter workspace at https://app.whatsetter.com and connect a WhatsApp number."
  - "In the app, open Settings then API, create a key and pick the scopes you need. Reads are enough for a briefing; add messages:send only if the bot may reply for you. The key is shown once."
  - "Add an MCP server to your bot: https://mcp.whatsetter.com/mcp (Streamable HTTP). OAuth 2.1 is discovered from the server, so there is no client id to fill in."
  - "On the first tool call the Connect to WhatSetter page opens: paste the key and approve. The bot only ever holds a revocable token, never the key."
  - "Ask: give me my WhatSetter briefing. Read-only tools answer directly; anything that sends or changes something asks you first."
prompt: "Connect to the WhatSetter MCP server at https://mcp.whatsetter.com/mcp (Streamable HTTP, OAuth 2.1 discovered from the server: a consent page opens once for me to paste my WhatSetter API key). Read the tool reference at https://docs.whatsetter.com/developers/mcp/ so you use the real tools, and never invent a tool, a field or an endpoint. Start every session with whoami to learn my workspace and the scopes of my key, and only use what those scopes allow. Use the read-only tools freely to answer questions about my leads, replies, meetings and campaigns, quote what leads actually wrote, and never invent a reply, a booking or a number. For anything that writes or sends (update_lead, create_list, import_leads, pause_campaign, resume_campaign, the webhook tools and above all send_whatsapp_message), show me exactly what you are about to do and wait for my explicit approval; approving one message never covers the next one. Never try to message a contact who was never contacted: the API refuses with lead_not_contacted, so new contacts go into a list with import_leads and the campaign makes first contact at a safe pace. If the API answers quota_exceeded, stop sending on that number until the quota resets at midnight UTC. Drafts for WhatsApp are short plain text in the lead's language, no markdown."
works_with: ["WhatsApp", "Zapier"]
project_url: https://whatsetter.com
repo_url: https://github.com/whatsetter/whatsetter-plugin
source_url: https://docs.whatsetter.com/developers/mcp/
author:
  handle: whatsetter
  url: https://whatsetter.com
  platform: web
pricing_note: "Free plugin and MCP. Needs a WhatSetter workspace; plans at whatsetter.com."
setup_minutes: 5
added_at: "2026-09-21T00:00:00Z"
updated_at: "2026-09-21T00:00:00Z"
status: proposed
---

## What it does

WhatSetter is an AI appointment setter on WhatsApp. A campaign contacts imported leads at a human pace, the AI qualifies them in conversation and books meetings on your calendar (Cal.com, Calendly, GoHighLevel). This plugin connects a Grok Bot to that workspace through a hosted MCP server, with OAuth 2.1 and an open-source manifest under MIT. From the bot you can read leads and full conversations, draft and send a reply to a lead you have already contacted, create lists and import contacts, pause or resume a campaign, read booked meetings, look at managed WhatsApp groups, and manage outbound webhooks (a qualified contact or a new booking can land in Zapier or any HTTPS endpoint). The anti-ban rules live in the API, not in the prompt: cold outreach to a number that was never contacted is refused, every WhatsApp number has a shared daily budget, and each send carries an idempotency key so a retry can never double-send.

## Use it in Grok Bot

Ask in plain language: who is waiting on us in the inbox, draft a reply to Karim but do not send it, import this CSV into a new list, how many meetings did the setter book this week, pause the Madrid campaign, who left my webinar group. The plugin ships a skill that gives the bot its operating rules: nothing sends without your explicit yes, first contact always goes through a campaign rather than a direct message, the daily quota of each number is respected, and the bot stays quiet when the AI setter is already answering a lead. Setup is one API key from the app and about five minutes.
