---
type: use-case
slug: sa-driving-licence-card-renewal
headline: "South Africa: a driving licence card renewal booked months ahead of the queue"
summary: "Grok Bot tracks your SA driving licence card expiry, asks NaTIS Online for a DLTC slot well ahead, preps the eye test, photos and DL1 form, and watches whether the proposed 10-year card validity has become law."
categories: [personal]
format: use-case
integrations:
  - Google Calendar
  - Gmail
schedule: monthly
autonomy: acts-with-approval
difficulty: beginner
setup_minutes: 15
cost_note: "Card and temporary licence fees are set by each province or licensing office"
author:
  handle: JMoraba22
  url: https://x.com/JMoraba22
  platform: x
prompt_provenance: author
replicability: "Built for Gauteng, where NaTIS Online slot booking works. In other provinces, swap step 3 for your local DLTC's booking process. Keep your licence number and ID in the vault, not in chat."
added_at: "2026-10-29T00:00:00Z"
updated_at: "2026-10-30T00:00:00Z"
status: proposed
---

## How it's set up

1. Save your driving licence card's "valid to" date, licence codes and your preferred DLTCs (for example a Gauteng Smart Licensing Centre near you) in the Grok Bot vault.
2. Connect Google Calendar for the reminder and appointment events, and Gmail if the NaTIS slot SMS/email confirmations are forwarded there.
3. Paste the prompt below as a monthly routine. It starts nudging you 6 months before expiry. Slot allocation can take up to 30 days and card printing has had backlogs, so leave room.
4. When you say go, it walks you through the online.natis.gov.za "request a slot" registration while you watch. It reminds you that a slot must be accepted within 24 hours or it goes to someone else.
5. Before the appointment it sends a checklist: ID, current card, photos, proof of address, an optional optometrist eye test report, and the fee to confirm with your DLTC.
6. If the card expires before the new one arrives, it reminds you to ask for a temporary driving licence at the DLTC.

## Prompt

```text
Role: My driving licence card renewal assistant (South Africa, Gauteng).

Routine: on the 1st of each month, read my licence card expiry date from the vault.
- 6 months before expiry: send a heads-up and ask whether I want to request a DLTC slot now.
- 3 months, 6 weeks, and 2 weeks before expiry: remind me again if no booking exists.
- If there's nothing to do, stay silent.

Every heads-up:
1. Law check first. Search gov.za, sanews.gov.za and transport.gov.za for the status of the proposal to extend driving licence card validity for codes A1, A, B and EB from 5 to 10 years. Tell me whether it is in force yet, with a link. Until it is, assume my card expires on the printed date.
2. Booking: explain the online.natis.gov.za "Request a Slot" process. I must register and pick 1st, 2nd and 3rd choice DLTCs. A slot is allocated within 30 days and must be accepted within 24 hours. If I accept a slot and don't show up, I cannot register again for a slot. Offer to open the page with me. Never register or accept a slot without my yes.
3. Checklist for the visit: ID (and a copy), current licence card, ID photos (confirm the number with the DLTC), proof of residential address (an affidavit if the bill isn't in my name), form DL1 and NCP, and either the eye test at the DLTC or an optometrist's report. Fee: tell me to confirm it with the DLTC, and quote it only if you read it on an official page this month.
4. If my card has already expired, or will before the new one is ready (usually 4-6 weeks), remind me to apply for a temporary driving licence at the DLTC. It is issued the same day and valid for 6 months, and it has its own fee.
5. Remind me that an AARTO enforcement order can block the renewal. Point me to aarto.gov.za to check.

Hard rules:
- Official sources only (online.natis.gov.za, rtmc.co.za, gov.za, gauteng.gov.za, aarto.gov.za). No paid "booking agents".
- No payments, form submissions or slot acceptances without my explicit go-ahead in this chat.
- Never write my ID or licence number in chat or files. Use the vault and fill it in only on the official site while I watch.
- Propose calendar events for the appointment and the collection. Create them only after I approve.
- NaTIS Online (online.natis.gov.za) may drop connections from outside South Africa. If it won't load, route the browser through my own SA connection (Grok Bot's route-traffic-through-my-computer setting) or tell me to do the NaTIS step myself. Never use a mirror or agent site instead.
```

## Why it's cool

Renewing a South African licence card has become a planning problem more than paperwork. Slots are allocated, not chosen, a missed acceptance window puts you back in the queue, and the card printer has had well-publicised backlogs. A monthly routine that starts six months out, keeps the checklist ready, and watches whether the 10-year validity change has become law turns a stressful last-minute DLTC trip into a booked appointment.

## Sources

Tested 30 Oct 2026: from a non-SA network, online.natis.gov.za dropped the connection with no error page, so the slot request step could not be reached.

Checked 29 Oct 2026 (SAST).

- Renew 4 weeks before expiry at the latest; no driving test; eye test at the DLTC or an optometrist; documents; DL1 + NCP; card ready in 4-6 weeks; online.natis.gov.za: https://www.gov.za/services/driving-licence/renew-driving-licence
- Temporary licence issued the same day, valid 6 months: https://www.gov.za/services/driving-licence/temporary-driving-licence
- Slot booking rules (1st/2nd/3rd DLTC, allocation within 30 days, accept within 24 hours, no re-registration after a no-show): https://online.natis.gov.za/equeue-ui/
- Cabinet approved a 10-year validity for A1/A/B/EB on 30 Jul 2026, but it is not law yet, so keep renewing: https://www.gov.za/news/media-statements/transport-welcomes-cabinets-approval-extend-driving-licence-validity-five-ten and https://www.sanews.gov.za/south-africa/renewal-driving-licence-cards-continues-until-10-year-extension-legislated
- Draft regulations out for public comment; proposed transition lets an expired card stay valid for up to 3 months if a replacement was applied for (Parliament, 6 Oct 2026): https://www.parliament.gov.za/press-releases/media-statement-select-committee-briefed-proposed-amendments-regulations-governing-driving-licences
- Gauteng Smart Licensing Centres: booking essential, cashless, weekday 08:00-17:00 and Saturday 09:00-15:00 hours: https://www.gov.za/news/media-statements/gauteng-roads-and-transport-encourages-motorists-utilise-smart-licensing
- Not verified on an official page: exact Gauteng card and temporary licence fees. The Citizen reports R140-R250 nationally; gov.za only says "contact your local licensing office".
