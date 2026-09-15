-- 0007: functions/triggers for the payment phase
--
-- These are the only places business-critical, must-be-atomic state changes
-- happen. Every function below runs as a single statement from the caller's
-- point of view, i.e. one Postgres transaction per RPC call — this is how
-- "no network calls inside a DB transaction" is enforced: Razorpay/Resend
-- calls happen in TypeScript *outside* any of these functions, before or
-- after invoking them, never inside.
--
-- All are called exclusively with the Supabase service-role key from server
-- code (never from the browser), so they intentionally do not use
-- `security definer` — RLS is bypassed by the service role already, and
-- keeping them `security invoker` (the default) avoids granting anon/
-- authenticated any extra privilege if one is ever called with a lesser key.

-- Fetches a departure by (trek_slug, batch_label), or creates it the first
-- time this batch is ever booked. See the deviation note in 0003_catalog.sql.
create or replace function get_or_create_departure(
  p_trek_slug text,
  p_trek_name text,
  p_batch_label text,
  p_start_date date,
  p_end_date date,
  p_seed_price numeric(12,2),
  p_seed_total_seats int,
  p_duration_days int
) returns departures as $$
declare
  v_trek treks;
  v_dep departures;
begin
  select * into v_trek from treks where slug = p_trek_slug;
  if not found then
    insert into treks (slug, name, duration_days)
    values (p_trek_slug, p_trek_name, p_duration_days)
    returning * into v_trek;
  end if;

  select * into v_dep
  from departures
  where trek_slug = p_trek_slug and batch_label = p_batch_label
  for update;

  if not found then
    insert into departures (
      trek_id, trek_slug, batch_label, start_date, end_date, price, total_seats
    ) values (
      v_trek.id, p_trek_slug, p_batch_label, p_start_date, p_end_date, p_seed_price,
      coalesce(p_seed_total_seats, 20)
    )
    returning * into v_dep;
  end if;

  return v_dep;
end;
$$ language plpgsql;

-- Atomically: locks the departure row, re-checks capacity, creates the
-- customer (upsert by email), the booking, its travellers, a 15-minute seat
-- hold, and the initial `created` payment row. Amounts are passed in already
-- computed (server-side, from the authoritative departure price) — this
-- function only enforces capacity + persists state, it does not price
-- anything.
create or replace function create_booking_with_hold(
  p_departure_id uuid,
  p_pax int,
  p_customer_name text,
  p_customer_email citext,
  p_customer_phone text,
  p_travellers jsonb,          -- [{full_name, email, is_primary, addons}]
  p_addons jsonb,               -- booking-level addons summary
  p_gross_amount numeric(12,2),
  p_discount_amount numeric(12,2),
  p_tax_amount numeric(12,2),
  p_total_amount numeric(12,2),
  p_coupon_code text,
  p_hold_minutes int default 15
) returns jsonb as $$
declare
  v_dep departures;
  v_customer customers;
  v_booking bookings;
  v_hold seat_holds;
  v_payment payments;
  v_traveller jsonb;
  v_booking_no text;
begin
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
  values (v_booking.id, 'full', p_total_amount, 'INR', 'created')
  returning * into v_payment;

  return jsonb_build_object(
    'booking', to_jsonb(v_booking),
    'hold', to_jsonb(v_hold),
    'payment', to_jsonb(v_payment),
    'departure', to_jsonb(v_dep)
  );
end;
$$ language plpgsql;

-- Attaches the Razorpay order id to a payment row after the order has been
-- created (that HTTP call happens in TypeScript, outside any transaction).
create or replace function attach_gateway_order(
  p_payment_id uuid,
  p_gateway_order_id text
) returns payments as $$
declare
  v_payment payments;
begin
  update payments
  set gateway_order_id = p_gateway_order_id, status = 'created'
  where id = p_payment_id
  returning * into v_payment;
  return v_payment;
end;
$$ language plpgsql;

create or replace function mark_payment_attempted(
  p_gateway_order_id text
) returns void as $$
begin
  update payments
  set status = 'attempted'
  where gateway_order_id = p_gateway_order_id and status = 'created';
end;
$$ language plpgsql;

create or replace function mark_payment_authorized(
  p_gateway_order_id text,
  p_gateway_payment_id text,
  p_method text,
  p_gateway_payload jsonb
) returns void as $$
begin
  update payments
  set status = 'authorized',
      gateway_payment_id = p_gateway_payment_id,
      method = p_method,
      gateway_payload = p_gateway_payload
  where gateway_order_id = p_gateway_order_id
    and status in ('created', 'attempted');
end;
$$ language plpgsql;

-- THE critical transaction: payment.captured. Locks the departure, updates
-- the payment, converts the seat hold into booked seats, updates the
-- booking, and queues the confirmation email as an outbox row — all in one
-- transaction, with no network I/O. Idempotent: a payment already at
-- 'captured' is a no-op (webhook_events dedupe already prevents re-entry in
-- the normal case; this is defence in depth).
create or replace function capture_payment(
  p_gateway_order_id text,
  p_gateway_payment_id text,
  p_method text,
  p_method_detail jsonb,
  p_fee numeric(12,2),
  p_tax_on_fee numeric(12,2),
  p_gateway_payload jsonb,
  p_captured_at timestamptz
) returns jsonb as $$
declare
  v_payment payments;
  v_booking bookings;
  v_dep departures;
  v_hold seat_holds;
  v_customer customers;
  v_travellers jsonb;
  v_vars jsonb;
begin
  select * into v_payment from payments where gateway_order_id = p_gateway_order_id for update;
  if not found then
    raise exception 'PAYMENT_NOT_FOUND' using errcode = 'P0003';
  end if;

  if v_payment.status = 'captured' then
    return jsonb_build_object('already_captured', true, 'booking_id', v_payment.booking_id);
  end if;

  select * into v_booking from bookings where id = v_payment.booking_id for update;
  select * into v_dep from departures where id = v_booking.departure_id for update;

  update payments set
    status = 'captured',
    gateway_payment_id = p_gateway_payment_id,
    method = p_method,
    method_detail = p_method_detail,
    fee = p_fee,
    tax_on_fee = p_tax_on_fee,
    gateway_payload = p_gateway_payload,
    captured_at = p_captured_at,
    recorded_by = 'webhook'
  where id = v_payment.id
  returning * into v_payment;

  select * into v_hold from seat_holds where booking_id = v_booking.id for update;
  if found and v_hold.released_at is null then
    update departures set held_seats = greatest(0, held_seats - v_hold.pax) where id = v_dep.id;
    update seat_holds set released_at = now() where id = v_hold.id;
  end if;

  update departures set booked_seats = booked_seats + v_booking.pax where id = v_dep.id
  returning * into v_dep;

  update bookings set
    paid_amount = paid_amount + v_payment.amount,
    status = case when paid_amount + v_payment.amount >= total_amount then 'confirmed' else 'partially_paid' end,
    payment_state = case when paid_amount + v_payment.amount >= total_amount then 'fully_paid' else 'advance_paid' end,
    confirmed_at = case when paid_amount + v_payment.amount >= total_amount then now() else confirmed_at end
  where id = v_booking.id
  returning * into v_booking;

  select * into v_customer from customers where id = v_booking.customer_id;
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
    'trek_name', (select name from treks where id = v_dep.trek_id),
    'trek_slug', v_dep.trek_slug,
    'batch_label', v_dep.batch_label,
    'start_date', v_dep.start_date,
    'end_date', v_dep.end_date,
    'amount_paid', v_payment.amount,
    'currency', v_payment.currency,
    'payment_status', v_payment.status,
    'gateway_payment_id', v_payment.gateway_payment_id,
    'gateway_order_id', v_payment.gateway_order_id,
    'captured_at', v_payment.captured_at
  );

  insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id)
  values ('booking.payment_success', 'email', v_customer.email, 'customer', v_vars, 'booking', v_booking.id);

  return jsonb_build_object('booking', to_jsonb(v_booking), 'payment', to_jsonb(v_payment));
end;
$$ language plpgsql;

create or replace function fail_payment(
  p_gateway_order_id text,
  p_failure_code text,
  p_failure_reason text,
  p_gateway_payload jsonb
) returns void as $$
begin
  update payments set
    status = 'failed',
    failure_code = p_failure_code,
    failure_reason = p_failure_reason,
    gateway_payload = p_gateway_payload,
    recorded_by = 'webhook'
  where gateway_order_id = p_gateway_order_id
    and status <> 'captured';
end;
$$ language plpgsql;

-- Sweep: releases seat holds past their expiry and cancels bookings that
-- never got captured. Safe to call repeatedly / concurrently — each row is
-- only touched once (guarded by released_at is null).
create or replace function release_expired_seat_holds() returns int as $$
declare
  v_hold record;
  v_count int := 0;
begin
  for v_hold in
    select * from seat_holds
    where released_at is null and expires_at < now()
    for update skip locked
  loop
    update departures set held_seats = greatest(0, held_seats - v_hold.pax) where id = v_hold.departure_id;
    update seat_holds set released_at = now() where id = v_hold.id;
    update bookings set status = 'cancelled'
      where id = v_hold.booking_id and status in ('draft', 'pending_payment');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$ language plpgsql;
