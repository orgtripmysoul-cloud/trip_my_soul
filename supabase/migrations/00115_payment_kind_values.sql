-- 00115: split out of 0012 so the migration chain is replayable.
--
-- Postgres forbids *using* a newly added enum value in the same transaction
-- that added it (SQLSTATE 55P04). 0012 added 'installment'/'final' and then
-- declared `create_additional_payment(... p_kind payment_kind default
-- 'installment')` further down the same file; because the CLI wraps each
-- migration file in one transaction, that file aborts on any database where
-- it has not already been applied:
--
--   ERROR: unsafe use of new value "installment" of enum type payment_kind
--
-- Production was unaffected (0012 was applied there before this was noticed),
-- but every fresh environment — a local stack, a dev project, CI — failed at
-- 0012. Moving the two ALTER TYPEs into this earlier file gives them their
-- own transaction, so the value is committed before 0012 refers to it.
--
-- Sorts between 0011 and 0012 ("00115" < "0012" lexicographically). Both
-- statements are idempotent, so re-applying this to a database that already
-- has the values is a no-op.

alter type payment_kind add value if not exists 'installment';
alter type payment_kind add value if not exists 'final';
