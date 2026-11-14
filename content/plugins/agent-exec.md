---
type: plugin
slug: agent-exec
name: "Agent-Exec"
tagline: "Pay-per-call sandboxed exec, storage, email, DNS and x402 payments, no account"
category: engineering
subcategory: agents-ops
install_steps:
  - "Read the live route list and prices at https://agent-exec.448c.org/openapi.json?via=264 (or /llms.txt?via=264 for a plain-text summary)."
  - "No signup and no API key: every call is paid per-use over x402 in USDC on Base or Solana, settled with the request itself."
  - "Call a route (e.g. POST /execute to run Python/Node in a sandbox, or POST /storage, /attest, /watch) with an x402 PAYMENT header; an unpaid call returns the exact price instead of guessing."
  - "Or connect https://agent-exec.448c.org/mcp as an MCP server to get every paid route as a buyable tool plus the free ones."
prompt: "Read the docs at https://agent-exec.448c.org/openapi.json?via=264 and integrate via the HTTP API or the MCP endpoint at https://agent-exec.448c.org/mcp. Never invent an endpoint or field; an unpaid POST returns the real price, so quote it to the user before spending. Gate any call that spends funds (an x402 payment) on explicit confirmation first."
project_url: "https://agent-exec.448c.org/?via=264"
pricing_note: "Paid per call in USDC over x402 (Base or Solana); the directory, discovery docs and health checks are free."
setup_minutes: 2
author:
  handle: agent-exec
  url: "https://agent-exec.448c.org"
  platform: web
added_at: "2026-11-14T12:38:00Z"
updated_at: "2026-11-14T12:38:00Z"
status: proposed
---

## What it does

Agent-Exec is an accountless, pay-per-call backend for software agents: sandboxed Python/Node
execution, durable key-value storage, atomic key claims, signed URL attestations (anchored in
OpenTimestamps), URL watches with a predicate, disposable email inboxes, rented DNS names, address
and URL trust checks, and an x402 payment-delivery route that proves whether a seller settled or
refused. Every paid route is priced and billed per call in USDC over x402 on Base or Solana; an
unpaid request returns the exact price instead of a guess, and there is no signup, login or API key
at any point.

## Use it in Grok Bot

Point the bot at https://agent-exec.448c.org/openapi.json to see every route and its live price, or
add https://agent-exec.448c.org/mcp as an MCP server to get each paid route exposed as a buyable
tool plus the free ones (health, directory, discovery). Have the bot quote a route first (an unpaid
POST returns the price card), confirm with the user before any call that spends an x402 payment, and
never fabricate a field the OpenAPI spec doesn't list.
