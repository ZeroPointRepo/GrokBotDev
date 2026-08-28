---
type: plugin
name: "Sightkick"
slug: sightkick
tagline: "Run SEO end to end: AI-answer visibility, articles, publishing, Search Console proof."
category: marketing
subcategory: seo
install_steps:
  - "Create a Sightkick workspace at sightkick.so and add your website — the free analysis seeds your tracked prompts and keywords."
  - "Connect Google Search Console in Settings, so the agent reads real impressions, clicks and positions instead of estimates."
  - "Add the server to your MCP client — 'claude mcp add --transport http sightkick https://app.sightkick.so/mcp', or paste that URL into any client's custom-connector field. There is no API key: the first call opens an OAuth sign-in where you pick which workspace the grant binds to."
  - "Paste the prompt below into your Grok Bot so 'how are we showing up in AI answers, and what should we publish next?' becomes a standing question."
prompt: "You are setting up a Sightkick integration for me inside Grok Bot. Sightkick is an SEO/AEO autopilot: it tracks how ChatGPT, Gemini, Google AI Overviews and AI Mode answer my buyers' questions, researches keywords, writes and scores articles, schedules them on a calendar, and proves outcomes with Google Search Console data. First, read Sightkick's documentation at https://sightkick.so/mcp and its machine-readable reference at https://sightkick.so/llm-info so you understand the tool catalog before you call anything. Then connect to the remote MCP server at https://app.sightkick.so/mcp over streamable HTTP. There is no API key — authentication is OAuth 2.1 with dynamic client registration, and one grant is bound to one workspace, so when the consent screen appears, pick the workspace for the site we are working on. Then make this a standing capability. Whenever I ask how we are doing, or on whatever cadence I set: pull my AI-visibility summary and the prompts I track (get_visibility_summary, list_tracked_prompts), read the actual AI answers and the sources they cite (get_ai_answer, list_cited_sources), find where I am absent (list_visibility_gaps), and cross-read the Search Console proof (get_search_metrics). Report what moved, which competitors are being named instead of me, and which cited sources I do not appear in yet. Rules, and they are not optional. Follow the documented tool catalog exactly: never invent a tool, an argument or a field, and never guess a number — if a tool did not return it, say so plainly. Reads you may run freely: workspace, AI-visibility, keyword, article, calendar, outreach and activity reads. ASK ME FIRST, every single time, before anything that writes, publishes or spends money — generate_article (this costs real money per article), publish_article (this puts a page on my live site), queue_article, reschedule_article, set_autopilot_mode, and track_prompt or retire_prompt (these change what my subscription meters). Show me exactly what you are about to do, and wait for me to say yes. Every write is attributed to you in my workspace activity feed, so keep them deliberate and few. Confirm the connection now by calling get_workspace and showing me the workspace name, then my current AI-visibility summary."
works_with: []
project_url: "https://sightkick.so/mcp"
repo_url: "https://github.com/sightkick-so/mcp"
founder:
  name: "Fabio Bergmann"
  x_handle: "fabiobergmann"
author:
  handle: "sightkick"
  url: "https://sightkick.so"
  platform: web
pricing_note: "From $39/mo after a 7-day free trial. Agent access is in every paid plan, never a separate tier."
setup_minutes: 5
added_at: "2026-08-28T17:11:54Z"
updated_at: "2026-08-28T17:11:54Z"
status: proposed
---

## What it does

Sightkick is an SEO/AEO autopilot that runs the whole loop rather than one slice of it: it tracks how ChatGPT, Gemini, Google AI Overviews and AI Mode actually answer your buyers' questions, researches the keywords worth winning, writes and scores articles against a five-pillar rubric, schedules them on a publishing calendar, pushes them to your connected CMS, and then proves the outcome with Google Search Console data — impressions, clicks and positions, not estimates.

The MCP server hands all of that to an agent: 31 tools over streamable HTTP, authenticated with OAuth 2.1, no API key anywhere. One grant binds to one workspace, and every write the agent makes is attributed to it in the workspace's activity feed, so an agent operating your SEO leaves an audit trail a human can read.

## Use it in Grok Bot

Paste the prompt on this page into a Grok Bot. Because auth is OAuth rather than a key, there is nothing to copy from a dashboard — the first call opens a sign-in and a workspace picker, and the connection is done. The bot reads Sightkick's own documentation first, wires up the server, then answers "how are we showing up in AI answers?" from real data: which prompts you win, which competitors get named instead of you, which sources the engines cite, and where Search Console says you actually moved.

The prompt deliberately splits reads from writes. Reads run freely; anything that generates an article, publishes to your live site, changes your tracked-prompt panel or flips autopilot has to come back and ask you first, because each of those spends money or changes something public.
