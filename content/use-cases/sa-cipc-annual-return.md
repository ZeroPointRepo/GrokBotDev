---
type: use-case
slug: sa-cipc-annual-return
headline: "South Africa: a CIPC annual return and beneficial ownership filing that never lapse"
summary: "For South African company and CC owners: Grok Bot works out each year's CIPC annual return window from the incorporation date, checks that the beneficial ownership filing is done first, quotes the turnover-band fee, and prepares the CIPC filing for you to submit."
categories: [finance-ops]
format: use-case
integrations:
  - Google Calendar
  - Gmail
schedule: monthly
autonomy: acts-with-approval
difficulty: intermediate
setup_minutes: 20
cost_note: "CIPC fee R100-R3,000 by turnover band if on time; R100 + R50 late penalty per late return for turnover under R1m"
author:
  handle: JMoraba22
  url: https://x.com/JMoraba22
  platform: x
prompt_provenance: author
replicability: "Works for any SA private company (Pty) Ltd or close corporation. Store the registration number and incorporation date in the vault. The bot re-reads CIPC's current fee table each year instead of hard-coding it."
added_at: "2026-10-29T00:00:00Z"
updated_at: "2026-10-30T00:00:00Z"
status: proposed
---

## How it's set up

1. Save each entity's name, CIPC registration number, type (company or CC), incorporation date and last financial year's turnover in the Grok Bot vault. Your CIPC customer code and password stay in the vault; the bot only uses them on the CIPC site while you watch.
2. Connect Gmail so the bot can find CIPC notices and filing confirmations, and Google Calendar for the filing window.
3. Paste the prompt below as a monthly routine. Two months before the anniversary it sends a filing brief: window, fee band, and the beneficial ownership (BO) check.
4. Gather what it asks for: turnover for the last financial year and the AFS or financial accountability supplement (FAS) completed. If BO details changed, file the BO declaration first. CIPC blocks the annual return until BO is compliant.
5. When you say go, the bot opens CIPC eServices with you, fills in the non-sensitive fields, and stops at the declaration and payment step for you to confirm.
6. It saves the confirmation email reference and proposes next year's reminders.

## Prompt

```text
Role: My CIPC compliance assistant for my South African company/close corporation.

Routine: on the 1st of each month, read each entity's details from the vault (type, registration number, incorporation date, last turnover). Work out this year's annual return window:
- Company: the incorporation anniversary date plus 30 business days. Skip SA public holidays when counting.
- Close corporation: the 2 months starting from the first day of the anniversary month.
Two months before the window opens, send a filing brief. Remind me again when it opens and 10 business days before it closes. Otherwise stay silent.

Filing brief:
1. Window open and close dates, with how you calculated them.
2. Beneficial ownership first: since 1 July 2024 CIPC will not let me finalise the annual return unless the BO register is compliant. Ask whether owners or shareholdings changed. Changes must be filed within 10 business days.
3. Fee estimate: read CIPC's current annual return fee table this month (cipc.co.za) and give the on-time and late fee for my turnover band. As at the CIPC June 2026 presentation, companies pay R100 / R450 / R2,000 / R3,000 for turnover under R1m / R1m-under R10m / R10m-under R25m / R25m+ when on time, and CCs pay R100 below R50m turnover. Late returns add a penalty: in Oct 2026 a late return for turnover under R1m was R100 + R50 = R150 each. Confirm the current figures and don't rely on these.
4. Prerequisites: AFS or financial accountability supplement (FAS) done; turnover figure ready. The FAS asks for the record-keeper's ID number, full name and date of birth: ask me to enter the ID via the vault or a secure form, never in chat. Warn me that declaring a false turnover is a criminal offence and a filed return can't simply be amended.
5. Consequences: missing returns for 2+ years can lead to deregistration, after which the company needs reinstatement before it can file. If CIPC says "Entity not allowed to file annual returns, contact CIPC", the entity is in deregistration: draft a request to CIPC for me instead of trying to file.
6. Paying: CIPC's card page can fail ("An error occurred, please try again later"). The fallback is an EFT into my CIPC customer account with my customer code as the reference, then paying the cart from the balance. EFTs take 2-3 working days to reflect unless from ABSA. Open the cart via the CART button in eServices; the direct Cart.aspx link can error.

Hard rules:
- Look up company status and file only on CIPC's own sites: eservices.cipc.co.za, annualreturns.cipc.co.za, beneficialownership.cipc.co.za (or bizportal.gov.za). Never rely on third-party company directories for status, and never use third-party "CIPC agents" unless I name one.
- Get a fresh, explicit yes in this chat before EACH submit, each one-time code entry and each payment, after showing me what will be submitted and the exact amount. An earlier yes does not carry over to the next step or the next company.
- Never put ID numbers, the CIPC customer code or passwords in chat or files. Use the vault only, on the official site, while I watch.
- Propose calendar events for the window. Create them only after I approve.
```

## Why it's cool

A CIPC annual return takes minutes to file and costs as little as R100, but missing two years quietly gets a small business deregistered, and that can freeze its bank account and contracts. The routine works out the real business-day window from the incorporation date, catches the beneficial ownership hard stop before it blocks you, and quotes the correct turnover-band fee. You only need to confirm the number and press submit.

## Sources

Checked 29 Oct 2026 (SAST).

- Annual return windows (companies: 30 business days from the anniversary; CCs: 2 months from the start of the anniversary month), turnover-band fees and late fees, online-only filing via BizPortal/eServices, BO and AFS/FAS prerequisites, false turnover is a criminal offence, no amendments, deregistration after 2+ years (s82(3) Companies Act; s26 CC Act), reinstatement: CIPC presentation of 23 Jun 2026, https://www.cipc.co.za/wp-content/uploads/2026/07/Company-and-Close-Corporation-Annual-Returns-Presentation.pdf
- Beneficial ownership: hard stop on annual returns since 1 Jul 2024, annual BO declaration, 10 business days for changes and new entities: https://www.cipc.co.za/?page_id=16055
- Statutory fee schedule (Companies Regulations, Table CR 2B): https://www.acts.co.za/Companies_Act_2008/r351_ann_2_table_cr_2b_-_commission_
- Filing portals: https://bizportal.gov.za and https://eservices.cipc.co.za
- Close corporations per the same presentation: R100 (turnover under R50m) or R4,000 (R50m+), plus a R150 penalty for each late lodgement. Not verified: whether CIPC changes these figures after Jun 2026, so the bot re-reads the fee table every year.
