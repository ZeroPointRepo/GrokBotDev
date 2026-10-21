---
type: plugin
name: "Patch MCP"
slug: patch-mcp
tagline: "Make outbound phone calls from your verified number and retrieve structured results"
category: work
subcategory: tasks
install_steps:
  - "Read https://www.patchmcp.com/docs and https://www.patchmcp.com/docs/agents.md for connection requirements and the calling workflow."
  - "Connect https://www.patchmcp.com/mcp using a remote Streamable HTTP MCP client with OAuth support; complete sign-in and phone-number verification."
  - "Paste the prompt below into Grok Bot. Confirm the connection with get_phone_number before authorizing a call."
  - "Provide the destination, objective and decision limits. Check estimate_call, then explicitly approve dialing and any permitted commitments."
prompt: >-
  Set up Patch MCP so you can make phone calls I authorize and report the results.
  First read https://www.patchmcp.com/docs and https://www.patchmcp.com/docs/agents.md,
  then use the documented Streamable HTTP MCP endpoint https://www.patchmcp.com/mcp
  and its OAuth flow. Let me complete sign-in and phone-number verification; never
  ask me to paste tokens or verification codes into this prompt. If this environment
  cannot connect with the required transport and authentication, explain the limitation
  and stop. Never invent endpoints, tools, parameters or capabilities. Confirm the
  connection with get_phone_number. Before dialing, gather the destination, objective,
  relevant facts, acceptable alternatives and limits on commitments. Use estimate_call
  to check route support and estimated usage, show me the plan, and get my explicit
  approval before place_call or anything that sends, writes or spends. Do not agree
  to purchases, booking changes or other commitments beyond my approved limits.
  If a name is required, ask me rather than inventing one. Offer the returned listen_url
  and use get_call until the call reaches a terminal status and its resolution is ready.
  Report the resolution outcome, key facts, commitments and follow-ups; a completed
  call does not necessarily mean the objective succeeded. Stop an active call when I
  ask, and do not retry a call I stopped. Keep calls private unless I explicitly ask
  to publish them after understanding what becomes public. Preserve the required
  recording disclosure. Do not use this for emergencies or claim texting is available.
project_url: "https://www.patchmcp.com"
repo_url: "https://github.com/lekom/patch-mcp-connectors"
source_url: "https://github.com/lekom/patch-mcp-connectors/blob/main/README.md"
author:
  handle: lekom
  url: "https://github.com/lekom"
  platform: github
pricing_note: "Eligible US/Canada accounts receive trial calls; other routes require a paid plan. Check current pricing and estimate_call before dialing."
added_at: "2026-10-21T00:00:00Z"
updated_at: "2026-10-21T00:00:00Z"
status: proposed
---

## What it does

Patch MCP gives an agent tools to call businesses using the user's verified caller ID and retrieve structured outcomes, transcripts and recordings when available. Tasks include checking appointment availability, asking about opening hours or stock, and following up on an order. The user supplies the objective and decision limits before dialing, and can listen to or stop the call through its private call page.

Calls require an authenticated account and a supported route. Check the current estimate before dialing; unsuccessful attempts can consume paid usage. Calls include a recording disclosure, and texting is currently unavailable.

## Use it in Grok Bot

Read the linked setup documentation, connect the remote MCP server through a client that supports Streamable HTTP and OAuth, and complete phone-number verification. Paste the setup prompt above into Grok Bot and first check the connected caller ID without placing a call. If the environment cannot complete the required MCP connection and authentication, resolve that prerequisite before attempting the workflow.

For an order follow-up, provide the business number, order reference, question to ask and a limit such as "do not change the order or accept charges." Review the estimate and approve the call. The bot then reports the structured outcome and any follow-up needed instead of treating a connected call as proof that the task succeeded. The setup prompt was written for this submission from the linked public documentation.
