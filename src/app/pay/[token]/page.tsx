"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, XCircle, Lock } from "lucide-react";
import { ApiError, ERROR_MESSAGES, getQuoteDetails, loadRazorpayScript, newIdempotencyKey, payQuote } from "@/lib/client/checkoutApi";
import { formatInr } from "@/lib/money";
import type { QuoteDetailsResponse } from "@/lib/types/booking";

type LoadState = "loading" | "ready" | "not_found";
type FlowState = "idle" | "creating" | "awaiting_payment" | "success" | "failure";

const PURPOSE_LABELS: Record<string, string> = {
  advance: "Advance / booking deposit",
  full: "Full trip amount",
  balance: "Balance payment",
  addon: "Add-on",
};

export default function QuotePayPage() {
  const params = useParams();
  const token = params.token as string;

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [quote, setQuote] = useState<QuoteDetailsResponse | null>(null);
  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [flowError, setFlowError] = useState<string | null>(null);

  useEffect(() => {
    getQuoteDetails(token)
      .then((data) => {
        setQuote(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("not_found"));
  }, [token]);

  const handlePay = async () => {
    if (!quote) return;
    setFlowError(null);
    setFlowState("creating");
    try {
      const order = await payQuote(token, newIdempotencyKey());
      await loadRazorpayScript();
      if (!window.Razorpay) throw new ApiError("GATEWAY_UNAVAILABLE", ERROR_MESSAGES.GATEWAY_UNAVAILABLE);

      setFlowState("awaiting_payment");
      const rzp = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: Math.round(order.payingNowAmount * 100),
        currency: order.currency,
        name: "TripMySoul",
        description: `${quote.tripLabel} — ${PURPOSE_LABELS[quote.purpose] ?? quote.purpose}`,
        order_id: order.razorpayOrderId,
        prefill: { name: quote.customerName, email: quote.customerEmail, contact: quote.customerPhone },
        theme: { color: "#0B2545" },
        handler: () => setFlowState("success"),
        modal: { ondismiss: () => setFlowState("idle") },
      });
      rzp.on("payment.failed", (resp) => {
        setFlowState("failure");
        setFlowError(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setFlowState("failure");
      setFlowError(err instanceof ApiError ? ERROR_MESSAGES[err.code] ?? err.message : "Something went wrong.");
    }
  };

  if (loadState === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-xs text-gray-400 pt-24">Loading payment link...</div>;
  }

  if (loadState === "not_found" || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-sm text-center space-y-3">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">Invalid payment link</h1>
          <p className="text-xs text-gray-500">This link doesn&apos;t exist or has been removed. Please contact us for a new one.</p>
        </div>
      </div>
    );
  }

  if (quote.status === "paid" || flowState === "success") {
    return (
      <div className="min-h-screen bg-[#F7F9FC] pt-32 pb-20 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <h1 className="text-2xl font-bold font-serif text-brand-dark-text">Payment received!</h1>
          <p className="text-xs text-gray-500">A receipt has been emailed to {quote.customerEmail}. Thank you!</p>
        </div>
      </div>
    );
  }

  if (quote.status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-sm text-center space-y-3">
          <XCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-xl font-bold">This payment link has expired</h1>
          <p className="text-xs text-gray-500">Please contact us on WhatsApp or email for a fresh payment link.</p>
        </div>
      </div>
    );
  }

  if (quote.status === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-sm text-center space-y-3">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto" />
          <h1 className="text-xl font-bold">This payment link is no longer valid</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pt-24 pb-20 px-4 font-sans text-brand-dark-text">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold font-serif">Complete Your Payment</h1>
          <p className="text-xs text-gray-500">Details below have been pre-filled by our team and cannot be edited.</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="space-y-3 text-xs">
            <Row label="Name" value={quote.customerName} />
            <Row label="Email" value={quote.customerEmail} />
            <Row label="Mobile" value={quote.customerPhone} />
            <Row label="Trek / Trip" value={quote.tripLabel} />
            {quote.departureDate && <Row label="Departure date" value={quote.departureDate} />}
            <Row label="Trekkers" value={String(quote.pax)} />
            <Row label="Payment for" value={PURPOSE_LABELS[quote.purpose] ?? quote.purpose} />
            {quote.addonDetail && <Row label="Add-on" value={quote.addonDetail} />}
            {quote.notes && <Row label="Notes" value={quote.notes} />}
          </div>

          <div className="bg-brand-warm-bg rounded-2xl p-4 space-y-2 text-xs border border-gray-150">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold">{formatInr(quote.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">GST (5%)</span>
              <span className="font-bold">{formatInr(quote.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
              <span className="font-bold">Total to pay</span>
              <span className="font-extrabold text-brand-forest">{formatInr(quote.totalAmount)}</span>
            </div>
          </div>

          {flowError && (
            <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-150 text-xs text-red-700 font-semibold">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{flowError}</span>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={flowState === "creating" || flowState === "awaiting_payment"}
            className="w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white bg-[#E84855] hover:bg-[#d63b48] transition shadow-lg disabled:bg-gray-300"
          >
            {flowState === "creating" ? "Preparing secure payment..." : flowState === "awaiting_payment" ? "Waiting for payment..." : `Pay ${formatInr(quote.totalAmount)}`}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>
              Processed securely by Razorpay. See our{" "}
              <Link href="/policies/cancellation-policy" className="text-blue-600 font-bold hover:underline">
                cancellation &amp; refund policy
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-400 font-semibold shrink-0">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}
