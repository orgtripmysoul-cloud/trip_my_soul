"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/client/leadsApi";
import type { LeadFormType } from "@/lib/types/crm";

export interface LeadFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Half-width on desktop. */
  half?: boolean;
}

interface LeadFormProps {
  formType: LeadFormType;
  /** Extra fields beyond name/phone/email, stored in the lead's `details`. */
  fields?: LeadFormField[];
  trekSlug?: string;
  trekName?: string;
  submitLabel?: string;
  successMessage?: string;
  /** Dark surfaces (hero overlays, the navy callback card) invert the labels. */
  tone?: "light" | "dark";
  compact?: boolean;
}

const BASE_FIELDS: LeadFormField[] = [
  { name: "name", label: "Full name", required: true, half: true },
  { name: "phone", label: "Mobile number", type: "tel", required: true, half: true },
  { name: "email", label: "Email", type: "email" },
];

/**
 * The one form component behind every enquiry on the site. Each instance
 * declares its `formType`; everything common — UTM capture, the honeypot,
 * DPDP consent, validation and the success state — lives here so a new form
 * is a field list rather than a new integration.
 */
export default function LeadForm({
  formType,
  fields = [],
  trekSlug,
  trekName,
  submitLabel = "Send Enquiry",
  successMessage = "Thank you! Our trip expert will call you shortly.",
  tone = "light",
  compact = false,
}: LeadFormProps) {
  const allFields = [...BASE_FIELDS, ...fields];

  const [values, setValues] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { name, phone, email, message, travelDate, travelMonth, paxAdults, paxChildren, ...rest } = values;

      await submitLead({
        formType,
        name: name ?? "",
        phone: phone ?? "",
        email: email || undefined,
        trekSlug,
        trekName,
        travelDate: travelDate || undefined,
        travelMonth: travelMonth || undefined,
        paxAdults: paxAdults ? Number(paxAdults) : undefined,
        paxChildren: paxChildren ? Number(paxChildren) : undefined,
        message: message || undefined,
        details: rest,
        consentMarketing: consent,
        website: honeypot,
      });

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl ${
          tone === "dark" ? "bg-white/10 text-white" : "bg-emerald-50 border border-emerald-200 text-emerald-800"
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-sm font-bold">{successMessage}</p>
      </div>
    );
  }

  const labelClass = tone === "dark" ? "text-white/70" : "text-gray-500";
  const inputClass =
    tone === "dark"
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
      : "bg-white border-gray-200 text-brand-dark-text";

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-2.5" : "space-y-4"}>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allFields.map((field) => {
          const id = `${formType}-${field.name}`;
          const wrapperClass = field.half ? "sm:col-span-1" : "sm:col-span-2";

          return (
            <div key={field.name} className={wrapperClass}>
              <label htmlFor={id} className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${labelClass}`}>
                {field.label}
                {field.required && <span className="text-brand-dusk-orange"> *</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={3}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm transition focus:border-brand-forest-light focus:outline-none ${inputClass}`}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  required={field.required}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm transition focus:border-brand-forest-light focus:outline-none ${inputClass}`}
                >
                  <option value="">Select…</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={field.type ?? "text"}
                  inputMode={field.type === "tel" ? "tel" : undefined}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => set(field.name, e.target.value)}
                  // 16px on mobile stops iOS Safari zooming the viewport on focus.
                  className={`w-full p-3 min-h-[44px] rounded-xl border text-base sm:text-sm transition focus:border-brand-forest-light focus:outline-none ${inputClass}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <label className={`flex items-start gap-2 text-[11px] cursor-pointer ${tone === "dark" ? "text-white/60" : "text-gray-500"}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-brand-dusk-orange"
        />
        <span>I agree to receive trip details and updates on WhatsApp, SMS and email.</span>
      </label>

      {error && <p className="text-xs font-bold text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-dusk-orange hover:bg-brand-dusk text-white font-bold text-sm min-h-[48px] rounded-xl transition disabled:opacity-60"
      >
        {submitting ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
