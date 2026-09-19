"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { ALL_TRIPS, tripToTrek } from "@/data/trips";
import { TREK_ADD_ONS, type TrekAddOnKey } from "@/data/addOns";
import {
  Calendar, Info, ArrowLeft,
  CheckCircle2, XCircle, User, HelpCircle, Lock, ShieldCheck, Phone, Mail, AlertTriangle, Clock
} from "lucide-react";
import SeatHoldCountdown from "@/components/checkout/SeatHoldCountdown";
import {
  ApiError,
  ERROR_MESSAGES,
  confirmVerificationOtp,
  createBooking,
  createPaymentIntent,
  loadRazorpayScript,
  lookupBooking,
  newIdempotencyKey,
  sendVerificationOtp,
  verifyPayment,
} from "@/lib/client/checkoutApi";
import type { BookingLookupResponse, CreateBookingRequest, CreateBookingResponse } from "@/lib/types/booking";

type FlowState =
  | "form"
  | "creating_booking"
  | "awaiting_payment"
  | "processing"
  | "waiting_confirmation"
  | "success"
  | "failure"
  | "expired";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugParam = searchParams.get("slug") || searchParams.get("trek") || "valley-of-flowers-trek";
  const batchParam = searchParams.get("batch") || "06 Aug-11 Aug 2026";
  const rawPriceParam = searchParams.get("price");
  const priceParam = rawPriceParam ? parseInt(rawPriceParam, 10) : null;

  // Trips book through here too, so resolve the slug against every catalogue.
  // Falling back to an unrelated package would show the wrong name and fare.
  const trek = useMemo(() => {
    const fromCatalogue = [...TREKS, ...YATRAS, ...WILDLIFE].find((t) => t.slug === slugParam);
    if (fromCatalogue) return fromCatalogue;
    const fromTrips = ALL_TRIPS.find((t) => t.slug === slugParam);
    return fromTrips ? tripToTrek(fromTrips) : null;
  }, [slugParam]);

  // Currency Converter state (INR vs USD)
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const conversionRate = 0.012; // 1 INR = 0.012 USD approx

  // Primary booker details — collected here, sent to the server as the
  // authoritative customer record. Phone is required for the booking API.
  const [primaryName, setPrimaryName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");

  // Email OTP verification — required before a booking can be submitted.
  // `verifiedEmail`/`verificationToken` only count as valid for the exact
  // email they were issued for, so editing the email after verifying
  // requires re-verifying (see `isEmailVerified` below).
  type OtpStatus = "idle" | "sending" | "sent" | "verifying" | "error";
  const [otpStatus, setOtpStatus] = useState<OtpStatus>("idle");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const normalizedPrimaryEmail = primaryEmail.trim().toLowerCase();
  const isEmailVerified = verificationToken !== null && verifiedEmail === normalizedPrimaryEmail;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedPrimaryEmail)) {
      setOtpError("Enter a valid email address first.");
      return;
    }
    setOtpError(null);
    setOtpStatus("sending");
    try {
      await sendVerificationOtp(normalizedPrimaryEmail);
      setOtpStatus("sent");
      setResendCooldown(60);
    } catch (err) {
      setOtpStatus("error");
      setOtpError(err instanceof ApiError ? err.message : "Could not send code. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    setOtpError(null);
    setOtpStatus("verifying");
    try {
      const result = await confirmVerificationOtp(normalizedPrimaryEmail, otpCode.trim());
      if (result.verified && result.token) {
        setVerificationToken(result.token);
        setVerifiedEmail(normalizedPrimaryEmail);
        setOtpCode("");
      } else {
        setOtpStatus("sent");
        setOtpError(result.message ?? "Incorrect code.");
      }
    } catch (err) {
      setOtpStatus("sent");
      setOtpError(err instanceof ApiError ? err.message : "Could not verify code. Please try again.");
    }
  };

  // Co-participants state
  const [coParticipantEmail, setCoParticipantEmail] = useState("");
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "",
      email: "",
      isPrimary: true,
      addOns: {
        insurance: true,
        offload: false
      } as Record<TrekAddOnKey, boolean>
    }
  ]);

  // Coupon / Voucher state
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponAppliedMsg, setCouponAppliedMsg] = useState("");

  // T&C Acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Real payment/booking flow state (server is authoritative for all of it).
  const [flowState, setFlowState] = useState<FlowState>("form");
  const [flowError, setFlowError] = useState<string | null>(null);
  const [booking, setBooking] = useState<CreateBookingResponse | null>(null);
  const [lookupResult, setLookupResult] = useState<BookingLookupResponse | null>(null);
  const bookingIdempotencyKey = useRef<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Price calculations
  const basePricePerPerson = priceParam ?? trek?.price ?? 0;
  
  const totalAddOns = useMemo(() => {
    return participants.reduce((total, p) => {
      const addOnSum = TREK_ADD_ONS.reduce(
        (sum, addOn) => (p.addOns[addOn.key] ? sum + addOn.price : sum),
        0
      );
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
        addOns: { insurance: true, offload: false }
      }
    ]);
    setCoParticipantEmail("");
  };

  const handleRemoveParticipant = (id: number) => {
    setParticipants(participants.filter((p) => p.id !== id || p.isPrimary));
  };

  const toggleAddOn = (participantId: number, addOnKey: TrekAddOnKey) => {
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
    const code = couponCode.trim().toUpperCase();
    if (code === "TRIPMYSOUL10") {
      setDiscountPercent(10);
      setAppliedCouponCode(code);
      setCouponAppliedMsg("10% Special Discount Applied!");
    } else if (code === "HIMALAYA5") {
      setDiscountPercent(5);
      setAppliedCouponCode(code);
      setCouponAppliedMsg("5% Special Trek Discount Applied!");
    } else {
      alert("Invalid Promo Code. Try 'TRIPMYSOUL10' for 10% Off!");
    }
  };

  const clearPollTimer = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const pollBookingStatus = useCallback(async (bookingNo: string, email: string) => {
    const MAX_POLL_MS = 60_000;
    const startedAt = Date.now();

    while (Date.now() - startedAt < MAX_POLL_MS) {
      try {
        const result = await lookupBooking(bookingNo, email);
        setLookupResult(result);
        if (result.status === "confirmed" || result.status === "partially_paid") {
          setFlowState("success");
          return;
        }
      } catch {
        // transient lookup failure — keep polling until the timeout
      }
      await new Promise<void>((resolve) => {
        pollTimer.current = setTimeout(resolve, 2500);
      });
    }

    setFlowState("waiting_confirmation");
  }, []);

  const openRazorpayCheckout = useCallback(
    async (order: { razorpayKeyId: string; razorpayOrderId: string; totalAmount: number; currency: string; bookingNo: string }) => {
      try {
        await loadRazorpayScript();
      } catch {
        setFlowState("failure");
        setFlowError(ERROR_MESSAGES.GATEWAY_UNAVAILABLE);
        return;
      }

      if (!window.Razorpay) {
        setFlowState("failure");
        setFlowError(ERROR_MESSAGES.GATEWAY_UNAVAILABLE);
        return;
      }

      setFlowState("awaiting_payment");
      const rzp = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: Math.round(order.totalAmount * 100),
        currency: order.currency,
        name: "TripMySoul",
        description: `${trek?.name ?? "TripMySoul Booking"} — ${batchParam}`,
        order_id: order.razorpayOrderId,
        prefill: { name: primaryName, email: primaryEmail, contact: primaryPhone },
        theme: { color: "#0B2545" },
        handler: (response) => {
          // Advisory only — the booking is confirmed by the server webhook,
          // never by this callback. See PAYMENT_FLOW notes in the API routes.
          verifyPayment(response).catch(() => {});
          setFlowState("processing");
          void pollBookingStatus(order.bookingNo, primaryEmail);
        },
        modal: {
          ondismiss: () => {
            setFlowState("form");
          },
        },
      });
      rzp.on("payment.failed", (resp) => {
        setFlowState("failure");
        setFlowError(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    },
    [primaryName, primaryEmail, primaryPhone, trek?.name, batchParam, pollBookingStatus]
  );

  const handleHoldExpired = useCallback(() => {
    clearPollTimer();
    setFlowState("expired");
  }, [clearPollTimer]);

  const handlePayNow = async () => {
    if (!trek) return;
    if (!acceptedTerms) {
      alert("Please accept the Terms and Conditions to proceed with booking.");
      return;
    }
    if (!primaryName.trim() || !primaryEmail.trim() || !primaryPhone.trim()) {
      setFlowError("Please fill in your name, email and phone number.");
      setFlowState("failure");
      return;
    }
    if (!isEmailVerified || !verificationToken) {
      setFlowError("Please verify your email before booking.");
      setFlowState("failure");
      return;
    }

    setFlowError(null);

    // Seat hold from an earlier attempt is still live (e.g. the Razorpay
    // modal was dismissed) — reuse the same booking rather than creating a
    // second one.
    if (booking && flowState !== "expired") {
      setFlowState("creating_booking");
      try {
        const intent = await createPaymentIntent(booking.bookingNo, newIdempotencyKey());
        setBooking((prev) => (prev ? { ...prev, ...intent } : prev));
        await openRazorpayCheckout(intent);
      } catch (err) {
        if (err instanceof ApiError && err.code === "HOLD_EXPIRED") {
          setFlowState("expired");
        } else {
          setFlowState("failure");
          setFlowError(err instanceof ApiError ? ERROR_MESSAGES[err.code] ?? err.message : "Something went wrong.");
        }
      }
      return;
    }

    setFlowState("creating_booking");
    if (!bookingIdempotencyKey.current) {
      bookingIdempotencyKey.current = newIdempotencyKey();
    }

    const requestBody: CreateBookingRequest = {
      trekSlug: trek.slug,
      batchLabel: batchParam,
      pax: participants.length,
      customer: { name: primaryName.trim(), email: primaryEmail.trim().toLowerCase(), phone: primaryPhone.trim() },
      travellers: participants.map((p) => ({
        fullName: p.isPrimary ? primaryName.trim() : p.name,
        email: p.isPrimary ? primaryEmail.trim().toLowerCase() : p.email,
        isPrimary: p.isPrimary,
        addOns: (Object.keys(p.addOns) as TrekAddOnKey[]).filter((key) => p.addOns[key]),
      })),
      couponCode: appliedCouponCode || undefined,
      verificationToken,
    };

    try {
      const created = await createBooking(requestBody, bookingIdempotencyKey.current);
      setBooking(created);
      await openRazorpayCheckout(created);
    } catch (err) {
      bookingIdempotencyKey.current = null;
      setFlowState("failure");
      setFlowError(err instanceof ApiError ? ERROR_MESSAGES[err.code] ?? err.message : "Something went wrong.");
    }
  };

  const handleRetryAfterExpiry = () => {
    clearPollTimer();
    bookingIdempotencyKey.current = null;
    setBooking(null);
    setLookupResult(null);
    setFlowState("form");
  };

  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
        <Info className="w-12 h-12 text-brand-dusk-orange mx-auto" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Package not found</h1>
        <p className="text-xs text-gray-500">
          We could not find a package matching this link. Browse the catalogue and try again.
        </p>
        <Link href="/treks" className="text-xs font-bold text-brand-forest hover:underline">
          Browse all treks
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] pt-24 pb-20 font-sans text-brand-dark-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-gray-500 hover:text-brand-forest transition"
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
              className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center justify-center min-h-[44px] mt-1 mx-auto"
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
            className="font-bold text-blue-700 hover:underline inline-flex items-center min-h-[44px] gap-1"
          >
            Click Here to try again on WhatsApp
          </a>.
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

          {/* Left Column: Participant Details & Add-Ons */}
          <div className="lg:col-span-2 space-y-6 order-last lg:order-first">

            {/* 0. Primary Booker Details */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-dusk-orange" />
                <h2 className="text-lg font-bold text-brand-dark-text">Your Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full name"
                  value={primaryName}
                  onChange={(e) => setPrimaryName(e.target.value)}
                  className="p-3 min-h-[44px] rounded-2xl border border-gray-200 text-base lg:text-xs focus:outline-none focus:border-brand-dusk sm:col-span-2"
                  aria-label="Your full name"
                />
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    className="p-3 pl-9 min-h-[44px] rounded-2xl border border-gray-200 text-base lg:text-xs w-full focus:outline-none focus:border-brand-dusk"
                    aria-label="Your email address"
                  />
                </div>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    className="p-3 pl-9 min-h-[44px] rounded-2xl border border-gray-200 text-base lg:text-xs w-full focus:outline-none focus:border-brand-dusk"
                    aria-label="Your phone number"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                Your booking confirmation and payment receipt are sent to this email.
              </p>

              {/* Email OTP verification — gates the Pay Now button below */}
              <div className="pt-1">
                {isEmailVerified ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Email verified</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {otpStatus === "idle" || otpStatus === "sending" || otpStatus === "error" ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpStatus === "sending" || !normalizedPrimaryEmail}
                        className="px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-2xl border border-brand-forest/30 text-brand-forest font-bold text-xs hover:bg-brand-forest/5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {otpStatus === "sending" ? "Sending code..." : "Verify email to continue"}
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="p-3 min-h-[44px] rounded-2xl border border-gray-200 text-base lg:text-xs w-full sm:w-40 tracking-widest text-center focus:outline-none focus:border-brand-dusk"
                          aria-label="Verification code"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpStatus === "verifying" || otpCode.length !== 6}
                          className="px-5 py-3 min-h-[44px] inline-flex items-center justify-center bg-brand-forest hover:bg-brand-forest/90 text-white font-bold text-xs rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                          {otpStatus === "verifying" ? "Verifying..." : "Verify Code"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={resendCooldown > 0}
                          className="px-3 py-2.5 min-h-[44px] text-[11px] font-bold text-gray-500 hover:text-brand-forest disabled:opacity-50 disabled:cursor-not-allowed shrink-0 whitespace-nowrap"
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                        </button>
                      </div>
                    )}
                    {otpStatus === "sent" && !otpError && (
                      <p className="text-[10px] text-gray-400">Code sent to {normalizedPrimaryEmail}. It expires in 10 minutes.</p>
                    )}
                    {otpError && (
                      <p role="alert" className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                        <XCircle className="w-3 h-3 shrink-0" />
                        {otpError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 1. Add Co-Participants Box */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-dusk-orange" />
                <h2 className="text-lg font-bold text-brand-dark-text">Add Participants</h2>
              </div>

              <form onSubmit={handleAddCoParticipant} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter email id to add your co-participant"
                  value={coParticipantEmail}
                  onChange={(e) => setCoParticipantEmail(e.target.value)}
                  className="flex-grow p-3 min-h-[44px] rounded-2xl border border-gray-200 text-base lg:text-xs focus:outline-none focus:border-brand-dusk"
                />
                <button
                  type="submit"
                  className="px-6 py-3 min-h-[44px] inline-flex items-center justify-center bg-[#E84855] hover:bg-[#d63b48] text-white font-bold text-xs rounded-2xl transition shadow-sm shrink-0"
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

              {participants.map((p) => (
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
                          <h3 className="font-extrabold text-sm text-brand-dark-text">
                            {p.isPrimary ? primaryName || "You" : p.name}
                          </h3>
                          {p.isPrimary && (
                            <span className="text-[9px] bg-brand-forest/10 text-brand-forest font-extrabold px-2 py-0.5 rounded-full uppercase">
                              Primary Booker
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 block">
                          {p.isPrimary ? primaryEmail || "Add your email above" : p.email}
                        </span>
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
                      {TREK_ADD_ONS.map((addOn) => (
                        <label
                          key={addOn.key}
                          className="flex items-center justify-between gap-2 min-h-[44px] p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50/50 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={p.addOns[addOn.key]}
                              onChange={() => toggleAddOn(p.id, addOn.key)}
                              className="w-5 h-5 shrink-0 text-brand-dusk rounded focus:ring-0 cursor-pointer"
                            />
                            <span className="font-bold text-gray-700">{addOn.label}</span>
                            <span title={addOn.description}>
                              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                            </span>
                          </div>
                          <span className="font-bold text-gray-600">{displayPrice(addOn.price)}</span>
                        </label>
                      ))}
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
                        className="flex-grow p-2.5 min-h-[44px] rounded-xl border border-gray-200 text-base lg:text-xs uppercase font-bold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
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

          {/* Right Column: Payment Summary Card — shown first on mobile */}
          <div className="space-y-6 order-first lg:order-last">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 lg:sticky lg:top-28">
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
                <label className="flex items-start gap-2.5 min-h-[44px] py-2 cursor-pointer text-xs text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 shrink-0 text-brand-dusk rounded focus:ring-0 mt-0.5 shrink-0"
                  />
                  <span>
                    I accept Term and Condition |{" "}
                    <a href="/policies/terms-and-conditions" target="_blank" className="text-blue-600 font-bold hover:underline inline-flex items-center min-h-[44px]">
                      READ T&C
                    </a>
                  </span>
                </label>
              </div>

              {/* Seat hold countdown, once a booking + hold exist */}
              {booking && (flowState === "form" || flowState === "awaiting_payment") && (
                <SeatHoldCountdown expiresAt={booking.holdExpiresAt} onExpire={handleHoldExpired} />
              )}

              {flowState === "expired" && (
                <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-150 text-xs text-red-700 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Your seat reservation expired. Please check availability again to continue.</span>
                </div>
              )}

              {flowError && (flowState === "failure" || flowState === "form") && (
                <div role="alert" aria-live="assertive" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-150 text-xs text-red-700 font-semibold">
                  <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{flowError}</span>
                </div>
              )}

              {/* Pay Now Button */}
              {flowState === "expired" ? (
                <button
                  onClick={handleRetryAfterExpiry}
                  className="w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white transition shadow-lg bg-[#0B2545] hover:bg-brand-dusk-orange"
                >
                  Check Availability Again
                </button>
              ) : (
                <button
                  onClick={handlePayNow}
                  disabled={
                    !acceptedTerms || !isEmailVerified || flowState === "creating_booking" || flowState === "awaiting_payment" || flowState === "processing"
                  }
                  aria-live="polite"
                  className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white transition shadow-lg ${
                    acceptedTerms && isEmailVerified && flowState !== "creating_booking" && flowState !== "awaiting_payment" && flowState !== "processing"
                      ? "bg-[#E84855] hover:bg-[#d63b48] cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {flowState === "creating_booking"
                    ? "Preparing secure payment..."
                    : flowState === "awaiting_payment"
                    ? "Waiting for payment..."
                    : flowState === "processing"
                    ? "Confirming your booking..."
                    : booking
                    ? `Retry Payment (${displayPrice(grossTotalINR)})`
                    : `Pay Now (${displayPrice(grossTotalINR)})`}
                </button>
              )}

              {!isEmailVerified && flowState === "form" && (
                <p className="text-center text-[11px] font-semibold text-gray-400">
                  Verify your email above to enable payment.
                </p>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Payments are processed securely by Razorpay. We never see your card details.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Processing / Confirming Overlay */}
      {(flowState === "creating_booking" || flowState === "processing") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" role="status" aria-live="polite">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-[#E84855] border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark-text">
              {flowState === "creating_booking" ? "Preparing secure payment..." : "Confirming your booking..."}
            </h3>
            <p className="text-xs text-gray-500">
              {flowState === "creating_booking"
                ? "Reserving your seats and connecting to the secure payment gateway."
                : "Your payment was received. We are confirming your booking — please don't close this tab."}
            </p>
          </div>
        </div>
      )}

      {/* Still waiting on the webhook past the poll window */}
      {flowState === "waiting_confirmation" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" role="status" aria-live="polite">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark-text font-serif">Confirming your booking</h3>
            <p className="text-xs text-gray-500">
              Your payment was received. We are still confirming your booking — this can take a minute. Booking
              reference: <strong className="font-mono">{booking?.bookingNo}</strong>.
            </p>
            <button
              onClick={() => booking && pollBookingStatus(booking.bookingNo, primaryEmail)}
              className="w-full py-3 rounded-full border border-gray-200 text-brand-dark-text font-bold text-xs hover:bg-gray-50 transition"
            >
              Refresh Status
            </button>
          </div>
        </div>
      )}

      {/* Payment Failed */}
      {flowState === "failure" && flowError && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" role="alertdialog" aria-live="assertive">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md">
              <XCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark-text font-serif">Payment Failed</h3>
            <p className="text-xs text-gray-500">{flowError}</p>
            <button
              onClick={() => setFlowState("form")}
              className="w-full py-3.5 rounded-full bg-[#E84855] hover:bg-[#d63b48] text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Payment Success Modal — only shown once the server (webhook-confirmed) status says so */}
      {flowState === "success" && booking && lookupResult && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" role="status" aria-live="polite">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-brand-dark-text font-serif">Booking Confirmed!</h3>
              <p className="text-xs text-gray-500">
                Your expedition registration for <strong>{lookupResult.trekName || trek.name}</strong> ({lookupResult.batchLabel || batchParam}) for {lookupResult.pax} participant(s) is successful.
              </p>
            </div>

            <div className="bg-brand-warm-bg p-4 rounded-2xl border border-gray-150 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Paid:</span>
                <span className="font-extrabold text-emerald-700">{displayPrice(lookupResult.paidAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Booking Reference:</span>
                <span className="font-mono font-bold text-gray-700">{lookupResult.bookingNo}</span>
              </div>
              {lookupResult.latestPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="font-mono font-bold text-gray-700">{lookupResult.latestPaymentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Confirmation Email:</span>
                <span className="font-bold text-gray-700">Sent to {primaryEmail}</span>
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
