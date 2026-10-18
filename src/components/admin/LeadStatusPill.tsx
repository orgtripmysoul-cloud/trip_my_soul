"use client";

import React from "react";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types/crm";

/**
 * Pipeline colour language, shared by the table, the board and the detail
 * header so a status always reads the same way:
 * neutral = untouched, blue = in progress, green = won, red = lost.
 */
const STATUS_CLASSES: Record<LeadStatus, string> = {
  new: "bg-brand-dusk-orange/10 text-brand-dusk border-brand-dusk-orange/30",
  contacted: "bg-brand-forest-light/10 text-brand-forest-light border-brand-forest-light/30",
  quote_sent: "bg-blue-50 text-blue-700 border-blue-200",
  negotiation: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  on_hold: "bg-slate-100 text-slate-600 border-slate-200",
  lost: "bg-red-50 text-red-700 border-red-200",
  junk: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function LeadStatusPill({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-extrabold uppercase tracking-wide ${STATUS_CLASSES[status]}`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

export { STATUS_CLASSES };
