---
type: plugin
name: "Astria"
slug: astria
tagline: "Create product photos, virtual try-on images, headshots and videos through hosted MCP."
category: marketing
subcategory: content
install_steps:
  - "Create or sign in to your Astria account at https://www.astria.ai. Generation and training use Astria credits."
  - "Paste the setup prompt below into Grok Bot. It links the maintained Astria skills and remote MCP connection documentation."
  - "Connect https://mcp.astria.ai/mcp through your host's supported remote MCP setup and complete Astria's browser sign-in and consent."
  - "Ask the bot to identify the connected account and list available models without generating anything."
  - "Request a product photo, virtual try-on, headshot or video with an explicit shot count, then retrieve the completed media."
prompt: >-
  Set up Astria for me. First read the maintained documentation at
  https://github.com/astriaai/skills and the operating skill at
  https://github.com/astriaai/skills/blob/main/astria-api/SKILL.md.
  Connect the hosted streamable-HTTP MCP server at https://mcp.astria.ai/mcp
  through this host's supported MCP connection workflow. Use Astria's OAuth
  browser sign-in and consent; do not ask me to paste an API key into chat.
  If this Grok Bot environment cannot add a remote MCP server, explain the
  missing host capability instead of claiming it is connected. Discover the
  real tool names and schemas; never invent an endpoint, field, model or
  attachment URL. Keep setup read-only: identify my connected account and
  list available image and video models without submitting generation or
  training. When I explicitly authorize a photoshoot, edit, headshot or
  video, use only the approved references, count and scope. Explain that
  generation and training use Astria credits. Each distinct write needs a
  fresh idempotency key; preserve the same key and identical arguments for
  retries, and inspect existing prompts if a submission outcome is uncertain.
  Input media must have an actual HTTPS URL accessible to Astria. Retrieve
  the submitted prompt until completed media is available and return its
  actual image or video URLs. Never claim queued work is finished, and do
  not publish or send the media to another service without my authorization.
works_with: []
project_url: "https://www.astria.ai"
repo_url: "https://github.com/astriaai/skills"
source_url: "https://github.com/astriaai/skills/blob/main/astria-api/SKILL.md"
author:
  handle: "astriaai"
  url: "https://github.com/astriaai"
  platform: github
pricing_note: "Generation and reference training use Astria credits; inspecting existing prompts does not submit another generation."
added_at: "2026-10-11T17:14:01Z"
updated_at: "2026-10-11T17:14:01Z"
status: proposed
---

## What it does

Astria exposes image and video generation, image editing, reusable person and
product references, and photoshoot templates through a hosted MCP server.
Its maintained skills cover product photography, virtual try-on, professional
headshots from supplied photos, and fashion lookbooks. The bot can discover
current models, reuse the chosen references across scenes, submit an authorized
generation, and retrieve the finished assets.

## Use it in Grok Bot

Paste the setup prompt into your bot. It reads Astria's maintained documentation
and connects the remote MCP server using OAuth when the host supports remote
MCP configuration. Complete sign-in and consent in the host's browser flow.
An Astria listing in the Grok Bot marketplace is not assumed; if your host does
not expose remote MCP setup, the bot should report that requirement.

Start with a read-only request: "Using Astria, identify my account and list the
available image and video models. Do not generate anything." Then request a
specific result, such as one product shot or two portraits from supplied photos.
The bot preserves your requested count and references, uses submission keys to
avoid duplicate paid actions, and checks the returned prompt for completed
media. Inputs need accessible HTTPS URLs; a local file path or attachment ID
is not automatically usable by Astria.

The setup prompt does not authorize a generation. Generation and training use
your Astria credits after you authorize the task. Returned media URLs work
without an embedded gallery; interactive previews depend on host support.
This directory entry documents the maintained MCP integration and does not
claim an approved official Grok Bot marketplace listing.
