import { NextRequest, NextResponse, after } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { claimIdempotencyKey, completeIdempotencyKey, releaseIdempotencyKey } from "@/lib/server/idempotency";
import { AppError, errorResponseBody, statusForError, fromPostgresError } from "@/lib/server/errors";
import { isValidInrAmount } from "@/lib/money";
import { dispatchPendingNotifications } from "@/lib/server/notifications";
import { sendEmail } from "@/lib/server/resend";
import { renderBookingInternalNotificationEmail, type BookingConfirmationVars } from "@/lib/server/email-templates/bookingConfirmation";
import { env } from "@/lib/server/env";
import type {
  AdminManualPaymentMethod,
  AdminRecordPaymentRequest,
  AdminRecordPaymentResponse,
} from "@/lib/types/booking";

export const dynamic = "force-dynamic";

const ENDPOINT = "POST /v1/admin/bookings/:bookingNo/payments";
const ALLOWED_METHODS: AdminManualPaymentMethod[] = ["cash", "upi_manual", "bank_transfer", "other"];

export async function POST(request: NextRequest, context: { params: Promise<{ bookingNo: string }> }) {
  const { bookingNo } = await context.params;
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Missing Idempotency-Key header.")), { status: 400 });
  }

  let staffContext;
  try {
    staffContext = await requireStaff(request);
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(errorResponseBody(new AppError("VALIDATION_FAILED", "Invalid JSON body.")), { status: 400 });
  }

  let claim;
  try {
    claim = await claimIdempotencyKey(ENDPOINT, idempotencyKey, staffContext.id, rawBody);
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
  if (claim.kind === "replay") {
    return NextResponse.json(claim.response, { status: claim.statusCode });
  }

  try {
    const body = rawBody as Partial<AdminRecordPaymentRequest>;
    if (typeof body.amount !== "number" || !isValidInrAmount(body.amount)) {
      throw new AppError("VALIDATION_FAILED", "Please enter a valid amount.");
    }
    if (!body.method || !ALLOWED_METHODS.includes(body.method)) {
      throw new AppError("VALIDATION_FAILED", "Unsupported payment method.");
    }

    const db = supabaseAdmin();

    const { data: booking } = await db.from("bookings").select("id").eq("booking_no", bookingNo).single();
    if (!booking) throw new AppError("NOT_FOUND", "We couldn't find that booking.");

    const { data, error } = await db.rpc("record_manual_payment", {
      p_booking_id: booking.id,
      p_amount: body.amount,
      p_method: body.method,
      p_kind: body.kind ?? "installment",
      p_transaction_reference: body.transactionReference ?? null,
      p_notes: body.notes ?? null,
      p_staff_id: staffContext.id,
    });
    if (error) throw fromPostgresError(error);

    const result = data as {
      booking: { booking_no: string; status: string; payment_state: string; total_amount: number; paid_amount: number };
      payment: {
        id: string;
        kind: string;
        amount: number;
        currency: string;
        gateway: string;
        method: string | null;
        status: string;
        transaction_reference: string | null;
        notes: string | null;
        verified_at: string | null;
        captured_at: string | null;
        created_at: string;
      };
      vars: BookingConfirmationVars;
    };

    const responseBody: AdminRecordPaymentResponse = {
      booking: {
        bookingNo: result.booking.booking_no,
        status: result.booking.status,
        paymentState: result.booking.payment_state,
        totalAmount: result.booking.total_amount,
        paidAmount: result.booking.paid_amount,
      },
      payment: {
        id: result.payment.id,
        kind: result.payment.kind,
        amount: result.payment.amount,
        currency: result.payment.currency,
        gateway: result.payment.gateway,
        method: result.payment.method,
        status: result.payment.status,
        transactionReference: result.payment.transaction_reference,
        notes: result.payment.notes,
        collectedByName: staffContext.fullName,
        verifiedByName: staffContext.fullName,
        verifiedAt: result.payment.verified_at,
        capturedAt: result.payment.captured_at,
        createdAt: result.payment.created_at,
      },
    };

    await completeIdempotencyKey(ENDPOINT, idempotencyKey, 200, responseBody);

    // Best-effort, after the response is sent. after() keeps the serverless
    // function alive until these finish; a bare un-awaited promise can be
    // frozen/dropped by Vercel once the response returns.
    after(() =>
      sendInternalBookingNotification(result.vars).catch((err) =>
        console.error("[admin-record-payment] internal notification email failed", err)
      )
    );
    after(() =>
      dispatchPendingNotifications(10).catch((err) =>
        console.error("[admin-record-payment] notification dispatch failed", err)
      )
    );

    return NextResponse.json(responseBody, { status: 200 });
  } catch (err) {
    await releaseIdempotencyKey(ENDPOINT, idempotencyKey);
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}

async function sendInternalBookingNotification(vars: BookingConfirmationVars): Promise<void> {
  const { subject, html, text } = await renderBookingInternalNotificationEmail(vars);
  await sendEmail(env.resendBookingsInbox, subject, html, text);
}
