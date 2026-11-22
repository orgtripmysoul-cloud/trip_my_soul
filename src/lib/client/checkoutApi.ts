"use client";

import type {
  BookingLookupResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  CreateCustomPaymentRequest,
  CreateCustomPaymentResponse,
  CreateQuoteLeadRequest,
  PaymentIntentResponse,
  QuoteDetailsResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/lib/types/booking";

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/** Human copy for the error codes in src/lib/server/errors.ts — never show raw server errors. */
export const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_FAILED: "Please check your details and try again.",
  SEATS_UNAVAILABLE: "Sorry, these seats are no longer available. Please choose another departure.",
  HOLD_EXPIRED: "Your seat reservation expired. Check availability again to continue.",
  DUPLICATE_REQUEST: "This request was already processed differently. Please refresh and try again.",
  REQUEST_IN_PROGRESS: "Your previous request is still being processed. Please wait a moment.",
  PAYMENT_VERIFICATION_FAILED: "We couldn't verify that payment. Please contact support with your booking number.",
  GATEWAY_UNAVAILABLE: "Payment service is temporarily unavailable. Please try again.",
  NOT_FOUND: "We couldn't find that booking.",
  DB_OPERATION_FAILED: "We couldn't save your booking. Please try again.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
  SERVICE_UNAVAILABLE: "This service is temporarily unavailable. Please try again shortly.",
  EMAIL_NOT_VERIFIED: "Please verify your email before booking.",
  RATE_LIMITED: "Too many requests. Please try again shortly.",
  EMAIL_SEND_FAILED: "Couldn't send the verification code. Please try again in a moment.",
  CONFIG_ERROR: "Verification is temporarily unavailable. Please try again shortly.",
};

async function postJson<T>(url: string, body: unknown, idempotencyKey?: string): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiError(data.code ?? "RATE_LIMITED", data.message ?? "Too many requests. Please try again shortly.");
    }
    throw new ApiError(data.code ?? "INTERNAL_ERROR", data.message ?? "Something went wrong.");
  }
  return data as T;
}

export interface SendOtpResponse {
  ok: boolean;
  expiresInMinutes: number;
}

export interface ConfirmOtpResponse {
  verified: boolean;
  token?: string;
  message?: string;
  expiresInMinutes?: number;
}

export function sendVerificationOtp(email: string): Promise<SendOtpResponse> {
  return postJson("/api/verify/send", { email });
}

/** Does not throw on an incorrect/expired code (`verified: false` with `message`) — only on network/validation failure. */
export async function confirmVerificationOtp(email: string, code: string): Promise<ConfirmOtpResponse> {
  const res = await fetch("/api/verify/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (res.status === 429) {
    throw new ApiError("RATE_LIMITED", data.message ?? "Too many requests. Please try again shortly.");
  }
  return data as ConfirmOtpResponse;
}

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

export function createBooking(body: CreateBookingRequest, idempotencyKey: string): Promise<CreateBookingResponse> {
  return postJson("/api/v1/public/bookings", body, idempotencyKey);
}

export function createPaymentIntent(bookingNo: string, idempotencyKey: string): Promise<PaymentIntentResponse> {
  return postJson(`/api/v1/public/bookings/${encodeURIComponent(bookingNo)}/payment-intent`, {}, idempotencyKey);
}

export function verifyPayment(body: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  return postJson("/api/v1/public/payments/verify", body);
}

export async function lookupBooking(bookingNo: string, email: string): Promise<BookingLookupResponse> {
  const res = await fetch(
    `/api/v1/public/bookings/lookup?booking_no=${encodeURIComponent(bookingNo)}&email=${encodeURIComponent(email)}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(data.code ?? "INTERNAL_ERROR", data.message ?? "Something went wrong.");
  }
  return data as BookingLookupResponse;
}

export function createCustomPayment(body: CreateCustomPaymentRequest, idempotencyKey: string): Promise<CreateCustomPaymentResponse> {
  return postJson("/api/v1/public/pay", body, idempotencyKey);
}

export function submitQuoteLead(body: CreateQuoteLeadRequest): Promise<{ ok: boolean }> {
  return postJson("/api/v1/public/quote-leads", body);
}

export async function getQuoteDetails(token: string): Promise<QuoteDetailsResponse> {
  const res = await fetch(`/api/v1/public/quotes/${encodeURIComponent(token)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(data.code ?? "INTERNAL_ERROR", data.message ?? "Something went wrong.");
  }
  return data as QuoteDetailsResponse;
}

export function payQuote(token: string, idempotencyKey: string): Promise<CreateCustomPaymentResponse> {
  return postJson(`/api/v1/public/quotes/${encodeURIComponent(token)}/pay`, {}, idempotencyKey);
}

let razorpayScriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window !== "undefined" && (window as unknown as { Razorpay?: unknown }).Razorpay) {
    return Promise.resolve();
  }
  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Could not load the payment gateway. Please check your connection."));
      document.body.appendChild(script);
    });
  }
  return razorpayScriptPromise;
}
