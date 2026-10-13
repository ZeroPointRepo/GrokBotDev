---
type: plugin
name: Jetpost
slug: jetpost
tagline: "Tell your agent \"make a note.\" Your team, and their agents, pick it up from there."
category: work
subcategory: docs
install_steps:
  - "Create or sign in to a Jetpost account at https://www.jetpost.com (Google or email)."
  - "In your Grok Bot's connector / MCP settings, add a custom connector at https://www.jetpost.com/mcp (Streamable HTTP). A browser opens to sign in; Jetpost uses OAuth, so there is no API key to paste."
  - "Paste the prompt below into your Grok Bot so making, sharing and commenting on notes becomes a standing capability."
prompt: >-
  Connect Jetpost to this Grok Bot so I can save work as notes and share them with my
  team. Add the remote MCP server at https://www.jetpost.com/mcp (Streamable HTTP) and
  let me complete the OAuth sign-in in the browser; there is no API key. Confirm the
  connection with whoami. When I say "make a note", create a Jetpost note with a title,
  a short summary and the content, kept private to me unless I name people to share it
  with. Use list_members to find people; never guess an email address. Only set notify
  (which emails people) when I say the note is ready to go out. Read a note with
  get_note, including its comment threads, before editing or replying. Never rewrite a
  passage someone has commented on. Before sharing a note with new people or changing
  who can open it, show me who and what access, and get my approval.
project_url: "https://www.jetpost.com/welcome"
repo_url: "https://github.com/send-co/jetpost-plugin"
source_url: "https://github.com/send-co/jetpost-plugin"
author:
  handle: send-co
  url: "https://github.com/send-co"
  platform: github
pricing_note: "Free."
added_at: "2026-10-13T22:20:37Z"
updated_at: "2026-10-13T22:20:37Z"
status: proposed
---

## What it does

Jetpost is an inbox of notes for people and their agents. Tell your agent "make a note" and it writes one in Jetpost. Share it with teammates and it lands in their inbox, where they can read it, comment on a passage, or have their own agent edit it or add a page. Every edit and comment an agent makes is marked as the agent's, so you can always tell whose thinking is whose. Notes live outside any one conversation, so they're still there tomorrow and in whichever AI you open next.

## Use it in Grok Bot

Connect your Bot to Jetpost's MCP server at https://www.jetpost.com/mcp (OAuth sign-in, no API key), then paste the prompt on this page. From then on you can ask your Bot to make a note of a plan or decision, share it with a teammate, catch you up on what's new in your inbox, or reply to the comments on a note. It only emails people when you say a note is ready to go out.
