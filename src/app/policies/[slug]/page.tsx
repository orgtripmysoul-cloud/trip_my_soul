"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Compass, ShieldCheck, Scale, CreditCard, AlertCircle } from "lucide-react";

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const policyData = useMemo(() => {
    switch (slug) {
      case "payment-policy":
        return {
          title: "Payment & Booking Policy",
          icon: CreditCard,
          subtitle: "Terms regarding reservation amounts, balances, and payment gateways.",
          content: (
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
              <p>
                To secure a booking slot for any Himalayan trek or yatra, travelers must adhere to the following deposit schedules:
              </p>
              
              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">1. Reservation Deposit</span>
                <p>
                  A non-refundable deposit representing <strong>30% of the total tour fee</strong> is required at the time of reserving slots. This enables forest department permits, guide allocations, and homestay bookings.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">2. Balance Payments</span>
                <p>
                  The remaining <strong>70% balance</strong> must be cleared at least <strong>15 days prior</strong> to the trek start date. Failure to process the balance within this timeframe may result in automatic slot cancellation without refunds.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">3. Transaction Modes</span>
                <p>
                  We accept online payments via Credit/Debit Cards, Net Banking, and UPI gateways (Razorpay). Cash payments are not accepted at basecamp locations for safety and accounting compliance.
                </p>
              </div>
            </div>
          ),
        };
      case "cancellation-policy":
        return {
          title: "Cancellation & Voucher Policy",
          icon: AlertCircle,
          subtitle: "Rules regarding slot changes, cancellations, and trail cancellations.",
          content: (
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
              <p>
                We understand that travel plans change due to personal reasons, transport issues, or weather. Our cancellation terms are structured as follows:
              </p>
              
              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">1. Early Cancellations (30+ Days)</span>
                <p>
                  Cancellations requested 30 days or more prior to the trek start date are eligible for a <strong>90% refund</strong> or a <strong>100% trek voucher</strong> valid for 1 year.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">2. Mid-Term Cancellations (15 to 30 Days)</span>
                <p>
                  Cancellations requested between 15 to 30 days prior to the start date are eligible for a <strong>50% refund</strong> or a <strong>100% trek voucher</strong> valid for 1 year.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">3. Late Cancellations (Under 15 Days)</span>
                <p>
                  Cancellations requested less than 15 days before the trek start date are <strong>not eligible for refunds or vouchers</strong>. Slots, permits, and food rations are locked in with local vendors by this time.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">4. Weather road blocks</span>
                <p>
                  If a trek is canceled by TripMySoul due to extreme weather, landslides, or state-ordered closures, we will provide a <strong>100% trek voucher</strong> for alternative dates.
                </p>
              </div>
            </div>
          ),
        };
      case "terms-conditions":
        return {
          title: "Terms & Conditions",
          icon: Scale,
          subtitle: "Rules of conduct, medical declarations, and trip disruptions.",
          content: (
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
              <p>
                By booking a trek with TripMySoul, you agree to comply with our environmental, health, and conduct regulations:
              </p>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">1. Medical Fitness Clearance</span>
                <p>
                  All trekkers must upload a signed Medical Self-Declaration form 7 days before departure. Trip leaders reserve the right to exclude any traveler showing signs of extreme AMS or physical fatigue during the initial basecamp briefing.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">2. Eco-Sustainability Pledge</span>
                <p>
                  Our trails are pristine ecosystems. Trekkers are strictly prohibited from dumping plastic wrap, cans, or sanitary items on the trails. You must pack back all personal non-biodegradable waste to the basecamp.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">3. Extreme Weather Liabilities</span>
                <p>
                  Himalayan weather is unpredictable. If trail rerouting is required, or additional overnight lodging is incurred due to snow blocks or landslides, any additional costs must be borne by the traveler.
                </p>
              </div>
            </div>
          ),
        };
      case "privacy-policy":
        return {
          title: "Privacy & Data Protection",
          icon: ShieldCheck,
          subtitle: "How we secure your personal, payment, and health data.",
          content: (
            <div className="space-y-6 text-sm text-gray-600 leading-relaxed font-sans">
              <p>
                Your privacy is paramount. We handle your documents and data with strict compliance protocols:
              </p>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">1. Personal Information Collection</span>
                <p>
                  We collect your legal name, contact information, emergency numbers, and health stats. This data is used solely for obtaining forest department climbing permits and issuing group medical insurance.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">2. Third-Party Sharing</span>
                <p>
                  We do not sell or lease your personal data. We only share details with insurance providers, park authorities, and emergency medical teams as required by law.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-brand-dark-text block">3. Payment Security</span>
                <p>
                  All financial transactions are handled on secure SSL-encrypted servers by our payment partner, Razorpay. We do not store credit card details or bank passwords on our servers.
                </p>
              </div>
            </div>
          ),
        };
      default:
        return null;
    }
  }, [slug]);

  if (!policyData) {
    return (
      <div className="max-w-md mx-auto py-40 px-4 text-center space-y-4">
        <Compass className="w-12 h-12 text-brand-dusk mx-auto animate-spin-slow" />
        <h1 className="text-2xl font-bold text-brand-dark-text">Policy Page Not Found</h1>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold text-xs transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const IconComponent = policyData.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-24 sm:pt-16 sm:pb-32 space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-xs font-bold text-brand-forest hover:text-brand-dusk transition bg-brand-forest/5 hover:bg-brand-forest/10 px-3.5 py-2 rounded-full"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        <span>Back</span>
      </button>

      {/* Header card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-forest/5 flex items-center justify-center text-brand-forest shrink-0">
          <IconComponent className="w-6 h-6 text-brand-dusk-orange" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-brand-dark-text font-serif leading-tight">
            {policyData.title}
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            {policyData.subtitle}
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xs">
        {policyData.content}
      </div>
    </div>
  );
}
