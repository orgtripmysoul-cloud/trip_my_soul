"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface TrekFaqsProps {
  faqs: { title: string; description: string }[];
}

export default function TrekFaqs({ faqs }: TrekFaqsProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = expandedFaq === idx;
          return (
            <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 bg-brand-warm-bg text-left hover:bg-gray-100 transition"
              >
                <span className="font-extrabold text-xs text-brand-forest uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-dusk-orange shrink-0" />
                  <span>{faq.title}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-brand-forest transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="p-4 text-xs text-gray-650 leading-relaxed bg-white border-t border-gray-150">
                  {faq.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
