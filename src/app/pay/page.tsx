"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { ALL_TRIPS } from "@/data/trips";
import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import {
  ApiError,
  ERROR_MESSAGES,
  createCustomPayment,
  loadRazorpayScript,
  newIdempotencyKey,
} from "@/lib/client/checkoutApi";
import { formatInr } from "@/lib/money";
import type { CreateCustomPaymentRequest, CustomPaymentPurpose } from "@/lib/types/booking";

const MIN_AMOUNT = 500;
const OTHER_TRIP_VALUE = "__other__";

const TRIP_OPTIONS = [
  ...TREKS.map((t) => ({ slug: t.slug, name: t.name })),
  ...YATRAS.map((t) => ({ slug: t.slug, name: t.name })),
  ...WILDLIFE.map((t) => ({ slug: t.slug, name: t.name })),
  ...ALL_TRIPS.map((t) => ({ slug: t.slug, name: t.name })),
];

const PURPOSE_LABELS: Record<CustomPaymentPurpose, string> = {
  advance: "Advance / booking deposit",
  full: "Full trip amount",
  balance: "Balance payment",
  addon: "Add-on (gear rental, transport, private batch, etc.)",
};

type FlowState = "form" | "creating" | "awaiting_payment" | "success" | "failure";

export default function PayPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tripQuery, setTripQuery] = useState("");
  const [selectedTrip, setSelectedTrip] = useState<{ slug: string; name: string } | null>(null);
  const [showOtherTrip, setShowOtherTrip] = useState(false);
  const [customTripLabel, setCustomTripLabel] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [pax, setPax] = useState(1);
  const [amount, setAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<CustomPaymentPurpose>("advance");
  const [notes, setNotes] = useState("");

  const [flowState, setFlowState] = useState<FlowState>("form");
  const [flowError, setFlowError] = useState<string | null>(null);
  const [bookingNo, setBookingNo] = useState<string | null>(null);

  const filteredTrips = useMemo(() => {
    if (!tripQuery.trim()) return TRIP_OPTIONS.slice(0, 20);
    const q = tripQuery.trim().toLowerCase();
    return TRIP_OPTIONS.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 20);
  }, [tripQuery]);

  const numericAmount = Number(amount);
  const gstAmount = Number.isFinite(numericAmount) ? Math.round(numericAmount * 0.05 * 100) / 100 : 0;
  const totalAmount = Number.isFinite(numericAmount) ? Math.round((numericAmount + gstAmount) * 100) / 100 : 0;

  const tripLabel = showOtherTrip ? customTripLabel.trim() : selectedTrip?.name ?? "";

  const canSubmit =
    name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && phone.trim() && tripLabel && pax >= 1 && numericAmount >= MIN_AMOUNT;

  const handlePay = async () => {
    if (!canSubmit) {
      setFlowError("Please fill in all required fields with a valid amount.");
      setFlowState("failure");
      return;
    }
    setFlowError(null);
    setFlowState("creating");

    const body: CreateCustomPaymentRequest = {
      customer: { name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() },
      tripLabel,
      departureDate: departureDate || null,
      pax,
      amount: numericAmount,
      purpose,
      notes: notes.trim() || undefined,
    };

    try {
      const order = await createCustomPayment(body, newIdempotencyKey());
      setBookingNo(order.bookingNo);
      await loadRazorpayScript();
      if (!window.Razorpay) throw new ApiError("GATEWAY_UNAVAILABLE", ERROR_MESSAGES.GATEWAY_UNAVAILABLE);

      setFlowState("awaiting_payment");
      const rzp = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: Math.round(order.payingNowAmount * 100),
        currency: order.currency,
        name: "TripMySoul",
        description: `Custom payment — ${tripLabel}`,
        order_id: order.razorpayOrderId,
        prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
        theme: { color: "#0B2545" },
        handler: () => setFlowState("success"),
        modal: { ondismiss: () => setFlowState("form") },
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

  if (flowState === "success" && bookingNo) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] pt-32 pb-20 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
          <h1 className="text-2xl font-bold font-serif text-brand-dark-text">Payment received!</h1>
          <p className="text-xs text-gray-500">
            We are confirming your payment. A receipt will be emailed to <strong>{email}</strong> shortly. Reference:{" "}
            <span className="font-mono font-bold">{bookingNo}</span>
          </p>
          <Link href="/dashboard" className="inline-flex items-center justify-center w-full py-3 rounded-full bg-[#0B2545] text-white font-bold text-xs">
            Go to My Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pt-24 pb-20 px-4 font-sans text-brand-dark-text">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold font-serif">Pay a Custom Amount</h1>
          <p className="text-xs text-gray-500">For advances, balances, add-ons, or a custom itinerary quote.</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm sm:col-span-2"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
            />
            <input
              type="tel"
              placeholder="Mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-600 block">Trek / Trip</span>
            {!showOtherTrip ? (
              <>
                <input
                  placeholder="Search a trek/trip..."
                  value={selectedTrip ? selectedTrip.name : tripQuery}
                  onChange={(e) => {
                    setSelectedTrip(null);
                    setTripQuery(e.target.value);
                  }}
                  className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
                />
                {!selectedTrip && tripQuery && (
                  <div className="border border-gray-150 rounded-2xl divide-y max-h-52 overflow-y-auto">
                    {filteredTrips.map((t) => (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => {
                          setSelectedTrip(t);
                          setTripQuery("");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50"
                      >
                        {t.name}
                      </button>
                    ))}
                    {filteredTrips.length === 0 && <div className="px-4 py-2.5 text-xs text-gray-400">No matches.</div>}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowOtherTrip(true)}
                  className="text-[11px] font-bold text-brand-forest hover:underline"
                >
                  Other / Custom Itinerary
                </button>
              </>
            ) : (
              <>
                <input
                  placeholder="Describe your custom itinerary"
                  value={customTripLabel}
                  onChange={(e) => setCustomTripLabel(e.target.value)}
                  className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowOtherTrip(false)}
                  className="text-[11px] font-bold text-gray-500 hover:underline"
                >
                  Choose from existing treks instead
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-600 block">Departure date (optional)</span>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-600 block">Number of trekkers</span>
              <input
                type="number"
                min={1}
                max={60}
                value={pax}
                onChange={(e) => setPax(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
                className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-600 block">What is this payment for?</span>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as CustomPaymentPurpose)}
              className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm bg-white"
            >
              {Object.entries(PURPOSE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-600 block">Amount (₹)</span>
            <input
              type="number"
              min={MIN_AMOUNT}
              placeholder={`Minimum ₹${MIN_AMOUNT}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 min-h-[44px] rounded-2xl border border-gray-200 text-sm"
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-600 block">Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl border border-gray-200 text-sm"
            />
          </div>

          {numericAmount >= MIN_AMOUNT && (
            <div className="bg-brand-warm-bg rounded-2xl p-4 space-y-2 text-xs border border-gray-150">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold">{formatInr(numericAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST (5%)</span>
                <span className="font-bold">{formatInr(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-gray-200">
                <span className="font-bold">Total to pay</span>
                <span className="font-extrabold text-brand-forest">{formatInr(totalAmount)}</span>
              </div>
            </div>
          )}

          {flowError && (
            <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-150 text-xs text-red-700 font-semibold">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{flowError}</span>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={!canSubmit || flowState === "creating" || flowState === "awaiting_payment"}
            className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white transition shadow-lg ${
              canSubmit && flowState !== "creating" && flowState !== "awaiting_payment"
                ? "bg-[#E84855] hover:bg-[#d63b48]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {flowState === "creating" ? "Preparing secure payment..." : flowState === "awaiting_payment" ? "Waiting for payment..." : `Pay ${totalAmount ? formatInr(totalAmount) : ""}`}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
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
