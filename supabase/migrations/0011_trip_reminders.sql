-- 0011: split the single "payment success" customer email into two
-- (Payment Received, fired on every capture; Booking Confirmed, fired only
-- the first time a booking's status actually becomes 'confirmed') and add a
-- Trip Reminder email queued by the daily cron 3 days before departure.
--
-- Two new departure fields (pickup_location, reporting_time) are needed for
-- the Booking Confirmed / Trip Reminder copy and don't exist anywhere in the
-- schema yet — operators fill these in per departure (e.g. via Supabase
-- Studio) when they're known; both are nullable and the emails render "—"
-- until then.

alter table departures
  add column pickup_location text,
  add column reporting_time text;

alter table bookings
  add column reminder_sent_at timestamptz;

insert into notification_templates (code, channel, subject, description) values
  ('booking.payment_received', 'email', 'Payment Received – Trip My Soul', 'Sent every time a payment is captured for a booking (may fire more than once for partial payments).'),
  ('booking.confirmed', 'email', 'Booking Confirmed – Trip My Soul', 'Sent once, the first time a booking''s status transitions to confirmed.'),
  ('booking.trip_reminder', 'email', '3 Days to Go! – Trip My Soul', 'Queued by the daily cron for confirmed bookings departing in exactly 3 days.');

-- capture_payment: same behaviour as 0010, but (a) always queues a
-- Payment Received email and (b) queues a separate, one-time Booking
-- Confirmed email only on the transition into 'confirmed' (never re-sent on
-- a later, redundant capture of an already-confirmed booking).
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
  v_prev_status booking_status;
  v_dep departures;
  v_hold seat_holds;
  v_customer customers;
  v_travellers jsonb;
  v_vars jsonb;
  v_trek treks;
begin
  select * into v_payment from payments where gateway_order_id = p_gateway_order_id for update;
  if not found then
    raise exception 'PAYMENT_NOT_FOUND' using errcode = 'P0003';
  end if;

  if v_payment.status = 'captured' then
    return jsonb_build_object('already_captured', true, 'booking_id', v_payment.booking_id);
  end if;

  select * into v_booking from bookings where id = v_payment.booking_id for update;
  v_prev_status := v_booking.status;
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
    'gateway_payment_id', v_payment.gateway_payment_id,
    'gateway_order_id', v_payment.gateway_order_id,
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

-- queue_trip_reminders: called once daily by the internal cron. Finds every
-- confirmed booking whose departure starts in exactly 3 days and that
-- hasn't been reminded yet, queues one email each, and stamps
-- reminder_sent_at so a re-run (or a Hobby-plan cron catch-up) never
-- double-sends. Returns the number queued.
create or replace function queue_trip_reminders() returns int as $$
declare
  v_count int;
begin
  with due as (
    select b.id as booking_id, b.booking_no, b.pax, c.full_name as customer_name,
           c.email as customer_email, t.name as trek_name, d.start_date, d.end_date,
           d.reporting_time, d.pickup_location
    from bookings b
    join departures d on d.id = b.departure_id
    join treks t on t.id = d.trek_id
    join customers c on c.id = b.customer_id
    where b.status = 'confirmed'
      and b.reminder_sent_at is null
      and d.start_date = current_date + 3
    for update of b skip locked
  ),
  queued as (
    insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id)
    select
      'booking.trip_reminder', 'email', due.customer_email, 'customer',
      jsonb_build_object(
        'booking_no', due.booking_no,
        'pax', due.pax,
        'customer_name', due.customer_name,
        'customer_email', due.customer_email,
        'trek_name', due.trek_name,
        'start_date', due.start_date,
        'end_date', due.end_date,
        'reporting_time', due.reporting_time,
        'pickup_location', due.pickup_location
      ),
      'booking', due.booking_id
    from due
    returning entity_id
  )
  update bookings set reminder_sent_at = now()
  where id in (select entity_id from queued);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$ language plpgsql;
