-- 0001: extensions + enums
-- Payment/booking phase. Numbering follows the target LLD migration sequence
-- (0001 extensions/enums, 0002 identity, 0003 catalog, 0004 CRM, 0005 commerce,
-- 0006 platform, 0007 functions/triggers, 0008 RLS) so later phases can slot
-- into the reserved numbers without renumbering existing migrations.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- case-insensitive email

create type booking_status as enum (
  'draft',
  'pending_payment',
  'partially_paid',
  'confirmed',
  'cancellation_requested',
  'cancelled',
  'rescheduled',
  'completed',
  'no_show'
);

create type booking_payment_state as enum (
  'unpaid',
  'advance_paid',
  'fully_paid',
  'refunded'
);

create type payment_status as enum (
  'created',
  'attempted',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partially_refunded',
  'voided',
  'disputed'
);

create type payment_kind as enum (
  'full',
  'advance',
  'addon',
  'other'
);

create type notification_channel as enum (
  'email',
  'sms',
  'whatsapp'
);

create type notification_status as enum (
  'pending',
  'sent',
  'failed',
  'cancelled'
);

-- Shared updated_at trigger, used by every mutable table below.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;
