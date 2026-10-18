"use client";

import React, { useState } from "react";
import { PhoneCall, X } from "lucide-react";
import { submitLead } from "@/lib/client/leadsApi";

/** Desktop-only "request a call back" card. Mobile gets the global WhatsApp button instead. */
export default function TrekCallbackBar({ trekSlug, trekName }: { trekSlug?: string; trekName?: string } = {}) {
  const [showCallbackBar, setShowCallbackBar] = useState(true);
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!showCallbackBar) return null;

  return (
    <div className="hidden lg:flex fixed bottom-4 right-4 z-40 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 text-white rounded-2xl p-3.5 shadow-2xl items-center gap-3 max-w-sm animate-fade-in font-sans">
      <div className="w-8 h-8 rounded-full bg-brand-dusk-orange/10 border border-brand-dusk-orange/20 text-brand-dusk-orange flex items-center justify-center shrink-0">
        <PhoneCall className="w-4 h-4" />
      </div>

      {callbackSuccess ? (
        <span className="text-[10px] font-bold text-green-400">
          Request received! Our trip expert will call you shortly.
        </span>
      ) : (
        <div className="space-y-1.5 flex-grow pr-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-dusk-orange block leading-none">
            Request a Call Back
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="tel"
              inputMode="tel"
              placeholder="Your mobile number"
              value={callbackPhone}
              onChange={(e) => setCallbackPhone(e.target.value)}
              className="bg-white/5 border border-white/10 text-base lg:text-xs px-3 py-2 min-h-[44px] rounded-lg focus:outline-none flex-1 min-w-0 text-white"
            />
            <button
              onClick={async () => {
                if (!callbackPhone.trim() || submitting) return;
                setSubmitting(true);
                setCallbackError(null);
                try {
                  await submitLead({
                    formType: "callback",
                    name: "Website visitor",
                    phone: callbackPhone.trim(),
                    trekSlug,
                    trekName,
                    consentMarketing: true,
                  });
                  setCallbackSuccess(true);
                  setTimeout(() => {
                    setCallbackSuccess(false);
                    setCallbackPhone("");
                    setShowCallbackBar(false);
                  }, 2500);
                } catch (err) {
                  // Previously failures were swallowed and the card just reset,
                  // so a mistyped number looked like a successful request.
                  setCallbackError(err instanceof Error ? err.message : "Could not send. Please try again.");
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
              className="bg-brand-dusk-orange hover:bg-brand-dusk-orange/90 text-white text-xs min-h-[44px] inline-flex items-center justify-center font-bold px-4 py-2 rounded-lg transition shrink-0 disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Call Me"}
            </button>
          </div>
          {callbackError && <p className="text-[10px] font-bold text-red-400">{callbackError}</p>}
        </div>
      )}

      <button
        onClick={() => setShowCallbackBar(false)}
        className="absolute top-1 right-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-white transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
