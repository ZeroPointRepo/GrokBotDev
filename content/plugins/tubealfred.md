---
type: plugin
name: "TubeAlfred"
slug: tubealfred
tagline: "Give your Grok Bot read-only access to any public YouTube video, channel, or playlist."
category: data
subcategory: enrichment
install_steps:
  - "Create a TubeAlfred API key at https://tubealfred.com/app/api-keys."
  - "Connect the TubeAlfred MCP server and give your Grok Bot the key."
  - "Paste the prompt below so this becomes a standing capability."
prompt: "Read TubeAlfred's docs at https://tubealfred.com/docs, then integrate via its MCP server using my TubeAlfred API key. Whenever I share a YouTube URL or ask about a video, channel, playlist, or search term, resolve it first, then call the matching tool for details, transcript, comments, or search. Never invent an endpoint, field, metadata, view count, or transcript text that a tool call didn't actually return — if a tool errors or a resource is private, tell me instead of guessing. Confirm the connection first by resolving one YouTube URL I give you."
works_with: []
project_url: "https://tubealfred.com"
x_handle: "TubeAlfred"
founder:
  x_handle: "rakesh_rry"
author:
  handle: "tubealfred"
  url: "https://tubealfred.com"
  platform: web
pricing_note: "Free tier; paid plans available."
setup_minutes: 5
added_at: "2026-08-24T00:00:00Z"
updated_at: "2026-08-24T00:00:00Z"
status: proposed
---

## What it does

TubeAlfred is a YouTube API and hosted MCP server covering video, channel, transcript, comment, reply, playlist, community, search, hashtag, and trending endpoints — 35 REST endpoints and 34 MCP tools total.

## Use it in Grok Bot

Connect the MCP server with an API key and paste the prompt. Your bot reads TubeAlfred's docs first, confirms the connection, then from then on can resolve any YouTube URL, pull video/channel/playlist metadata, fetch transcripts, read comments, and search or browse trending content directly in chat.
