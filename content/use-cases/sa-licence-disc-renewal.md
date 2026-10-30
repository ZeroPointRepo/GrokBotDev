---
type: use-case
slug: sa-licence-disc-renewal
headline: "South Africa: your car licence disc renewed before the 21-day grace period runs out"
summary: "A yearly Grok Bot routine for South African drivers: 6 weeks before the disc expires it checks NaTIS Online for blocks such as AARTO enforcement orders or roadworthy marks, compares NaTIS and bank-app renewal costs, and stops at payment."
categories: [personal]
format: use-case
integrations:
  - Google Calendar
  - Gmail
schedule: monthly
autonomy: acts-with-approval
difficulty: beginner
setup_minutes: 15
cost_note: "Licence fee varies by vehicle and province, plus a transaction fee (R72 in 2023) and delivery; confirm at checkout"
author:
  handle: JMoraba22
  url: https://x.com/JMoraba22
  platform: x
prompt_provenance: author
replicability: "Works in any South African province: NaTIS Online is national. Swap the bank app for your own bank (FNB, Nedbank, Standard Bank, Absa, Capitec), and keep your ID and registration number in the vault rather than in chat."
added_at: "2026-10-29T00:00:00Z"
updated_at: "2026-10-30T00:00:00Z"
status: proposed
---

## How it's set up

1. Save the vehicle's registration number, licence number, VIN and the current disc's expiry date to your Grok Bot vault (not to chat). Add your SA ID number to the vault only if you want the bot to fill it in on the official site while you watch.
2. Connect Google Calendar so the bot can propose an event for the expiry date and one 6 weeks before it. If your RTMC/NaTIS reminder emails land there, connect Gmail too.
3. Paste the prompt below as a routine that runs on the 1st of every month. Most months it finds nothing due and stays quiet. In the month that falls 6 weeks before expiry, it sends you a renewal brief.
4. The brief covers anything that would block the disc (an AARTO enforcement order, another unlicensed vehicle, a roadworthy requirement, an admin or police mark), the cheapest official way to renew, and the documents you would need at a licensing office.
5. You say "go". The bot opens online.natis.gov.za or your bank app's licence disc flow, checks the details with you, and hands you the payment screen. It never pays for you.
6. Once the new disc arrives, tell the bot. It updates the expiry date in the vault and proposes next year's calendar events.

## Prompt

```text
Role: My vehicle licence disc renewal assistant (South Africa, Gauteng).

Routine: on the 1st of each month, check the expiry date of each vehicle in my vault. If a disc expires within the next 6 weeks, or has already expired, send me a renewal brief. If nothing is due, stay silent.

The renewal brief:
1. Vehicle, registration number, and expiry date. Count the 21-day grace period from the expiry date and show the last penalty-free day.
2. Blocks to check first. A disc will NOT be printed (the portal issues an MVLX receipt instead) if there is an AARTO enforcement order against me, another vehicle in my name is unlicensed, the vehicle needs roadworthy certification, or it carries an administration or police mark. Tell me to check the vehicle on online.natis.gov.za and my infringements/enforcement orders on aarto.gov.za. Do not log in unless I am present and ask you to.
3. Renewal routes and costs, cheapest first, using fees you read on the official page this month and not from memory:
   - NaTIS Online (online.natis.gov.za): licence fee + transaction fee (R72 per a 2023 RTMC statement; read the current amount on the page) + courier. Delivery is usually 3-5 working days. Needs a profile and a 3D-Secure card.
   - My bank app's licence disc renewal (e.g. FNB nav» Car, Nedbank, Standard Bank, Absa, Capitec): note the bank's delivery or convenience fee.
   - In person at my registering authority / licensing office: list the documents. That means my ID, proof of address (an affidavit if the utility bill is not in my name), and the MVL2 renewal notice, or form ALV if I never got the notice.
4. Penalty warning: after the grace period, late-licensing penalties and arrears apply. Quote the amount only if an official source shows it; otherwise say "penalty amount not confirmed".

Hard rules:
- NaTIS Online (online.natis.gov.za) may drop connections from outside South Africa. If it won't load, route the browser through my own SA connection (Grok Bot's route-traffic-through-my-computer setting) or tell me to do the NaTIS step myself. Never use a mirror or agent site instead.
- Use only official sites (natis.gov.za, rtmc.co.za, aarto.gov.za, gauteng.gov.za, gov.za) or my own bank's app. Never use a third-party "renewal agent" site.
- Never pay, submit a form, or accept terms without my explicit go-ahead in this chat, given after you have shown me the exact amount due.
- Never write my ID number, card details or passwords in chat or in files. Read them from the vault only on the official form while I watch.
- Propose calendar events (expiry date, and 6 weeks before next year's expiry). Create them only after I approve.
```

## Why it's cool

The fee itself is small. What hurts is a disc that quietly expires and starts piling up penalties, or a renewal that fails at the counter because of an AARTO enforcement order you didn't know about. This routine checks for blocks first and then compares the official online route with your bank app, so the renewal takes ten minutes instead of a morning in a licensing queue. It still stops at the payment screen.

## Sources

Tested 30 Oct 2026: from a non-SA network, online.natis.gov.za dropped the connection with no error page.

Checked 29 Oct 2026 (SAST).

- 21-day grace period counted from the expiry date; late penalties and arrears after that; in-person documents (ID, proof of address, MVL2 or ALV); NaTIS Online steps: https://www.gov.za/services/register-motor-vehicle/renew-motor-vehicle-licence
- Reasons a disc is not printed (enforcement order, other unlicensed vehicles, roadworthy, admin or police mark), MVLX receipt, 3-5 workday delivery, aarto.gov.za for enforcement orders: https://onlinebulk.natis.gov.za/faqs
- R72 legislated transaction fee, R99 courier, no RTMC admin fee, 3D-Secure required (RTMC statement of 4 Jul 2023, so fees may have changed since): https://www.gov.za/news/media-statements/road-traffic-management-corporation-online-licence-discs-service-growing-04
- RTMC email/SMS reminders, profile at online.natis.gov.za: https://www.rtmc.co.za/images/rtmc/docs/press_releases/2023/Press-Statement-RTMC-Renew-Vehicle-Licence-Disc-and-Save.pdf
- Bank routes: FNB nav» Car licence renewal, https://www.fnb.co.za/ways-to-bank/digital/navCar.html ; Nedbank (R72 transaction + R99 delivery + R20 convenience, renew up to 60 days early), https://business.nedbank.co.za/content/nedbank/za/en/personal/bank/digital-banking/needs/payments/vehicle-licence-disc-renewal-faqs.html
- Not verified on an official page: a "10% of the annual fee per month" late penalty (only a secondary source, The Citizen, reports it), Gauteng licence fee amounts by tare weight, and whether any post office still renews discs (SAPO's online service reportedly closed in Nov 2024).
