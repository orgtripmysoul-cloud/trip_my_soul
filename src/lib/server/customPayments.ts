import "server-only";
import crypto from "node:crypto";
import { supabaseAdmin } from "./supabase";
import { round2 } from "@/lib/money";

/** Same rate as computeBookingPricing (src/lib/server/pricing.ts) — one GST rate across the whole site. */
const GST_RATE = 0.05;

/** Below this, a Razorpay order isn't worth the transaction fee. Enforced server-side, never trust a client-sent amount. */
export const MIN_CUSTOM_PAYMENT_AMOUNT = 500;

export const CUSTOM_PAYMENT_TREK_SLUG = "custom-payment";
export const CUSTOM_PAYMENT_BATCH_LABEL = "one-time";

export interface CustomPricingResult {
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
}

/** GST is added on top of the amount the customer/admin enters — that entered amount is never itself inclusive of tax. */
export function computeCustomPricing(baseAmount: number): CustomPricingResult {
  const base = round2(baseAmount);
  const taxAmount = round2(base * GST_RATE);
  const totalAmount = round2(base + taxAmount);
  return { baseAmount: base, taxAmount, totalAmount };
}

export function isValidCustomAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= MIN_CUSTOM_PAYMENT_AMOUNT && round2(amount) === amount;
}

/** Cryptographically random, URL-safe token for /pay/[token] links. Long enough that guessing is infeasible. */
export function generateQuoteToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

/**
 * Every custom payment books against this one shared, effectively unlimited
 * departure (see 0015_custom_payments.sql) rather than a real trek's
 * inventory, so create_booking_with_hold's capacity check never blocks it
 * and no real seat is ever consumed by a custom payment.
 */
export async function resolveCustomPaymentDepartureId(): Promise<string> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("departures")
    .select("id")
    .eq("trek_slug", CUSTOM_PAYMENT_TREK_SLUG)
    .eq("batch_label", CUSTOM_PAYMENT_BATCH_LABEL)
    .single();
  if (error || !data) {
    throw new Error("Custom payment sentinel departure is missing — did migration 0015 run?");
  }
  return data.id;
}
