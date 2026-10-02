---
type: plugin
slug: fonino
name: "Fonino: a real iPhone for your Grok Bot"
tagline: "A real, non-jailbroken iPhone your Grok Bot can tap, type and swipe in, with live takeover"
category: personal
subcategory: home
install_steps:
  - "Start the Xcode download from the Mac App Store first (30–60 min). You need an Apple silicon Mac (M1+, macOS 15+) and a spare iPhone XS or newer."
  - "Paste the prompt on this page into Grok Bot. It reads https://api.fonino.app/setup.md and walks you through each step, waiting for you to say done."
  - "Start the BYOF trial (3 days free, then $19/month) and sign in at app.fonino.app with your email and the 6-digit code. US only for now."
  - "Install Fonino on the Mac (curl -fsSL https://api.fonino.app/install.sh | FONINO_NO_SETUP=1 sh) and work through ~/Fonino/bin/fonino setup status until every step shows ✓."
  - "On the iPhone: trust the Mac, turn on Developer Mode, trust the helper, set Auto-Lock to Never and notification previews to Never. You enter every passcode yourself."
  - "At app.fonino.app click Connect Grok, then grok.com/connectors → New Connector → Custom → URL https://api.fonino.app/mcp → Connect → enter the code."
  - "Test it: ask Grok Bot to take a screenshot of your Fonino phone and describe what's on it. Keep the Mac on and awake while the bot uses the phone."
prompt: "Set me up with Fonino so you can use a real iPhone for me. Read https://api.fonino.app/setup.md and walk me through it one step at a time: tell me exactly what to click, type or tap, and wait until I say done before the next step. Only use the steps, commands and the MCP server URL (https://api.fonino.app/mcp) that the guide gives; never invent a command, endpoint or tool. Never ask for or type my passwords, passcodes, card details or verification codes; I enter those myself. Once connected, confirm by taking a screenshot of the phone. Before you send a message, buy anything, or change an account on the phone, show me exactly what you'll do and wait for my explicit yes."
works_with: []
project_url: https://fonino.app
source_url: https://api.fonino.app/setup.md
author:
  handle: fonino
  url: https://fonino.app
  platform: web
pricing_note: "BYOF: 3-day free trial, then $19/month (your iPhone + Mac). Hosted phone: $1,788/year. US only."
setup_minutes: 20
added_at: "2026-10-02T02:00:00Z"
updated_at: "2026-10-02T12:00:00Z"
status: live
verified_at: "2026-10-02T12:00:00Z"
---

## What it does

Fonino connects Grok Bot, through an MCP connector, to a physical, non-jailbroken iPhone plugged into your Mac by USB. The bot sees the phone's screen, taps, swipes and types in native apps, then looks again to check the result. It can also use Safari on the device and Messages. The point is reach. Some jobs live only in an iPhone app with no web version or API, and some depend on a phone session you're already signed in to. A cloud browser can't do those. A live view at app.fonino.app lets you watch and take over at any moment, for a login, a 2FA prompt or a payment step, and then hand the phone back. Texts to other people wait for your approval at app.fonino.app.

Be realistic: it's a small pilot, tested with Grok Bot and Muse on physical iPhones (for example, opening Notes and writing a note, and sending through iMessage). Not every app or workflow has been tested. A real phone doesn't prevent blocks either, so websites and apps can still require verification or restrict access. SMS from BYOF still needs validation.

## Use it in Grok Bot

Paste the prompt on this page into Grok Bot. It reads the setup guide and walks you through it in about 20 minutes, plus the Xcode download if you don't already have it, so start that first. You need a spare iPhone XS or newer that can stay plugged in and unlocked, and an Apple silicon Mac (M1+, macOS 15+) that stays awake. Once the connector is added (grok.com/connectors → Custom → https://api.fonino.app/mcp), start with something small, like "Take a screenshot of my Fonino phone and tell me what's on it", then a single-app task. Use a dedicated phone that's signed in only to the accounts you want the bot to touch. Prefer a real API or connector whenever one exists, and keep Fonino for the app-only steps. No spare iPhone? Ask about the hosted phone ($1,788/year).
