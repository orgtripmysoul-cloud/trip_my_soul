-- Regression check for the 42804 cast bug (see 0019_restore_payment_kind_cast.sql).
--
-- Run against any NON-PRODUCTION database with migrations 0001..0019 applied:
--   psql "$DATABASE_URL" -f supabase/checks/payment_kind_cast.sql
-- Read-only: it creates no bookings or payments, and raises an exception
-- (rolling back nothing, since it writes nothing) if the cast is missing.
do $check$
declare
  d text;
begin
  d := pg_get_functiondef('create_booking_with_hold'::regproc);

  if position('::payment_kind' in d) = 0 then
    raise exception 'create_booking_with_hold has no ::payment_kind cast — payments.kind will fail with 42804 on every checkout';
  end if;

  -- Both branches of the CASE must be cast: assigning the uncast branch to
  -- payments.kind fails only for the paths that reach it, so a half-fixed
  -- function breaks advance payments while full payments keep working.
  if position($q$'full'::payment_kind$q$ in d) = 0 then
    raise exception 'create_booking_with_hold: the ''full'' branch is not cast to payment_kind';
  end if;
  if position($q$'advance'::payment_kind$q$ in d) = 0 then
    raise exception 'create_booking_with_hold: the ''advance'' branch is not cast to payment_kind';
  end if;

  raise notice 'ok: create_booking_with_hold casts both payment_kind branches';
end
$check$;
