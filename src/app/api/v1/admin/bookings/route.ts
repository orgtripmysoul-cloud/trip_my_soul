import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminBookingListItem, AdminBookingListResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request);

    const params = request.nextUrl.searchParams;
    const q = params.get("q")?.trim() || null;
    const status = params.get("status")?.trim() || null;
    const paymentState = params.get("paymentState")?.trim() || null;
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(params.get("limit")) || DEFAULT_LIMIT));
    const offset = Math.max(0, Number(params.get("offset")) || 0);

    const db = supabaseAdmin();

    let matchingCustomerIds: string[] | null = null;
    if (q) {
      const { data: customers } = await db
        .from("customers")
        .select("id")
        .or(`email.ilike.%${q}%,phone.ilike.%${q}%`);
      matchingCustomerIds = (customers ?? []).map((c) => c.id);
    }

    let query = db
      .from("bookings")
      .select(
        "id, booking_no, status, payment_state, total_amount, paid_amount, currency, customer_id, departure_id, created_at",
        { count: "exact" }
      )
      .neq("status", "draft");

    if (status) query = query.eq("status", status);
    if (paymentState) query = query.eq("payment_state", paymentState);

    if (q) {
      const orParts = [`booking_no.ilike.%${q}%`];
      if (matchingCustomerIds && matchingCustomerIds.length > 0) {
        orParts.push(`customer_id.in.(${matchingCustomerIds.join(",")})`);
      }
      query = query.or(orParts.join(","));
    }

    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    const { data: bookings, count, error } = await query;
    if (error) throw error;

    const items = bookings ?? [];
    const customerIds = [...new Set(items.map((b) => b.customer_id))];
    const departureIds = [...new Set(items.map((b) => b.departure_id))];

    const { data: customers } = customerIds.length
      ? await db.from("customers").select("id, full_name, email, phone").in("id", customerIds)
      : { data: [] };
    const customerById = new Map((customers ?? []).map((c) => [c.id, c]));

    const { data: departures } = departureIds.length
      ? await db.from("departures").select("id, trek_id, batch_label").in("id", departureIds)
      : { data: [] };
    const departureById = new Map((departures ?? []).map((d) => [d.id, d]));

    const trekIds = [...new Set((departures ?? []).map((d) => d.trek_id))];
    const { data: treks } = trekIds.length ? await db.from("treks").select("id, name").in("id", trekIds) : { data: [] };
    const trekById = new Map((treks ?? []).map((t) => [t.id, t]));

    const responseItems: AdminBookingListItem[] = items.map((booking) => {
      const customer = customerById.get(booking.customer_id);
      const departure = departureById.get(booking.departure_id);
      const trek = departure ? trekById.get(departure.trek_id) : undefined;
      return {
        bookingNo: booking.booking_no,
        status: booking.status,
        paymentState: booking.payment_state,
        totalAmount: booking.total_amount,
        paidAmount: booking.paid_amount,
        currency: booking.currency,
        customerName: customer?.full_name ?? "",
        customerEmail: customer?.email ?? "",
        customerPhone: customer?.phone ?? "",
        trekName: trek?.name ?? "",
        batchLabel: departure?.batch_label ?? "",
        createdAt: booking.created_at,
      };
    });

    const responseBody: AdminBookingListResponse = {
      bookings: responseItems,
      total: count ?? responseItems.length,
      limit,
      offset,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
