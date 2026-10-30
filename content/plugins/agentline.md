---
type: plugin
name: "AgentLine"
slug: agentline
tagline: "Give your Grok Bot its own phone number: calls in and out, two-way SMS, transcripts."
category: sales
subcategory: calls
install_steps:
  - "Create an AgentLine account at agentline.cloud. Your first US or Canada number starts a 7-day free trial; plans from $20/month."
  - "Connect one of two ways: add the AgentLine MCP server (https://api.agentline.cloud/mcp) in Grok Bot's MCP settings and sign in, or create an API key in the AgentLine dashboard and paste it into the bot's secure prompt, never into chat."
  - "Paste the prompt below. The bot reads agentline.cloud/skill.md, creates a hosted phone agent, and asks you to approve the number before it buys one."
  - "Test it on your own phone: ask the bot to call you, then read back the transcript."
prompt: "Give yourself a phone line with AgentLine. Read https://agentline.cloud/skill.md and follow it exactly. If the AgentLine MCP server is connected, use its tools; otherwise ask me for my AgentLine API key in a secure prompt, never in chat, and keep it in the environment as AGENTLINE_API_KEY. Create a hosted phone agent with a prompt I approve, then provision a US or Canada number only after telling me the cost and getting my yes. From then on: when I ask you to call someone, first show me who you are calling, the number, and the goal of the call in one line, and wait for my go-ahead; after the call, read the transcript and report what was agreed. Read inbound calls and texts to the number and summarize them for me; send a text only after I approve the exact recipient and message. Rules that never change: follow AgentLine's docs and never invent an endpoint, field, number, or transcript; be honest that you are an AI assistant calling on my behalf if anyone asks; no calls to emergency services; stop contacting anyone who asks. Confirm the setup by telling me the number and what you can do."
works_with: []
project_url: https://agentline.cloud
source_url: https://agentline.cloud/build/grokbot
x_handle: "AgentLineHQ"
author:
  handle: agentline
  url: https://agentline.cloud
  platform: web
pricing_note: "7-day free trial on the first number. Plans from $20/mo: US/CA number, 100 min, 400 SMS; then $0.12/min, $0.02/SMS."
setup_minutes: 5
added_at: "2026-10-30T12:00:00Z"
updated_at: "2026-10-30T12:00:00Z"
status: proposed
---

## What it does

AgentLine is a phone API built for AI agents. It gives your Grok Bot a dedicated US or Canada number that works in both directions. The bot can place calls that AgentLine's hosted voice agent carries out, then read the transcript afterward. Inbound calls are answered 24/7, even while the bot's computer is asleep, and every call is saved as a transcript. The same number sends and receives SMS. The bot drives it over AgentLine's REST API with one API key, following the skill file, or through the AgentLine MCP server if you add it.

## Use it in Grok Bot

Grok Bot sets itself up from the docs. Add the AgentLine MCP server and sign in, or hand over an API key through a secure prompt, then paste the prompt on this page. The bot reads agentline.cloud/skill.md, creates the phone agent, and asks you to approve the number and its cost. After that, "call the dentist and move my cleaning to next week" or "what did the plumber say when he called back?" are things it can do and report on. The prompt keeps you in the loop on anything that dials, texts or spends: it shows the recipient and goal before each call, it says it is an AI if asked, and it never invents a number or a transcript. Setup notes, MCP config and pricing are at agentline.cloud/build/grokbot.
