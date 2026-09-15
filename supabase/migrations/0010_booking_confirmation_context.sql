-- 0010: thread region/difficulty through to the booking-confirmation email,
-- and have capture_payment hand back the same vars it queues for the
-- customer email so the webhook can also fire a best-effort internal copy
-- without a second round-trip.
--
-- get_or_create_departure's parameter list changes (two new params), so the
-- old signature is dropped first — `create or replace function` only
-- replaces a function when the argument list matches exactly; with extra
-- params (even defaulted) it would otherwise create an ambiguous overload.

drop function if exists get_or_create_departure(
  text, text, text, date, date, numeric(12,2), int, int
);

create or replace function get_or_create_departure(
  p_trek_slug text,
  p_trek_name text,
  p_batch_label text,
  p_start_date date,
  p_end_date date,
  p_seed_price numeric(12,2),
  p_seed_total_seats int,
  p_duration_days int,
  p_region text default null,
  p_difficulty text default null
) returns departures as $$
declare
  v_trek treks;
  v_dep departures;
begin
  select * into v_trek from treks where slug = p_trek_slug;
  if not found then
    insert into treks (slug, name, duration_days, region, difficulty)
    values (p_trek_slug, p_trek_name, p_duration_days, p_region, p_difficulty)
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

-- capture_payment: same behaviour as 0007, plus region/difficulty/price in
-- v_vars (for the richer customer template) and 'vars' included in the
-- returned jsonb so the webhook handler can send the internal notification
-- copy from this same result, instead of re-querying.
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
    'total_amount', v_booking.total_amount,
    'amount_paid', v_payment.amount,
    'currency', v_payment.currency,
    'payment_status', v_payment.status,
    'gateway_payment_id', v_payment.gateway_payment_id,
    'gateway_order_id', v_payment.gateway_order_id,
    'captured_at', v_payment.captured_at
  );

  insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id)
  values ('booking.payment_success', 'email', v_customer.email, 'customer', v_vars, 'booking', v_booking.id);

  return jsonb_build_object('booking', to_jsonb(v_booking), 'payment', to_jsonb(v_payment), 'vars', v_vars);
end;
$$ language plpgsql;
