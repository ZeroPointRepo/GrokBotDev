---
type: plugin
name: "Prism Network"
slug: prism-network
tagline: "Live GPU capacity, per-second prices, and a public receipt for every run."
category: engineering
subcategory: agents-ops
install_steps:
  - "In Grok, open grok.com/connectors, click New Connector, then pick Custom."
  - "Enter https://prismnetwork.tech/api/mcp as the server URL. No account and no API key: every tool on it is read-only."
  - "Paste the prompt below so your Bot checks real capacity and real prices before it plans any GPU work."
  - "Funding a run stays with you. You approve and pay for a lease at https://prismnetwork.tech/compute, and the connector has no way to spend."
prompt: "You have a Prism Network connector. Prism is a GPU compute network that meters per second and settles onchain in USDG on Robinhood Chain, chain id 4663. Read the documentation at https://docs.prismnetwork.tech/ before you use it, and call only the tools this connector reports. Never invent an endpoint, a tool, or a field. Every tool here is read-only: none of them can sign a wallet transaction, create a lease, or spend money, so do not tell me you have started or paid for anything. When I ask which GPUs are available or what compute costs, read the live capacity and quote the real rate instead of estimating. When I ask you to run something on a GPU, prepare it: pin the exact command and image digest into an approval intent with a cost ceiling, show me that ceiling, and tell me I have to approve and fund it myself at https://prismnetwork.tech/compute. Once a run exists, read its status and its signed execution evidence using the read capability I give you, and run the verification checks before you call any result trustworthy. Report a failed check as a failure, and never describe an unverified run as verified. When I ask what a run cost, read the public settlement receipt and give me the onchain number rather than your own arithmetic. Confirm the connection now by listing current GPU capacity and the starting hourly rate."
project_url: https://prismnetwork.tech
x_handle: "useprismnetwork"
author:
  handle: "useprismnetwork"
  url: https://prismnetwork.tech
  platform: web
pricing_note: "Metered per second in USDG on Robinhood Chain, from 0.7992 USDG per hour. The read-only tools cost nothing."
setup_minutes: 5
added_at: "2026-08-31T00:00:00Z"
updated_at: "2026-08-31T00:00:00Z"
verified_at: "2026-09-02T18:00:00Z"
status: live
---

## What it does

Prism Network is a GPU compute network where the price and the evidence are both public. The GPUs come from independent operators, billing is metered per second in USDG on Robinhood Chain, and a finished run leaves a settlement receipt anyone can read: seconds used, amount charged, amount refunded, and the outcome. The hosted MCP server at `https://prismnetwork.tech/api/mcp` needs no account and no key, and everything on it is read-only. It covers live capacity and starting rates, pinning a command and an image digest into an approval intent with a spend ceiling attached, reading a run's status and its gateway-signed execution evidence, running the verification checks over that evidence, and reading public receipts.

## Use it in Grok Bot

Add it as a custom connector and paste the prompt. Your Bot can then answer "which GPUs are free right now and what do they cost" from live data, turn a job description into a pinned command plus image digest with a cost ceiling, and check the signed evidence for a finished run before it reports a result. Funding stays with you: you approve the lease in the Prism web app, and the connector holds no key and can sign nothing. Because receipts are public, you can ask what a run actually cost and get the onchain figure instead of an estimate. One limit worth knowing before you start: this connector cannot rent a GPU on its own, so anything that spends money passes through you.
