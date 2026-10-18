-- 0012: payment ledger extensions for partial/multiple/manual payments + staff
--
-- Fills in the two things 0004/0006 explicitly deferred (CRM, staff/admin
-- surfaces) only to the extent this phase needs: a minimal `staff` table so
-- an admin-recorded cash/UPI/bank-transfer payment has a real identity to
-- attribute to, plus the columns/enum values/RPCs needed to record a second
-- (or third, ...) payment against a booking without touching the existing
-- Razorpay webhook path at all.
--
-- Nothing here changes the meaning of an existing row. `capture_payment`
-- (0011) is untouched — it already does `paid_amount = paid_amount +
-- v_payment.amount` and derives status/payment_state from the total, which
-- is already correct N-payment-row accumulation. This migration only adds
-- the ability to (a) create a second payment row for an existing booking
-- (Razorpay, customer-initiated) and (b) create+capture a manual payment row
-- in one step (admin-initiated), plus (c) let the very first payment be less
-- than the full total.

-- payment_kind already has full/advance/addon/other; the two values this
-- migration relies on ('installment' for a second-or-later online payment,
-- 'final' for the payment that closes the balance) are added in
-- 00115_payment_kind_values.sql. They must land in an earlier transaction:
-- Postgres rejects the use of a newly added enum value in the transaction
-- that added it, and create_additional_payment below defaults p_kind to
-- 'installment'. Existing rows keep their existing kind unchanged.

-- Manual payment methods are stored in payments.gateway (already a free
-- text column, already what gateway_order_id/gateway_payment_id uniqueness
-- is scoped by) rather than a new column — 'razorpay' stays the only value
-- with real gateway order/payment ids; the rest are admin-attested.
alter table payments
  add constraint payments_gateway_chk
  check (gateway in ('razorpay', 'cash', 'upi_manual', 'bank_transfer', 'other'));

alter table payments
  add column transaction_reference text,
  add column notes text,
  add column verified_at timestamptz,
  add column verified_by uuid;

comment on column payments.transaction_reference is 'UPI/bank transfer reference number etc. Not used for razorpay rows (gateway_payment_id is the reference).';
comment on column payments.verified_at is 'Set the moment a manual payment is recorded (the admin recording it is the verification) or when a razorpay payment is captured.';
comment on column payments.recorded_by is 'Free-text actor tag: ''webhook'' for razorpay captures, ''admin'' for manually recorded payments.';

-- Minimal staff/admin identity. One row per Supabase Auth user who is
-- allowed to record manual payments / view the admin booking panel — the
-- auth account itself (email+password) is created in Supabase Auth exactly
-- like a customer's, via the dashboard; this table is what turns "a logged
-- in Supabase user" into "an authorized staff member" (see 0006's deferred
-- placeholder, and requireStaff() in src/lib/server/adminAuth.ts).
create table staff (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id),
  full_name text not null,
  email citext not null,
  role text not null default 'staff' check (role in ('admin', 'staff')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create trigger staff_set_updated_at
  before update on staff
  for each row execute function set_updated_at();

alter table payments
  add column collected_by uuid references staff(id),
  add constraint payments_verified_by_fkey foreign key (verified_by) references staff(id);

comment on column payments.collected_by is 'Staff member who physically collected/recorded a cash/UPI/bank-transfer payment. Null for razorpay rows.';

-- RLS: same default-deny posture as every other transactional table in
-- 0008 — only the service-role key (used exclusively by server code, see
-- requireStaff()) ever reads/writes this table.
alter table staff enable row level security;

-- create_booking_with_hold: identical to 0007's version, except the initial
-- payment row's amount is now a separate, independently-validated parameter
-- (p_initial_payment_amount) instead of always being the full total — this
-- is what lets a customer pay only part of the total at checkout (e.g. a
-- ₹2,000 advance on a ₹10,000 trek) instead of only ever being able to
-- split payments *after* the first one. Existing callers that don't pass it
-- get the old all-or-nothing behaviour (defaults to the full total).
--
-- `create or replace` cannot add a new parameter to an existing function —
-- that creates an ambiguous second overload instead of replacing it (same
-- issue 0010 hit with get_or_create_departure) — so the old 13-arg signature
-- is dropped first.
drop function if exists create_booking_with_hold(
  uuid, int, text, citext, text, jsonb, jsonb,
  numeric(12,2), numeric(12,2), numeric(12,2), numeric(12,2), text, int
);

create or replace function create_booking_with_hold(
  p_departure_id uuid,
  p_pax int,
  p_customer_name text,
  p_customer_email citext,
  p_customer_phone text,
  p_travellers jsonb,
  p_addons jsonb,
  p_gross_amount numeric(12,2),
  p_discount_amount numeric(12,2),
  p_tax_amount numeric(12,2),
  p_total_amount numeric(12,2),
  p_coupon_code text,
  p_hold_minutes int default 15,
  p_initial_payment_amount numeric(12,2) default null
) returns jsonb as $$
declare
  v_dep departures;
  v_customer customers;
  v_booking bookings;
  v_hold seat_holds;
  v_payment payments;
  v_traveller jsonb;
  v_booking_no text;
  v_initial_amount numeric(12,2);
begin
  v_initial_amount := coalesce(p_initial_payment_amount, p_total_amount);
  if v_initial_amount <= 0 or v_initial_amount > p_total_amount then
    raise exception 'INVALID_INITIAL_PAYMENT_AMOUNT' using errcode = 'P0006';
  end if;

  select * into v_dep from departures where id = p_departure_id for update;
  if not found then
    raise exception 'DEPARTURE_NOT_FOUND' using errcode = 'P0001';
  end if;

  if not v_dep.bookable then
    raise exception 'SEATS_UNAVAILABLE' using errcode = 'P0002';
  end if;

  if v_dep.held_seats + v_dep.booked_seats + p_pax > v_dep.total_seats then
    raise exception 'SEATS_UNAVAILABLE' using errcode = 'P0002';
  end if;

  insert into customers (full_name, email, phone)
  values (p_customer_name, p_customer_email, p_customer_phone)
  on conflict (email) do update
    set full_name = excluded.full_name, phone = excluded.phone
  returning * into v_customer;

  v_booking_no := 'TMS-' || to_char(now(), 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into bookings (
    booking_no, customer_id, departure_id, pax, addons,
    gross_amount, discount_amount, tax_amount, total_amount,
    status, payment_state, coupon_code
  ) values (
    v_booking_no, v_customer.id, v_dep.id, p_pax, coalesce(p_addons, '[]'::jsonb),
    p_gross_amount, p_discount_amount, p_tax_amount, p_total_amount,
    'pending_payment', 'unpaid', nullif(p_coupon_code, '')
  ) returning * into v_booking;

  for v_traveller in select * from jsonb_array_elements(p_travellers)
  loop
    insert into booking_travellers (booking_id, full_name, email, is_primary, addons)
    values (
      v_booking.id,
      v_traveller->>'full_name',
      nullif(v_traveller->>'email', ''),
      coalesce((v_traveller->>'is_primary')::boolean, false),
      coalesce(v_traveller->'addons', '[]'::jsonb)
    );
  end loop;

  update departures set held_seats = held_seats + p_pax where id = v_dep.id;

  insert into seat_holds (departure_id, booking_id, pax, expires_at)
  values (v_dep.id, v_booking.id, p_pax, now() + make_interval(mins => p_hold_minutes))
  returning * into v_hold;

  insert into payments (booking_id, kind, amount, currency, status)
  values (
    v_booking.id,
    case when v_initial_amount >= p_total_amount then 'full' else 'advance' end,
    v_initial_amount, 'INR', 'created'
  )
  returning * into v_payment;

  return jsonb_build_object(
    'booking', to_jsonb(v_booking),
    'hold', to_jsonb(v_hold),
    'payment', to_jsonb(v_payment),
    'departure', to_jsonb(v_dep)
  );
end;
$$ language plpgsql;

-- create_additional_payment: the customer-initiated path for a *second* (or
-- later) online payment against a booking that's already past its first
-- payment — e.g. paid the ₹2,000 advance, now paying another ₹3,000. Only
-- creates the payments row (status 'created'); the caller still has to
-- create the Razorpay order and attach_gateway_order exactly like the
-- initial-booking flow, and only the webhook's capture_payment call ever
-- marks it captured/accumulates paid_amount. Locking the booking row here
-- means two concurrent requests for the same booking serialize, so the
-- balance check below is against a consistent snapshot.
create or replace function create_additional_payment(
  p_booking_id uuid,
  p_amount numeric(12,2),
  p_kind payment_kind default 'installment'
) returns payments as $$
declare
  v_booking bookings;
  v_payment payments;
  v_balance numeric(12,2);
begin
  select * into v_booking from bookings where id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0004';
  end if;

  if v_booking.status in ('cancelled', 'draft', 'pending_payment') then
    raise exception 'BOOKING_NOT_PAYABLE' using errcode = 'P0005';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT' using errcode = 'P0006';
  end if;

  v_balance := greatest(v_booking.total_amount - v_booking.paid_amount, 0);
  if p_amount > v_balance then
    raise exception 'AMOUNT_EXCEEDS_BALANCE' using errcode = 'P0007';
  end if;

  insert into payments (booking_id, kind, amount, currency, status, gateway)
  values (p_booking_id, p_kind, p_amount, v_booking.currency, 'created', 'razorpay')
  returning * into v_payment;

  return v_payment;
end;
$$ language plpgsql;

-- record_manual_payment: the admin-initiated path for cash/UPI/bank
-- transfer. Unlike a Razorpay payment, there is no separate "create" then
-- "capture" step — the staff member recording it is attesting the money
-- was already received, so the row is inserted directly as 'captured' and
-- immediately folded into bookings.paid_amount/status/payment_state, using
-- the exact same accumulation + status-derivation logic as capture_payment
-- (0011), and queuing the same booking.payment_received /
-- booking.confirmed(-once) notification_outbox rows so the customer gets
-- the identical email regardless of how the payment was collected. Locks
-- the booking row (and releases any still-open seat hold, for the edge case
-- of a booking whose *first* payment is recorded as cash before Razorpay is
-- ever involved) exactly like capture_payment does.
create or replace function record_manual_payment(
  p_booking_id uuid,
  p_amount numeric(12,2),
  p_method text,
  p_kind payment_kind,
  p_transaction_reference text,
  p_notes text,
  p_staff_id uuid,
  p_captured_at timestamptz default now()
) returns jsonb as $$
declare
  v_booking bookings;
  v_dep departures;
  v_hold seat_holds;
  v_payment payments;
  v_customer customers;
  v_trek treks;
  v_travellers jsonb;
  v_vars jsonb;
  v_prev_status booking_status;
  v_balance numeric(12,2);
begin
  if p_method not in ('cash', 'upi_manual', 'bank_transfer', 'other') then
    raise exception 'INVALID_METHOD' using errcode = 'P0008';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT' using errcode = 'P0006';
  end if;

  select * into v_booking from bookings where id = p_booking_id for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND' using errcode = 'P0004';
  end if;

  if v_booking.status = 'cancelled' then
    raise exception 'BOOKING_NOT_PAYABLE' using errcode = 'P0005';
  end if;

  v_prev_status := v_booking.status;
  v_balance := greatest(v_booking.total_amount - v_booking.paid_amount, 0);
  if p_amount > v_balance then
    raise exception 'AMOUNT_EXCEEDS_BALANCE' using errcode = 'P0007';
  end if;

  select * into v_dep from departures where id = v_booking.departure_id for update;

  select * into v_hold from seat_holds where booking_id = v_booking.id for update;
  if found and v_hold.released_at is null then
    update departures set held_seats = greatest(0, held_seats - v_hold.pax) where id = v_dep.id;
    update seat_holds set released_at = now() where id = v_hold.id;
    update departures set booked_seats = booked_seats + v_booking.pax where id = v_dep.id
    returning * into v_dep;
  end if;

  insert into payments (
    booking_id, kind, amount, currency, gateway, status, method,
    transaction_reference, notes, collected_by, verified_by, verified_at,
    captured_at, recorded_by
  ) values (
    p_booking_id, p_kind, p_amount, v_booking.currency, p_method, 'captured', p_method,
    nullif(p_transaction_reference, ''), nullif(p_notes, ''), p_staff_id, p_staff_id, now(),
    p_captured_at, 'admin'
  ) returning * into v_payment;

  update bookings set
    paid_amount = paid_amount + v_payment.amount,
    status = case when paid_amount + v_payment.amount >= total_amount then 'confirmed' else 'partially_paid' end,
    payment_state = case when paid_amount + v_payment.amount >= total_amount then 'fully_paid' else 'advance_paid' end,
    confirmed_at = case when paid_amount + v_payment.amount >= total_amount then now() else confirmed_at end
  where id = v_booking.id
  returning * into v_booking;

  select * into v_customer from customers where id = v_booking.customer_id;
  select * into v_trek from treks where id = v_dep.trek_id;
  select coalesce(jsonb_agg(jsonb_build_object(
      'full_name', full_name, 'email', email, 'is_primary', is_primary, 'addons', addons
    )), '[]'::jsonb)
    into v_travellers
  from booking_travellers where booking_id = v_booking.id;

  v_vars := jsonb_build_object(
    'booking_no', v_booking.booking_no,
    'booking_status', v_booking.status,
    'pax', v_booking.pax,
    'customer_name', v_customer.full_name,
    'customer_email', v_customer.email,
    'customer_phone', v_customer.phone,
    'travellers', v_travellers,
    'trek_name', v_trek.name,
    'trek_slug', v_dep.trek_slug,
    'region', v_trek.region,
    'difficulty', v_trek.difficulty,
    'duration_days', v_trek.duration_days,
    'batch_label', v_dep.batch_label,
    'start_date', v_dep.start_date,
    'end_date', v_dep.end_date,
    'pickup_location', v_dep.pickup_location,
    'total_amount', v_booking.total_amount,
    'paid_amount', v_booking.paid_amount,
    'balance_amount', greatest(v_booking.total_amount - v_booking.paid_amount, 0),
    'amount_paid', v_payment.amount,
    'currency', v_payment.currency,
    'payment_status', v_payment.status,
    'payment_state', v_booking.payment_state,
    'gateway_payment_id', coalesce(p_transaction_reference, upper(p_method) || '-' || left(v_payment.id::text, 8)),
    'gateway_order_id', null,
    'captured_at', v_payment.captured_at
  );

  insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id)
  values ('booking.payment_received', 'email', v_customer.email, 'customer', v_vars, 'booking', v_booking.id);

  if v_prev_status is distinct from 'confirmed' and v_booking.status = 'confirmed' then
    insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id)
    values ('booking.confirmed', 'email', v_customer.email, 'customer', v_vars, 'booking', v_booking.id);
  end if;

  return jsonb_build_object('booking', to_jsonb(v_booking), 'payment', to_jsonb(v_payment), 'vars', v_vars);
end;
$$ language plpgsql;
