import "server-only";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env } from "./env";
import { AppError } from "./errors";

let client: Razorpay | null = null;

function razorpayClient(): Razorpay {
  if (!client) {
    client = new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret });
  }
  return client;
}

export interface CreateOrderParams {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
}

/** Creates a Razorpay order server-side. Never called from the browser. */
export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    return await razorpayClient().orders.create({
      amount: params.amountPaise,
      currency: "INR",
      receipt: params.receipt,
      notes: params.notes,
    });
  } catch (err) {
    console.error("Razorpay createOrder failed:", err);
    throw new AppError("GATEWAY_UNAVAILABLE", "Payment service is temporarily unavailable. Please try again.");
  }
}

function hmacHex(secret: string, payload: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verifies X-Razorpay-Signature on a webhook. rawBody must be the exact, unparsed request body. */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const expected = hmacHex(env.razorpayWebhookSecret, rawBody);
  return timingSafeEqualHex(expected, signatureHeader);
}

/**
 * Verifies the client-side checkout callback (order_id + "|" + payment_id).
 * ADVISORY ONLY — per the HLD/LLD, this must never be used to confirm a
 * booking. Only the webhook (verifyWebhookSignature + payment.captured) is
 * authoritative.
 */
export function verifyCheckoutCallbackSignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = hmacHex(env.razorpayKeySecret, `${orderId}|${paymentId}`);
  return timingSafeEqualHex(expected, signature);
}
