---
type: use-case
slug: topic-to-branded-carousel
headline: "Create a branded carousel from a single topic"
summary: "Give Grok Bot a topic such as how to price freelance work. With ContentDrips MCP connected, it builds a multi-slide carousel in your saved brand style (or a named template), returns the editor link, and waits for you before any LinkedIn or Instagram publish."
categories: [marketing]
format: use-case
author:
  handle: CONTENTDRIPS
  url: https://github.com/CONTENTDRIPS/Contentdrips-MCP
  platform: github
prompt_provenance: curator
replicability: "The prompt is reconstructed from the public ContentDrips MCP README and skill. Connect the hosted MCP with an API token, paste the prompt, then send a topic. If you have a template you already like, name it so the layout stays put."
added_at: "2026-08-29T07:14:51Z"
updated_at: "2026-08-29T07:14:51Z"
status: proposed
---

## How it's set up

This is the empty-canvas path: you have a topic, not a URL, and you want slides that look like your existing posts.

1. Create a ContentDrips account and an API token at app.contentdrips.com → Settings → API Tokens.
2. Add the hosted MCP server at https://mcp.contentdrips.com/mcp with Authorization: Bearer YOUR_API_KEY. Copy the skill from github.com/CONTENTDRIPS/Contentdrips-MCP/tree/main/skills/contentdrips if you want the agent to know Design Agent vs template fill without being told twice.
3. Paste the prompt. The bot lists workspaces and brand styles, and it asks which style to lock in if there is more than one — it does not auto-pick.
4. Send a topic and slide count (for example a 5-slide LinkedIn carousel on how to price freelance work). No template named: AI Design Agent, then editor link only. Template named: keep the layout, fill the topic.
5. Review the editor link and caption. Name LinkedIn, Instagram, or both before anything is scheduled. Never both by default.

## Prompt

```text
You are my carousel bot. Set up ContentDrips MCP first: read https://github.com/CONTENTDRIPS/Contentdrips-MCP and https://github.com/CONTENTDRIPS/Contentdrips-MCP/blob/main/skills/contentdrips/SKILL.md, then connect https://mcp.contentdrips.com/mcp with Authorization: Bearer my API token. Confirm by listing my workspaces. If I have more than one workspace or saved brand style, ask which to use. Never invent a tool, field, or endpoint.

Whenever I give a topic (no URL):
1. If I did not name a template, use the AI Design Agent: create a blank design, apply the chosen brand style, generate a new layout, and share the Open in editor link. Do not export or publish yet.
2. If I named a template or pasted a template ID, keep that layout and fill it from the topic (get_template_structure, then generate_ai_carousel with method topic).
3. Draft a caption in my voice. Show me the editor link, the caption, and the proposed platform(s) and time.
4. Schedule or publish only after I confirm, and only to platforms I named — LinkedIn, Instagram, or both. Never default to both. If a named platform is not connected, send me to https://app.contentdrips.com/social-accounts. Confirm before deleting a design or post.
```

## Why it's cool

Most agent-to-social setups start with a finished image and then ask where to post it. This one starts with a sentence. The Design Agent is the twist: it is not filling placeholders on a generic template unless you asked it to; it builds a layout in a style you already saved, then hands you an editor link instead of burning an export you did not request. You stay in the loop for platforms, which is what keeps a topic bot from spraying the same carousel to every connected account.
