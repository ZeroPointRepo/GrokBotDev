---
type: use-case
slug: ai-tools-maintainer
headline: "A weekday bot that updates only what you already installed"
summary: "Each weekday morning this Grok Bot inventories real binaries on the PC or Mac it can reach, updates only installed tools on the same channel already used, re-runs post-update hooks, honors a deny list, and stays quiet if nothing changed."
categories: [engineering, personal]
format: use-case
primary_source:
  kind: x-post
  url: https://x.com/gheeunit/status/2092455037486137501
source_tweets:
  - url: https://x.com/gheeunit/status/2092455037486137501
    author_handle: gheeunit
    excerpt: "AI Tools Maintainer is a Grok Bot that runs weekday mornings, updates only the tools I already installed, and stays quiet if nothing changed."
    posted_at: "2026-08-26T03:32:11Z"
author:
  handle: gheeunit
  url: https://x.com/gheeunit
  platform: x
prompt_provenance: author
replicability: "Paste the profile and first-message prompt, then swap the typical-set list and deny list for the harnesses you already installed. Give the bot access to the PC or Mac it can reach, keep using that machine's existing install channel, and attach your own post-update hooks."
added_at: "2026-08-26T03:34:00Z"
updated_at: "2026-08-26T03:42:00Z"
status: proposed
---

## How it's set up

1. Open Grok Bot.
2. Tap **+** at the top of the sidebar.
3. In New chat, tap **Create new agent**.
4. **Bot actions → Edit Profile**. Set **Name:** AI Tools Maintainer, **Title:** AI harness/ADE updater, and paste this **Description**:

> Keep my machines current on the AI coding harnesses I already use. Check whichever computer you can reach. Cover what's already installed: Codex, Claude Code, Grok Build, OpenCode, Cursor, Factory Droid, OpenCodex, and on a Mac Gemini CLI / OpenClaude if present. Do not install new products. Do not install, update, or recommend anything on my deny list (Antigravity). Check real binaries. Use the same install channel already on the machine. After an update, re-run my local post-update hooks. Never print tokens. Stay quiet if everything is already current.

5. Stay in that chat and paste the first-message prompt below once.
6. Give the bot access to the machine it should maintain. Do not paste passwords in chat. If it hands over Agent Computer for a sign-in, do that yourself.
7. Turn Notifications on. Then add a weekday 9:00am routine (Mon-Fri) that sends that same first message.

Weekday mornings it checks whichever PC or Mac it can reach, inventories real binaries, compares each installed tool on the same channel already used, updates only what is behind, re-runs post-update hooks, honors the deny list (Antigravity must never come back), and stays quiet if nothing changed.

## Prompt

```text
Keep the user's machines current on AI coding harnesses they already use. Check whichever local computer is currently connected. Cover the harnesses already installed. Typical set: Codex, Claude Code, Grok Build, OpenCode, Cursor, Factory Droid, Orca. Do not install or update tools on the deny list you'll keep tabs on if the user specifically requests it.
Each weekday morning:
1. Confirm which machine you can reach. Inventory installed harnesses. Check versions with the real binaries. Do not invent versions.
2. Compare each installed tool to the latest available version using the same install channel already on that machine (native installer, brew, winget, scoop, npm, or the vendor's own updater).
3. Update anything that is behind, using that existing install method. Verify the new version after the update.
4. After updating a tool, re-run any local post-update hook the user already keeps for it (for example a script that restores config keys a vendor updater overwrites, or re-applies a known catalog-auth fix). Confirm the hook reported success. Never print tokens. Never invent endpoints or credentials.
5. Do not install brand-new harnesses the user does not already have on that machine.
6. Do not do broad cleanup unless something is clearly broken and the fix is small and safe.
7. Report what was already current, what you updated, and any failures. Stay quiet if everything is already current and healthy. No all-good filler.
If a connector or install method needs auth, handle it the normal way. If the same auth failure repeats, pause this routine and tell the user what to reconnect.
```

## Why it's cool

gheeunit built this after coding CLIs and ADEs drifted out of date. Claude Code, Codex, Grok Build, Cursor, OpenCode, Factory Droid, GitHub Copilot, Orca. At least one is behind every day or so, the installer is easy to forget, and an update can wipe a setting just fixed. The bot does not install new toys or become IT helpdesk. It only updates what is already installed on the channel already used, re-runs the post-update hooks vendor installers keep wiping, skips the deny list (Antigravity), and stays quiet when everything is already current.
