-- 0013: expose the manual payment method to the Payment Received email.
--
-- record_manual_payment (0012) already puts a synthesized reference
-- (e.g. CASH-a1b2c3d4) in vars.gateway_payment_id, but the email template had
-- no way to tell a manual payment from a Razorpay one, so it always labelled
-- the row "Transaction ID". This adds vars.payment_method (the same value as
-- payments.gateway: cash / upi_manual / bank_transfer / other) so the
-- template can render "Payment reference: Cash · CASH-a1b2c3d4".
--
-- Also treats an empty-string transaction reference the same as null when
-- building that fallback reference (0012's coalesce let '' through, which
-- rendered a blank reference).
--
-- capture_payment (Razorpay) is intentionally untouched: rows without
-- payment_method are rendered exactly as before.

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
'payment_method', p_method,
'gateway_payment_id', coalesce(nullif(p_transaction_reference, ''), upper(p_method) || '-' || left(v_payment.id::text, 8)),
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
