import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminPaymentListItem, AdminPaymentListResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toCsv(items: AdminPaymentListItem[]): string {
  const header = ["Booking No", "Type", "Trek", "Customer Name", "Customer Email", "Status", "Payment State", "Total", "Paid", "Currency", "Created At"];
  const rows = items.map((item) =>
    [
      item.bookingNo,
      item.bookingType,
      item.trekName,
      item.customerName,
      item.customerEmail,
      item.status,
      item.paymentState,
      String(item.totalAmount),
      String(item.paidAmount),
      item.currency,
      item.createdAt,
    ]
      .map(csvEscape)
      .join(",")
  );
  return [header.join(","), ...rows].join("\n");
}

/** Admin payments list — every booking (trek + custom), filterable by status/trek/booking type/date range, with CSV export. */
export async function GET(request: NextRequest) {
  try {
    await requireStaff(request);

    const params = request.nextUrl.searchParams;
    const status = params.get("status")?.trim() || null;
    const bookingType = params.get("bookingType")?.trim() || null;
    const trekSlug = params.get("trekSlug")?.trim() || null;
    const dateFrom = params.get("dateFrom")?.trim() || null;
    const dateTo = params.get("dateTo")?.trim() || null;
    const format = params.get("format")?.trim() || "json";
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.get("limit")) || DEFAULT_LIMIT));
    const offset = Math.max(0, Number(params.get("offset")) || 0);

    const db = supabaseAdmin();

    let departureIdsForTrek: string[] | null = null;
    if (trekSlug) {
      const { data: deps } = await db.from("departures").select("id").eq("trek_slug", trekSlug);
      departureIdsForTrek = (deps ?? []).map((d) => d.id);
    }

    let query = db
      .from("bookings")
      .select(
        "id, booking_no, booking_type, status, payment_state, total_amount, paid_amount, currency, customer_id, departure_id, created_at",
        { count: "exact" }
      )
      .neq("status", "draft");

    if (status) query = query.eq("status", status);
    if (bookingType) query = query.eq("booking_type", bookingType);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo);
    if (departureIdsForTrek) {
      if (departureIdsForTrek.length === 0) {
        const emptyBody: AdminPaymentListResponse = { payments: [], total: 0, limit, offset };
        return format === "csv"
          ? new NextResponse(toCsv([]), { status: 200, headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=payments.csv" } })
          : NextResponse.json(emptyBody, { status: 200 });
      }
      query = query.in("departure_id", departureIdsForTrek);
    }

    const isCsv = format === "csv";
    query = query.order("created_at", { ascending: false });
    query = isCsv ? query.range(0, 9999) : query.range(offset, offset + limit - 1);

    const { data: bookings, count, error } = await query;
    if (error) throw error;

    const items = bookings ?? [];
    const customerIds = [...new Set(items.map((b) => b.customer_id))];
    const departureIds = [...new Set(items.map((b) => b.departure_id))];

    const { data: customers } = customerIds.length
      ? await db.from("customers").select("id, full_name, email").in("id", customerIds)
      : { data: [] };
    const customerById = new Map((customers ?? []).map((c) => [c.id, c]));

    const { data: departures } = departureIds.length
      ? await db.from("departures").select("id, trek_id").in("id", departureIds)
      : { data: [] };
    const departureById = new Map((departures ?? []).map((d) => [d.id, d]));

    const trekIds = [...new Set((departures ?? []).map((d) => d.trek_id))];
    const { data: treks } = trekIds.length ? await db.from("treks").select("id, name").in("id", trekIds) : { data: [] };
    const trekById = new Map((treks ?? []).map((t) => [t.id, t]));

    const responseItems: AdminPaymentListItem[] = items.map((booking) => {
      const customer = customerById.get(booking.customer_id);
      const departure = departureById.get(booking.departure_id);
      const trek = departure ? trekById.get(departure.trek_id) : undefined;
      return {
        bookingNo: booking.booking_no,
        bookingType: booking.booking_type,
        trekName: booking.booking_type === "custom" ? "Custom Payment" : trek?.name ?? "",
        customerName: customer?.full_name ?? "",
        customerEmail: customer?.email ?? "",
        status: booking.status,
        paymentState: booking.payment_state,
        totalAmount: booking.total_amount,
        paidAmount: booking.paid_amount,
        currency: booking.currency,
        createdAt: booking.created_at,
      };
    });

    if (isCsv) {
      return new NextResponse(toCsv(responseItems), {
        status: 200,
        headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=payments.csv" },
      });
    }

    const responseBody: AdminPaymentListResponse = { payments: responseItems, total: count ?? responseItems.length, limit, offset };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
