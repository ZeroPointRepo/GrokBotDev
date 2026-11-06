---
type: plugin
name: "Parley"
slug: parley
tagline: "Let your Grok Bot send and receive WhatsApp from your own number."
category: support
subcategory: replies
install_steps:
  - "Sign in at app.itsparley.com (OAuth, free, no card), then link your WhatsApp under Linked devices by scanning the QR code, the same way you link WhatsApp Web."
  - "In your Grok Bot's connector / MCP settings, add a custom connector at https://app.itsparley.com/mcp (Streamable HTTP) and approve the sign-in when your browser opens. There is no API key to paste."
  - "Paste the prompt below into your Grok Bot so sending and reading WhatsApp messages becomes a standing capability."
prompt: "You are setting up Parley inside Grok Bot so you can send and receive WhatsApp messages from my own WhatsApp number. Parley is connected as a remote MCP connector at https://app.itsparley.com/mcp, so its tools are already available to you; do not ask me for an API key. Read the tool list Parley exposes so you understand what it can do, and use only the tools and fields it actually returns - never invent a chat, contact, phone number or message that Parley did not give you. Rules that never change: a WhatsApp message goes to a real person from my number and cannot be taken back, so before you send anything show me the exact recipient, the full text and wait for my explicit yes; never message anyone in bulk or someone I have not named; keep messages short and human; and report back what was sent and any replies in this chat. Confirm setup by listing my recent WhatsApp chats and telling me how many you can see, without sending anything."
works_with: []
project_url: https://itsparley.com
repo_url: https://github.com/Verbiflow/parley
author:
  handle: Verbiflow
  url: https://github.com/Verbiflow/parley
  platform: web
source_url: https://github.com/Verbiflow/parley
pricing_note: "Free. Source-available under the Elastic License 2.0."
setup_minutes: 5
featured: false
sponsor: false
added_at: "2026-11-06T02:50:00Z"
updated_at: "2026-11-06T02:50:00Z"
status: proposed
---

## What it does

Parley connects your Grok Bot to WhatsApp through your own number. You link WhatsApp once by scanning a QR code, then add Parley as a remote MCP connector. Your bot can then send messages to people you name and read their replies, so a task like "ask the caterers for a quote" can finish on WhatsApp instead of stopping at a draft. Messages go out from your number at a human pace, and incoming replies come back to the bot so it can report to you in the chat you already use.

Parley supports WhatsApp today. LinkedIn, email and Slack are planned but not available yet. The code is source-available under the Elastic License 2.0, and the service is free to use.

## Use it in Grok Bot

Link WhatsApp at app.itsparley.com, add https://app.itsparley.com/mcp as a custom connector in your Grok Bot, approve the sign-in, then paste the prompt on this page. The prompt makes your bot show you every recipient and message and wait for your approval before anything is sent, and it never messages anyone you have not named.
