# Email setup: direct results to the user

## Current code behavior

The site posts to `https://iqtestemails.gorelikgo.workers.dev`. Every payload now includes `lang` (`en` or `ru` from the URL). Results emails (`type: send-results-only`) are rendered in that language and sent **to the address the user typed**. Admin gets BCC plus a separate notification. There is no `[TEST for …]` subject and no “forward this by hand” copy.

The frontend (Pages) and the Worker (workers.dev) deploy separately. Merging this PR updates the site; the Worker must be redeployed from `functions/api/worker.js` (`npx wrangler deploy` or paste/upload in the Cloudflare Worker editor).

## Remaining dashboard step (required for live delivery)

Resend’s `onboarding@resend.dev` sender can only deliver to the Resend account owner’s mailbox. Until a real sending domain is verified, a results email to a stranger’s inbox will 403 and the form will show an error.

Do this once in the Resend dashboard (no code change after secrets are set):

1. Open [https://resend.com/domains](https://resend.com/domains) → **Add Domain** → `iqtestnow.org` (or a subdomain such as `mail.iqtestnow.org`).
2. Add the DNS records Resend shows (typically DKIM `TXT`, SPF `TXT`, and MX / return-path). In Cloudflare DNS, use the exact names and values from Resend; proxy status should be **DNS only** for those records.
3. Wait until the domain status is **Verified** (often minutes, sometimes longer).
4. Set the Cloudflare Worker secret (Workers → `iqtestemails` → Settings → Variables / Secrets), or `npx wrangler secret put FROM_EMAIL`:

   `FROM_EMAIL` = `IQ Test <noreply@iqtestnow.org>`

   Use an address on the **same** domain you verified (if you verified `mail.iqtestnow.org`, the From address must use that host). Do not leave From as `onboarding@resend.dev`.
5. Redeploy the Worker if you have not already (`npx wrangler deploy`). Existing secrets `RESEND_API_KEY` and `ADMIN_EMAIL` stay as they are. Do not put API keys in git.

Optional: `REPLY_TO` if replies should go somewhere other than `ADMIN_EMAIL`.

## Test plan

Offline (this PR):

```bash
npm run test:email
```

Live, after Worker deploy + domain verification:

1. **English:** open `https://iqtestnow.org/en/`, finish the test, send results to a real inbox you control that is **not** the Resend account owner. The message must be English (`Your IQ test results`, “Range”, not «Результаты» / «Диапазон»). From should be the verified domain, To should be that inbox. Nobody forwards anything.
2. **Russian:** same flow on `https://iqtestnow.org/ru/` to the same or another real inbox. Message must be Russian (`Результаты IQ теста`, «Диапазон»).
3. Confirm the operator mailbox gets BCC/copy only — not as the sole recipient, and not a `[TEST for user@…]` wrapper.
4. In the browser Network tab, the POST body to the Worker must include `"lang":"en"` or `"lang":"ru"`.
5. Negative check (optional, before domain verify): sending to a non-owner inbox should fail with a 502 and a `hint` about `resend.com/domains` instead of a fake success.

Until that is done, send results **today** with a new Gmail compose from `iqtestnoworg@gmail.com` (not a forward chain). How-to and paste-ready EN/RU bodies: [`docs/SEND_RESULTS.md`](docs/SEND_RESULTS.md).
