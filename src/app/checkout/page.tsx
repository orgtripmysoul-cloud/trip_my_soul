"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TREKS } from "@/data/db";
import {
  Calendar, Check, X, Shield, Plus, Info, ArrowLeft, ArrowRight,
  DollarSign, CheckCircle2, User, HelpCircle, Lock, ShieldCheck
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugParam = searchParams.get("slug") || searchParams.get("trek") || "valley-of-flowers-trek";
  const batchParam = searchParams.get("batch") || "06 Aug-11 Aug 2026";
  const priceParam = parseInt(searchParams.get("price") || "12450", 10);

  const trek = useMemo(() => {
    return TREKS.find((t) => t.slug === slugParam) || TREKS[0];
  }, [slugParam]);

  // Currency Converter state (INR vs USD)
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const conversionRate = 0.012; // 1 INR = 0.012 USD approx

  // Co-participants state
  const [coParticipantEmail, setCoParticipantEmail] = useState("");
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Srishti Rana",
      email: "srishtirana28@gmail.com",
      isPrimary: true,
      addOns: {
        insurance: true, // ₹240
        offload: false,   // ₹1,000
        transport: false  // ₹3,400
      }
    }
  ]);

  // Coupon / Voucher state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponAppliedMsg, setCouponAppliedMsg] = useState("");

  // T&C Acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Payment Processing Modal
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Price calculations
  const basePricePerPerson = trek.price || priceParam || 12450;
  
  const totalAddOns = useMemo(() => {
    return participants.reduce((total, p) => {
      let addOnSum = 0;
      if (p.addOns.insurance) addOnSum += 240;
      if (p.addOns.offload) addOnSum += 1000;
      if (p.addOns.transport) addOnSum += 3400;
      return total + addOnSum;
    }, 0);
  }, [participants]);

  const totalBasePrice = basePricePerPerson * participants.length;
  const rawSubtotal = totalBasePrice + totalAddOns;
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const taxableSubtotal = rawSubtotal - discountAmount;
  const gstAmount = Math.round(taxableSubtotal * 0.05); // 5% GST
  const grossTotalINR = taxableSubtotal + gstAmount;

  const displayPrice = (inrVal: number) => {
    if (currency === "USD") {
      const usdVal = Math.round(inrVal * conversionRate);
      return `$${usdVal.toLocaleString()}`;
    }
    return `₹${inrVal.toLocaleString()}`;
  };

  const handleAddCoParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coParticipantEmail.trim()) return;

    const newId = participants.length + 1;
    const emailStr = coParticipantEmail.trim();
    const derivedName = emailStr.split("@")[0].replace(/[._-]/g, " ");

    setParticipants([
      ...participants,
      {
        id: newId,
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email: emailStr,
        isPrimary: false,
        addOns: { insurance: true, offload: false, transport: false }
      }
    ]);
    setCoParticipantEmail("");
  };

  const handleRemoveParticipant = (id: number) => {
    setParticipants(participants.filter((p) => p.id !== id || p.isPrimary));
  };

  const toggleAddOn = (participantId: number, addOnKey: "insurance" | "offload" | "transport") => {
    setParticipants(
      participants.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            addOns: {
              ...p.addOns,
              [addOnKey]: !p.addOns[addOnKey]
            }
          };
        }
        return p;
      })
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "TRIPMYSOUL10") {
      setDiscountPercent(10);
      setCouponAppliedMsg("10% Special Discount Applied!");
    } else if (couponCode.trim().toUpperCase() === "HIMALAYA5") {
      setDiscountPercent(5);
      setCouponAppliedMsg("5% Special Trek Discount Applied!");
    } else {
      alert("Invalid Promo Code. Try 'TRIPMYSOUL10' for 10% Off!");
    }
  };

  const handlePayNow = () => {
    if (!acceptedTerms) {
      alert("Please accept the Terms and Conditions to proceed with booking.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] pt-24 pb-20 font-sans text-brand-dark-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-forest transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trek Details</span>
          </button>
          
          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Secure Checkout</span>
          </div>
        </div>

        {/* Top Header Card (Trek Name, Batch, Price Box) */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-brand-dark-text">
              {trek.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <Calendar className="w-4 h-4 text-brand-dusk-orange" />
              <span>{batchParam}</span>
              <span className="text-gray-300">•</span>
              <span>{trek.days} Days / {trek.nights} Nights</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center min-w-[200px] shadow-xs relative">
            <span className="text-2xl font-black text-brand-dark-text block">
              {displayPrice(basePricePerPerson)}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">
              per person
            </span>
            <button
              onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
              className="text-[10px] font-bold text-blue-600 hover:underline block mt-1 mx-auto"
            >
              Convert to {currency === "INR" ? "USD" : "INR"}
            </button>
          </div>
        </div>

        {/* Support Help Bar */}
        <div className="bg-sky-50 border border-sky-150 rounded-2xl p-3.5 text-center text-xs text-sky-800 font-medium">
          If you&apos;re having trouble booking simply,{" "}
          <a
            href="https://wa.me/918178613438?text=Hi%20TripMySoul,%20I'm%20having%20trouble%20booking%20my%20trek."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            Click Here to try again on WhatsApp
          </a>.
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Participant Details & Add-Ons */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Add Co-Participants Box */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-dusk-orange" />
                <h2 className="text-lg font-bold text-brand-dark-text">Add Participants</h2>
              </div>

              <form onSubmit={handleAddCoParticipant} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email id to add your co-participant"
                  value={coParticipantEmail}
                  onChange={(e) => setCoParticipantEmail(e.target.value)}
                  className="flex-grow p-3 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-brand-dusk"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#E84855] hover:bg-[#d63b48] text-white font-bold text-xs rounded-2xl transition shadow-sm shrink-0"
                >
                  Add Participant
                </button>
              </form>
            </div>

            {/* 2. Participant Cards & Add-Ons Checkboxes */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block pl-1">
                Participant Details ({participants.length} Person{participants.length > 1 ? "s" : ""})
              </span>

              {participants.map((p, idx) => (
                <div
                  key={p.id}
                  className="bg-white border-2 border-brand-forest/20 rounded-3xl p-6 shadow-sm space-y-4 relative"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E84855] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-brand-dark-text">{p.name}</h3>
                          {p.isPrimary && (
                            <span className="text-[9px] bg-brand-forest/10 text-brand-forest font-extrabold px-2 py-0.5 rounded-full uppercase">
                              Primary Booker
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 block">{p.email}</span>
                      </div>
                    </div>

                    {!p.isPrimary && (
                      <button
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Add-Ons Checkbox Table */}
                  <div className="space-y-3 pt-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E84855] block">
                      ADD-ONS
                    </span>

                    <div className="space-y-2 text-xs">
                      {/* Insurance */}
                      <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50/50 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={p.addOns.insurance}
                            onChange={() => toggleAddOn(p.id, "insurance")}
                            className="w-4 h-4 text-brand-dusk rounded focus:ring-0 cursor-pointer"
                          />
                          <span className="font-bold text-gray-700">Medical & Trek Insurance</span>
                          <span title="Covers high altitude emergency hospitalization">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                        </div>
                        <span className="font-bold text-gray-600">{displayPrice(240)}</span>
                      </label>

                      {/* Offload */}
                      <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50/50 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={p.addOns.offload}
                            onChange={() => toggleAddOn(p.id, "offload")}
                            className="w-4 h-4 text-brand-dusk rounded focus:ring-0 cursor-pointer"
                          />
                          <span className="font-bold text-gray-700">Backpack Offloading (to Mule/Porter)</span>
                          <span title="Porter carries your main 12kg backpack on trail">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                        </div>
                        <span className="font-bold text-gray-600">{displayPrice(1000)}</span>
                      </label>

                      {/* Transport */}
                      <label className="flex items-center justify-between p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50/50 cursor-pointer transition">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={p.addOns.transport}
                            onChange={() => toggleAddOn(p.id, "transport")}
                            className="w-4 h-4 text-brand-dusk rounded focus:ring-0 cursor-pointer"
                          />
                          <span className="font-bold text-gray-700">Shared Basecamp Transport (Pickup & Drop)</span>
                          <span title="Dehradun/Rishikesh to Base Camp roundtrip">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          </span>
                        </div>
                        <span className="font-bold text-gray-600">{displayPrice(3400)}</span>
                      </label>
                    </div>
                  </div>

                  {/* Vouchers & Discounts Input */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">
                      VOUCHERS & DISCOUNTS
                    </span>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Promo Coupon (e.g. TRIPMYSOUL10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-grow p-2.5 rounded-xl border border-gray-200 text-xs uppercase font-bold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponAppliedMsg && (
                      <span className="text-[11px] font-bold text-emerald-600 block pl-1">
                        ✓ {couponAppliedMsg}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Payment Summary Card */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 sticky top-28">
              <h2 className="text-xl font-bold font-serif text-brand-dark-text flex items-center gap-2">
                <span className="text-[#E84855] font-black">₹</span>
                <span>Payment Summary</span>
              </h2>

              <div className="space-y-3 text-xs text-gray-600 border-b border-gray-150 pb-4">
                <div className="flex justify-between">
                  <span>No. of participants</span>
                  <span className="font-bold text-gray-800">{participants.length} Person{participants.length > 1 ? "s" : ""}</span>
                </div>

                <div className="flex justify-between">
                  <span>Price × {displayPrice(basePricePerPerson)}</span>
                  <span className="font-bold text-gray-800">{displayPrice(totalBasePrice)}</span>
                </div>

                {totalAddOns > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Add-ons</span>
                    <span className="font-bold">+{displayPrice(totalAddOns)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-bold">-{displayPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-bold text-gray-800">{displayPrice(gstAmount)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Gross Total</span>
                  <span className="text-[10px] text-gray-400 block">Inclusive of GST & fees</span>
                </div>
                <span className="text-2xl font-black text-brand-dark-text">
                  {displayPrice(grossTotalINR)}
                </span>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 text-brand-dusk rounded focus:ring-0 mt-0.5 shrink-0"
                  />
                  <span>
                    I accept Term and Condition |{" "}
                    <a href="/policies/terms-and-conditions" target="_blank" className="text-blue-600 font-bold hover:underline">
                      READ T&C
                    </a>
                  </span>
                </label>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePayNow}
                disabled={!acceptedTerms}
                className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white transition shadow-lg ${
                  acceptedTerms
                    ? "bg-[#E84855] hover:bg-[#d63b48] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Pay Now ({displayPrice(grossTotalINR)})
              </button>

              <div className="text-[10px] text-gray-400 text-center space-y-1">
                <p>➔ Current Page Instructions</p>
                <p>➔ After clicking &quot;Pay Now&quot;: Outcome?</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Processing Payment Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-[#E84855] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark-text">Processing Payment...</h3>
            <p className="text-xs text-gray-500">Connecting to secure banking gateway. Please do not refresh.</p>
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-brand-dark-text font-serif">Booking Confirmed!</h3>
              <p className="text-xs text-gray-500">
                Your expedition registration for <strong>{trek.name}</strong> ({batchParam}) for {participants.length} participant(s) is successful.
              </p>
            </div>

            <div className="bg-brand-warm-bg p-4 rounded-2xl border border-gray-150 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid:</span>
                <span className="font-extrabold text-emerald-700">{displayPrice(grossTotalINR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="font-mono font-bold text-gray-700">TMS-2026-99481</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 rounded-full bg-[#0B2545] hover:bg-brand-dusk-orange text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              Go to My Bookings Dashboard →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-40 text-center font-bold text-gray-500">Loading Checkout Portal...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
