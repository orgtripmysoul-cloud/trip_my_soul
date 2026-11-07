"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, Building2, Shield, ArrowRight, CheckCircle2, Phone, Mail } from "lucide-react";
import { submitLead } from "@/lib/client/leadsApi";

export default function CorporateExpeditionsPage() {
  const [formData, setFormData] = useState({
    orgName: "",
    contactPerson: "",
    email: "",
    phone: "",
    groupType: "Corporate Team Building",
    groupSize: "20-50 Trekkers",
    preferredRegion: "Uttarakhand",
    tentativeMonth: "Oct 2026",
    notes: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitLead({
        formType: "corporate",
        name: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        travelMonth: formData.tentativeMonth || undefined,
        message: formData.notes || undefined,
        details: {
          company: formData.orgName,
          groupSize: formData.groupSize,
          purpose: formData.groupType,
          region: formData.preferredRegion,
        },
        consentMarketing: true,
        website: honeypot,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-bg pt-24 pb-24 font-sans text-brand-dark-text">
      {/* Hero Header */}
      <section className="bg-[#0B2545] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 px-4 py-1.5 rounded-full inline-block border border-white/10">
            Custom Group Wilderness Expeditions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif">
            Corporate & Educational Himalayan Retreats
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tailor-made team building, wilderness survival programs, and outdoor leadership expeditions for corporate organizations, schools, and university groups.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm text-center">
            <Building2 className="w-10 h-10 text-brand-dusk-orange mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark-text">Corporate Leadership Camps</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enhance resilience, communication, and strategic problem solving through high-altitude wilderness challenges.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm text-center">
            <GraduationCap className="w-10 h-10 text-sky-500 mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark-text">School & College Expeditions</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Safe, structured outdoor educational journeys for students with 1:5 guide-to-student ratio and medical safety leads.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm text-center">
            <Shield className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark-text">100% Medical Safety Net</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Oxygen cylinders, portable hyperbaric chambers, stretcher support, and IMF-certified instructors on every expedition.
            </p>
          </div>
        </div>

        {/* Custom Proposal Request Form */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-md max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold font-serif text-brand-dark-text">Request a Custom Group Proposal</h2>
            <p className="text-xs text-gray-500">Fill in your organization details to receive a customized itinerary quote within 2 hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-10 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-800">Proposal Request Received!</h3>
              <p className="text-xs text-emerald-700">Our expedition manager will call you shortly at {formData.phone} with full pricing & logistics details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              {/* Honeypot: hidden from people, filled by bots. */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] w-px h-px opacity-0"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company / Institution Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Infosys / Doon School"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dusk"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saurabh Sharma"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dusk"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dusk"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dusk"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Group Category</label>
                  <select
                    value={formData.groupType}
                    onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none font-semibold bg-white"
                  >
                    <option value="Corporate Team Building">Corporate Team Building</option>
                    <option value="School Expedition">School Students</option>
                    <option value="University Outdoor Club">College / University</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Group Size</label>
                  <select
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none font-semibold bg-white"
                  >
                    <option value="10-20 Trekkers">10 - 20 Trekkers</option>
                    <option value="20-50 Trekkers">20 - 50 Trekkers</option>
                    <option value="50+ Trekkers">50+ Trekkers</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Target Region</label>
                  <select
                    value={formData.preferredRegion}
                    onChange={(e) => setFormData({ ...formData, preferredRegion: e.target.value })}
                    className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none font-semibold bg-white"
                  >
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jammu & Kashmir">Jammu & Kashmir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Mention any specific team building activities, food preferences, or custom dates..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 min-h-[44px] text-base lg:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-brand-dusk"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#0B2545] hover:bg-brand-dusk-orange disabled:opacity-60 text-white font-bold shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <span>{submitting ? "Sending..." : "Submit Proposal Request"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
