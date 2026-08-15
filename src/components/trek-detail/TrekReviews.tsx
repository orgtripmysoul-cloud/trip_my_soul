"use client";

import React, { useState } from "react";
import { Play, Star } from "lucide-react";

interface Review {
  name: string;
  role: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}

interface TrailVideo {
  title: string;
  duration: string;
  views: string;
}

interface TrekReviewsProps {
  reviews: Review[];
  trailVideos: TrailVideo[];
}

export default function TrekReviews({ reviews, trailVideos }: TrekReviewsProps) {
  const [reviewTab, setReviewTab] = useState<"reviews" | "videos">("reviews");

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            Verified Feedback
          </span>
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Trek Reviews & Videos</h2>
        </div>

        <div className="flex bg-brand-warm-bg p-1 rounded-full border border-gray-150 text-[10px] font-bold">
          <button
            onClick={() => setReviewTab("reviews")}
            className={`px-4 py-1.5 rounded-full uppercase transition-all ${
              reviewTab === "reviews" ? "bg-[#0B2545] text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            ⭐ Reviews (128)
          </button>
          <button
            onClick={() => setReviewTab("videos")}
            className={`px-4 py-1.5 rounded-full uppercase transition-all ${
              reviewTab === "videos" ? "bg-[#0B2545] text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            📹 Trail Videos ({trailVideos.length})
          </button>
        </div>
      </div>

      {/* Written Reviews Tab */}
      {reviewTab === "reviews" && (
        <div className="space-y-4 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-gray-150 bg-brand-warm-bg/40 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-8 h-8 rounded-full object-cover border border-brand-forest/20"
                    />
                    <div>
                      <span className="font-extrabold text-brand-dark-text block">{rev.name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {rev.role} • {rev.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-650 leading-relaxed font-medium italic">&quot;{rev.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {reviewTab === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          {trailVideos.map((v, idx) => (
            <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden bg-white space-y-2 group">
              <div className="aspect-video w-full bg-gray-900 relative flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
                  alt={v.title}
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="w-12 h-12 rounded-full bg-brand-dusk-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/80 text-white px-2 py-0.5 rounded">
                  {v.duration}
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-extrabold text-xs text-brand-dark-text group-hover:text-brand-forest transition">
                  {v.title}
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold">{v.views} • Official TripMySoul Vlog</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
