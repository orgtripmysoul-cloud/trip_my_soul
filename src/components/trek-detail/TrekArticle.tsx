"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleContent } from "@/data/db";

interface TrekArticleProps {
  trekName: string;
  noun: string;
  /** The listing's own written guide, where it publishes one. */
  article?: ArticleContent;
  /** Lead image for a published guide that carries none of its own. */
  heroImage?: string;
}

export default function TrekArticle({ trekName, noun, article, heroImage }: TrekArticleProps) {
  const leadImage = article?.image ?? heroImage;

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            Official {noun} Guide
          </span>
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">
            {noun} Article & Written Guide
          </h2>
        </div>
        <Link
          href="/blogs"
          className="text-xs font-bold inline-flex items-center min-h-[44px] text-brand-forest hover:text-brand-dusk-orange transition flex items-center gap-1"
        >
          <span>Read More on Blog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {article ? (
        <article className="space-y-6">
          <header className="space-y-3">
            {leadImage && (
              <div className="aspect-[21/9] w-full rounded-xl overflow-hidden relative shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={leadImage} alt={trekName} className="w-full h-full object-cover" />
              </div>
            )}
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded-full inline-block">
              Featured Trail Guide
            </span>
            <h3 className="text-lg font-extrabold text-brand-dark-text font-serif leading-snug">
              {article.title}
            </h3>
            {article.standfirst && (
              <p className="text-xs text-gray-650 leading-relaxed font-medium">{article.standfirst}</p>
            )}
            {article.readMinutes && (
              <span className="text-[10px] font-semibold text-gray-400 block">
                ⏱️ {article.readMinutes} min read
              </span>
            )}
          </header>

          <div className="space-y-6">
            {article.sections.map((section, idx) => (
              <section key={section.heading ?? idx} className="space-y-2">
                {section.heading && (
                  <h4 className="text-sm font-extrabold text-brand-dark-text font-serif">
                    {section.heading}
                  </h4>
                )}
                {/* The guide's line breaks carry its rhythm, so each stays its own paragraph. */}
                <div className="space-y-1.5 text-xs text-gray-650 leading-relaxed font-medium">
                  {section.paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {article.signoff && (
            <p className="text-xs font-extrabold text-brand-forest font-serif pt-4 border-t border-gray-100">
              {article.signoff}
            </p>
          )}
        </article>
      ) : (
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
                className="inline-flex items-center gap-1 min-h-[44px] font-bold text-brand-dusk-orange hover:underline text-xs"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
