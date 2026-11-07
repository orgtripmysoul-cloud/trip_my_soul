import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission } from "@/lib/server/permissions";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

/** Internal note on a booking (pickup changes, special requests, call logs). */
export async function POST(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "bookings", "view");
    const { bookingNo } = await context.params;

    let body: { body?: string };
    try {
      body = (await request.json()) as { body?: string };
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }
    const text = (body.body ?? "").trim();
    if (!text) throw new AppError("VALIDATION_FAILED", "Please write a note.");
    if (text.length > 5000) throw new AppError("VALIDATION_FAILED", "The note is too long.");

    const db = supabaseAdmin();
    const { data: booking } = await db.from("bookings").select("id").eq("booking_no", bookingNo).maybeSingle();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { error } = await db.from("booking_notes").insert({ booking_id: booking.id, staff_id: staff.id, body: text });
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
