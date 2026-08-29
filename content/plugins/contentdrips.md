---
type: plugin
name: "ContentDrips"
slug: contentdrips
tagline: "Let your agent design on-brand LinkedIn and Instagram carousels from chat."
category: marketing
subcategory: content
install_steps:
  - "Create a ContentDrips account at contentdrips.com, then open app.contentdrips.com → Settings → API Tokens and create a token."
  - "In Grok Bot, add the hosted MCP server at https://mcp.contentdrips.com/mcp with header Authorization: Bearer YOUR_API_KEY."
  - "Optionally copy the skill from github.com/CONTENTDRIPS/Contentdrips-MCP/tree/main/skills/contentdrips so the agent already knows Design Agent vs template fill."
  - "Paste the prompt below into your Grok Bot so ContentDrips becomes a standing design and publish capability."
prompt: "You are setting up a ContentDrips integration for me inside Grok Bot. First, read the ContentDrips MCP README at https://github.com/CONTENTDRIPS/Contentdrips-MCP and the skill at https://github.com/CONTENTDRIPS/Contentdrips-MCP/blob/main/skills/contentdrips/SKILL.md so you understand the hosted MCP at https://mcp.contentdrips.com/mcp (Authorization: Bearer my API token), the tools it actually exposes (workspaces, brand styles, AI Design Agent, AI carousel/graphic maker, posts, schedule, publish), and the rules: always fetch profile_id, ask which brand style if I have more than one, do not auto-export after Design Agent, and never publish without naming platforms. Then connect that MCP server with my API token from app.contentdrips.com → Settings → API Tokens. Whenever I give a topic, blog URL, YouTube URL, TikTok URL, or a template ID, design the carousel or graphic through ContentDrips and share the editor link. Rules: follow those docs exactly, never invent a tool, field, or endpoint, and if I ask for something the MCP does not list, say so. Confirm the connection first with a read-only call such as listing my workspaces. Scheduling or publishing is a public action — show me the caption, platforms, and time and get my explicit approval first, and only set linkedin_publish/instagram_publish for platforms I named."
works_with: []
project_url: "https://contentdrips.com"
repo_url: "https://github.com/CONTENTDRIPS/Contentdrips-MCP"
x_handle: "contentdrips"
founder:
  name: "Usama Khalid"
  x_handle: "im_usamakhalid"
author:
  handle: "CONTENTDRIPS"
  url: "https://github.com/CONTENTDRIPS"
  platform: github
pricing_note: "Requires a ContentDrips account and API token; AI jobs use workspace credits."
setup_minutes: 10
added_at: "2026-08-29T07:14:51Z"
updated_at: "2026-08-29T07:14:51Z"
status: proposed
---

## What it does

ContentDrips is a hosted MCP for designing LinkedIn and Instagram carousels and graphics from chat. Point Grok Bot at https://mcp.contentdrips.com/mcp with a Bearer API token. If you do not name a template, it runs the AI Design Agent on a blank canvas in a saved brand style and returns an editor link. If you name a template or paste a template ID, it keeps that layout and fills it from a topic, blog, YouTube URL, or TikTok URL. It can attach exports to a draft and schedule or publish only to LinkedIn and/or Instagram after you confirm the platforms.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it your ContentDrips API token plus the MCP URL. The bot reads the README and skill first, lists your workspaces, and asks which brand style to lock in if you have more than one. From then on you drive it in plain language — topic, blog, or video in, editor link out — and it follows the docs, never invents a tool, and does not publish until you name the platforms and say yes.
