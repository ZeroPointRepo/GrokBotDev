---
type: plugin
name: "RawTree"
slug: rawtree
tagline: "Give your Grok Bot a schema-free analytics database it can write events to and query."
category: data
subcategory: dashboards
install_steps:
  - "Request access to the RawTree private beta at rawtree.com, then sign in. RawTree is a schema-free OLAP database for agents: you send JSON events and tables are created on the first insert."
  - "In your Grok Bot's connector / MCP settings, add a custom connector pointing at https://mcp.rawtree.com/mcp (Streamable HTTP). A browser opens for OAuth 2.0 sign-in (PKCE); there is no API key to paste, and access is revocable."
  - "For a headless bot that cannot open a browser, create a RawTree API key and send it as a Bearer token. Keep it in your connector's secret field, never in the prompt. See the MCP reference at rawtree.com/docs/reference/mcp."
  - "Paste the prompt below so querying and analysing your event data becomes a standing capability you can drive in plain language."
prompt: "You are setting up a RawTree integration inside Grok Bot. RawTree is a schema-free OLAP/analytics database for agents: data goes in as JSON events, tables are created on the first insert, and reads are read-only SQL. First read the official MCP reference at https://rawtree.com/docs/reference/mcp. Connect to RawTree's hosted MCP server at https://mcp.rawtree.com/mcp (Streamable HTTP; a browser opens for OAuth 2.0 sign-in, no API key to paste). Use only the tools the server actually reports, and never invent a tool name, table, column, or parameter. Start by calling list-organizations, list-clusters and list-databases so you know exactly where my data lives, and tell me what you found. My sign-in covers every organization I belong to, so if there is more than one organization or cluster, ask me which organization and cluster to use before running anything. Clusters can be paused (scaled to zero); resuming one needs my explicit approval. The database argument on table and query tools is optional; if you are unsure which database applies, call list-databases and ask me. Prefer read-only tools: run-query, list-tables, describe-table and list-logs. If list-logs output contains other users' emails or query text, do not repeat them back to me or copy them anywhere; summarise without them. Before writing a query, call describe-table so you use real column names, and keep queries narrow (add LIMIT and time filters). Rules: ALWAYS stop and get my explicit approval, showing the exact target (organization, cluster, database, table) and the exact payload or change, before you do any of these: insert events, create or delete a table or database, pause, resume or create a cluster, change organization members, install or uninstall an app, or create or delete an API key. Never print, log, or store an API key anywhere, and never put one in a prompt, query, or event. If a tool is missing or fails, say so instead of guessing. Confirm the connection by listing my organizations, clusters and databases, then the tables in one database."
works_with: []
project_url: https://rawtree.com
repo_url: https://github.com/rawtreedb/rawtree-mcp
x_handle: rawtreedb
author:
  handle: gnzjgo
  url: https://github.com/gnzjgo
  platform: github
source_url: https://rawtree.com/docs/reference/mcp
featured: false
sponsor: false
added_at: "2026-10-02T00:00:00Z"
updated_at: "2026-10-02T00:00:00Z"
status: proposed
---

## What it does

RawTree is a schema-free OLAP/analytics database built for agents. You send it JSON events, a table is created automatically on the first insert, and you read the data back with read-only SQL. Its MCP server exposes that to an agent as tools: list organizations, clusters, databases and tables, describe a table, run a query, and read logs, plus write and admin operations such as inserting events or managing clusters, members, apps and API keys. The MCP server is open source (MIT) at github.com/rawtreedb/rawtree-mcp. The author is affiliated with RawTree.

## Use it in Grok Bot

Add a custom MCP connector in your Bot pointing at `https://mcp.rawtree.com/mcp` (Streamable HTTP, OAuth sign-in, no API key to paste), then paste the prompt on this page. The OAuth grant covers every organization the signed-in user belongs to, so the Bot should confirm which organization and cluster to use before it reads or writes anything. Your Bot can then explore your databases, describe tables and answer questions about your events with read-only SQL. For a headless setup, an API key can be sent as a Bearer token. For clients that cannot use a hosted server, run `npx -y @rawtree/mcp` locally with `RAWTREE_API_KEY` set (Node 22+). Access is currently a private beta, so request it at rawtree.com first. The prompt keeps the Bot read-only by default and makes it show you the exact target and payload and wait for your approval before it inserts data, creates or deletes tables or databases, changes clusters or members, or touches apps and API keys.
