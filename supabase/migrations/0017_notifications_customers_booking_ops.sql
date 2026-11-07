-- 0017: lead notifications, customers module grants, booking operations
--
-- 1. `lead.new_team` template: a team-inbox alert for every new website
--    enquiry, queued by the public leads route (recipient comes from env).
-- 2. Accounts can view customers; sales managers can export the customer list
--    and manage bookings (cancel / notes / status).
-- 3. Booking operations from the admin panel: cancellation with a reason,
--    internal notes, and marking a trip completed / no-show.

-- ---------------------------------------------------------------------------
-- 1. Templates
-- ---------------------------------------------------------------------------

insert into notification_templates (code, channel, subject, description) values
  ('lead.new_team', 'email', 'New enquiry received – Trip My Soul',
   'Sent to the team inbox (LEADS_NOTIFY_INBOX / RESEND_BOOKINGS_INBOX) for every new website enquiry.')
on conflict (code) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------

insert into role_permissions (role, module, action) values
  ('accounts', 'customers', 'view'),
  ('sales_manager', 'customers', 'export'),
  ('sales_manager', 'bookings', 'edit')
on conflict (role, module, action) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Booking operations
-- ---------------------------------------------------------------------------

alter table bookings
  add column if not exists cancellation_reason text,
  add column if not exists cancelled_by uuid references staff(id);

create table if not exists booking_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  staff_id uuid references staff(id),
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists booking_notes_booking_idx on booking_notes(booking_id, created_at desc);

-- Service-role only, like every other admin table: no policies.
alter table booking_notes enable row level security;

-- Cancels a booking and gives its seats back to the departure.
--
-- Seat accounting mirrors how seats were taken:
--  * an unreleased seat hold (unpaid, still inside its 15-minute window)
--    is released from held_seats;
--  * a booking that has received money had its hold converted into
--    booked_seats by capture_payment / record_manual_payment, so those seats
--    are returned from booked_seats.
-- Refunds are NOT issued here — money movement stays a deliberate, separate
-- step in the Razorpay dashboard / accounts process.
create or replace function admin_cancel_booking(
  p_booking_id uuid,
  p_staff_id uuid,
  p_reason text
)
returns bookings as $$
declare
  v_booking bookings%rowtype;
  v_hold    seat_holds%rowtype;
begin
  select * into v_booking from bookings where id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0004';
  end if;

  if v_booking.status in ('cancelled', 'completed') then
    raise exception 'BOOKING_NOT_CANCELLABLE' using errcode = 'P0010';
  end if;

  perform 1 from departures where id = v_booking.departure_id for update;

  select * into v_hold from seat_holds where booking_id = v_booking.id for update;
  if found and v_hold.released_at is null then
    update departures set held_seats = greatest(0, held_seats - v_hold.pax) where id = v_hold.departure_id;
    update seat_holds set released_at = now() where id = v_hold.id;
  elsif v_booking.paid_amount > 0 then
    update departures set booked_seats = greatest(0, booked_seats - v_booking.pax) where id = v_booking.departure_id;
  end if;

  update bookings
  set status = 'cancelled',
      cancelled_at = now(),
      cancelled_by = p_staff_id,
      cancellation_reason = nullif(trim(p_reason), '')
  where id = p_booking_id
  returning * into v_booking;

  -- Don't send a trip reminder for a trip that is no longer happening.
  update notification_outbox
  set status = 'cancelled'
  where entity_type = 'booking'
    and entity_id = p_booking_id
    and template_code = 'booking.trip_reminder'
    and status in ('pending', 'failed');

  return v_booking;
end;
$$ language plpgsql;
