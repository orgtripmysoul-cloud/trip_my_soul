import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { computeCustomPricing } from "@/lib/server/customPayments";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { QuoteDetailsResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

interface QuoteRow {
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  trip_label: string;
  departure_date: string | null;
  pax: number;
  amount: number;
  purpose: string;
  addon_detail: string | null;
  notes: string | null;
  expiry_date: string;
}

/** Public read of a locked quote — no auth, since the token itself is the credential shared over WhatsApp/email. Never exposes created_by/staff info. */
export async function GET(_request: NextRequest, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;
    const db = supabaseAdmin();

    const { data: quote } = await db
      .from("custom_quotes")
      .select("status, customer_name, customer_email, customer_phone, trip_label, departure_date, pax, amount, purpose, addon_detail, notes, expiry_date")
      .eq("token", token)
      .maybeSingle<QuoteRow>();

    if (!quote) throw new AppError("NOT_FOUND", "This payment link is invalid.");

    const isExpired = quote.status === "pending" && new Date(quote.expiry_date) < new Date(new Date().toDateString());
    if (isExpired) {
      await db.from("custom_quotes").update({ status: "expired" }).eq("token", token).eq("status", "pending");
    }

    const pricing = computeCustomPricing(quote.amount);
    const responseBody: QuoteDetailsResponse = {
      status: isExpired ? "expired" : (quote.status as QuoteDetailsResponse["status"]),
      customerName: quote.customer_name,
      customerEmail: quote.customer_email,
      customerPhone: quote.customer_phone,
      tripLabel: quote.trip_label,
      departureDate: quote.departure_date,
      pax: quote.pax,
      amount: pricing.baseAmount,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      purpose: quote.purpose as QuoteDetailsResponse["purpose"],
      addonDetail: quote.addon_detail,
      notes: quote.notes,
      expiryDate: quote.expiry_date,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
