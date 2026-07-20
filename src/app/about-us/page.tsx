"use client";

import React from "react";
import { ShieldCheck, Heart, Leaf } from "lucide-react";

export default function AboutUsPage() {
  const teamMembers = [
    {
      name: "Pramod Panwar",
      role: "CEO & Founder",
      bio: "High-altitude explorer and wilderness expert dedicated to safety and community integration across Himalayan routes.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Karan Negi",
      role: "Head Operations (Dehradun)",
      bio: "With over 10 years of operations experience, ensuring seamless transport logistics and medical coordination.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Rishi Raj",
      role: "Lead Expedition Guide",
      bio: "Mountaineer certified by NIM Uttarkashi. Has successfully summitted 15+ high-altitude passes.",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="bg-brand-warm-bg min-h-screen">
      {/* Page Header Banner */}
      <div className="relative h-[45vh] w-full bg-brand-forest overflow-hidden flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="About us background"
            className="w-full h-full object-cover opacity-35 scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-bg via-brand-forest/65 to-brand-forest" />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl px-4 mt-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif leading-tight">
            About TripMySoul
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
            &ldquo;Under the Full Moon, Every Journey Shines Brighter.&rdquo;
          </p>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        {/* Section 1: Mission and Vibe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Driven by Purpose
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark-text leading-tight">
              Our Sacred Mission
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our mission at TripMySoul is to inspire and guide travelers toward meaningful, soul-stirring journeys. We believe that travel is more than just reaching a destination; it’s about the experiences you gather, the connections you make, and the stories you create along the way.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We focus on slow travel, minimizing ecological footprints, cleaning high-altitude wilderness, and returning mountain economies to the local villages.
            </p>
          </div>
          {/* Hexagonal bullets grid */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: ShieldCheck, title: "Uncompromising Safety", text: "Oxygen tanks, NIM-certified leaders, and medical briefings before every single ascent." },
              { icon: Leaf, title: "Eco-Conscious Travel", text: "Removing trail waste, absolute plastics bans, and carbon-offset support." },
              { icon: Heart, title: "Soul-Healing Experiences", text: "Crafting small-batch treks that connect you deeply with nature and yourself." }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-forest/5 flex items-center justify-center shrink-0 text-brand-forest">
                    <Icon className="w-5 h-5 text-brand-dusk-orange" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-brand-dark-text block">{pillar.title}</span>
                    <span className="text-xs text-gray-500 leading-relaxed">{pillar.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Team profiles */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Himalayan Experts
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark-text leading-tight">
              Meet the Team
            </h2>
            <p className="text-xs text-gray-500">
              The guides, organizers, and builders who make your high-altitude dreams safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs text-center space-y-4 hover:shadow-lg transition duration-200"
              >
                {/* Avatar with cover */}
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-brand-forest/20 relative bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-brand-dark-text text-base">{member.name}</h3>
                  <span className="text-[10px] font-extrabold text-brand-dusk-orange uppercase tracking-wider block">
                    {member.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
