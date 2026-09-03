"use client";

import React, { useState } from "react";
import { ExternalLink, Play, Star } from "lucide-react";
import type { ExternalReview } from "@/data/db";

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
  /** Reviews published on another platform, linked rather than reproduced. */
  externalReviews?: ExternalReview[];
  /** YouTube review videos, as watch/Shorts URLs. */
  reviewVideos?: string[];
  /** Listing name, used for the video labels. */
  trekName?: string;
}

/** The Google mark, inlined so the card carries its branding without a remote asset. */
function GoogleMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18c-.44-1.32-.69-2.72-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.14l7.35 5.7c1.73-5.2 6.58-9.09 12.31-9.09z"
      />
    </svg>
  );
}

/** The YouTube mark, inlined for the same reason as `GoogleMark`. */
function YoutubeMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="#FF0000"
        d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81z"
      />
      <path fill="#fff" d="M9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

/** Pulls the video id out of a Shorts, watch, embed or youtu.be URL. */
export function youtubeId(url: string): string | null {
  const match = url.match(/(?:shorts\/|watch\?v=|youtu\.be\/|embed\/)([\w-]{6,})/);
  return match ? match[1] : null;
}

export default function TrekReviews({
  reviews,
  trailVideos,
  externalReviews = [],
  reviewVideos = [],
  trekName,
}: TrekReviewsProps) {
  /**
   * A listing with real, link-backed reviews shows those instead of the
   * generic sample feedback — a published review and a placeholder should
   * never sit side by side.
   */
  const hasPublished = externalReviews.length > 0 || reviewVideos.length > 0;

  const [reviewTab, setReviewTab] = useState<"reviews" | "videos">(
    hasPublished && externalReviews.length === 0 ? "videos" : "reviews"
  );
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const sources = [...new Set(externalReviews.map((r) => r.source))];
  const reviewsLabel = hasPublished
    ? `${sources.length === 1 ? sources[0] : "Verified"} Reviews (${externalReviews.length})`
    : "Reviews (128)";
  const videosLabel = hasPublished
    ? `Video Reviews (${reviewVideos.length})`
    : `Trail Videos (${trailVideos.length})`;

  const showReviewsTab = hasPublished ? externalReviews.length > 0 : true;
  const showVideosTab = hasPublished ? reviewVideos.length > 0 : true;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
            {hasPublished ? "Real Experiences" : "Verified Feedback"}
          </span>
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">
            {hasPublished ? "What Trekkers Say" : "Trek Reviews & Videos"}
          </h2>
        </div>

        <div className="flex bg-brand-warm-bg p-1 rounded-full border border-gray-150 text-[10px] font-bold">
          {showReviewsTab && (
            <button
              onClick={() => setReviewTab("reviews")}
              className={`px-4 min-h-[44px] inline-flex items-center justify-center rounded-full uppercase transition-all ${
                reviewTab === "reviews" ? "bg-[#0B2545] text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              ⭐ {reviewsLabel}
            </button>
          )}
          {showVideosTab && (
            <button
              onClick={() => setReviewTab("videos")}
              className={`px-4 min-h-[44px] inline-flex items-center justify-center rounded-full uppercase transition-all ${
                reviewTab === "videos" ? "bg-[#0B2545] text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              📹 {videosLabel}
            </button>
          )}
        </div>
      </div>

      {/* Published reviews, linked to the platform they live on */}
      {reviewTab === "reviews" && externalReviews.length > 0 && (
        <div className="space-y-3 font-sans">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {externalReviews.map((review, idx) => (
              <li
                key={review.url}
                className="p-5 rounded-2xl border border-gray-150 bg-white shadow-xs space-y-3 text-xs transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand-forest/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-full bg-brand-warm-bg border border-gray-150 flex items-center justify-center shrink-0">
                    <GoogleMark className="w-4.5 h-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="font-extrabold text-brand-dark-text block truncate">
                      {review.subject}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {review.source} Review
                    </span>
                  </span>
                </div>

                {/* Star treatment only — the rating itself is shown on the platform */}
                <span className="flex items-center gap-1 text-gray-300" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" />
                  ))}
                </span>

                <p className="text-[11px] text-gray-650 leading-relaxed font-medium">
                  Read the rating and the trekker&apos;s own words on {review.source}.
                </p>

                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${review.subject} ${review.source} review ${idx + 1} of ${externalReviews.length} (opens in a new tab)`}
                  className="inline-flex items-center gap-1.5 min-h-[44px] text-[11px] font-extrabold text-brand-forest hover:text-brand-dusk-orange transition"
                >
                  <span>View Review</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample feedback, for listings with no published reviews yet */}
      {reviewTab === "reviews" && externalReviews.length === 0 && (
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
                      loading="lazy"
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

      {/* Published review videos: poster first, the embed only once asked for */}
      {reviewTab === "videos" && reviewVideos.length > 0 && (
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
          {reviewVideos.map((url, idx) => {
            const id = youtubeId(url);
            const label = `${trekName ?? "Trek"} review video ${idx + 1}`;
            const isPlaying = playingVideo === url;
            return (
              <li
                key={url}
                className="border border-gray-150 rounded-2xl overflow-hidden bg-white shadow-xs group transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-[9/16] w-full bg-gray-900">
                  {isPlaying && id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                      title={label}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(url)}
                      aria-label={`Play ${label}`}
                      className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dusk-orange"
                    >
                      {id && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
                        />
                      )}
                      <span className="relative w-12 h-12 rounded-full bg-brand-dusk-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </span>
                      <span className="absolute top-2 left-2 bg-white/95 rounded-full p-1 shadow-xs">
                        <YoutubeMark className="w-4 h-4" />
                      </span>
                    </button>
                  )}
                </div>

                <div className="p-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${label} on YouTube (opens in a new tab)`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-[11px] font-extrabold text-brand-forest hover:text-brand-dusk-orange transition"
                  >
                    <YoutubeMark className="w-3.5 h-3.5" />
                    <span>Watch Review</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Sample trail videos, for listings with no published ones */}
      {reviewTab === "videos" && reviewVideos.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          {trailVideos.map((v, idx) => (
            <div key={idx} className="border border-gray-150 rounded-2xl overflow-hidden bg-white space-y-2 group">
              <div className="aspect-video w-full bg-gray-900 relative flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
                  alt={v.title}
                  loading="lazy"
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
