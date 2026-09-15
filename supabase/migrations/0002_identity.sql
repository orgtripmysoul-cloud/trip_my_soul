-- 0002: identity (customers)
-- Full account/auth identity (login, staff, roles) is out of scope for the
-- payment phase — checkout is guest-style. This table exists so bookings have
-- a stable FK target and repeat bookers consolidate by email.

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email)
);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();
