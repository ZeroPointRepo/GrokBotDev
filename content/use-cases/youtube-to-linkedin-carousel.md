---
type: use-case
slug: youtube-to-linkedin-carousel
headline: "Turn a YouTube video into a LinkedIn carousel"
summary: "Hand Grok Bot a YouTube URL. After ContentDrips MCP is connected, it fills a carousel from the video, applies your saved brand style or a named template, and returns an editor link. It drafts a caption and only schedules or publishes to LinkedIn after you confirm."
categories: [marketing]
format: use-case
author:
  handle: CONTENTDRIPS
  url: https://github.com/CONTENTDRIPS/Contentdrips-MCP
  platform: github
prompt_provenance: curator
replicability: "The prompt is reconstructed from the public ContentDrips MCP README and skill. Connect https://mcp.contentdrips.com/mcp with a token from app.contentdrips.com → Settings → API Tokens, paste the prompt, then send a YouTube URL. Publishing stays opt-in."
added_at: "2026-08-29T07:14:51Z"
updated_at: "2026-08-29T07:14:51Z"
status: proposed
---

## How it's set up

This is the ContentDrips MCP path for turning a video into slides instead of asking the bot to screenshot YouTube by hand.

1. Create a ContentDrips account, then generate an API token at app.contentdrips.com → Settings → API Tokens.
2. In Grok Bot, add the hosted MCP server at https://mcp.contentdrips.com/mcp with header Authorization: Bearer YOUR_API_KEY. Optionally install the skill from github.com/CONTENTDRIPS/Contentdrips-MCP/tree/main/skills/contentdrips.
3. Paste the prompt below. On first run the bot lists workspaces (`get_profiles`) and saved brand styles (`get_brand_styles`) and asks which to use if you have more than one.
4. Send a YouTube URL. If you named a template or pasted a template ID, it keeps that layout and fills it from the video. If you did not, it uses the AI Design Agent, then shares the Open in editor link without exporting.
5. Review the editor link and caption. Schedule or publish to LinkedIn only after you confirm. If LinkedIn is not connected, it sends you to app.contentdrips.com/social-accounts instead of posting to Instagram as a substitute.

## Prompt

```text
You are my carousel bot. Set up ContentDrips MCP first: read https://github.com/CONTENTDRIPS/Contentdrips-MCP and the skill at https://github.com/CONTENTDRIPS/Contentdrips-MCP/blob/main/skills/contentdrips/SKILL.md, then connect https://mcp.contentdrips.com/mcp with Authorization: Bearer my API token from app.contentdrips.com → Settings → API Tokens. Confirm the connection by listing my workspaces. Ask which workspace and which saved brand style to use if I have more than one. Never invent a tool or field.

Whenever I send a YouTube URL:
1. If I named a template or pasted a template ID, keep that layout and fill it from the video (get_template_structure, then generate_ai_carousel with method youtube).
2. If I did not name a template, use the AI Design Agent on a new blank, apply the chosen brand style, and share the Open in editor link. Do not export yet.
3. Draft a LinkedIn caption in my voice from the actual video topic. Show me the editor link, caption, and proposed time.
4. Schedule or publish only after I confirm, and only to LinkedIn (linkedin_publish true, instagram_publish false). If LinkedIn is not connected, send me to https://app.contentdrips.com/social-accounts. Never auto-publish.
```

## Why it's cool

A YouTube video is already a structured argument — chapters, quotes, a takeaway — and that is exactly what a LinkedIn carousel needs. The bot does not scrape a screenshot of the player; it sends the URL through ContentDrips so the slides pick up your saved type, color, and spacing, then stops at an editor link so you can still kill a bad slide before anyone sees it. The publish gate is the point: LinkedIn only, and only after you say yes.
