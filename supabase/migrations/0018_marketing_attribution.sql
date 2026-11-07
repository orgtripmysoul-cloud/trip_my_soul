-- 0018: marketing attribution for leads and bookings
--
-- Lets the admin dashboard answer "which channels and which pages bring
-- enquiries and revenue". Every column is nullable / additive: older rows and
-- older clients keep working, they just report as channel 'unknown'.
--
-- Semantics:
--   channel          bucket computed server-side (src/lib/attribution.ts)
--   referrer         external site the credited visit came from (origin + path)
--   landing_page     (leads: existing column) entry page of the credited visit
--   conversion_page  page the enquiry form was submitted from
--   first_touch      the very first visit seen from that browser (jsonb)

alter table leads
  add column if not exists channel text,
  add column if not exists referrer text,
  add column if not exists conversion_page text,
  add column if not exists first_touch jsonb;

alter table bookings
  add column if not exists channel text,
  add column if not exists referrer text,
  add column if not exists landing_page text,
  add column if not exists utm jsonb,
  add column if not exists first_touch jsonb;

alter table leads drop constraint if exists leads_channel_chk;
alter table leads add constraint leads_channel_chk check (
  channel is null or channel in (
    'organic_search', 'paid_search', 'organic_social', 'paid_social', 'whatsapp',
    'email', 'referral', 'direct', 'offline', 'unknown'
  )
);

alter table bookings drop constraint if exists bookings_channel_chk;
alter table bookings add constraint bookings_channel_chk check (
  channel is null or channel in (
    'organic_search', 'paid_search', 'organic_social', 'paid_social', 'whatsapp',
    'email', 'referral', 'direct', 'offline', 'unknown'
  )
);

create index if not exists leads_channel_created_idx on leads(channel, created_at desc);
create index if not exists bookings_channel_created_idx on bookings(channel, created_at desc);

-- Backfill existing leads from what we already know. Website leads without
-- campaign tags predate referrer tracking, so they honestly stay 'unknown'.
update leads
set channel = case
  when source = 'whatsapp' then 'whatsapp'
  when source = 'instagram' then 'organic_social'
  when source = 'google_ads' then 'paid_search'
  when source in ('referral', 'b2b_partner') then 'referral'
  when source in ('phone_call', 'walk_in', 'repeat_customer') then 'offline'
  when utm ? 'gclid' or utm ? 'gbraid' or utm ? 'wbraid'
    or lower(coalesce(utm->>'medium', '')) in ('cpc', 'ppc', 'paid', 'paidsearch', 'paid_search', 'sem') then 'paid_search'
  when lower(coalesce(utm->>'medium', '')) in ('paid_social', 'paidsocial') then 'paid_social'
  when utm ? 'fbclid' or lower(coalesce(utm->>'medium', '')) = 'social' then 'organic_social'
  when lower(coalesce(utm->>'medium', '')) = 'email' then 'email'
  when utm ? 'source' then 'referral'
  else 'unknown'
end
where channel is null;
