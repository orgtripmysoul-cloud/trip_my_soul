-- 0009: email OTP verification, ahead of a booking being submitted.
--
-- Deliberately plain CRUD tables (no RPC functions) — unlike the commerce
-- tables in 0005/0007, there is no multi-row invariant here that needs a
-- single atomic transaction (no seat inventory to protect), so the simpler
-- pattern already used by idempotency_keys (raw table reads/writes from
-- src/lib/server/idempotency.ts) is followed instead of adding a new RPC.
--
-- Only a salted HMAC hash of the OTP is ever stored (see
-- src/lib/server/otp.ts) — never the plaintext code.

create table email_verifications (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  purpose text not null default 'booking',
  code_hash text not null,
  attempts int not null default 0,
  max_attempts int not null default 5,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  verified_until timestamptz,
  created_at timestamptz not null default now()
);

-- Confirm looks up "the latest still-live code for this email+purpose";
-- older/expired rows are simply never matched again, not actively cleaned up.
create index email_verifications_lookup_idx
  on email_verifications (email, purpose, created_at desc);

-- One row per send attempt, used purely to count sends in a rolling 15-minute
-- window per email and per IP. A row is never updated, only inserted/counted.
create table email_verification_sends (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  ip text not null,
  created_at timestamptz not null default now()
);

create index email_verification_sends_email_idx
  on email_verification_sends (email, created_at desc);
create index email_verification_sends_ip_idx
  on email_verification_sends (ip, created_at desc);

-- Same defence-in-depth stance as 0008_rls.sql: only the service-role key
-- (which bypasses RLS) ever touches these tables; no policies means
-- anon/authenticated get default-deny on every operation.
alter table email_verifications enable row level security;
alter table email_verification_sends enable row level security;
