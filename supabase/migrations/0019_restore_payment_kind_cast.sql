-- 0019: restore the ::payment_kind cast that 0014 added and 0015 dropped.
-- 0015 re-created create_booking_with_hold from source text that predates
-- 0014's hotfix, so every checkout failed with 42804 (HTTP 500).
-- Idempotent: if the cast is already present, the replace is a no-op and the
-- count check still passes.
do $fix$
declare
  d text;
  n int;
begin
  d := pg_get_functiondef('create_booking_with_hold'::regproc);
  d := replace(d, $q$then 'full' else 'advance' end$q$,
                  $q$then 'full'::payment_kind else 'advance'::payment_kind end$q$);
  n := (length(d) - length(replace(d, '::payment_kind else', ''))) / length('::payment_kind else');
  if n <> 1 then
    raise exception 'unexpected replacement count % for create_booking_with_hold', n;
  end if;
  execute d;
end
$fix$;
