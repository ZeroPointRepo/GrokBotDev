---
type: plugin
name: "CurlShot"
slug: curlshot
tagline: "Give your agent a screenshot API: any public URL as PNG, PDF or scrolling video."
category: data
subcategory: scraping
install_steps:
  - "Create a free CurlShot account at curlshot.com/register and copy your access key (100 screenshots a month, no card)."
  - "Skim the linked docs for the options you need: format, full page, device, viewport, dark mode, PDF or scrolling video."
  - "Paste the prompt below into your Grok Bot and give it your CurlShot access key so screenshots become a standing capability."
prompt: "You are setting up a CurlShot integration for me inside Grok Bot. First, read CurlShot's documentation at https://curlshot.com/docs, its OpenAPI description at https://curlshot.com/openapi.json and the AI agents guide at https://curlshot.com/docs/guides/ai-agents, so you understand how it works: one GET request to https://curlshot.com/api/v1/screenshot with a url parameter renders a public page in a real browser and returns it as PNG, JPEG, WebP, PDF or a scrolling video. The access key goes in the X-Access-Key header or as Authorization: Bearer, never in a link you show me. There is also a hosted MCP server at https://curlshot.com/api/mcp with a take_screenshot tool. Then use my CurlShot access key so that whenever I ask you to capture a page (screenshot this URL, grab the full page, show it on an iPhone, save it as a PDF) you build the correct CurlShot request and return the file. Rules: follow the documentation exactly, never invent an option or parameter CurlShot does not list, and if I ask for a capture it cannot do (for example a localhost or private-network address), tell me. Each capture counts against my monthly quota, so ask before batch jobs. Confirm the connection first with one small screenshot of a simple public page."
works_with: []
project_url: "https://curlshot.com"
repo_url: "https://github.com/SergiuPogor/curlshot-mcp"
author:
  handle: "curlshot"
  url: "https://curlshot.com"
  platform: web
pricing_note: "Free plan with 100 screenshots a month, no card; paid plans from $19/month."
setup_minutes: 5
added_at: "2026-10-16T17:30:00Z"
updated_at: "2026-10-16T17:30:00Z"
status: proposed
---

## What it does

CurlShot is a screenshot API. One HTTPS GET request renders a public web page in a real browser and returns it as a PNG, JPEG or WebP image, a PDF, or an MP4/WebM/GIF video of the page scrolling. It covers full-page captures, device presets (phones, tablets, desktop), custom viewports, dark mode, and waiting for a selector before it captures. It can also render HTML or Markdown you send it, which is how an agent can capture a page that is not public. Auth is a single access key, and the API answers browser requests (CORS).

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot and give it your CurlShot access key. The bot reads CurlShot's docs and OpenAPI description first, then you just ask it to screenshot a URL, grab a full-page or mobile view, or save a page as a PDF, and it returns the file. If your setup speaks MCP, point it at the hosted server at `https://curlshot.com/api/mcp` and use the `take_screenshot` tool instead of raw requests. The free plan gives 100 screenshots a month without a card, which is enough to try it on your own pages.
