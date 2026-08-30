"use client";

import React from "react";
import { Download, Phone, ShieldCheck } from "lucide-react";

const LINKS = [
  { icon: Download, label: "Download PDF Brochure" },
  { icon: ShieldCheck, label: "Obtain Group Travel Insurance" },
];

interface TrekImportantLinksProps {
  /** Enquiry numbers printed on this listing, most specific first. */
  contactNumbers: string[];
}

export default function TrekImportantLinks({ contactNumbers }: TrekImportantLinksProps) {
  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Important Documents & Links</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {LINKS.map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center justify-between p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-brand-forest font-bold hover:bg-gray-100 transition shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-brand-dusk-orange shrink-0" />
              <span>{label}</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        ))}

        {contactNumbers.map((number) => (
          <a
            key={number}
            href={`tel:${number.replace(/\s+/g, "")}`}
            className="flex items-center justify-between p-4 bg-brand-warm-bg rounded-2xl border border-gray-150 text-brand-forest font-bold hover:bg-gray-100 transition shadow-xs group"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-dusk-orange shrink-0" />
              <span>Enquiries: {number}</span>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        ))}
      </div>
    </>
  );
}
