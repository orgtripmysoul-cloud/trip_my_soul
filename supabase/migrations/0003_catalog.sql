-- 0003: catalog (treks, departures) + seat holds
--
-- DEVIATION FROM LLD (documented, not silently faked): the existing frontend
-- catalogue (src/data/db.ts and friends) has no numeric seat inventory at
-- all today — departures are free-text batch labels with only a status
-- string. There is no full 75+ trek/departure data migration in this phase.
-- Instead, `treks` and `departures` rows are lazily upserted by the booking
-- API the first time a given (trek slug, batch label) is actually booked,
-- seeded from that static catalogue's name/price and a default total_seats.
-- From that first booking onward, Postgres is the authoritative seat count
-- for that departure. Backfilling the full catalogue into these tables
-- ahead of time is future work (see docs/PAYMENTS_INTEGRATION.md).

create table treks (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  duration_days int,
  region text,
  difficulty text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create trigger treks_set_updated_at
  before update on treks
  for each row execute function set_updated_at();

create table departures (
  id uuid primary key default gen_random_uuid(),
  trek_id uuid not null references treks(id),
  trek_slug text not null,
  batch_label text not null,
  start_date date,
  end_date date,
  price numeric(12,2) not null check (price > 0),
  total_seats int not null default 20 check (total_seats > 0),
  held_seats int not null default 0 check (held_seats >= 0),
  booked_seats int not null default 0 check (booked_seats >= 0),
  bookable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trek_slug, batch_label),
  -- The critical capacity invariant from the LLD: never oversell.
  constraint departures_capacity_chk check (held_seats + booked_seats <= total_seats)
);

create index departures_trek_id_idx on departures(trek_id);

create trigger departures_set_updated_at
  before update on departures
  for each row execute function set_updated_at();

-- Persisted (not in-memory / not Redis-only) seat holds, per the HLD's
-- 15-minute PostgreSQL hold requirement.
create table seat_holds (
  id uuid primary key default gen_random_uuid(),
  departure_id uuid not null references departures(id),
  booking_id uuid not null,
  pax int not null check (pax > 0),
  expires_at timestamptz not null,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id)
);

create index seat_holds_departure_id_idx on seat_holds(departure_id);
create index seat_holds_expires_at_idx on seat_holds(expires_at) where released_at is null;
