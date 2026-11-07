# Admin system — lead, customer & booking management

What the client brief asked for, and where it lives:

| Requirement | Where |
|---|---|
| Website lead capture | All website forms post to `POST /api/v1/public/leads` (`submitLead()`), incl. Contact Us and Corporate Expeditions |
| Lead storage | `leads` + `lead_activities` tables (0016) |
| Admin dashboard | `/admin` |
| Lead management | `/admin/leads`, `/admin/leads/[leadNo]` |
| Booking management | `/admin/bookings`, `/admin/bookings/[bookingNo]` — record payments, internal notes, cancel (releases seats), mark completed / no-show |
| Booking confirmation email | `booking.confirmed` queued by the payment functions, sent via Resend |
| Notifications | New enquiry → team inbox (`lead.new_team`) + assigned salesperson (`lead.new_assigned`); repeat enquiry → owner; customer auto-reply; paid booking → `RESEND_BOOKINGS_INBOX` |
| Customer database | `/admin/customers` (search, CSV export), `/admin/customers/[id]` (bookings, payments, enquiries, edit contact details) |
| Payments | Razorpay checkout + webhook, manual payments, custom quotes / payment links |

## Deploying these changes

1. Apply the new migration: `supabase db push` (adds `0017_notifications_customers_booking_ops.sql`).
2. In Vercel env vars, optionally set `LEADS_NOTIFY_INBOX` (falls back to `RESEND_BOOKINGS_INBOX`).
3. Make sure salespeople who should receive leads have `staff.accepts_leads = true`.
4. Lead emails are sent immediately after each enquiry; the cron (`/api/internal/cron`) is the retry path.
   Emails that fail 8 times are parked as `cancelled` in `notification_outbox` (see `last_error`).

## Notes

- Cancelling a booking never refunds money automatically — process refunds in Razorpay / accounts.
- Permissions are rows in `role_permissions` (module × action). `super_admin` can do everything.
