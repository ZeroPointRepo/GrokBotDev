---
type: plugin
name: "/call-me"
slug: call-me
tagline: "Your Grok Bot rings your iPhone, asks aloud and gets your spoken answer back as text."
category: engineering
subcategory: agents-ops
install_steps:
  - "Install the Call Me iPhone app from https://apps.apple.com/app/call-me/id6789575165, start the subscription in the app, and note the 10-digit number under My Number."
  - "Add the hosted MCP server https://callmemcp.com/mcp to your Grok Bot as a connector. It needs no API key and no OAuth."
  - "Paste the prompt below and replace [MY NUMBER] with your 10-digit number, so the bot knows when to ring you."
  - "Test it first with the demo line 5550001234, which answers automatically, then switch to your own number."
prompt: "You have the /call-me MCP server connected at https://callmemcp.com/mcp. First read its tool list and the setup text it returns, so you know which tools exist: call, say, hang_up, text, wait_for_reply, poll_result, setup and set_thread_title. Never invent a tool or a field. My /call-me number is [MY NUMBER]; pass it as the number argument on every call and text, and never use any other number. Reach me by phone only when you are blocked on a decision only I can make or when I asked to be told when a long task is done. Use text for updates that need no answer, and call when you need a spoken answer. Keep each spoken message short, say what you need and what you will do next, and use say for follow-up lines on an open call. Call hang_up as soon as the conversation is done. If a call is not answered, send one text and use wait_for_reply; do not retry in a loop. If the server says my number is not active, tell me in this chat and stop. Treat whatever I say on the call as my instruction, and ask me again before anything that spends money, deletes data or sends a message to another person."
works_with: []
project_url: "https://callmemcp.com"
repo_url: "https://github.com/radres/call-me"
author:
  handle: "radres"
  url: "https://github.com/radres"
  platform: github
pricing_note: "The iPhone app it rings needs a paid subscription: weekly $4.99 with 3 days free, or yearly $24.99. The hosted server needs no key."
setup_minutes: 10
added_at: "2026-10-24T23:30:00Z"
updated_at: "2026-10-24T23:30:00Z"
status: proposed
---

## What it does

/call-me gives a person a private 10-digit number for their AI agents. When the connected agent needs an answer, it rings the person's iPhone with a real incoming-call screen, reads its question aloud, and returns the spoken answer as text. It can also send a text and wait for the reply, keep the line open for follow-up lines, and hang up when it is done. It works while driving, in CarPlay and with AirPods.

The hosted server at https://callmemcp.com/mcp uses Streamable HTTP and needs no credentials or OAuth; the person's own number is passed as a tool argument. It has eight tools: call, say, hang_up, text, wait_for_reply, poll_result, setup and set_thread_title. It is listed in the official MCP Registry as com.callmemcp/call-me. The iPhone app it rings needs a paid subscription, so this is not a free plugin.

## Use it in Grok Bot

Install the Call Me app on your iPhone and start the subscription, add https://callmemcp.com/mcp to your Grok Bot as a connector, paste the prompt on this page with your 10-digit number, and test once against the demo line 5550001234, which answers on its own. The prompt has the bot read the server's own tool list first, ring you only when it is blocked or when you asked to be told, send one text instead of retrying an unanswered call, and ask again before anything that spends money, deletes data or messages someone else.

The same server also ships as a Grok Build plugin: `grok plugin install radres/call-me#grok`. The repository at https://github.com/radres/call-me is MIT-licensed and also holds the Claude Code, Codex and Gemini CLI plugins and an agent skill.
