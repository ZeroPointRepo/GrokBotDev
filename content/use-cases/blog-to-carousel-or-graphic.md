---
type: use-case
slug: blog-to-carousel-or-graphic
headline: "Turn a blog post into a carousel or a graphic"
summary: "Paste a blog URL into Grok Bot. ContentDrips MCP keeps your template layout if you named one, or runs Design Agent if you did not, then returns an editor link for a carousel or a single graphic. Captions stay in your voice; publish is LinkedIn or Instagram only after you confirm."
categories: [marketing]
format: use-case
author:
  handle: CONTENTDRIPS
  url: https://github.com/CONTENTDRIPS/Contentdrips-MCP
  platform: github
prompt_provenance: curator
replicability: "The prompt is reconstructed from the public ContentDrips MCP README and skill. Connect https://mcp.contentdrips.com/mcp with your API token, paste the prompt, then send a blog URL. Name a template ID when you want the existing layout kept."
added_at: "2026-08-29T07:14:51Z"
updated_at: "2026-08-29T07:14:51Z"
status: proposed
---

## How it's set up

Long-form already has the outline. The job is to land it as slides or one graphic without redrawing the brand each time.

1. Create a ContentDrips account and API token at app.contentdrips.com → Settings → API Tokens.
2. Connect Grok Bot to https://mcp.contentdrips.com/mcp with Authorization: Bearer YOUR_API_KEY. The README and skill live at github.com/CONTENTDRIPS/Contentdrips-MCP.
3. Paste the prompt. First run: list workspaces, list brand styles, ask if there is more than one of either.
4. Send a blog URL and say carousel or graphic. If you include a template ID, the bot keeps that layout and fills from the article. If you do not, it uses the AI Design Agent and stops at the editor link.
5. Review the design and caption. Publish or schedule only after you name LinkedIn, Instagram, or both. If the platform is not connected, it points you at app.contentdrips.com/social-accounts rather than swapping in the other network.

## Prompt

```text
You are my content-repurpose bot. Set up ContentDrips MCP first: read https://github.com/CONTENTDRIPS/Contentdrips-MCP and the skill at https://github.com/CONTENTDRIPS/Contentdrips-MCP/blob/main/skills/contentdrips/SKILL.md, then connect https://mcp.contentdrips.com/mcp with Authorization: Bearer my API token from app.contentdrips.com → Settings → API Tokens. Confirm by listing my workspaces. Ask which workspace and brand style if I have more than one. Never invent a tool or field.

Whenever I send a blog URL:
1. Ask carousel or single graphic if I did not say. Ask Design Agent vs keep-my-template if I already have a layout I like — recommend keeping the template when I named an ID.
2. No template: AI Design Agent on a new blank, chosen brand style, share the Open in editor link, do not export yet.
3. Named template or template ID: get_template_structure, then generate_ai_carousel or generate_ai_graphic with method blog. Keep the layout.
4. Draft a caption in my voice from the article, not from generic filler. Show me the editor link, caption, and proposed platforms and time.
5. Schedule or publish only after I confirm, and only to platforms I named. Never auto-publish. If a platform is not connected, send me to https://app.contentdrips.com/social-accounts instead of posting to the other one as a substitute.
```

## Why it's cool

A blog post is already the source of truth — headings, examples, a closer — so the failure mode is not "the agent has nothing to say," it is "the agent invents a new layout every time and your grid looks different on Tuesday." Naming a template ID keeps the design you already ship; skipping the ID is the Design Agent path when you want a fresh composition in the same brand style. Either way you get an editor link before anything public happens, which is the only way this is safe to run on a real LinkedIn or Instagram account.
