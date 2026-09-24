-- 0014: hotfix for 0011/0012 — cast CASE results to their enum types.
--
-- capture_payment (0011), create_booking_with_hold and record_manual_payment
-- (0012) assign `case when ... then '<literal>' else '<literal>' end` to enum
-- columns. A CASE over two string literals resolves to text, and there is no
-- assignment cast from text to an enum, so all three failed at runtime with
-- 42804 "column ... is of type <enum> but expression is of type text":
--   * create_booking_with_hold -> payments.kind           (every checkout)
--   * capture_payment          -> bookings.status / payment_state (Razorpay webhook)
--   * record_manual_payment    -> bookings.status / payment_state (admin manual payment)
--
-- Fix: re-create each function from its current definition with only the
-- enum casts added. Applied to production on 2026-09-24 exactly as below.
-- Each replacement is counted so this fails loudly (and rolls back) if a
-- definition doesn't look the way we expect, rather than silently skipping.

do $fix$
declare
  f text;
  d text;
  n int;
begin
  foreach f in array array['capture_payment', 'record_manual_payment', 'create_booking_with_hold'] loop
    d := pg_get_functiondef(f::regproc);
    d := replace(d, $q$then 'confirmed' else 'partially_paid' end$q$, $q$then 'confirmed'::booking_status else 'partially_paid'::booking_status end$q$);
    d := replace(d, $q$then 'fully_paid' else 'advance_paid' end$q$, $q$then 'fully_paid'::booking_payment_state else 'advance_paid'::booking_payment_state end$q$);
    d := replace(d, $q$then 'full' else 'advance' end$q$, $q$then 'full'::payment_kind else 'advance'::payment_kind end$q$);
    n := (length(d) - length(replace(d, '::booking_status else', ''))) / length('::booking_status else')
       + (length(d) - length(replace(d, '::booking_payment_state else', ''))) / length('::booking_payment_state else')
       + (length(d) - length(replace(d, '::payment_kind else', ''))) / length('::payment_kind else');
    if (f = 'create_booking_with_hold' and n <> 1) or (f <> 'create_booking_with_hold' and n <> 2) then
      raise exception 'unexpected replacement count % for %', n, f;
    end if;
    execute d;
  end loop;
end
$fix$;
