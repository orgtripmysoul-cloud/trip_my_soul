import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { generateQuoteToken, isValidCustomAmount, MIN_CUSTOM_PAYMENT_AMOUNT } from "@/lib/server/customPayments";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminCreateQuoteRequest, AdminCreateQuoteResponse, AdminQuoteListItem, AdminQuoteListResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(body: Partial<AdminCreateQuoteRequest>): AdminCreateQuoteRequest {
  const customer = body.customer;
  if (!customer?.name?.trim() || !customer?.email || !isEmail(customer.email) || !customer?.phone?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please provide a valid customer name, email and phone number.");
  }
  if (!body.tripLabel?.trim()) {
    throw new AppError("VALIDATION_FAILED", "Please enter the trek/trip this quote is for.");
  }
  if (!isValidCustomAmount(body.amount ?? NaN)) {
    throw new AppError("VALIDATION_FAILED", `Please enter a valid amount (minimum ₹${MIN_CUSTOM_PAYMENT_AMOUNT.toLocaleString()}).`);
  }
  if (!body.purpose || !["advance", "full", "balance", "addon"].includes(body.purpose)) {
    throw new AppError("VALIDATION_FAILED", "Please select what this payment is for.");
  }
  if (!body.expiryDate || Number.isNaN(new Date(body.expiryDate).getTime())) {
    throw new AppError("VALIDATION_FAILED", "Please set a valid expiry date.");
  }
  if (new Date(body.expiryDate) < new Date(new Date().toDateString())) {
    throw new AppError("VALIDATION_FAILED", "Expiry date cannot be in the past.");
  }
  return body as AdminCreateQuoteRequest;
}

/** Admin creates a locked payment quote — produces a unique /pay/[token] link to share on WhatsApp/email. */
export async function POST(request: NextRequest) {
  try {
    const staff = await requireStaff(request);

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }
    const body = validate(rawBody as Partial<AdminCreateQuoteRequest>);
    const token = generateQuoteToken();

    const { error } = await supabaseAdmin().from("custom_quotes").insert({
      token,
      customer_name: body.customer.name.trim(),
      customer_email: body.customer.email.trim().toLowerCase(),
      customer_phone: body.customer.phone.trim(),
      trip_label: body.tripLabel.trim(),
      departure_date: body.departureDate || null,
      pax: body.pax ?? 1,
      amount: body.amount,
      purpose: body.purpose,
      addon_detail: body.addonDetail?.trim() || null,
      notes: body.notes?.trim() || null,
      expiry_date: body.expiryDate,
      created_by: staff.id,
    });
    if (error) throw new AppError("INTERNAL_ERROR", "Could not create the payment link.");

    const responseBody: AdminCreateQuoteResponse = { token, payUrl: `/pay/${token}` };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireStaff(request);

    const params = request.nextUrl.searchParams;
    const status = params.get("status")?.trim() || null;
    const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 25));

    const db = supabaseAdmin();
    let query = db
      .from("custom_quotes")
      .select(
        "token, status, customer_name, customer_email, customer_phone, trip_label, amount, purpose, expiry_date, booking_id, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (status) query = query.eq("status", status);

    const { data: quotes, error } = await query;
    if (error) throw error;

    const bookingIds = [...new Set((quotes ?? []).map((q) => q.booking_id).filter((id): id is string => Boolean(id)))];
    const { data: bookings } = bookingIds.length
      ? await db.from("bookings").select("id, booking_no").in("id", bookingIds)
      : { data: [] };
    const bookingNoById = new Map((bookings ?? []).map((b) => [b.id, b.booking_no]));

    const items: AdminQuoteListItem[] = (quotes ?? []).map((q) => ({
      token: q.token,
      status: q.status,
      customerName: q.customer_name,
      customerEmail: q.customer_email,
      customerPhone: q.customer_phone,
      tripLabel: q.trip_label,
      amount: q.amount,
      purpose: q.purpose as AdminQuoteListItem["purpose"],
      expiryDate: q.expiry_date,
      bookingNo: q.booking_id ? bookingNoById.get(q.booking_id) ?? null : null,
      createdAt: q.created_at,
    }));

    const responseBody: AdminQuoteListResponse = { quotes: items };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
