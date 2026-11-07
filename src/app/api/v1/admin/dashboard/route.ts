import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, canSeeAllLeads, hasPermission } from "@/lib/server/permissions";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import {
  MARKETING_CHANNELS,
  MARKETING_CHANNEL_LABELS,
  istMonthStart,
  istStartOfDay,
  normalisePath,
  type MarketingChannel,
} from "@/lib/attribution";
import {
  LEAD_STATUSES,
  MARKETING_RANGES,
  OPEN_LEAD_STATUSES,
  type AdminDashboardResponse,
  type AdminMarketingSummary,
  type LeadStatus,
  type LeadSource,
  type MarketingRange,
} from "@/lib/types/crm";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

interface ScopedLead {
  status: LeadStatus;
  source: LeadSource;
  owner_id: string | null;
  follow_up_at: string | null;
  created_at: string;
}

interface MarketingLead {
  status: LeadStatus;
  channel: string | null;
  landing_page: string | null;
  trek_name: string | null;
  created_at: string;
}

const rate = (converted: number, total: number) => (total === 0 ? 0 : Math.round((converted / total) * 1000) / 10);

function rangeStart(range: MarketingRange, now: Date): Date {
  if (range === "month") return istMonthStart(0, now);
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  // Whole IST days, today included.
  return new Date(istStartOfDay(now).getTime() - (days - 1) * DAY_MS);
}

function asChannel(value: string | null | undefined): MarketingChannel {
  return value && (MARKETING_CHANNELS as readonly string[]).includes(value) ? (value as MarketingChannel) : "unknown";
}

/**
 * Marketing performance for the selected window: leads and conversions per
 * channel, the entry pages and treks that generate enquiries, and cash
 * collected per channel.
 */
async function buildMarketing(
  range: MarketingRange,
  now: Date,
  ownerScope: string | null,
  includeRevenue: boolean
): Promise<AdminMarketingSummary> {
  const db = supabaseAdmin();
  const since = rangeStart(range, now);

  let leadQuery = db
    .from("leads")
    .select("status, channel, landing_page, trek_name, created_at")
    .is("deleted_at", null)
    .neq("status", "junk")
    .gte("created_at", since.toISOString())
    .limit(10000);
  if (ownerScope) leadQuery = leadQuery.eq("owner_id", ownerScope);
  const { data: leadRows, error } = await leadQuery;
  if (error) throw error;
  const leads = (leadRows ?? []) as MarketingLead[];

  type ChannelStats = { leads: number; converted: number; bookings: number; revenue: number };
  const channels = new Map<MarketingChannel, ChannelStats>();
  const bump = (c: MarketingChannel) => {
    const entry = channels.get(c) ?? { leads: 0, converted: 0, bookings: 0, revenue: 0 };
    channels.set(c, entry);
    return entry;
  };

  const pages = new Map<string, { leads: number; converted: number }>();
  const treks = new Map<string, { leads: number; converted: number }>();
  let trackedLeads = 0;

  for (const lead of leads) {
    const channel = asChannel(lead.channel);
    const converted = lead.status === "converted";
    const c = bump(channel);
    c.leads += 1;
    if (converted) c.converted += 1;
    if (channel !== "unknown") trackedLeads += 1;

    if (lead.landing_page) {
      const page = normalisePath(lead.landing_page);
      const p = pages.get(page) ?? { leads: 0, converted: 0 };
      p.leads += 1;
      if (converted) p.converted += 1;
      pages.set(page, p);
    }

    const trek = lead.trek_name?.trim();
    if (trek && trek !== "Not specified") {
      const t = treks.get(trek) ?? { leads: 0, converted: 0 };
      t.leads += 1;
      if (converted) t.converted += 1;
      treks.set(trek, t);
    }
  }

  let revenue: AdminMarketingSummary["revenue"] = null;
  if (includeRevenue) {
    const { data: bookingRows } = await db
      .from("bookings")
      .select("channel, booking_type, paid_amount, customer_id")
      .gte("created_at", since.toISOString())
      .not("status", "in", "(draft,cancelled)")
      .gt("paid_amount", 0)
      .limit(10000);
    const bookings = bookingRows ?? [];

    // Bookings made before tracking (or via a payment link) have no channel of
    // their own: credit the channel of the same customer's enquiry, if any.
    const untracked = bookings.filter((b) => !b.channel);
    const leadChannelByContact = new Map<string, MarketingChannel>();
    if (untracked.length > 0) {
      const customerIds = [...new Set(untracked.map((b) => b.customer_id))];
      const { data: customers } = await db.from("customers").select("id, email, phone").in("id", customerIds);
      const emails = [...new Set((customers ?? []).map((c) => String(c.email).toLowerCase()))];
      const { data: matchedLeads } = emails.length
        ? await db
            .from("leads")
            .select("email, phone, channel, created_at")
            .in("email", emails)
            .not("channel", "is", null)
            .order("created_at", { ascending: true })
        : { data: [] };
      const byEmail = new Map<string, MarketingChannel>();
      for (const l of matchedLeads ?? []) {
        const key = String(l.email).toLowerCase();
        if (!byEmail.has(key)) byEmail.set(key, asChannel(l.channel));
      }
      for (const c of customers ?? []) {
        const match = byEmail.get(String(c.email).toLowerCase());
        if (match) leadChannelByContact.set(c.id, match);
      }
    }

    let collected = 0;
    for (const b of bookings) {
      const amount = Number(b.paid_amount) || 0;
      collected += amount;
      const channel: MarketingChannel = b.channel
        ? asChannel(b.channel)
        : leadChannelByContact.get(b.customer_id) ?? (b.booking_type === "custom" ? "offline" : "unknown");
      const c = bump(channel);
      c.bookings += 1;
      c.revenue += amount;
    }
    revenue = { bookings: bookings.length, collected };
  }

  const byChannel = [...channels.entries()]
    .map(([channel, s]) => ({
      channel,
      label: MARKETING_CHANNEL_LABELS[channel],
      leads: s.leads,
      converted: s.converted,
      rate: rate(s.converted, s.leads),
      bookings: s.bookings,
      revenue: s.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue || b.leads - a.leads);

  const topLandingPages = [...pages.entries()]
    .map(([page, s]) => ({ page, leads: s.leads, converted: s.converted, rate: rate(s.converted, s.leads) }))
    .sort((a, b) => b.leads - a.leads || b.converted - a.converted)
    .slice(0, 10);

  const topTreks = [...treks.entries()]
    .map(([trek, s]) => ({ trek, leads: s.leads, converted: s.converted }))
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 8);

  return {
    range,
    since: since.toISOString(),
    totalLeads: leads.length,
    trackedLeads,
    byChannel,
    topLandingPages,
    topTreks,
    revenue,
  };
}

/**
 * Role-aware dashboard. A salesperson sees their own numbers; a manager sees
 * the whole team. Calendar boundaries ("today", "this month") are India time.
 */
export async function GET(request: NextRequest) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "view");

    const rangeParam = request.nextUrl.searchParams.get("range");
    const range: MarketingRange = (MARKETING_RANGES as readonly string[]).includes(rangeParam ?? "")
      ? (rangeParam as MarketingRange)
      : "30d";

    const db = supabaseAdmin();
    const seesAll = canSeeAllLeads(staff);
    const now = new Date();

    const thisMonthStart = istMonthStart(0, now).getTime();
    const lastMonthStart = istMonthStart(-1, now).getTime();
    const todayStart = istStartOfDay(now).getTime();
    const todayEnd = todayStart + DAY_MS - 1;
    const nowMs = now.getTime();

    // Only the window the top cards report on: this month, last month, and
    // anything still open (which may be older).
    let query = db
      .from("leads")
      .select("status, source, owner_id, follow_up_at, created_at")
      .is("deleted_at", null)
      .or(
        `created_at.gte.${new Date(lastMonthStart).toISOString()},status.in.(new,contacted,quote_sent,negotiation,on_hold)`
      );

    if (!seesAll) query = query.eq("owner_id", staff.id);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as ScopedLead[];

    const pipeline = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
    const sourceCounts = new Map<LeadSource, number>();

    let newLeads = 0;
    let followUpsDue = 0;
    let followUpsOverdue = 0;
    let unassigned = 0;
    let thisMonthTotal = 0;
    let thisMonthConverted = 0;
    let lastMonthTotal = 0;
    let lastMonthConverted = 0;

    for (const row of rows) {
      pipeline[row.status] = (pipeline[row.status] ?? 0) + 1;
      sourceCounts.set(row.source, (sourceCounts.get(row.source) ?? 0) + 1);

      const created = new Date(row.created_at).getTime();
      const isOpen = row.status === "new" || OPEN_LEAD_STATUSES.includes(row.status);
      if (created >= todayStart && row.status === "new") newLeads += 1;
      if (!row.owner_id && isOpen) unassigned += 1;

      // Follow-ups only matter while the lead is still being worked.
      if (row.follow_up_at && isOpen) {
        const due = new Date(row.follow_up_at).getTime();
        if (due < nowMs) followUpsOverdue += 1;
        else if (due >= todayStart && due <= todayEnd) followUpsDue += 1;
      }

      if (created >= thisMonthStart) {
        thisMonthTotal += 1;
        if (row.status === "converted") thisMonthConverted += 1;
      } else if (created >= lastMonthStart) {
        lastMonthTotal += 1;
        if (row.status === "converted") lastMonthConverted += 1;
      }
    }

    // Leaderboard is a manager-and-above view only.
    let leaderboard: AdminDashboardResponse["leaderboard"] = [];
    if (seesAll) {
      const { data: staffRows } = await db.from("staff").select("id, full_name").eq("active", true);
      const byOwner = new Map<string, { assigned: number; converted: number }>();
      for (const row of rows) {
        if (!row.owner_id || new Date(row.created_at).getTime() < thisMonthStart) continue;
        const entry = byOwner.get(row.owner_id) ?? { assigned: 0, converted: 0 };
        entry.assigned += 1;
        if (row.status === "converted") entry.converted += 1;
        byOwner.set(row.owner_id, entry);
      }
      leaderboard = (staffRows ?? [])
        .map((s) => {
          const entry = byOwner.get(s.id) ?? { assigned: 0, converted: 0 };
          return {
            staffId: s.id,
            name: s.full_name,
            assigned: entry.assigned,
            converted: entry.converted,
            rate: rate(entry.converted, entry.assigned),
          };
        })
        .filter((r) => r.assigned > 0)
        .sort((a, b) => b.converted - a.converted || b.rate - a.rate);
    }

    const includeRevenue = seesAll && (await hasPermission(staff, "bookings", "view"));
    const marketing = await buildMarketing(range, now, seesAll ? null : staff.id, includeRevenue);

    const responseBody: AdminDashboardResponse = {
      today: { newLeads, followUpsDue, followUpsOverdue, unassigned },
      pipeline,
      bySource: [...sourceCounts.entries()]
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      conversion: {
        thisMonth: { total: thisMonthTotal, converted: thisMonthConverted, rate: rate(thisMonthConverted, thisMonthTotal) },
        lastMonth: { total: lastMonthTotal, converted: lastMonthConverted, rate: rate(lastMonthConverted, lastMonthTotal) },
      },
      leaderboard,
      marketing,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
