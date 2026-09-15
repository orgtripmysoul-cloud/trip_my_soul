-- 0008: Row Level Security
--
-- Defence in depth, not the primary access control — all mutations go
-- through the server-side API using the service-role key, which bypasses
-- RLS entirely. These policies exist so that if the anon/authenticated key
-- were ever used directly against these tables (it should never be, and the
-- service-role key must never reach the browser), it could not read or write
-- transactional data, and could only read the public catalogue.

alter table customers enable row level security;
alter table treks enable row level security;
alter table departures enable row level security;
alter table seat_holds enable row level security;
alter table bookings enable row level security;
alter table booking_travellers enable row level security;
alter table payments enable row level security;
alter table idempotency_keys enable row level security;
alter table webhook_events enable row level security;
alter table notification_templates enable row level security;
alter table notification_outbox enable row level security;

-- Public catalogue: readable by anyone (anon or authenticated), never
-- writable by them. No policy is created for insert/update/delete, so those
-- remain denied to anon/authenticated by default; only service_role (which
-- bypasses RLS) can write.
create policy treks_public_read on treks for select to anon, authenticated using (true);
create policy departures_public_read on departures for select to anon, authenticated using (true);

-- Everything else: no policies for anon/authenticated at all → default deny
-- for every operation. service_role bypasses RLS and is unaffected.
