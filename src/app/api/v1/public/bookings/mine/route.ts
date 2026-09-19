import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { MyBookingSummary, MyBookingsResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

/**
 * Lists bookings for the logged-in traveller. The caller's identity comes
 * from their Supabase access token, never from a client-supplied email —
 * otherwise anyone could list anyone else's bookings by guessing an address.
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
    if (!accessToken) {
      throw new AppError("VALIDATION_FAILED", "Missing bearer token.");
    }

    const db = supabaseAdmin();
    const { data: userData, error: userError } = await db.auth.getUser(accessToken);
    if (userError || !userData.user?.email) {
      throw new AppError("VALIDATION_FAILED", "Not signed in.");
    }
    const email = userData.user.email;

    const { data: customer } = await db.from("customers").select("id").eq("email", email).maybeSingle();
    if (!customer) {
      return NextResponse.json({ bookings: [] } satisfies MyBookingsResponse, { status: 200 });
    }

    const { data: bookings } = await db
      .from("bookings")
      .select("id, booking_no, status, payment_state, pax, total_amount, paid_amount, currency, departure_id, created_at")
      .eq("customer_id", customer.id)
      .neq("status", "draft")
      .order("created_at", { ascending: false });

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ bookings: [] } satisfies MyBookingsResponse, { status: 200 });
    }

    const departureIds = [...new Set(bookings.map((b) => b.departure_id))];
    const { data: departures } = await db
      .from("departures")
      .select("id, trek_id, trek_slug, batch_label, start_date, end_date")
      .in("id", departureIds);
    const departureById = new Map((departures ?? []).map((d) => [d.id, d]));

    const trekIds = [...new Set((departures ?? []).map((d) => d.trek_id))];
    const { data: treks } = await db.from("treks").select("id, name, region").in("id", trekIds);
    const trekById = new Map((treks ?? []).map((t) => [t.id, t]));

    const summaries: MyBookingSummary[] = bookings.map((booking) => {
      const departure = departureById.get(booking.departure_id);
      const trek = departure ? trekById.get(departure.trek_id) : undefined;
      return {
        bookingNo: booking.booking_no,
        status: booking.status,
        paymentState: booking.payment_state,
        pax: booking.pax,
        totalAmount: booking.total_amount,
        paidAmount: booking.paid_amount,
        currency: booking.currency,
        trekSlug: departure?.trek_slug ?? "",
        trekName: trek?.name ?? "",
        region: trek?.region ?? null,
        batchLabel: departure?.batch_label ?? "",
        startDate: departure?.start_date ?? null,
        endDate: departure?.end_date ?? null,
        createdAt: booking.created_at,
      };
    });

    return NextResponse.json({ bookings: summaries } satisfies MyBookingsResponse, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
