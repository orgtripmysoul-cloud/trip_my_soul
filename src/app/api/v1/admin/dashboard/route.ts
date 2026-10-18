import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, canSeeAllLeads } from "@/lib/server/permissions";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import { LEAD_STATUSES, type AdminDashboardResponse, type LeadStatus, type LeadSource } from "@/lib/types/crm";

export const dynamic = "force-dynamic";

interface ScopedLead {
  status: LeadStatus;
  source: LeadSource;
  owner_id: string | null;
  follow_up_at: string | null;
  created_at: string;
}

function monthStart(offset: number): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + offset);
  return d;
}

/**
 * Role-aware dashboard. A salesperson sees their own numbers; a manager sees
 * the whole team. Computed in one pass over the scoped rows rather than a
 * dozen count queries.
 */
export async function GET(request: NextRequest) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "view");

    const db = supabaseAdmin();
    const seesAll = canSeeAllLeads(staff);

    // Only the window the dashboard reports on: this month, last month, and
    // anything still open (which may be older).
    const since = monthStart(-1).toISOString();
    let query = db
      .from("leads")
      .select("status, source, owner_id, follow_up_at, created_at")
      .is("deleted_at", null)
      .or(`created_at.gte.${since},status.in.(new,contacted,quote_sent,negotiation,on_hold)`);

    if (!seesAll) query = query.eq("owner_id", staff.id);

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as ScopedLead[];

    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    const thisMonthStart = monthStart(0).getTime();
    const lastMonthStart = monthStart(-1).getTime();

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
      if (created >= todayStart && row.status === "new") newLeads += 1;
      if (!row.owner_id && !["converted", "lost", "junk"].includes(row.status)) unassigned += 1;

      if (row.follow_up_at) {
        const due = new Date(row.follow_up_at).getTime();
        if (due < now) followUpsOverdue += 1;
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

    const rate = (converted: number, total: number) => (total === 0 ? 0 : Math.round((converted / total) * 1000) / 10);

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
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
