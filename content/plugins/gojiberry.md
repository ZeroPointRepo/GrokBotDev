---
type: plugin
name: "Gojiberry AI"
slug: gojiberry
tagline: "Find warm B2B leads, manage outreach campaigns, and work your inbox from the agent"
category: sales
subcategory: prospecting
install_steps:
  - "Create a Gojiberry account at https://app.gojiberry.ai (7-day free trial)."
  - "In the app, go to Settings → API → \"Create API Key\" and copy the key — it is shown only once."
  - "Add an MCP server to your bot: URL https://mcp.gojiberry.ai/mcp (Streamable HTTP) with header Authorization: Bearer YOUR_API_KEY."
  - "Reload your client. The gojiberry tools appear; read-only tools carry MCP annotations so clients can auto-approve them and always prompt on writes."
prompt: "Connect to the Gojiberry MCP server at https://mcp.gojiberry.ai/mcp, authenticating with the Authorization: Bearer header and my Gojiberry API key. Before using any tool, read the integration guide at https://github.com/DydjyZ/Gojiberry-mcp/blob/main/docs/user-guide.md and only call tools the server actually exposes — never invent an endpoint, field, or filter. Use the read-only tools (list_contacts, get_contact, list_campaigns, get_campaign, list_lists, get_intent_type_counts, list_unibox_threads, get_unibox_thread_messages, list_agents, get_agent_logs) freely to answer my questions about contacts, campaigns, lists, lead-finding agents, and my inbox. For anything that writes, spends, or sends — create_contact, update_contact, update_campaign, create_list, add_contacts_to_list, remove_contacts_from_list, enrich_contact_email (consumes 1 credit on success), and especially send_unibox_linkedin_message — show me exactly what you are about to do and wait for my explicit confirmation first."
works_with: []
project_url: "https://gojiberry.ai"
repo_url: "https://github.com/DydjyZ/Gojiberry-mcp"
x_handle: "gojiberryai"
founder:
  name: "Romàn Czerny"
  x_handle: "romanbuildsaas"
author:
  handle: "gojiberry"
  url: "https://gojiberry.ai"
  platform: web
pricing_note: "7-day free trial, then from $99/mo. Email enrichment consumes credits."
setup_minutes: 5
added_at: "2026-08-22T00:00:00Z"
updated_at: "2026-09-02T18:00:00Z"
featured: true
sponsor: false
verified_at: "2026-09-02T18:00:00Z"
status: live
---

## What it does

Gojiberry AI is a signal-based B2B prospecting platform: it watches LinkedIn for buying signals (funding rounds, job changes, competitor engagement), scores prospects against your ideal customer profile, and runs personalized multichannel outreach. This plugin connects your bot to your Gojiberry account over MCP (Streamable HTTP, open-source server under MIT) and exposes ~25 tools: search and filter contacts with pagination, create and update them, browse campaigns and their steps, manage lists (adding contacts to a list enrolls them in the linked campaign), inspect lead-finding Agents and their run logs, pull contact counts by intent type, read your unified inbox, and — always behind an explicit prompt — send a LinkedIn reply in an existing thread. Every tool carries a title plus explicit `readOnlyHint`/`destructiveHint` MCP annotations, so clients can auto-approve reads and must confirm writes.

## Use it in Grok Bot

Ask in plain language: "show me contacts created this week with a score above 2", "how many contacts do I have per intent type?", "get campaign #5 and its steps", "add these ten contacts to my SaaS-founders list", or "summarize my unread inbox threads and draft replies". The bot reads live data from your account and only mutates anything after showing you the exact change it intends to make. Auth is a single API key from app.gojiberry.ai → Settings → API passed as a Bearer header; each conversation gets an isolated session and the server stores no data. Setup is the four steps above — about five minutes.
