import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, maskPhone } from "@/lib/server/permissions";
import { logActivity } from "@/lib/server/activityLog";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminCustomerListItem, AdminCustomerListResponse } from "@/lib/types/customer";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const EXPORT_LIMIT = 5000;

/** Strips characters that would break out of a PostgREST `or=(...)` filter. */
function sanitiseSearch(raw: string): string {
  return raw.replace(/[,()*%\\:"']/g, " ").trim().slice(0, 100);
}

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  // Neutralise spreadsheet formula injection, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * Customer database: everyone who has ever booked or paid. Supports search
 * (name / email / phone), sorting, pagination, and `format=csv` export.
 */
export async function GET(request: NextRequest) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "customers", "view");

    const params = request.nextUrl.searchParams;
    const isExport = params.get("format") === "csv";
    if (isExport) await requirePermission(staff, "customers", "export");

    const q = sanitiseSearch(params.get("q") ?? "");
    const sort = params.get("sort") === "name" ? "name" : "recent";
    const limit = isExport
      ? EXPORT_LIMIT
      : Math.min(MAX_LIMIT, Math.max(1, Number(params.get("limit")) || DEFAULT_LIMIT));
    const offset = isExport ? 0 : Math.max(0, Number(params.get("offset")) || 0);

    const db = supabaseAdmin();
    let query = db.from("customers").select("id, full_name, email, phone, created_at", { count: "exact" });

    if (q) {
      query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
    }
    query =
      sort === "name"
        ? query.order("full_name", { ascending: true })
        : query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data: customers, count, error } = await query;
    if (error) throw error;

    const rows = customers ?? [];
    const ids = rows.map((c) => c.id);
    const { data: bookings } = ids.length
      ? await db
          .from("bookings")
          .select("customer_id, paid_amount, created_at, status")
          .in("customer_id", ids)
          .neq("status", "draft")
      : { data: [] };

    const stats = new Map<string, { count: number; paid: number; last: string | null }>();
    for (const b of bookings ?? []) {
      const s = stats.get(b.customer_id) ?? { count: 0, paid: 0, last: null };
      s.count += 1;
      s.paid += Number(b.paid_amount) || 0;
      if (!s.last || b.created_at > s.last) s.last = b.created_at;
      stats.set(b.customer_id, s);
    }

    const items: AdminCustomerListItem[] = rows.map((c) => {
      const s = stats.get(c.id);
      return {
        id: c.id,
        name: c.full_name,
        email: c.email,
        phone: maskPhone(c.phone, staff),
        bookingsCount: s?.count ?? 0,
        totalPaid: s?.paid ?? 0,
        lastBookingAt: s?.last ?? null,
        createdAt: c.created_at,
      };
    });

    if (isExport) {
      await logActivity(staff, request, {
        action: "export",
        module: "customers",
        newValues: { rows: items.length, q: q || null },
      });
      const header = ["Name", "Email", "Phone", "Bookings", "Total paid (INR)", "Last booking", "Customer since"];
      const lines = [
        header.map(csvCell).join(","),
        ...items.map((c) =>
          [c.name, c.email, c.phone, c.bookingsCount, c.totalPaid, c.lastBookingAt ?? "", c.createdAt]
            .map(csvCell)
            .join(",")
        ),
      ];
      return new NextResponse(lines.join("\r\n"), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="tripmysoul-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const body: AdminCustomerListResponse = { customers: items, total: count ?? items.length, limit, offset };
    return NextResponse.json(body, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
