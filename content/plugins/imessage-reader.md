---
type: plugin
name: "iMessage Reader (read-only)"
slug: imessage-reader
tagline: "Let Grok Bot read and search your Mac's iMessages, with no sending and no network."
category: personal
subcategory: family
install_steps:
  - "On a Mac (macOS 13+) with Xcode Command Line Tools, clone https://github.com/RyanNewsom/grokbot-imessage-reader and enter that directory."
  - "Run ./install.sh (no sudo). It builds a small ad-hoc-signed imsg-helper.app and an on-demand LaunchAgent."
  - "Open System Settings → Privacy & Security → Full Disk Access, add the imsg-helper.app path the installer printed, and turn it on. Terminal never needs Full Disk Access."
  - "Test with ~/.local/bin/imsg-read recent --hours 24 and check the JSON says ok: true."
  - "Paste the prompt on this page into Grok Bot and let it run imsg-read on that Mac."
prompt: "You are wiring up the open-source read-only iMessage reader for macOS. Read the real docs before you do anything: the README and SKILL.md at https://github.com/RyanNewsom/grokbot-imessage-reader. Do not invent commands, flags, or fields. The only commands are imsg-read recent --hours N, imsg-read search --query TEXT --days N, and imsg-read thread --handle HANDLE --days N (each with optional --limit), run on my Mac; they print JSON. If it is not installed, follow the README install steps and wait for me to grant Full Disk Access to the printed imsg-helper.app path. Rules that never change: this tool cannot send, so never claim it can; never send a message on my behalf without showing me the exact recipient and full text and getting my explicit yes; never invent a phone number, contact name, or thread the helper did not return; summarize instead of dumping whole threads. Confirm setup with imsg-read recent --hours 24 and tell me how many threads it found."
works_with: []
project_url: https://github.com/RyanNewsom/grokbot-imessage-reader
repo_url: https://github.com/RyanNewsom/grokbot-imessage-reader
author:
  handle: "RyanNewsom"
  url: https://github.com/RyanNewsom
  platform: github
pricing_note: "Free and open source (MIT). Runs entirely on your Mac."
setup_minutes: 5
added_at: "2026-11-05T01:56:00Z"
updated_at: "2026-11-05T01:56:00Z"
status: proposed
---

## What it does

A deliberately small, read-only iMessage reader for Grok Bot on macOS. About 290 lines of Swift open ~/Library/Messages/chat.db with SQLite in read-only, query-only mode and return recent threads, search results, or one conversation as JSON. It has no networking code, no sending, no third-party dependencies, and it only runs when called.

Full Disk Access is scoped to the helper alone: imsg-read writes a request file and kickstarts an on-demand LaunchAgent, so launchd starts imsg-helper.app with no Terminal ancestor and macOS attributes the permission to that app instead of Terminal. MIT-licensed, independent of Apple and xAI. Text only; attachments are counted, not read.

## Use it in Grok Bot

Install from the GitHub repo, grant Full Disk Access to the printed imsg-helper.app path, then paste the prompt on this page. Grok Bot runs imsg-read on your Mac (each run goes through your normal local-command approval) to catch you up on texts, search for something, or pull one conversation. It cannot send messages; any reply your bot drafts is shown to you first and goes out only with your explicit yes through a method you approve. Message text it reads enters your Grok Bot chat, so treat it like sharing those texts with your bot.
