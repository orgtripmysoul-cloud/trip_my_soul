-- 0005: commerce (bookings, travellers, payments, idempotency, webhooks, notifications)

create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_no text not null,
  customer_id uuid not null references customers(id),
  departure_id uuid not null references departures(id),
  pax int not null check (pax between 1 and 60),
  addons jsonb not null default '[]'::jsonb,
  gross_amount numeric(12,2) not null check (gross_amount > 0),
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  tax_amount numeric(12,2) not null default 0 check (tax_amount >= 0),
  total_amount numeric(12,2) not null check (total_amount > 0 and total_amount <= 10000000),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  currency text not null default 'INR',
  status booking_status not null default 'draft',
  payment_state booking_payment_state not null default 'unpaid',
  coupon_code text,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_no)
);

create index bookings_customer_id_idx on bookings(customer_id);
create index bookings_departure_id_idx on bookings(departure_id);
create index bookings_status_idx on bookings(status);

create trigger bookings_set_updated_at
  before update on bookings
  for each row execute function set_updated_at();

alter table seat_holds
  add constraint seat_holds_booking_id_fkey
  foreign key (booking_id) references bookings(id);

create table booking_travellers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  full_name text not null,
  email citext,
  is_primary boolean not null default false,
  addons jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index booking_travellers_booking_id_idx on booking_travellers(booking_id);

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  kind payment_kind not null default 'full',
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'INR',
  gateway text not null default 'razorpay',
  gateway_order_id text,
  gateway_payment_id text,
  gateway_signature text,
  method text,
  method_detail jsonb,
  status payment_status not null default 'created',
  failure_code text,
  failure_reason text,
  fee numeric(12,2),
  tax_on_fee numeric(12,2),
  gateway_payload jsonb,
  idempotency_key text,
  captured_at timestamptz,
  reconciled_at timestamptz,
  settlement_id text,
  recorded_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_booking_id_idx on payments(booking_id);
create unique index payments_gateway_order_id_uq on payments(gateway, gateway_order_id) where gateway_order_id is not null;
create unique index payments_gateway_payment_id_uq on payments(gateway, gateway_payment_id) where gateway_payment_id is not null;

create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

create table idempotency_keys (
  endpoint text not null,
  key text not null,
  actor_id text,
  request_hash text not null,
  status_code int,
  response jsonb,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  primary key (endpoint, key)
);

create index idempotency_keys_expires_at_idx on idempotency_keys(expires_at);

create table webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text,
  unique (provider, event_id)
);

create table notification_templates (
  code text primary key,
  channel notification_channel not null,
  subject text,
  description text,
  created_at timestamptz not null default now()
);

insert into notification_templates (code, channel, subject, description) values
  ('booking.payment_success', 'email', 'Your TripMySoul booking is confirmed', 'Sent after Razorpay payment.captured is processed for a booking.');

create table notification_outbox (
  id uuid primary key default gen_random_uuid(),
  template_code text not null references notification_templates(code),
  channel notification_channel not null,
  recipient text not null,
  recipient_type text not null default 'customer',
  vars jsonb not null,
  entity_type text,
  entity_id uuid,
  priority int not null default 5,
  status notification_status not null default 'pending',
  attempts int not null default 0,
  next_attempt_at timestamptz not null default now(),
  provider text,
  provider_message_id text,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index notification_outbox_dispatch_idx
  on notification_outbox(status, next_attempt_at)
  where status in ('pending', 'failed');
