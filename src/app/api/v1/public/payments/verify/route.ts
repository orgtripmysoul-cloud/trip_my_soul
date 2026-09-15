import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { verifyCheckoutCallbackSignature } from "@/lib/server/razorpay";
import { supabaseAdmin } from "@/lib/server/supabase";
import { errorResponseBody, statusForError, AppError } from "@/lib/server/errors";
import type { VerifyPaymentRequest, VerifyPaymentResponse } from "@/lib/types/booking";

export const dynamic = "force-dynamic";

/**
 * ADVISORY ONLY. This checks the Razorpay checkout callback signature so the
 * UI can move to an optimistic "confirming your booking" state — it must
 * NEVER be used to mark a booking confirmed. Only the signed webhook
 * (payment.captured) does that. See src/app/api/webhooks/razorpay/route.ts.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<VerifyPaymentRequest>;
    if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
      throw new AppError("VALIDATION_FAILED", "Missing payment verification fields.");
    }

    const verified = verifyCheckoutCallbackSignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );

    if (verified) {
      // Best-effort optimistic marker only; never touches booking status.
      try {
        await supabaseAdmin().rpc("mark_payment_attempted", { p_gateway_order_id: body.razorpay_order_id });
      } catch {
        // ignored — advisory only
      }
    }

    const responseBody: VerifyPaymentResponse = { verified };
    return NextResponse.json(responseBody, { status: verified ? 200 : 400 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
