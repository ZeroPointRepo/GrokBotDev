---
type: plugin
name: "iMessage for Grok Bot"
slug: imessage
tagline: "Read, triage, search, and send iMessages from a local macOS helper."
category: personal
subcategory: family
install_steps:
  - "On a Mac (macOS 13+), clone or download a verified release of https://github.com/jeffhuber/grokbot-imessage-skill and enter that directory."
  - "Run ./install.sh for the default per-user install (no sudo). Use ./install-hardened.sh only if you want root-owned code and a default-deny allowlist."
  - "Open System Settings → Privacy & Security → Full Disk Access, add the exact grokbot-imessage-helper wrapper path the installer printed, and turn it on."
  - "The first send will prompt Automation → Messages for grokbot-imessage-helper; click OK. Later you can confirm it under Privacy & Security → Automation."
  - "When Grok Bot asks where the helper lives, give the bridge path the installer printed (hardened default: ~/Library/Application Support/GrokBotIMessage)."
  - "Paste the prompt on this page. Sending is preview-and-confirm: the helper shows a native macOS dialog and Cancel is the default. Never send without that approval."
prompt: "You are wiring up the open-source Grok Bot iMessage skill for macOS. Read the real docs before you do anything: the README at https://github.com/jeffhuber/grokbot-imessage-skill and the JSON protocol at https://github.com/jeffhuber/grokbot-imessage-skill/blob/main/docs/PROTOCOL.md. Do not invent actions, fields, endpoints, or a different install path. The helper is a local LaunchAgent (com.jeffhuber.grokbot-imessage) that reads ~/Library/Messages/chat.db and sends only via AppleScript after a native confirmation dialog. Supported actions are only those in PROTOCOL.md: review, search, chat_history, response_stats, contacts_lookup, send_preview, send, status. If the helper is not installed yet, follow the README install steps and ask me for the bridge folder path the installer printed. Rules that never change: never send an iMessage or SMS without showing me the exact recipient and full body and getting my explicit yes; always call send_preview first and wait for the native macOS Send click (Cancel is the default); never invent a phone number, email, or thread the helper did not return; never dump raw chat.db; respect the helper's blocklist/allowlist. Confirm setup with a status (or contacts_lookup) request against the bridge, then tell me what you found."
works_with: []
project_url: https://github.com/jeffhuber/grokbot-imessage-skill
repo_url: https://github.com/jeffhuber/grokbot-imessage-skill
x_handle: "jhuber"
founder:
  name: "Jeff Huber"
  x_handle: "jhuber"
author:
  handle: "jeffhuber"
  url: https://github.com/jeffhuber
  platform: github
pricing_note: "Free and open source (MIT). Runs entirely on your Mac."
setup_minutes: 10
added_at: "2026-08-29T21:48:00Z"
updated_at: "2026-08-29T21:48:00Z"
status: proposed
---

## What it does

This is a macOS skill plus a local LaunchAgent that lets Grok Bot read, search, triage, and send iMessages on the machine where Messages.app already lives. A helper watches a user-owned bridge folder, snapshots chat.db on device, and only talks to Grok through request/response JSON files. The helper itself makes no network calls. Sending is gated twice: a single-use nonce bound to the exact recipient and body, then a native macOS dialog where Cancel is the keyboard default.

It is MIT-licensed and independent of Apple and xAI. Full Disk Access is required to read chat.db; Automation is required to send. A hardened installer can put the helper code under a root-owned path with a default-deny allowlist. Text only: no attachments, Tapbacks, or group-chat sending.

## Use it in Grok Bot

Install from the GitHub repo (README at https://github.com/jeffhuber/grokbot-imessage-skill), grant Full Disk Access to the printed wrapper path, then paste the prompt on this page and tell the bot the bridge folder. The bot must read PROTOCOL.md and only use listed actions. Ask it to review recent threads, search, or pull one chat. If you ask it to send, it has to preview first and wait for you to click Send in the macOS dialog. Do not treat this as a remote iMessage API; it only works on that Mac.
