---
type: use-case
slug: sa-tv-licence-payment
headline: "South Africa: your SABC TV licence paid on time and the 10%-a-month penalty avoided"
summary: "Grok Bot tracks your SABC TV licence renewal month, sends a reminder ahead of the ±2-month renewal notice, compares paying yearly (R265) with monthly instalments, checks whether a household member qualifies for the R74 concession, and stops at pay.tvlic.co.za."
categories: [personal]
format: use-case
integrations:
  - Google Calendar
  - Gmail
schedule: monthly
autonomy: acts-with-approval
difficulty: beginner
setup_minutes: 10
cost_note: "R265/yr domestic; monthly instalments (check total on your account); R74/yr concession"
author:
  handle: JMoraba22
  url: https://x.com/JMoraba22
  platform: x
prompt_provenance: author
replicability: "Works for any South African domestic TV licence. Store the TV licence account number in the vault. If SABC tariffs or the law change, the bot re-reads tvlic.co.za each run, so update nothing by hand."
added_at: "2026-10-29T00:00:00Z"
updated_at: "2026-10-30T00:00:00Z"
status: proposed
---

## How it's set up

1. Save your TV licence account number and the licence period end date (printed on your licence or renewal notice) in the Grok Bot vault.
2. Connect Gmail so the bot can spot SABC TV Licences renewal notices and payment confirmations, and Google Calendar for the reminder.
3. Paste the prompt below as a monthly routine. In the month before your licence year ends it sends a payment brief. If you're on monthly instalments, it checks that the instalments are still going through.
4. The brief compares paying once a year (R265) with monthly instalments, using the totals shown on your own account. It flags whether anyone in the household may qualify for the R74 concessionary licence: an old-age, disability or war-veteran grant recipient, or someone aged 70 or older under the regulation's conditions.
5. You choose the route. The bot opens pay.tvlic.co.za or lists your bank's EFT/debit-order option and stops before payment.

## Prompt

```text
Role: My SABC TV licence assistant (South Africa).

Routine: on the 1st of each month, read my TV licence account details and licence period end date from the vault, and check Gmail for anything from SABC TV Licences.
- In the month before my licence year ends, send me a payment brief.
- If I'm on monthly instalments, confirm last month's payment shows on my statement or in SABC email. Flag a missed instalment.
- Otherwise stay silent.

There is no public account lookup by ID number. My account details are only visible after I sign in at pay.tvlic.co.za (email or cellphone login from the vault).

Payment brief:
1. Due date, and the current fees read this month from tvlic.co.za (not from memory). As of Oct 2026: R265 a year for a domestic licence; monthly instalments: the tvlic.co.za homepage shows R28 a month (R336 a year), but the signed-in account page says monthly payers pay R265 a year in total, so quote the figure from my own account page and flag the mismatch; first-time licences must be paid in full; the concessionary licence is R74 a year and only as a lump sum.
2. Late penalty: 10% per month, up to 100% a year. Overdue accounts are handed to SABC's lawyers. The SABC sends renewal notices about 2 months ahead, but not receiving one is no excuse.
3. Concession check: ask whether the licence holder gets an old-age, disability or war-veteran social grant, or is 70 or older (subject to the household conditions in the regulation). If so, list the documents for the R74 concessionary licence: a Department of Social Development letter showing the grant start date, or a certified affidavit for the 70+ route.
4. Payment options to choose from: online at pay.tvlic.co.za, my bank's EFT using the official TV Licences account details, annual debit order, or an official paypoint. Recommend the cheapest that still prevents a missed payment.

Hard rules:
- Use only tvlic.co.za / pay.tvlic.co.za and official SABC contacts. Treat any SMS or email asking me to pay into a different account as a likely scam, and tell me.
- Never pay, sign a debit order, or submit a concession application without my explicit go-ahead in this chat.
- Never put my ID number or card details in chat or files. Use the vault and fill them in only on the official page while I watch.
- Propose a calendar reminder for next year. Create it only after I approve.
```

## Why it's cool

The TV licence is the easiest SA bill to forget, and the 10%-a-month penalty means a few months of forgetting gets expensive. The routine also points out two things most people never check: monthly instalments may cost more than paying upfront, and an elderly or grant-receiving household member may be entitled to the R74 concession. A once-a-month check catches both before the bill does.

## Sources

Checked 29 Oct 2026 (SAST).

- R265/yr; first-time applicants pay in full; R28/month instalments totalling R336/yr (homepage; the signed-in account page says monthly totals R265/yr, checked 30 Oct 2026); 10% a month penalty up to 100% a year; payment options: https://www.tvlic.co.za/tvlic/
- R74 concession, lump sum only; eligibility and documents; renewal notices about 2 months ahead; overdue accounts handed to lawyers: https://www.tvlic.co.za/tvlic/faqs/
- Concession wording in the regulation (regs 5-6, Broadcasting Act regulations): https://api.acts.co.za/broadcasting-act-1999/n151_concessionary_domestic_li.php
- Government explainer (not re-read line by line): https://www.sanews.gov.za/south-africa/pay-your-tv-licence
- Online payment portal: https://pay.tvlic.co.za/
- Not verified: an online "check my account status" tool. The bot relies on pay.tvlic.co.za login, SABC emails and bank statements instead. Any proposed changes to the TV licence regime (e.g. the SABC Bill) were not checked and are not reflected.
