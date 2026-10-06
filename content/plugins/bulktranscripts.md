---
type: plugin
name: "BulkTranscripts"
slug: bulktranscripts
tagline: "Let your Grok Bot read whole YouTube channels and playlists as transcripts."
category: data
subcategory: scraping
install_steps:
  - "In Grok, open Connectors, choose New Connector, then Custom, and paste https://bulktranscripts.co/mcp as the server URL."
  - "Sign in with Google on the authorization page that opens. New accounts start with 30 free credits."
  - "Paste the prompt below so reading YouTube becomes a standing capability."
prompt: "Read the BulkTranscripts docs at https://bulktranscripts.co/docs, then use the BulkTranscripts MCP connector for anything involving YouTube. When I share a video link, fetch its transcript with get_transcript before answering, and answer only from what the transcript says. For a channel or playlist, list the videos first, tell me how many there are, and ask before starting start_bulk_extract, because each new transcript uses one credit. Use get_latest_videos to check for new uploads; it is free. Never invent a tool, field, video, quote, or transcript text that a tool call did not return. If a video has no captions or a call fails, say so instead of guessing. Confirm the connection first by fetching the transcript of one video I give you."
works_with: []
project_url: "https://bulktranscripts.co"
repo_url: "https://github.com/pratie/bulktranscripts-mcp"
source_url: "https://bulktranscripts.co/integrations/grok-bot-youtube-transcripts"
author:
  handle: "pratie"
  url: "https://github.com/pratie"
  platform: github
pricing_note: "30 free credits; one-time credit packs from $4.99, no subscription."
setup_minutes: 2
added_at: "2026-10-06T00:00:00Z"
updated_at: "2026-10-06T00:00:00Z"
status: proposed
---

## What it does

BulkTranscripts is a hosted MCP server that turns YouTube into text an agent can read. It fetches the transcript of a single video, batches up to 20 videos in one call, and extracts a whole channel or playlist (up to 1,000 videos) as a background job the bot can poll. It can also search YouTube, search inside one channel, list a channel's or playlist's videos in order, and check a channel's newest uploads for free. Transcripts the account has already fetched are returned again at no cost.

## Use it in Grok Bot

Add the connector once and paste the prompt. From then on your bot reads the actual transcript instead of guessing from a video's title. Good fits: "summarise what this creator said about pricing across their last 50 videos", turning a lecture playlist into study notes in course order, or a routine that checks a few channels each morning and briefs you only on new uploads. The prompt makes the bot ask before any large bulk job, so it never spends credits on a whole channel without your go-ahead.
