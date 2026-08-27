---
type: plugin
name: "Pallyy"
slug: pallyy
tagline: "Let your agent draft, schedule, and publish social posts through Pallyy's REST API."
category: marketing
subcategory: social
install_steps:
  - "Create a Pallyy account at pallyy.com and connect the social profiles you want your agent to post to."
  - "On any paid plan (every plan has a 14-day trial), generate an API key at app.pallyy.com/settings/api-keys with the scopes you need: Edit posts, Publish posts, and Upload media."
  - "Paste the prompt below into your Grok Bot and give it your Pallyy API key so this becomes a standing capability."
prompt: "You are setting up a Pallyy integration for me inside Grok Bot. First, read Pallyy's API documentation at https://pallyy.com/docs/api so you understand how it works: bearer auth with an API key from Settings > API keys, base URL https://app.pallyy.com/api/v1, and endpoints for listing social sets (groups of connected profiles), creating and updating post sets (drafts and scheduled posts with per-network captions), listing media, and uploading media by URL. Then, whenever I ask you to draft or schedule posts across my connected profiles, use the Pallyy API to do it: pick the right social set, write the captions I ask for, and schedule at the time I give you. Rules: follow the documentation exactly and never invent an endpoint, field, or parameter Pallyy does not document; respect the 5 requests per second rate limit and back off when you get a 429; and if I ask for something the API cannot do (like analytics), tell me instead of guessing. Always show me the exact post text, profiles, and time before anything is scheduled or published, and confirm the connection first by listing my social sets."
works_with: ["X"]
project_url: "https://pallyy.com"
source_url: "https://pallyy.com/docs/api"
x_handle: "pallyysocial"
founder:
  name: "Tim"
  x_handle: "Timb03"
author:
  handle: "pallyysocial"
  url: "https://pallyy.com"
  platform: web
pricing_note: "Free plan available; the API is included on every paid plan, each with a 14-day trial."
setup_minutes: 5
added_at: "2026-08-27T00:00:00Z"
updated_at: "2026-08-27T00:00:00Z"
status: proposed
---

## What it does

Pallyy is a social media scheduling platform with a public REST API built for exactly this kind of agent work. An agent with a scoped API key can list your connected social profiles (organized into social sets), create and update post sets as drafts or scheduled posts with per-network captions, upload media by URL, and read back publishing results including the live permalink for each published post. Keys are read-only until you grant write scopes, can be restricted to a single social set, and every post an agent creates shows the key's name in the post history, so you can always see what your bot did.

## Use it in Grok Bot

Generate an API key in Pallyy under Settings > API keys, grant it only the scopes your bot needs (drafting works with Edit posts alone; add Publish posts when you trust it to schedule), and paste the prompt on this page into your Grok Bot with the key. The bot reads Pallyy's API docs first, then drives your scheduling in plain language, and it confirms the exact post, profiles, and time with you before anything goes out.
