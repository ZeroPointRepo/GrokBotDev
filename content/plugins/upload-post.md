---
type: plugin
name: "Upload-Post"
slug: upload-post
tagline: "Let your agent publish, schedule and analyze posts on 11 social networks."
category: marketing
subcategory: social
install_steps:
  - "Create a free Upload-Post account at app.upload-post.com (no credit card) and connect the social accounts you want the bot to post to."
  - "Open API Keys in the Upload-Post dashboard and generate a key — the free plan (10 uploads/month, no TikTok) is enough to try it."
  - "Point your bot at the hosted MCP server https://mcp.upload-post.com/mcp with header 'Authorization: ApiKey <your key>', or connect over OAuth; the REST API is documented at docs.upload-post.com."
  - "Paste the prompt below into your Grok Bot so publishing, scheduling and analytics become a standing capability."
prompt: "You are setting up an Upload-Post integration for me inside Grok Bot. First, read the Upload-Post MCP guide at https://docs.upload-post.com/guides/mcp-server-integration/ and the API reference at https://docs.upload-post.com so you understand how it actually works — authentication with my Upload-Post API key (sent as 'Authorization: ApiKey <key>') or OAuth, and the operations it exposes: listing my profiles and connected accounts, uploading videos, photos and text posts, scheduling with a date or the posting queue, checking upload status, and reading analytics, comments and DMs. Then connect to my Upload-Post account through the hosted MCP server at https://mcp.upload-post.com/mcp (or the REST API) so that whenever I ask you to post, cross-post or schedule to my social accounts, you do it through Upload-Post. Rules: follow the documentation exactly and never invent a tool, endpoint, parameter or platform that Upload-Post does not list; per-platform requirements are real constraints, so check them before composing (TikTok and YouTube need video, YouTube and Pinterest need a title, every network has its own caption limit). If I ask for something Upload-Post cannot do, tell me instead of guessing. Confirm the connection first with a read-only call such as listing my profiles, and always show me the exact caption, media, target accounts and scheduled time before anything is published."
works_with: ["X"]
project_url: "https://www.upload-post.com"
repo_url: "https://github.com/Upload-Post/upload-post-mcp"
source_url: "https://docs.upload-post.com/guides/mcp-server-integration/"
x_handle: "uploadpost"
author:
  handle: "Upload-Post"
  url: "https://www.upload-post.com"
  platform: web
pricing_note: "Free plan with 10 uploads/month, no credit card; paid plans from $16/mo billed annually."
setup_minutes: 5
added_at: "2026-09-27T00:00:00Z"
updated_at: "2026-09-27T00:00:00Z"
status: proposed
---

## What it does

Upload-Post is a social media publishing API built so an agent can drive it end to end. One API key publishes videos, photos and text posts to TikTok, Instagram, YouTube, LinkedIn, Facebook, X, Threads, Pinterest, Reddit, Bluesky and Google Business Profile, with scheduling by exact date or through a posting queue.

The hosted MCP server at `mcp.upload-post.com/mcp` exposes 40+ tools covering uploads, upload status, scheduling and the queue, analytics, profiles, Facebook pages and Pinterest boards, comments, DMs, media staging and FFmpeg video processing. It accepts an API key in the Authorization header or a standard OAuth 2.1 flow, stores nothing between sessions, and the open-source server lives on GitHub. A free plan with no credit card lets a bot be wired up and tested before paying.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it an Upload-Post API key. The bot reads the MCP guide and API reference first, connects through the hosted MCP server, and from then on you run your posting in plain language — "cut this clip for TikTok, Reels and Shorts, schedule it for Thursday 18:00 and show me the captions first."

It follows the documented tools rather than guessing, checks each network's rules before composing, confirms the connection by listing your profiles, and shows you the exact caption, media, accounts and time before anything goes out. After publishing it can pull analytics and new comments back so you can review performance or reply without leaving the chat.
