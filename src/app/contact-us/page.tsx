"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, BadgeCheck, X } from "lucide-react";
import { OFFICES } from "@/data/db";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 sm:pt-16 sm:pb-32 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk">
          Support desk
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-brand-dark-text leading-tight">
          Contact Our Adventure Experts
        </h1>
        <p className="text-sm text-gray-500">
          Have queries regarding snow conditions, batch bookings, customization, or corporate retreats? Contact us, and we will get back to you immediately.
        </p>
      </div>

      {/* Two columns layout */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Office info cards */}
        <div className="w-full lg:w-1/2 space-y-8">
          <h2 className="text-xl font-extrabold text-brand-dark-text font-serif">Our Offices</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {OFFICES.map((office, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4 hover:shadow-md transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-forest/5 flex items-center justify-center text-brand-forest">
                    <MapPin className="w-5 h-5 text-brand-dusk-orange" />
                  </div>
                  <h3 className="font-bold text-brand-dark-text text-base">{office.city}</h3>
                </div>
                
                <div className="space-y-2.5 text-xs text-gray-600 pl-1">
                  <p className="leading-relaxed">
                    <span className="font-semibold block text-brand-dark-text">Address:</span>
                    {office.address}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-dusk" />
                      <span>{office.phone}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-dusk" />
                      <span>{office.email}</span>
                    </span>
                  </div>
                  <span className="text-[10px] bg-brand-forest/5 text-brand-forest px-2.5 py-1 rounded-full font-bold uppercase inline-block mt-2">
                    Timings: {office.timings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="w-full lg:w-1/2">
          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/30 shadow-xl bg-white/60 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
              <MessageSquare className="w-6 h-6 text-brand-dusk-orange shrink-0" />
              <h2 className="text-lg font-bold text-brand-dark-text font-serif">Drop us a line</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="text-xs font-semibold text-gray-500 block">FullName</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 min-h-[44px] bg-brand-warm-bg rounded-xl border border-gray-150 text-base lg:text-xs focus:outline-none text-brand-dark-text"
                    required
                  />
                </div>
                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="contact-phone" className="text-xs font-semibold text-gray-500 block">Mobile Number</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 min-h-[44px] bg-brand-warm-bg rounded-xl border border-gray-150 text-base lg:text-xs focus:outline-none text-brand-dark-text"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="contact-email" className="text-xs font-semibold text-gray-500 block">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 min-h-[44px] bg-brand-warm-bg rounded-xl border border-gray-150 text-base lg:text-xs focus:outline-none text-brand-dark-text"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="contact-message" className="text-xs font-semibold text-gray-500 block">Your Message</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="How can we help you? Let us know if you want custom packages..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 min-h-[44px] bg-brand-warm-bg rounded-xl border border-gray-150 text-base lg:text-xs focus:outline-none text-brand-dark-text resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Submit Query</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSubmitted(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center mx-auto shadow-md">
              <BadgeCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-brand-dark-text">Message Received!</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Thank you for contacting TripMySoul. Our destination manager will review your message and reach out to you via WhatsApp or email within the hour.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3 rounded-full font-bold shadow-md transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
