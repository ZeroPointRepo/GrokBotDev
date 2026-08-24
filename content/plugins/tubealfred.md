---
type: plugin
name: "TubeAlfred"
slug: tubealfred
tagline: "Give your Grok Bot read-only access to any public YouTube video, channel, or playlist."
category: data
subcategory: youtube
install_steps:
  - "Connect the TubeAlfred MCP server at https://mcp.tubealfred.com — no account or API key needed."
  - "Tell your Grok Bot to use TubeAlfred whenever you share a YouTube link or ask about a video, channel, or playlist."
  - "Paste the prompt below so this becomes a standing capability."
prompt: "You have access to TubeAlfred, an MCP server for public YouTube data — no API key needed. Whenever I share a YouTube URL or ask about a video, channel, playlist, or search term, use TubeAlfred's tools: youtube_url_resolve to identify what a link points to, then the matching tool for video/channel/playlist details, comments, transcripts, or search. Never invent metadata, view counts, or transcript text that a tool call didn't actually return — if a tool errors or a resource is private, tell me instead of guessing. Confirm the connection first by resolving one YouTube URL I give you."
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

TubeAlfred gives AI agents read-only access to public YouTube data — videos, channels, playlists, comments, transcripts, search, and trending — through a hosted MCP server, no API key required.

## Use it in Grok Bot

Connect the MCP server and paste the prompt. From then on your bot can resolve any YouTube URL, pull video/channel/playlist metadata, fetch transcripts, read comments, and search or browse trending content directly in chat.
