"use client";

import React from "react";
import Link from "next/link";
import { Compass, Shield, Leaf, ArrowRight, Star, MapPin, Award } from "lucide-react";
import { motion } from "framer-motion";
import { TREKS, WHY_CHOOSE_US, TRUST_STATS, REGIONS } from "@/data/db";
import TrekCard from "@/components/TrekCard";
import SwiperCarousel from "@/components/SwiperCarousel";
import CategoryCarousel from "@/components/CategoryCarousel";

export default function Home() {
  // Get top winter and trending treks to display
  const topTreks = TREKS.filter(
    (t) => t.category.toLowerCase().includes("trending") || t.slug === "kedarkantha-trek"
  ).slice(0, 6);

  const testimonials = [
    {
      name: "Saurabh Sharma",
      trek: "Kedarkantha Trek",
      date: "Jan 2026",
      text: "The winter scenery was absolutely breathtaking. TripMySoul organized everything perfectly. The guides were extremely experienced, particularly in handling the heavy snow at basecamp.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Ananya Iyer",
      trek: "Kashmir Great Lakes",
      date: "Sept 2025",
      text: "Walking through alpine meadows and witnessing the pristine turquoise lakes was like a dream. Safe, clean camps, and delicious meals throughout the 8 days. Highly recommend!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Rahul Verma",
      trek: "Hampta Pass",
      date: "July 2025",
      text: "Loved the contrast between the green Kullu valley and the barren Spiti desert. TripMySoul's local guides explained the local folklore and kept us motivated throughout the steep climb.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const instagramPosts = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1472214222555-d404758b1c42?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=400&q=80",
  ];

  const blogPosts = [
    {
      title: "Kedarkantha Trek in Winter: A Complete Prep Guide",
      excerpt: "Essential gear, physical fitness routines, and itinerary breakdown for India's best winter peak trek.",
      category: "Preparation Guide",
      date: "July 15, 2026",
      image: "https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Why Kashmir Great Lakes Should Be on Your Bucket List",
      excerpt: "A detailed account of the magical landscapes, pristine lakes, and alpine flower valleys.",
      category: "Trek Stories",
      date: "June 28, 2026",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Sustainable Trekking: Leave No Trace in the Himalayas",
      excerpt: "How TripMySoul aims to clean high-altitude garbage, reduce plastic, and support local mountain economies.",
      category: "Sustainability",
      date: "May 10, 2026",
      image: "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div className="w-full relative bg-brand-warm-bg overflow-x-hidden">
      {/* 1. Hero Section with Carousel & Parallax */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-brand-forest">
        {/* Parallax Background overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="Himalayas Hero Background"
            className="w-full h-full object-cover opacity-60 scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-forest via-brand-forest/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white space-y-6 md:space-y-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 inline-block">
              Himalayan Wilderness Expeditions
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif leading-tight tracking-tight">
              Where Every Journey <br />
              <span className="text-brand-dusk-orange font-normal italic">Heals the Soul</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed"
          >
            Join curated, small-group treks across the towering ranges of Uttarakhand, Himachal, and Kashmir. Fully certified mountaineering guides, clean campsites, and rigorous safety standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/treks"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-dusk hover:bg-brand-dusk-orange text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
            >
              <span>Explore Seasonal Treks</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/918178613438"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/20 transition duration-200 flex items-center justify-center gap-2"
            >
              <span>Speak to Experts</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Trust Stats Bar (overlapping the Hero) */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-16 md:-mt-20 mb-8">
        <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 shadow-xl border border-gray-100 text-brand-dark-text">
          {TRUST_STATS.map((stat, idx) => (
            <div key={idx} className="text-center w-full md:w-auto space-y-1">
              <span className="text-3xl md:text-4xl font-extrabold text-brand-forest block leading-none">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-gray-600 font-semibold tracking-wide block uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Carousel Strip */}
      <CategoryCarousel />

      {/* 3. Seasonal Top Treks Carousel */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Trending Trails
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-tight">
              Top Treks This Season
            </h2>
          </div>
          <Link
            href="/treks"
            className="flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-dusk transition group"
          >
            <span>View All Treks</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <SwiperCarousel slidesPerView={1}>
          {topTreks.map((trek) => (
            <TrekCard key={trek.slug} trek={trek} />
          ))}
        </SwiperCarousel>
      </section>

      {/* 4. Region Grid Section */}
      <section className="py-20 bg-brand-warm-card/40 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Explore by Territory
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-none">
              Himalayan Regions
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every region offers a unique flavor. Wander through the rolling high-altitude meadows (bugyals) of Uttarakhand, negotiate mountain passes in Himachal, or seek pristine lakes in Kashmir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REGIONS.map((region) => (
              <Link
                key={region.slug}
                href={`/regions/${region.slug}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 border border-white/10"
              >
                {/* Image background with hover zoom */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-forest/90 via-brand-forest/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-white space-y-2">
                  <h3 className="text-2xl font-bold font-serif">{region.name}</h3>
                  <p className="text-xs text-gray-200 leading-relaxed line-clamp-2">
                    {region.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-brand-dusk-orange">
                    <span>Explore region treks</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
            Our Core Pillars
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-none">
            Why Choose TripMySoul?
          </h2>
          <p className="text-sm text-gray-600">
            We are dedicated to safety, trail cleanliness, and giving back to the mountain communities that support us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((metric, idx) => {
            const Icon = metric.icon === "Shield" ? Shield : metric.icon === "Leaf" ? Leaf : Compass;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-forest/5 flex items-center justify-center text-brand-forest">
                    <Icon className="w-6 h-6 text-brand-dusk-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark-text">{metric.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Testimonials Wall */}
      <section className="py-20 bg-brand-forest text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest via-brand-forest-light/10 to-brand-forest pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange">
              Trekkers Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif">
              What Our Explorers Say
            </h2>
          </div>

          <SwiperCarousel slidesPerView={1} showNavigation={false}>
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="glass-dark rounded-3xl p-8 max-w-2xl mx-auto border border-white/10 space-y-6 text-center"
              >
                <div className="flex justify-center space-x-1 text-brand-dusk-orange">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-base md:text-lg text-gray-200 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-4 pt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                  <div className="text-left">
                    <span className="font-bold text-white block text-sm">{t.name}</span>
                    <span className="text-xs text-brand-dusk-orange">
                      Trekker | {t.trek} ({t.date})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </SwiperCarousel>
        </div>
      </section>

      {/* 7. Affiliations & Certifications Strip */}
      <section className="py-12 bg-white border-y border-gray-150">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-gray-400 mb-8">
            Approved & Affiliated By
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-forest" />
              <span className="font-bold text-sm text-brand-dark-text tracking-wide uppercase">IMF Affiliated</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-forest" />
              <span className="font-bold text-sm text-brand-dark-text tracking-wide uppercase">ATOAI Member</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-forest" />
              <span className="font-bold text-sm text-brand-dark-text tracking-wide uppercase">Uttarakhand Tourism Board</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-forest" />
              <span className="font-bold text-sm text-brand-dark-text tracking-wide uppercase">MSME Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Blog Teaser Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Himalayan Chronicles
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark-text font-serif leading-none">
              Stories from the Trail
            </h2>
          </div>
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-dusk transition group"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, idx) => (
            <Link
              key={idx}
              href="/blogs"
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
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
      </section>

      {/* 9. Instagram Feed Embed Mock */}
      <section className="py-16 bg-brand-warm-card/25 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Social Community
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark-text font-serif">
              #TripMySoul Adventures
            </h2>
            <p className="text-xs text-gray-500">
              Follow our daily updates on Instagram for recent trail conditions, weather reports, and photos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {instagramPosts.map((img, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/tripmysoul.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square rounded-2xl overflow-hidden group shadow-xs block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Instagram photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
