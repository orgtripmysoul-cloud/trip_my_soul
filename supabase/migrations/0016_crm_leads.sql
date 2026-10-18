-- 0016: CRM — leads, sales pipeline, roles and audit log
--
-- Phase 1 of the CRM system plan ("Leads first"). 0004_crm.sql reserved this
-- work but was intentionally left empty during the payments phase; the number
-- cannot be reused now that 0005+ are applied, so the CRM lands here.
--
-- Scope: every website enquiry becomes an owned, followed-up lead. Bookings,
-- payments and the trek catalogue are untouched — leads reference treks by
-- slug (the catalogue is still static TypeScript, see src/data/db.ts) so this
-- migration does not depend on the CMS phase that follows.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type lead_status as enum (
  'new',
  'contacted',
  'quote_sent',
  'negotiation',
  'converted',
  'on_hold',
  'lost',
  'junk'
);

-- Where the enquiry came from. Distinct from form_type: a lead can arrive from
-- the "enquiry" form via a Google Ads click, so both are recorded.
create type lead_source as enum (
  'website_form',
  'whatsapp',
  'phone_call',
  'instagram',
  'google_ads',
  'referral',
  'b2b_partner',
  'walk_in',
  'repeat_customer'
);

-- The seven website forms in the system plan, plus 'admin' for leads a
-- salesperson types in by hand.
create type lead_form_type as enum (
  'contact_us',
  'book_now',
  'enquiry',
  'callback',
  'custom_tour',
  'b2b',
  'corporate',
  'admin'
);

create type lead_activity_type as enum (
  'note',
  'call',
  'whatsapp',
  'email',
  'status_change',
  'transfer',
  'follow_up_set',
  'created'
);

create type lead_lost_reason as enum (
  'price',
  'dates',
  'chose_competitor',
  'no_response',
  'postponed',
  'other'
);

-- ---------------------------------------------------------------------------
-- Roles: widen `staff.role` from admin/staff to the six roles in the plan
-- ---------------------------------------------------------------------------

alter table staff drop constraint if exists staff_role_check;

-- Existing rows: 'admin' becomes super_admin, 'staff' becomes salesperson.
-- Both are widened before the new constraint is applied so no row violates it.
update staff set role = 'super_admin' where role = 'admin';
update staff set role = 'salesperson' where role = 'staff';

alter table staff
  add constraint staff_role_check check (role in (
    'super_admin',
    'sales_manager',
    'salesperson',
    'operations',
    'accounts',
    'content_editor'
  ));

alter table staff alter column role set default 'salesperson';

-- Sales routing attributes. `max_open_leads` = 0 means "no cap".
alter table staff
  add column if not exists phone text,
  add column if not exists team text,
  add column if not exists languages text[] not null default '{}',
  add column if not exists max_open_leads int not null default 0 check (max_open_leads >= 0),
  add column if not exists accepts_leads boolean not null default false;

comment on column staff.accepts_leads is
  'Whether round-robin auto-assignment may route new leads to this person. Ops/accounts/content staff stay false.';

-- Permissions as module × action grants, so a new role needs a row, not a deploy.
create table role_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  module text not null,
  action text not null check (action in ('view', 'create', 'edit', 'delete', 'export')),
  created_at timestamptz not null default now(),
  unique (role, module, action)
);

create index role_permissions_role_idx on role_permissions(role);

-- Baseline grants, mirroring the "Roles & permissions" table in the plan.
-- super_admin is deliberately absent: it is allowed everything in code, so it
-- can never be locked out of the panel by a bad grant row.
insert into role_permissions (role, module, action) values
  -- Sales Manager: all leads, assign/transfer, reports, read-only bookings
  ('sales_manager', 'leads', 'view'),
  ('sales_manager', 'leads', 'create'),
  ('sales_manager', 'leads', 'edit'),
  ('sales_manager', 'leads', 'export'),
  ('sales_manager', 'customers', 'view'),
  ('sales_manager', 'customers', 'edit'),
  ('sales_manager', 'bookings', 'view'),
  ('sales_manager', 'payments', 'view'),
  ('sales_manager', 'reports', 'view'),
  ('sales_manager', 'reports', 'export'),
  ('sales_manager', 'staff', 'view'),
  -- Salesperson: own leads and customers, create bookings, record payments
  ('salesperson', 'leads', 'view'),
  ('salesperson', 'leads', 'create'),
  ('salesperson', 'leads', 'edit'),
  ('salesperson', 'customers', 'view'),
  ('salesperson', 'customers', 'edit'),
  ('salesperson', 'bookings', 'view'),
  ('salesperson', 'bookings', 'create'),
  ('salesperson', 'payments', 'view'),
  ('salesperson', 'payments', 'create'),
  -- Operations: departures, seats, documents, booking status
  ('operations', 'leads', 'view'),
  ('operations', 'customers', 'view'),
  ('operations', 'bookings', 'view'),
  ('operations', 'bookings', 'edit'),
  ('operations', 'departures', 'view'),
  ('operations', 'departures', 'create'),
  ('operations', 'departures', 'edit'),
  -- Accounts: payments, refunds, invoices, financial reports
  ('accounts', 'bookings', 'view'),
  ('accounts', 'payments', 'view'),
  ('accounts', 'payments', 'create'),
  ('accounts', 'payments', 'edit'),
  ('accounts', 'payments', 'export'),
  ('accounts', 'reports', 'view'),
  ('accounts', 'reports', 'export'),
  -- Content Editor: catalogue and content only
  ('content_editor', 'catalogue', 'view'),
  ('content_editor', 'catalogue', 'create'),
  ('content_editor', 'catalogue', 'edit');

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------

-- Human-facing lead number: TMS-L-26-00123. The year segment comes from the
-- row's creation year; the counter is global (not per-year) so it stays
-- gap-free and collision-free without a per-year sequence to roll over.
create sequence lead_no_seq start 1;

create table leads (
  id uuid primary key default gen_random_uuid(),
  lead_no text not null unique,

  -- Contact details live on the lead itself. `customers` is keyed on a
  -- NOT NULL unique email and is load-bearing for bookings/payments; the
  -- callback form captures a phone number and nothing else, so a lead cannot
  -- always produce a customer row. customer_id is linked opportunistically.
  full_name text not null,
  phone text not null,
  email citext,
  customer_id uuid references customers(id),

  -- What they want. trek_slug is a soft reference into the static catalogue
  -- (src/data/db.ts); trek_name is denormalised so the lead still reads
  -- correctly if a slug is later renamed by the CMS phase.
  trek_slug text,
  trek_name text,
  departure_id uuid references departures(id),
  travel_date date,
  travel_month text,
  pax_adults int not null default 1 check (pax_adults >= 0),
  pax_children int not null default 0 check (pax_children >= 0),
  message text,

  -- Attribution
  source lead_source not null default 'website_form',
  form_type lead_form_type not null,
  utm jsonb not null default '{}'::jsonb,
  landing_page text,

  -- Form-specific payload (budget, company, GSTIN, group size, interests…).
  -- Kept as jsonb so the custom-tour/B2B/corporate forms can evolve without a
  -- migration; anything queried or reported on gets promoted to a column.
  details jsonb not null default '{}'::jsonb,

  -- Pipeline
  status lead_status not null default 'new',
  owner_id uuid references staff(id),
  assigned_at timestamptz,
  first_contacted_at timestamptz,
  follow_up_at timestamptz,
  lost_reason lead_lost_reason,
  lost_note text,
  booking_id uuid references bookings(id),

  -- Consent (DPDP Act 2023): captured at the form, never assumed.
  consent_marketing boolean not null default false,
  consent_ip text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  -- A lost lead must say why; an open lead must have a next action. These are
  -- the two rules that keep the pipeline honest, so the database enforces them
  -- rather than trusting every caller.
  constraint leads_lost_reason_required check (
    status <> 'lost' or lost_reason is not null
  ),
  constraint leads_follow_up_required check (
    status not in ('contacted', 'quote_sent', 'negotiation', 'on_hold')
    or follow_up_at is not null
  )
);

create index leads_phone_idx on leads(phone) where deleted_at is null;
create index leads_status_idx on leads(status) where deleted_at is null;
create index leads_owner_idx on leads(owner_id) where deleted_at is null;
create index leads_created_at_idx on leads(created_at desc);
create index leads_trek_slug_idx on leads(trek_slug) where deleted_at is null;
-- Drives the "follow-ups due / overdue" dashboard and the 24h escalation.
create index leads_follow_up_idx on leads(follow_up_at)
  where deleted_at is null and status in ('new', 'contacted', 'quote_sent', 'negotiation', 'on_hold');

create trigger leads_set_updated_at
  before update on leads
  for each row execute function set_updated_at();

create or replace function set_lead_no()
returns trigger as $$
begin
  if new.lead_no is null then
    new.lead_no := 'TMS-L-'
      || to_char(now(), 'YY')
      || '-'
      || lpad(nextval('lead_no_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger leads_set_lead_no
  before insert on leads
  for each row execute function set_lead_no();

-- ---------------------------------------------------------------------------
-- Lead activity timeline
-- ---------------------------------------------------------------------------

create table lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type lead_activity_type not null,
  body text,
  outcome text,
  duration_seconds int check (duration_seconds >= 0),
  old_value text,
  new_value text,
  staff_id uuid references staff(id),
  created_at timestamptz not null default now()
);

create index lead_activities_lead_idx on lead_activities(lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Admin activity log (every module, not just leads)
-- ---------------------------------------------------------------------------

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff(id),
  staff_email text,
  action text not null,
  module text not null,
  entity_type text,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index activity_logs_staff_idx on activity_logs(staff_id, created_at desc);
create index activity_logs_module_idx on activity_logs(module, created_at desc);
create index activity_logs_entity_idx on activity_logs(entity_type, entity_id);

comment on table activity_logs is
  'Append-only audit trail, retained at least 1 year. Never updated or deleted by application code.';

-- ---------------------------------------------------------------------------
-- Lead capture RPC
-- ---------------------------------------------------------------------------

-- Creates a lead, picks an owner and queues notifications in one transaction,
-- so a website form submit can never half-succeed (a lead with no owner, or
-- an owner alerted about a lead that was rolled back).
--
-- Duplicate handling: a non-closed lead from the same phone within 30 days is
-- treated as the same enquiry. Rather than silently dropping the new message
-- (which loses what the customer actually said), the existing lead is returned
-- and the new message is appended to its timeline for the owner to see.
create or replace function create_lead(
  p_full_name text,
  p_phone text,
  p_email text,
  p_form_type lead_form_type,
  p_source lead_source,
  p_trek_slug text,
  p_trek_name text,
  p_travel_date date,
  p_travel_month text,
  p_pax_adults int,
  p_pax_children int,
  p_message text,
  p_utm jsonb,
  p_landing_page text,
  p_details jsonb,
  p_consent_marketing boolean,
  p_consent_ip text
)
returns table (lead_id uuid, lead_no text, is_duplicate boolean) as $$
declare
  v_existing   leads%rowtype;
  v_owner_id   uuid;
  v_lead       leads%rowtype;
  v_owner_email text;
begin
  -- 1. Duplicate check on phone, within the open window.
  select * into v_existing
  from leads
  where phone = p_phone
    and deleted_at is null
    and status not in ('converted', 'lost', 'junk')
    and created_at > now() - interval '30 days'
  order by created_at desc
  limit 1;

  if found then
    insert into lead_activities (lead_id, type, body, new_value)
    values (
      v_existing.id,
      'note',
      coalesce(
        'Repeat enquiry via ' || p_form_type::text ||
        case when p_message is not null and p_message <> '' then ': ' || p_message else '' end,
        'Repeat enquiry'
      ),
      p_form_type::text
    );

    if v_existing.owner_id is not null then
      select email into v_owner_email from staff where id = v_existing.owner_id;
      if v_owner_email is not null then
        insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id, priority)
        values ('lead.duplicate_enquiry', 'email', v_owner_email, 'staff',
                jsonb_build_object('lead_no', v_existing.lead_no, 'name', v_existing.full_name, 'phone', v_existing.phone),
                'lead', v_existing.id, 3);
      end if;
    end if;

    return query select v_existing.id, v_existing.lead_no, true;
    return;
  end if;

  -- 2. Round-robin by current open-lead workload: the eligible salesperson
  --    carrying the fewest open leads wins, respecting max_open_leads.
  select s.id into v_owner_id
  from staff s
  left join (
    select owner_id, count(*) as open_count
    from leads
    where deleted_at is null
      and status in ('new', 'contacted', 'quote_sent', 'negotiation')
    group by owner_id
  ) l on l.owner_id = s.id
  where s.active
    and s.accepts_leads
    and (s.max_open_leads = 0 or coalesce(l.open_count, 0) < s.max_open_leads)
  order by coalesce(l.open_count, 0) asc, s.created_at asc
  limit 1;

  -- 3. Insert the lead.
  insert into leads (
    full_name, phone, email, form_type, source,
    trek_slug, trek_name, travel_date, travel_month,
    pax_adults, pax_children, message,
    utm, landing_page, details,
    consent_marketing, consent_ip,
    owner_id, assigned_at
  ) values (
    p_full_name, p_phone, nullif(p_email, ''), p_form_type, p_source,
    nullif(p_trek_slug, ''), nullif(p_trek_name, ''), p_travel_date, nullif(p_travel_month, ''),
    coalesce(p_pax_adults, 1), coalesce(p_pax_children, 0), nullif(p_message, ''),
    coalesce(p_utm, '{}'::jsonb), nullif(p_landing_page, ''), coalesce(p_details, '{}'::jsonb),
    coalesce(p_consent_marketing, false), p_consent_ip,
    v_owner_id, case when v_owner_id is not null then now() else null end
  )
  returning * into v_lead;

  insert into lead_activities (lead_id, type, body, new_value)
  values (v_lead.id, 'created', 'Lead captured from ' || p_form_type::text, 'new');

  -- 4. Alert the owner. Unassigned leads (nobody eligible) are not silently
  --    dropped — the dashboard surfaces them in an "Unassigned" column.
  if v_owner_id is not null then
    select email into v_owner_email from staff where id = v_owner_id;
    if v_owner_email is not null then
      insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id, priority)
      values ('lead.new_assigned', 'email', v_owner_email, 'staff',
              jsonb_build_object(
                'lead_no', v_lead.lead_no,
                'name', v_lead.full_name,
                'phone', v_lead.phone,
                'trek', coalesce(v_lead.trek_name, 'Not specified'),
                'form_type', p_form_type::text
              ),
              'lead', v_lead.id, 2);
    end if;
  end if;

  -- 5. Auto-reply to the customer, when they gave us an email and consented.
  if v_lead.email is not null and coalesce(p_consent_marketing, false) then
    insert into notification_outbox (template_code, channel, recipient, recipient_type, vars, entity_type, entity_id, priority)
    values ('lead.auto_reply', 'email', v_lead.email::text, 'customer',
            jsonb_build_object('name', v_lead.full_name, 'trek', coalesce(v_lead.trek_name, 'your trip')),
            'lead', v_lead.id, 5);
  end if;

  return query select v_lead.id, v_lead.lead_no, false;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Notification templates
-- ---------------------------------------------------------------------------

insert into notification_templates (code, channel, subject, description) values
  ('lead.new_assigned', 'email', 'New lead assigned to you – Trip My Soul',
   'Sent to the assigned salesperson the moment a website enquiry lands.'),
  ('lead.duplicate_enquiry', 'email', 'Repeat enquiry on your lead – Trip My Soul',
   'Sent to the owner when the same phone number enquires again within 30 days.'),
  ('lead.auto_reply', 'email', 'We received your enquiry – Trip My Soul',
   'Auto-reply to the customer with trek details, sent only when they consented.');

-- ---------------------------------------------------------------------------
-- Backfill: fold existing quote_leads into the new pipeline
-- ---------------------------------------------------------------------------

-- quote_leads stays in place (the /pay quote flow still writes to it); this
-- copies its history across so the pipeline opens with real data rather than
-- an empty board.
-- follow_up_at and lost_reason are filled in the SELECT, not by a follow-up
-- UPDATE: the two check constraints above are evaluated per row at INSERT, so
-- an imported 'quote_sent' row with a null follow-up would be rejected before
-- any later statement could repair it.
insert into leads (
  full_name, phone, email, trek_name, travel_date, message,
  form_type, source, status, follow_up_at, lost_reason, created_at
)
select
  ql.full_name,
  ql.phone,
  ql.email,
  ql.trip_label,
  ql.departure_date,
  ql.message,
  case when ql.source = 'callback' then 'callback'::lead_form_type else 'enquiry'::lead_form_type end,
  'website_form'::lead_source,
  case
    when ql.status = 'quoted' then 'quote_sent'::lead_status
    when ql.status = 'closed' then 'lost'::lead_status
    else 'new'::lead_status
  end,
  -- Imported open leads are due for a follow-up immediately; they have been
  -- sitting in the old table with nobody chasing them.
  case when ql.status = 'quoted' then now() else null end,
  -- The old table never recorded why a lead closed.
  case when ql.status = 'closed' then 'other'::lead_lost_reason else null end,
  ql.created_at
from quote_leads ql;

-- ---------------------------------------------------------------------------
-- RLS: default deny, matching 0008. All access is server-side service-role.
-- ---------------------------------------------------------------------------

alter table leads enable row level security;
alter table lead_activities enable row level security;
alter table activity_logs enable row level security;
alter table role_permissions enable row level security;
