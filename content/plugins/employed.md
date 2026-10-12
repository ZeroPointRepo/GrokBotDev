---
type: plugin
name: "Employed"
slug: employed
tagline: "Give your Grok Bot live jobs from 5,000 employer career sites, plus your job tracker"
category: work
subcategory: research
install_steps:
  - "Create a free account at jobs.guaqai.me. Your profile, ranked feed and application tracker are free; the search tools include a free trial and need a Pro or Ultimate plan for regular use."
  - "In your Grok Bot's connector / MCP settings, add a custom connector at https://jobs.guaqai.me/mcp (Streamable HTTP). A browser opens and you sign in with your Employed login. It uses OAuth 2.1 with PKCE and dynamic client registration, so there is no API key to paste."
  - "For a stdio-only client instead, run npx -y employed-mcp with GUAQ_API_KEY set to a key from your Employed profile page. It is a thin launcher for the same tools."
  - "Paste the prompt below into your Grok Bot so job search, your feed and your application tracker become standing capabilities."
prompt: "You are setting up an Employed integration for me inside Grok Bot. Connect to Employed's hosted MCP server at https://jobs.guaqai.me/mcp (Streamable HTTP, OAuth 2.1 with PKCE, so a browser window will open for me to sign in; there is no API key). Read the tools the server exposes and the docs at https://jobs.guaqai.me/connectors so you understand the real surface before you act. Never invent an endpoint, a tool, a job, an employer, a salary or a visa status that the server does not return. Employed indexes live postings read straight from about 5,000 employers' own applicant-tracking systems, so you can search roles by title, seniority, location, work mode, technology and visa signal, count matches, open one posting, list the employers hiring for a search and read an employer's hiring profile. You can also read and update my job-search profile (education, target categories, cities, countries, work authorisation, experience), read my ranked feed, save roles to my tracker and record each application's status, and follow employers for new-role alerts. Rules: before any profile update, tracker change or follow, show me exactly what will change and wait for my go-ahead; look up accepted values with profile_options instead of guessing ids. Visa sponsorship marked likely is an inference, not a promise, so say so. Never apply to a job or contact an employer for me: give me the posting's own apply link. Confirm the connection by reading my profile and telling me whether onboarding is complete."
project_url: https://jobs.guaqai.me
repo_url: https://github.com/Guaq-AI/employed-plugins
source_url: https://jobs.guaqai.me/connectors
author:
  handle: guaq-ai
  url: https://jobs.guaqai.me
  platform: web
pricing_note: "Free account: profile, ranked feed and application tracker, plus a trial of the search tools. Pro or Ultimate for regular search use. See jobs.guaqai.me."
setup_minutes: 3
added_at: "2026-10-13T00:00:00Z"
updated_at: "2026-10-13T00:00:00Z"
status: proposed
---

## What it does

Employed is a job search built from about 5,000 employers' own career sites and applicant-tracking systems (Greenhouse, Lever, Workday, Ashby, SmartRecruiters and more), each board checked live before it is kept, so every result links to the employer's own application page rather than a reposted copy. Its hosted MCP server gives a Grok Bot the search side: find roles by title, seniority, location, work mode, technology and visa signal, count how many roles match before listing them, open one posting in full, list which employers are hiring for a search, and read an employer's hiring profile (seniority mix, functions, cities, technologies, longest-open roles).

It also reaches your own Employed account. Paste a CV and the bot can fill in your profile in one step instead of a long form, read your personal feed ranked against that profile, save roles to your tracker, record each application's status from applied to offer, and follow employers so you hear when they post. Visa sponsorship marked likely is an inference from the posting and the employer's history, and the tools say so. Nothing here can apply to a job or message an employer.

## Use it in Grok Bot

Connect your Bot to https://jobs.guaqai.me/mcp (OAuth sign-in with your Employed login, no API key to paste), then paste the prompt on this page. From then on "set up my profile from this CV", "what new roles fit me this week", "is Stripe hiring in London, and for what" and "mark the Wise role as applied, I have a phone screen Friday" are things your bot answers against live postings and your real tracker. The prompt keeps you in the loop: the bot shows you every profile change, tracker update or follow before it makes it, and it gives you the employer's own apply link instead of applying for you. Clients that only speak stdio can use the npm package with an API key instead, which talks to the same service.
