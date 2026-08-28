---
type: plugin
name: "AITuber"
slug: aituber
tagline: "Give your agent a video studio: script, voice-over, captions and publishing."
category: marketing
subcategory: content
install_steps:
  - "Create an AITuber account at aituber.app. New accounts start with free credits, so you can make a video before you pay for anything."
  - "Connect the hosted MCP server at https://mcp.aituber.app. Interactive clients sign in through the browser; headless clients send an API key as a Bearer token."
  - "In the dashboard, connect the YouTube, TikTok, Instagram or X accounts you want the agent to post to."
  - "Paste the prompt below into your Grok Bot so making and publishing videos becomes a standing capability."
prompt: "You are setting up an AITuber integration for me inside Grok Bot. First, read AITuber's documentation at https://aituber.app/mcp and https://aituber.app/api so you understand its hosted MCP server at https://mcp.aituber.app (browser sign-in for interactive clients, or an API key sent as a Bearer token for headless ones) and what it actually exposes: topic ideas for a niche, script writing, video generation in several styles (AI images with camera motion, narration and word-synced captions; AI video clips; real stock footage matched to the narration; the skeleton template; and consistent AI characters for a series), a library of over 1,300 voices, caption and image styles, standalone AI clips, talking avatar videos, MP4 export, my plan and credit balance, and publishing to the channels I have connected. Then connect to my account so that when I describe a video, you choose the style, voice and captions that fit it, generate it, and wait for it to finish before showing me the result. Rules: follow the documentation exactly and never invent an endpoint, a video style, a voice or a parameter that AITuber does not list; if I ask for something it cannot do, say so instead of guessing. Generating spends credits and publishing is public, so read my credit balance and tell me what a job will cost before you start it, and never export or publish anything until I have seen it and said yes. Confirm the connection first by reading my plan and credit balance."
works_with: ["X"]
project_url: "https://aituber.app"
founder:
  name: "Dhiva Logu"
  x_handle: "imdhiva"
author:
  handle: "aituber"
  url: "https://aituber.app"
  platform: web
pricing_note: "Free credits at signup, then credit-based plans."
setup_minutes: 10
added_at: "2026-08-28T00:00:00Z"
updated_at: "2026-08-28T00:00:00Z"
status: proposed
---

## What it does

AITuber turns a script, or just a rough idea, into a finished short video: an AI voice-over, visuals that match what is being said, and captions that stay in sync with the words. The agent picks the style that fits the brief, from AI images with camera motion, to AI video clips, to real stock footage matched against the narration, to templates that hold one look across a whole series. It can also find topic ideas for a niche, write the script, generate a standalone clip, build a talking avatar ad, export an MP4, and post the finished video to a connected YouTube, TikTok, Instagram or X account.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and connect it to the hosted MCP server at mcp.aituber.app. The bot reads AITuber's own documentation first, so it wires itself up against the real tools instead of guessing at them. After that you work in plain language: say what the video should be about and it chooses the style, voice and caption treatment, generates it, and brings the result back to you. Generating spends credits and publishing is public, so the prompt makes the bot read your balance and quote the cost before it starts, and hold every export and post until you have approved it.
