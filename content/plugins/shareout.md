---
type: plugin
name: Shareout
slug: shareout
tagline: "Share HTML proposals, reports and prototypes as browser links with feedback and revisions"
category: work
subcategory: docs
install_steps:
  - "Read https://shareout.io/agents and create or sign in to your Shareout account."
  - "Ask Grok Bot to add the remote MCP server at https://shareout.io/mcp, using the setup prompt below."
  - "Complete Shareout's OAuth sign-in and consent in the browser when Grok Bot requests it."
  - "Have the Bot check the connection with a read-only catalog request before publishing any files."
  - "Ask it to publish your HTML file for the audience you specify, then use the same document for revisions."
prompt: >-
  Connect Shareout to this Grok Bot so I can share HTML proposals, reports and interactive
  prototypes with people outside this chat. First read https://shareout.io/agent-start.md
  and https://shareout.io/agents. Reuse an existing Shareout connection if available;
  otherwise add the remote MCP server at https://shareout.io/mcp and let me complete
  OAuth sign-in and consent in the browser. Verify the connection with a read-only
  catalog request. Read https://shareout.io/skill.md when I ask you to publish or revise
  a page, and follow its current tool definitions and upload workflow. Never invent
  endpoints or fields, or put HTML file bytes in MCP arguments. Use direct HTTP file
  transfer for hosted publishing, or the documented CLI/local MCP if needed. Before
  publishing, changing access, inviting reviewers or deleting anything, show me the
  intended action and audience and get my approval. Keep credentials and private links
  out of logs. Return the intended recipient link and verify the active version after
  publishing. A viewing link alone does not grant commenting access.
project_url: "https://shareout.io/"
repo_url: "https://github.com/geland/shareout-integrations"
source_url: "https://github.com/geland/shareout-integrations"
author:
  handle: geland
  url: "https://github.com/geland"
  platform: github
pricing_note: "Free self-service offering, subject to workspace quotas."
added_at: "2026-10-09T20:54:25Z"
updated_at: "2026-10-09T20:54:25Z"
status: proposed
---

## What it does

Shareout turns a self-contained HTML file into a browser link. Use it to send a
proposal, report or interactive prototype to clients and collaborators who do not
use Grok Bot. Recipients can view and try the page without joining your AI workspace.
Authorized reviewers can comment, and your Bot can read that feedback and publish
a revision at the same address.

Named, expiring links let you share with different audiences and revoke access later.
Opening activity records which version was viewed; it does not verify the reader's
identity. Commenting access is granted separately from viewing access.

## Use it in Grok Bot

Paste the setup prompt above into your Bot and complete the browser sign-in when
requested. The hosted MCP endpoint uses OAuth. The
[connection guide](https://shareout.io/agents) and
[publishing skill](https://shareout.io/skill.md) explain the current tools and account
setup. The public repository contains the integration package and connection examples.

Once connected, ask: "Publish this HTML proposal as a private Shareout page. Show me
the audience and access settings before publishing, then return the viewing link."
For a revision, ask: "Read the authorized feedback on this Shareout page, show me the
changes you propose, and update the same document after I approve."

Grok Bot can transfer files directly over HTTP for the hosted upload workflow. The
standalone CLI and local MCP can also read files from disk. File contents must stay
out of MCP arguments. Pages support self-contained HTML and relative assets; they
cannot submit forms, call external APIs or embed other sites. Follow the
[authoring rules](https://shareout.io/guidelines.md) when preparing an interactive page.
