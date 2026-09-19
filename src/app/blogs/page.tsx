"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Compass } from "lucide-react";
import { blogArticles } from "@/data/blogArticles";

export default function BlogGridPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Preparation Guide", "Trek Stories", "Sustainability"];

  const filteredPosts = blogArticles.filter(
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
            className={`text-xs px-4 min-h-[44px] shrink-0 inline-flex items-center rounded-full font-bold border transition-all ${
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
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
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
            </Link>
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
