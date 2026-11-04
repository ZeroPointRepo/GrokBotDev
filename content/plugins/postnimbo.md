---
type: plugin
name: "PostNimbo"
slug: postnimbo
tagline: "Schedule posts, answer the inbox and run chat automations on 30+ channels from Grok Bot."
category: marketing
subcategory: social
install_steps:
  - "Sign in at postnimbo.com and connect the channels you want the bot to work with (early access: join the waitlist at postnimbo.com/#waitlist if you have no login yet)."
  - "Open Settings → MCP connector and copy the Connector URL (it is https://postnimbo.com/api/mcp-oauth-dynamic for the hosted service)."
  - "In Grok Bot send: Add a custom MCP server called PostNimbo at https://postnimbo.com/api/mcp-oauth-dynamic — confirm with Add it, then click Authorize on the card and approve access to your workspace. No API key to paste: it signs in with OAuth."
  - "Type @PostNimbo in a chat to attach it, then paste the prompt below so publishing and inbox work become a standing capability."
prompt: "You are setting up PostNimbo for me inside Grok Bot. PostNimbo is a social media and chat tool: it schedules posts to 30+ channels (Facebook, Instagram, Threads, X, LinkedIn profiles and pages, TikTok, YouTube, Pinterest, Bluesky, Mastodon, Discord, Telegram, Tumblr, Reddit, Google Business and more), runs a shared inbox for comments and direct messages, and runs chat automations (flows). First read the help pages at https://postnimbo.com/help/settings/mcp-connector/ and https://postnimbo.com/help/publishing/ai-agents/ so you know what the connector can do, then connect to my workspace through the PostNimbo MCP server at https://postnimbo.com/api/mcp-oauth-dynamic (OAuth sign-in, no key). Use only the tools the server lists: list channels and brands, list, schedule, edit and delete posts, best times to post, hashtag groups, variables, templates, ideas, upload media, generate images and videos, list and reply to inbox conversations, list and decide approvals, and list, validate, create and update automation flows. Rules: never invent a tool, channel, field or setting that PostNimbo does not list; each channel's settings and limits come from the post settings tool, so check them before composing; a post that is scheduled or published, an inbox reply, an approval decision or a flow change is an action you show me first — the exact text, the channels, the time, the person you reply to — and you do it only after I confirm. If PostNimbo cannot do what I ask, say so instead of guessing. Confirm the connection first by listing my connected channels."
works_with: ["X", "Telegram", "Discord", "WhatsApp"]
project_url: "https://postnimbo.com"
source_url: "https://postnimbo.com/help/settings/mcp-connector/"
x_handle: "postnimbo"
author:
  handle: "tares003"
  url: "https://github.com/tares003"
  platform: github
pricing_note: "Early access by invitation; the MCP connector is included on every plan."
setup_minutes: 5
added_at: "2026-11-04T00:00:00Z"
updated_at: "2026-11-04T00:00:00Z"
status: proposed
---

## What it does

PostNimbo is a social media and messaging tool built for small businesses and agencies, in English and Arabic. One composer schedules to 30+ channels: Facebook Pages, Instagram, Threads, X, LinkedIn profiles and company pages, TikTok, YouTube, Pinterest, Bluesky, Mastodon, Discord, Telegram, Tumblr, Reddit, Google Business Profile, WordPress, Medium, Dev.to, Hashnode and more, with a calendar, approvals, team roles, brands (one workspace, several clients), a media library and per-channel analytics with best-times-to-post. The same workspace runs a shared inbox for comments and direct messages across Facebook, Instagram, WhatsApp, Telegram, TikTok and Google reviews, and chat automations (flows) that reply to comments, send private replies, qualify leads, book appointments and take payments.

Everything an agent needs is on the hosted MCP server: posts (list, schedule, edit, delete, per-channel settings), channels and brands, hashtag groups, variables and templates, ideas, media upload and AI image and video generation, best times, approvals, the inbox (list, reply), and automation flows (list, templates, validate, create, update). Access is OAuth 2.1 with dynamic client registration, so Grok Bot signs in with your PostNimbo login and acts with your own role: if approvals are on and you are not an approver, what it schedules waits for review instead of going straight out.

## Use it in Grok Bot

Add the server with one chat message ("Add a custom MCP server called PostNimbo at https://postnimbo.com/api/mcp-oauth-dynamic"), authorize once, and attach it with @PostNimbo. From then on you drive the whole posting day in plain language: "draft this for LinkedIn and Instagram, pick the best time on Thursday, show me before it goes", "what is waiting for approval?", "reply to the three newest Instagram comments that ask about opening hours", or "make a flow that answers price questions on WhatsApp and books a visit".

The prompt on this page makes the bot read PostNimbo's own help pages first, use only the tools the server lists, check each channel's real limits through the post settings tool, and show you the exact text, channels, time or recipient before anything is scheduled, replied to, approved or changed. An undo window on "Post now" and the workspace's approval rules still apply to what the bot does, the same as to a human member.
