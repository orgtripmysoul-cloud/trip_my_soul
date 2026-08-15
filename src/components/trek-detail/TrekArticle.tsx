"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TrekArticleProps {
  trekName: string;
}

export default function TrekArticle({ trekName }: TrekArticleProps) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            Official Trek Guide
          </span>
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Trek Article & Written Guide</h2>
        </div>
        <Link
          href="/blogs"
          className="text-xs font-bold text-brand-forest hover:text-brand-dusk-orange transition flex items-center gap-1"
        >
          <span>Read More on Blog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-brand-warm-bg/50 border border-gray-150 rounded-2xl p-5">
        <div className="aspect-video w-full rounded-xl overflow-hidden relative shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
            alt={trekName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 text-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded-full inline-block">
            Featured Trail Guide
          </span>
          <h3 className="text-base font-extrabold text-brand-dark-text font-serif leading-snug">
            The Complete Guide to {trekName}: Trail Contours, Campsites & Preparation
          </h3>
          <p className="text-gray-650 leading-relaxed font-medium">
            Everything you need to know about preparing for {trekName}. Deep-dive analysis of altitude sickness
            prevention, terrain contours, camp temperature ranges, and gear checklist.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-[10px] font-semibold text-gray-400">⏱️ 6 min read</span>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 font-bold text-brand-dusk-orange hover:underline text-xs"
            >
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
