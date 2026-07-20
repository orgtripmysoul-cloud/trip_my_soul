"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Compass } from "lucide-react";

export default function BlogGridPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Preparation Guide", "Trek Stories", "Sustainability"];

  const posts = [
    {
      title: "Kedarkantha Trek in Winter: A Complete Prep Guide",
      excerpt: "Essential gear, physical fitness routines, and itinerary breakdown for India's best winter peak trek.",
      category: "Preparation Guide",
      date: "July 15, 2026",
      image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Why Kashmir Great Lakes Should Be on Your Bucket List",
      excerpt: "A detailed account of the magical landscapes, pristine lakes, and alpine flower valleys.",
      category: "Trek Stories",
      date: "June 28, 2026",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Sustainable Trekking: Leave No Trace in the Himalayas",
      excerpt: "How TripMySoul aims to clean high-altitude garbage, reduce plastic, and support local mountain economies.",
      category: "Sustainability",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "How to Choose Between Har Ki Dun and Kedarkantha",
      excerpt: "A comprehensive comparison covering difficulty, terrain, local culture, and winter views.",
      category: "Preparation Guide",
      date: "April 05, 2026",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Crossing the Hampta Pass: A First-Hand Account",
      excerpt: "Negotiating the snow bridge, walking alongside cascading streams, and descending to Chandratal Lake.",
      category: "Trek Stories",
      date: "March 22, 2026",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Mountain Sickness: Prevention and AMS Protocols",
      excerpt: "Recognizing early symptoms of Acute Mountain Sickness and how our guides execute safety evacuations.",
      category: "Preparation Guide",
      date: "Feb 18, 2026",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const filteredPosts = posts.filter(
    (post) => selectedCategory === "All" || post.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
          Himalayan chronicles
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-dark-text leading-tight">
          Himalayan Trekking Blog
        </h1>
        <p className="text-sm text-gray-500">
          Preparation guides, first-hand stories, and sustainable trekking policies from the team behind your adventures.
        </p>
      </div>

      {/* Categories select pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-4 border-b border-gray-150 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-4 py-2 rounded-full font-bold border transition-all ${
              selectedCategory === cat
                ? "bg-brand-forest text-white border-brand-forest shadow-sm"
                : "bg-white text-gray-700 border-gray-250 hover:bg-brand-warm-bg"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid view */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <div
              key={idx}
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="aspect-[1.6] bg-gray-150 relative overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk bg-brand-dusk/5 px-2.5 py-1 rounded-full border border-brand-dusk/10 inline-block">
                    {post.category}
                  </span>
                  <h3 className="text-base font-bold text-brand-dark-text group-hover:text-brand-dusk transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="text-[10px] text-gray-400 font-semibold">{post.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-3xl p-8 max-w-md mx-auto space-y-3">
          <Compass className="w-10 h-10 text-brand-dusk-orange mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-brand-dark-text">No articles found</h3>
          <p className="text-xs text-gray-500">
            We are working on adding more articles to this category. Browse other tags.
          </p>
        </div>
      )}
    </div>
  );
}
