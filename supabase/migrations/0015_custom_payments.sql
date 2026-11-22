-- 0015: custom payments (self-serve /pay, admin-generated quote links,
-- TBD-trip lead capture, generic rate limiting)
--
-- Design: a custom payment is still a `bookings` row (booking_type =
-- 'custom' instead of 'trek'), against one shared, non-scarce sentinel
-- departure — so it flows through the exact same create_booking_with_hold /
-- capture_payment / webhook / notification-outbox / My-Bookings machinery
-- that real trek bookings already use, instead of a parallel ledger. The
-- sentinel departure's total_seats is set absurdly high so the existing
-- capacity check in create_booking_with_hold never blocks a custom payment.

insert into treks (slug, name, duration_days, region, difficulty)
values ('custom-payment', 'Custom Payment', null, null, null)
on conflict (slug) do nothing;

insert into departures (trek_id, trek_slug, batch_label, price, total_seats, bookable)
select id, 'custom-payment', 'one-time', 1, 1000000, true
from treks where slug = 'custom-payment'
on conflict (trek_slug, batch_label) do nothing;

alter table bookings
  add column booking_type text not null default 'trek' check (booking_type in ('trek', 'custom')),
  add column custom_trip_label text,
  add column custom_purpose text check (custom_purpose is null or custom_purpose in ('advance', 'full', 'balance', 'addon')),
  add column custom_notes text;

comment on column bookings.custom_trip_label is 'Free-text trip the customer/admin entered for a custom payment (existing trek name or "Other / Custom Itinerary"). Null for booking_type = ''trek'', where the real trek/departure already carries this.';

create index bookings_booking_type_idx on bookings(booking_type);

-- create_booking_with_hold: add trailing, all-defaulted params so a custom
-- payment can tag the booking row without touching the trek-booking call
-- site in src/app/api/v1/public/bookings/route.ts. Same drop-then-recreate
-- requirement as 0010/0012 — `create or replace` cannot add a parameter to
-- an existing signature.
drop function if exists create_booking_with_hold(
  uuid, int, text, citext, text, jsonb, jsonb,
  numeric(12,2), numeric(12,2), numeric(12,2), numeric(12,2), text, int, numeric(12,2)
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
  p_initial_payment_amount numeric(12,2) default null,
  p_booking_type text default 'trek',
  p_custom_trip_label text default null,
  p_custom_purpose text default null,
  p_custom_notes text default null
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
    status, payment_state, coupon_code,
    booking_type, custom_trip_label, custom_purpose, custom_notes
  ) values (
    v_booking_no, v_customer.id, v_dep.id, p_pax, coalesce(p_addons, '[]'::jsonb),
    p_gross_amount, p_discount_amount, p_tax_amount, p_total_amount,
    'pending_payment', 'unpaid', nullif(p_coupon_code, ''),
    p_booking_type, p_custom_trip_label, p_custom_purpose, p_custom_notes
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
    -- The ::payment_kind casts are load-bearing: a CASE over two bare string
    -- literals resolves to text, and there is no assignment cast from text to
    -- an enum, so payments.kind would fail with 42804 on every checkout.
    -- See 0014_fix_enum_casts.sql and 0019_restore_payment_kind_cast.sql.
    case when v_initial_amount >= p_total_amount then 'full'::payment_kind
         else 'advance'::payment_kind end,
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

-- Admin-generated locked payment links (/pay/[token]). One row per quote;
-- `booking_id` is set the first time the customer actually starts paying it
-- (see src/lib/server/customPayments.ts), and `status` moves to 'paid' from
-- the webhook once that booking's payment is captured (see the razorpay
-- webhook route). Nothing here duplicates payment state already tracked on
-- the linked booking/payment rows.
create table custom_quotes (
  id uuid primary key default gen_random_uuid(),
  token text not null,
  customer_name text not null,
  customer_email citext not null,
  customer_phone text not null,
  trip_label text not null,
  departure_date date,
  pax int not null default 1 check (pax between 1 and 60),
  amount numeric(12,2) not null check (amount > 0 and amount <= 10000000),
  purpose text not null check (purpose in ('advance', 'full', 'balance', 'addon')),
  addon_detail text,
  notes text,
  expiry_date date not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'cancelled')),
  created_by uuid references staff(id),
  booking_id uuid references bookings(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (token)
);

create index custom_quotes_status_idx on custom_quotes(status);
create index custom_quotes_booking_id_idx on custom_quotes(booking_id);

create trigger custom_quotes_set_updated_at
  before update on custom_quotes
  for each row execute function set_updated_at();

-- TBD-priced trip leads ("Get Custom Quote") and, if reused for it later,
-- the "Request a Call Back" form — both are pre-payment leads an admin
-- answers by hand with a custom_quotes link, not a payment record.
create table quote_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext,
  phone text not null,
  trip_label text,
  departure_date date,
  message text,
  source text not null default 'tbd_quote' check (source in ('tbd_quote', 'callback')),
  status text not null default 'new' check (status in ('new', 'quoted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index quote_leads_status_idx on quote_leads(status);

create trigger quote_leads_set_updated_at
  before update on quote_leads
  for each row execute function set_updated_at();

-- Generic IP/email rate limiting for public, unauthenticated write endpoints
-- (/pay, /quote-leads, /quotes/:token/pay) — same rolling-window shape as
-- email_verification_sends (0009), generalised across endpoints instead of
-- one table per endpoint.
create table rate_limit_hits (
  id bigint generated always as identity primary key,
  endpoint text not null,
  rate_key text not null,
  created_at timestamptz not null default now()
);

create index rate_limit_hits_lookup_idx on rate_limit_hits(endpoint, rate_key, created_at);

-- Prune old rows lazily rather than a cron: any row older than 1 day is
-- irrelevant to every window used in this codebase (all <= 15 minutes).
create index rate_limit_hits_created_at_idx on rate_limit_hits(created_at);

alter table custom_quotes enable row level security;
alter table quote_leads enable row level security;
alter table rate_limit_hits enable row level security;
-- No policies for anon/authenticated on any of the three -> default deny,
-- same posture as every other transactional table (0008/0012). Only the
-- service-role key (server code) ever touches them.
