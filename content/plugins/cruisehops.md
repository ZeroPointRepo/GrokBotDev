---
type: plugin
slug: cruisehops
name: CruiseHops
tagline: "Search cruises, compare itineraries and inspect offer price history through MCP"
category: personal
subcategory: travel
project_url: https://cruisehops.com
source_url: https://cruisehops.com/integrations
author:
  handle: "Just One More Feature, s.r.o."
  url: https://cruisehops.com
  platform: web
pricing_note: "Free cruise research; no CruiseHops account or API key required. Host fees may apply."
install_steps:
  - "Read https://cruisehops.com/integrations for the connection instructions and service limits."
  - "Use your host's documented remote MCP connector to connect to https://cruisehops.com/mcp with Streamable HTTP and no authentication."
  - "Discover the available tools, then search with your departure dates, port, cabin preference or budget."
  - "Compare a short list of sailings and confirm the final fare and availability with the cruise provider."
prompt: |-
  Read https://cruisehops.com/integrations and use your documented remote MCP connector to connect to https://cruisehops.com/mcp with Streamable HTTP and no authentication. If your environment cannot connect to remote MCP servers, explain that limitation instead of inventing setup steps. Discover the available tools and follow their schemas; do not invent endpoints, arguments or results. Ask for any missing travel preferences, then search Carnival and Royal Caribbean sailings and compare a short list by departure, itinerary, cabin offer and recorded price history where available. Include the returned sailing links. Treat captured prices as observations rather than live quotes or guaranteed availability. This integration is read-only; refer booking and payment decisions to the provider.
added_at: "2026-10-26T16:44:40Z"
updated_at: "2026-10-26T16:44:40Z"
status: proposed
---

## What it does

CruiseHops gives an assistant cruise research tools through a public MCP server. Search Carnival and Royal Caribbean departures, compare itineraries and cabin offers, and inspect recorded price history for an exact offer.

A practical workflow starts with dates, a departure port, a cabin preference or a budget. The assistant narrows the options and returns a short list with sailing links for further research. Results are available as structured data; compatible MCP Apps hosts can also display an interactive shortlist.

Prices are captured observations in USD per person for the stated occupancy, normally two guests. Final fares, availability and booking conditions need confirmation with the cruise provider.

## Use it in Grok Bot

Read the [connection documentation](https://cruisehops.com/integrations), then use your environment's documented remote MCP connector to connect to https://cruisehops.com/mcp using Streamable HTTP and no authentication. No CruiseHops account or API key is required. Connecting requires an environment or connector that supports remote MCP servers.

Discover the available tools before making requests. For example, ask: “Find Carnival and Royal Caribbean cruises departing from Miami in my travel dates, compare balcony offers, and show the itineraries and recorded price history where available.”

The tools are read-only. CruiseHops does not reserve cabins, accept payments or change bookings. Follow the returned links to review an option and confirm the provider's final quote before booking.
