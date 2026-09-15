# Payment + Booking Persistence — Implementation Notes

This covers the Razorpay + Supabase + Resend payment phase added on top of the
existing static-catalogue Next.js frontend. Scope was deliberately limited to
payment/booking persistence — no CRM, admin panel, dashboards, refunds UI, or
WhatsApp/SMS were added.

## 1. Why this looks the way it does

The repo had **no backend of any kind** before this change: no API routes, no
database, no Go service. Per the HLD/LLD's own fallback guidance for that
case, the business layer was implemented as Next.js Route Handlers acting as
both BFF and application tier, directly on Supabase Postgres — not a
simplified schema, the same enums/tables/statuses the LLD specifies, just
without CRM/platform tables (reserved, see below).

## 2. Deliberate deviation from the LLD: no seat inventory existed

The static catalogue (`src/data/db.ts` etc.) has **no numeric seat capacity**
anywhere — departures are free-text batch labels (`"06 Aug-11 Aug 2026"`)
with only a status string, and the code itself had a `TODO(data-model)`
admitting this. There was no 75+ trek/departure data migration to run.

Instead: `treks` and `departures` rows are **lazily upserted** the first time
a given `(trek slug, batch label)` is actually booked (`get_or_create_departure`
in `supabase/migrations/0007_functions_triggers.sql`), seeded from the static
catalogue's name/price and a default `total_seats = 20`. From that first
booking onward, Postgres is the authoritative seat count for that departure.
**Backfilling the full catalogue ahead of time, and wiring per-batch real
capacity into the frontend data files, is future work.**

## 3. Files

**Migrations** (`supabase/migrations/`) — numbered to match the LLD's target
sequence so future phases slot in without renumbering:
- `0001_extensions_and_enums.sql` — pgcrypto/citext, all enums, `set_updated_at`
- `0002_identity.sql` — `customers` (guest-checkout identity; no login/auth this phase)
- `0003_catalog.sql` — `treks`, `departures`, `seat_holds` (capacity invariant as a CHECK constraint)
- `0004_crm.sql` — **empty, reserved** (CRM explicitly out of scope)
- `0005_commerce.sql` — `bookings`, `booking_travellers`, `payments`, `idempotency_keys`, `webhook_events`, `notification_templates`, `notification_outbox`
- `0006_platform.sql` — **empty, reserved** (admin/staff explicitly out of scope)
- `0007_functions_triggers.sql` — every atomic operation: `get_or_create_departure`, `create_booking_with_hold`, `attach_gateway_order`, `mark_payment_attempted/authorized`, `capture_payment` (the critical transaction), `fail_payment`, `release_expired_seat_holds`
- `0008_rls.sql` — RLS enabled everywhere; only `treks`/`departures` are publicly readable; everything else is service-role-only (defence in depth — the service role bypasses RLS and is the only thing that ever touches these tables)

**Server library** (`src/lib/server/`, all guarded with `import "server-only"`):
`env.ts`, `supabase.ts` (service-role client), `catalog.ts` (resolves trek/price
from the existing static data), `pricing.ts` (server-computed gross/discount/
tax/total — mirrors the checkout UI's own math but is the only side that's
ever trusted), `razorpay.ts` (order creation + both signature verifications),
`resend.ts`, `idempotency.ts`, `errors.ts`, `notifications.ts`, `email-templates/bookingPaymentSuccess.ts`.

**API routes** (`src/app/api/`):
- `POST /api/v1/public/bookings` — validates input, resolves the authoritative price, calls `get_or_create_departure` then `create_booking_with_hold` (locks the departure row, checks capacity, creates customer/booking/travellers/hold/payment atomically), creates the Razorpay order (network call, *after* that DB transaction, never inside it), attaches it to the payment row. Requires `Idempotency-Key`.
- `POST /api/v1/public/bookings/:bookingNo/payment-intent` — regenerates/reuses the Razorpay order for a still-valid hold (retry path). Requires `Idempotency-Key`.
- `POST /api/v1/public/payments/verify` — **advisory only**, checks the checkout callback signature, never confirms a booking.
- `GET /api/v1/public/bookings/lookup?booking_no=&email=` — used by the success page to poll; requires the email to match (doesn't leak booking existence to the wrong email).
- `POST /api/webhooks/razorpay` — **the authoritative path**. Verifies `X-Razorpay-Signature` (HMAC-SHA256), persists the raw event first (this row is also the dedupe gate), and only reprocesses an event if it was previously *inserted but never marked processed* (a genuine retry of a prior failure) — a truly-already-processed event returns 200 and does nothing, per spec. Calls `capture_payment`/`fail_payment`/`mark_payment_authorized`, then best-effort (outside the DB transaction) triggers notification dispatch.
- `GET|POST /api/internal/cron` — releases expired seat holds and retries failed notifications. See §6 below on scheduling.

**UI**: `src/app/checkout/page.tsx` was rewired in place (participants/add-ons/
coupon UI kept as-is) — added a "Your Details" name/email/phone card (there
was no phone field before), replaced the fake `setTimeout` "Pay Now" with the
real flow (`src/lib/client/checkoutApi.ts`), added `src/components/checkout/SeatHoldCountdown.tsx`
(ticks down from the server's `expires_at`, never a client `setTimeout(15*60*1000)`),
and added explicit states for preparing/awaiting-payment/confirming/success/
failure/expired, each with `aria-live` regions.

## 4. Payment flow as implemented

Cart → `POST /bookings` (booking + 15-min hold + Razorpay order, one round
trip) → Razorpay Checkout modal → on the browser `handler` callback: call
`/payments/verify` (advisory, UI-only) and move to a "confirming your
booking" state → poll `/bookings/lookup` → **only** the signed
`payment.captured` webhook actually flips the booking to `confirmed`/
`partially_paid` and queues the confirmation email. If the customer closes
the tab right after paying, the webhook still runs it through to completion
independently — nothing depends on the browser being open.

## 5. Environment variables

See `.env.example`. Required: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
`RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
`CRON_SECRET`. Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` is ever sent to the browser.

## 6. Known limitation: cron cadence

Seat holds need sweeping and failed emails need retrying on a schedule.
`vercel.json` wires `/api/internal/cron` as a Vercel Cron job, but **Vercel's
Hobby plan only runs crons once a day**, so it's set to `0 3 * * *` (03:00
daily) purely as a backstop — that's far too infrequent for a 15-minute hold.
The real cadence has to come from an external scheduler (e.g. cron-job.org)
hitting `POST /api/internal/cron` with header `x-internal-secret:
$CRON_SECRET` every 1-2 minutes. (If you later move to a paid Vercel plan,
you can drop the external scheduler and tighten `vercel.json`'s schedule
instead — crons on paid plans can run every minute.) This is a deploy-time
configuration step, not something the code can resolve on its own.

## 7. Setup

1. `npm install`
2. Run the migrations in `supabase/migrations/` in order against your
   Supabase project (`supabase db push` with the Supabase CLI linked to the
   project, or paste each file into the SQL editor in order — they're plain
   numbered SQL files, no Supabase-CLI-specific syntax).
3. Copy `.env.example` to `.env.local` and fill in real values (test-mode
   Razorpay keys for local dev).
4. In the Razorpay dashboard, add a webhook pointing at
   `https://<your-domain>/api/webhooks/razorpay` (or an `ngrok`/similar tunnel
   URL for local testing), subscribed to `payment.captured`, `payment.failed`,
   `payment.authorized`, `order.paid`, and set its secret to your
   `RAZORPAY_WEBHOOK_SECRET`.
5. In Resend, verify a sending domain and set `RESEND_FROM_EMAIL` to an
   address on it.
6. `npm run dev`, then walk through Cart → Checkout → pay with a Razorpay
   test card → the webhook (via your tunnel) → check the `bookings`/`payments`
   rows in Supabase → confirm the success screen appears → confirm the Resend
   email arrives.
7. `npm run build` / `npm run test` / `npm run lint` before deploying.

## 8. Tests added

`npm run test` (Vitest) covers the pure/deterministic logic that doesn't
require a live Postgres or Razorpay sandbox: INR↔paise conversion and amount
validation (`src/lib/money.test.ts`), the server-side pricing calculation
including the coupon/add-on/GST math (`src/lib/server/pricing.test.ts`),
idempotency request hashing (`src/lib/server/idempotency.test.ts`), and both
Razorpay HMAC signature verifications, including a tampered-payload rejection
case (`src/lib/server/razorpay.test.ts`).

**Explicitly deferred, not silently skipped:** integration tests against a
real Postgres (capacity constraint under concurrent bookings, the full
`capture_payment` transaction, RLS policy behavior) and true end-to-end tests
(webhook replay/dedupe against a live endpoint, a real Razorpay test-mode
payment, a real Resend send) need a running Supabase instance and a Razorpay
test account/webhook tunnel that don't exist in this session — they should be
added once the project has a CI environment that can provision those.

## 9. What's deferred by design (per the phase scope)

CRM, admin panel, dashboards, refunds UI, WhatsApp/SMS, staff/sales
functionality, advanced invoice PDFs. Migration numbers `0004`/`0006` are
reserved (currently empty files) so CRM/platform work can be added later
without renumbering.
