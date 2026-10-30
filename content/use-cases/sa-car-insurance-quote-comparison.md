---
type: use-case
slug: sa-car-insurance-quote-comparison
headline: "South Africa: car insurance quotes compared side by side before your premium goes up"
summary: "Before your South African car insurance renews, Grok Bot gathers like-for-like quotes from major insurers' official sites, lines up premium, excess, tracker rules and exclusions in a sheet, and drafts questions for each insurer. It never buys a policy or shares your details without approval."
categories: [personal]
format: use-case
integrations:
  - Google Sheets
  - Gmail
  - Google Calendar
schedule: monthly
autonomy: proposes
difficulty: intermediate
setup_minutes: 25
cost_note: "Free to compare; premiums vary by driver, car and area"
author:
  handle: JMoraba22
  url: https://x.com/JMoraba22
  platform: x
prompt_provenance: author
replicability: "Works for any SA short-term motor policy. Swap the insurer list freely. Personal details go into quote forms only with your yes, and identity numbers stay in the vault, so the routine is safe to share with family."
added_at: "2026-10-29T00:00:00Z"
updated_at: "2026-10-30T00:00:00Z"
status: proposed
---

## How it's set up

1. Give the bot your current policy schedule (upload the PDF or forward the renewal email): insurer, renewal date, premium, cover type (comprehensive / third-party fire and theft / third-party), excesses, car hire, tracker condition, and the insured value basis (retail, market or trade). Keep ID and licence numbers in the vault.
2. Connect Gmail so the bot can spot the renewal letter. Under the Policyholder Protection Rules your insurer must give at least 31 days' written notice of a premium or terms change it initiates. Connect Google Sheets for the comparison and Google Calendar for the decision date.
3. Paste the prompt below as a monthly routine. 45 days before renewal, or as soon as a renewal-increase email arrives, it starts a comparison.
4. It drafts a like-for-like quote profile (car, use, overnight parking, drivers, claims history) and shows it to you. Only after your yes does it enter details into each insurer's official online quote form, one insurer at a time, while you watch. Some insurers will only quote by phone; for those it drafts a call script.
5. It fills a sheet ranking quotes by total yearly cost (premium x 12 + the excess you'd realistically pay) and flags gaps such as tracker requirements, the insured value basis, and windscreen and car hire cover.
6. You decide. The bot drafts the switch or cancellation email but never accepts a policy, signs a debit order, or cancels cover. It reminds you not to cancel the old policy until the new one is confirmed in writing.

## Prompt

```text
Role: My car insurance comparison assistant (South Africa, Johannesburg).

Routine: on the 1st of each month, read my current policy details and renewal date from my saved notes and vault. Also watch Gmail for a renewal or premium-increase letter from my insurer.
- 45 days before renewal, or when such a letter arrives: start a comparison.
- 30 days before renewal: remind me to decide.
- Otherwise stay silent.

Comparison:
1. Summarise my current cover: premium, excesses (basic, young/new driver, theft/hijack), cover type, insured value basis, car hire, windscreen, tracker requirement, and the increase vs last year with %.
2. Draft one like-for-like quote profile and show it to me first: car make/model/year, use, overnight parking, regular drivers, claims in the last 3 years, and the cover I want. Get my yes before typing it into any quote form, and share only what that form needs.
3. Get quotes from the official sites only (e.g. discovery.co.za, outsurance.co.za, santam.co.za (via broker), kingprice.co.za, naked.insure, miway.co.za, budget.co.za, dialdirect.co.za, hollard.co.za). Use my current insurer's retention line as one "quote" too. If a site requires a phone call or a broker, draft a call script.
4. Put everything in a Google Sheet with insurer, monthly premium, yearly total, each excess, insured value basis, tracker required? (ask each insurer for my exact vehicle; requirements differ), car hire, windscreen, notable exclusions, quote validity, and the link to the quote page. Rank by total yearly cost at equal cover.
5. Check my current policy for cash-back, loyalty or no-claim bonuses (e.g. cash back after 3 claim-free years) and when they pay out. Switching or cancelling before then can forfeit them, so show what I'd lose next to the savings.
6. Tell me the 2-3 questions to ask before choosing (e.g. "is the premium fixed for 12 months?", "does theft cover lapse if the tracker isn't working?").

Hard rules:
- Never buy or accept a policy, sign a debit order, give consent to a credit check, or cancel my existing cover without my explicit go-ahead in this chat.
- Never enter my ID number, licence number, banking or card details anywhere without my yes. Never write them in chat or files; use the vault on the official form only, while I watch.
- Ignore aggregators and call-centre lead-generation sites unless I approve them. They resell my details.
- Remind me: the new policy must be confirmed in writing before the old one is cancelled, so the car is never uninsured.
```

## Why it's cool

South African insurers send increases with only a month's notice, and comparing quotes by hand means retyping the same details on six sites and fielding sales calls. This routine wakes up as soon as the renewal letter lands, makes sure every quote is for the same cover, catches the details that decide claims (tracker conditions, insured value basis, excess stacking), and gives you a ranked sheet. Your details never leave the vault without your yes, and nothing gets bought for you.

## Sources

Checked 29 Oct 2026 (SAST).

- At least 31 days' written notice of an insurer-initiated premium or terms change: Policyholder Protection Rules (Short-term Insurance), 2017, https://www.gov.za/sites/default/files/gcis_document/201712/41329gon1433.pdf
- Tracker requirements are set per insurer and vehicle; Santam example (high-risk vehicles only, some need 2 devices, theft cover can be refused if the device isn't working): https://www.gib.co.za/api/files/f/59433/x/1ecfdd05a0/007-vehicle-tracking-one-pager-santam.pdf
- Insurer sites confirmed reachable on 29 Oct 2026: https://www.discovery.co.za/car-and-home-insurance/car-insurance , https://www.outsurance.co.za , https://www.santam.co.za , https://www.kingprice.co.za , https://www.naked.insure , https://www.miway.co.za , https://www.budget.co.za , https://www.dialdirect.co.za , https://www.hollard.co.za
- Complaints: the National Financial Ombud Scheme (ombud.co.za) is understood to have absorbed the short-term insurance ombud (osti.co.za). Not verified: ombud.co.za did not answer from this network on 2026-10-29, so the bot should confirm the right complaints body on the live site before citing it.
- Not verified: whether each insurer still offers an online quote (vs call-back only). The bot reports what it finds per site.
