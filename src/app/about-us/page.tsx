"use client";

import React from "react";
import { ShieldCheck, Heart, Leaf } from "lucide-react";

export default function AboutUsPage() {
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
        {/* Section 1: Founder Story */}
        <div className="space-y-10">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
              Driven by Purpose
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-brand-dark-text leading-tight">
              It Started With a Love for the Mountains
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-5">
            <p className="text-base text-brand-dark-text font-serif italic leading-relaxed">
              Every journey begins with a feeling.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              For <span className="font-bold text-brand-dark-text">Pramod Panwar</span>, founder of Trip My Soul, that feeling was born in the mountains.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Growing up close to the Himalayas, Pramod experienced the mountains not just as beautiful landscapes, but as a way of life — quiet villages, long trails, simple people, sacred places, changing seasons, and the feeling of being truly alive.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Over time, he realised something:
            </p>

            <blockquote className="border-l-2 border-brand-dusk-orange pl-5 py-1 space-y-1">
              <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
                People don’t just travel to see places.
              </p>
              <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
                They travel to find a part of themselves.
              </p>
            </blockquote>

            <p className="text-sm text-gray-600 leading-relaxed">
              And that thought became the beginning of Trip My Soul.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              What started as a passion for exploring the Himalayas slowly became a dream — to create journeys that were more meaningful than ordinary holidays.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Journeys where you don’t simply tick a destination off your list.
            </p>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
              {[
                "You walk through forests.",
                "You sit under stars.",
                "You meet people who live differently.",
                "You hear the silence of the mountains.",
                "You challenge yourself.",
                "You laugh with strangers who become friends.",
              ].map((line, idx) => (
                <p key={idx} className="text-sm sm:text-base font-serif text-brand-dark-text leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              And somewhere between the trail and the destination, you reconnect with yourself.
            </p>
          </div>
        </div>

        {/* Section 2: From One Dream to Thousands of Journeys */}
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-brand-dark-text leading-tight">
            From One Dream to Thousands of Journeys
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Trip My Soul began with a simple belief:
          </p>
          <blockquote className="border-l-2 border-brand-dusk-orange pl-5 py-1">
            <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
              Travel should change you, not just your location.
            </p>
          </blockquote>
          <p className="text-sm text-gray-600 leading-relaxed">
            With every trek, every road trip, every spiritual journey and every traveller who trusted us, that belief became stronger.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            There were difficult days too — long journeys, unpredictable weather, challenging trails, operational struggles and countless lessons.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            But every time a traveller returned with a smile, every time someone said &ldquo;This was more than a trip,&rdquo; it reminded us why we started.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Today, Trip My Soul is growing into a community of travellers who don’t travel merely for photographs.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {["experiences", "stories", "friendships", "adventure", "peace"].map((word) => (
              <span
                key={word}
                className="text-xs font-bold text-brand-forest bg-brand-forest/5 border border-brand-forest/10 rounded-full px-4 py-1.5"
              >
                They travel for {word}.
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            And sometimes, simply to breathe again.
          </p>
        </div>

        {/* Section 3: Founder Belief */}
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-brand-dark-text leading-tight">
            Our Founder’s Belief
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Pramod Panwar believes that the greatest journeys don’t always take us somewhere new.
          </p>
          <blockquote className="border-l-2 border-brand-dusk-orange pl-5 py-1">
            <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
              Sometimes, they bring us back to ourselves.
            </p>
          </blockquote>
          <p className="text-sm text-gray-600 leading-relaxed">
            That is what Trip My Soul was created for.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            From the trails of the Himalayas to sacred journeys, from remote villages to unforgettable adventures — our purpose remains the same:
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            To create journeys that stay with you long after the journey ends.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Because destinations eventually become memories.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            But how a journey made you feel — that stays forever.
          </p>

          <div className="text-center pt-8 mt-4 space-y-2 border-t border-gray-150">
            <span className="text-sm font-extrabold uppercase tracking-widest text-brand-dusk-orange block">
              Trip My Soul
            </span>
            <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
              Not just a journey.
            </p>
            <p className="text-base sm:text-lg font-serif text-brand-dark-text leading-relaxed">
              A journey back to your soul.
            </p>
          </div>
        </div>

        {/* Section 4: What we stand for */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
