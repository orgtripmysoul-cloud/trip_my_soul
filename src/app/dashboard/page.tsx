"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, ShieldCheck, MapPin, User, LogOut, CheckCircle, FileText,
  Download, ArrowRight, Star, Clock, AlertTriangle, Compass, XCircle, X, AlertCircle, RotateCcw
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "documents" | "history">("bookings");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // Cancellation State
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Schedule Conflict");
  const [cancelNotes, setCancelNotes] = useState("");
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState(false);

  // Fix server-client mismatch
  useEffect(() => {
    setIsClient(true);
    const supabase = supabaseBrowser();
    if (!supabase) {
      // Auth isn't configured on this deployment — send to /login, which
      // renders the "not configured" message instead of a blank dashboard.
      router.push("/login");
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email ?? "");
      setUserName(session.user.user_metadata?.full_name ?? "");
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email ?? "");
      setUserName(session.user.user_metadata?.full_name ?? "");
    });

    return () => subscription.subscription.unsubscribe();
  }, [router]);

  if (!isClient) return null;

  const handleLogout = async () => {
    await supabaseBrowser()?.auth.signOut();
    router.push("/login");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setReviewText("");
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-warm-bg py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Summary Banner */}
        <div className="bg-brand-forest text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10">
            <Compass className="w-64 h-64 animate-spin-slow" />
          </div>

          <div className="space-y-2 z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dusk-orange bg-white/10 px-3 py-1 rounded-full border border-white/10 inline-block">
              Premium Trekker Club
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif">
              Welcome Back{(userName || userEmail.split("@")[0]) && `, ${userName || userEmail.split("@")[0]}`}!
            </h1>
            <p className="text-xs text-sky-200">Email: {userEmail}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full transition shadow-md shrink-0 z-10"
          >
            <LogOut className="w-4 h-4 text-brand-dusk-orange" />
            <span>Logout Portal</span>
          </button>
        </div>

        {/* Tab Selection Row */}
        <div className="flex bg-white p-1 rounded-full border border-gray-150 text-xs font-bold max-w-md shadow-xs">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 py-2.5 rounded-full text-center transition-all ${
              activeTab === "bookings" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex-1 py-2.5 rounded-full text-center transition-all ${
              activeTab === "documents" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            Medical & IDs
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-full text-center transition-all ${
              activeTab === "history" ? "bg-brand-forest text-white shadow-xs" : "text-gray-500 hover:text-brand-forest"
            }`}
          >
            Past Hikes
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* TAB 1: BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Active Registrations</h2>
                      <p className="text-[10px] text-gray-400">1 Upcoming Himalayan trek found</p>
                    </div>
                    {isCancelled ? (
                      <span className="text-[9px] bg-red-500/10 text-red-600 font-bold border border-red-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        Cancelled
                      </span>
                    ) : (
                      <span className="text-[9px] bg-green-500/10 text-green-600 font-bold border border-green-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        Confirmed
                      </span>
                    )}
                  </div>

                  {cancelSuccessMsg && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Booking Cancelled. Your full refund of ₹7,500 has been initiated to your source account.</span>
                      </div>
                      <button onClick={() => setCancelSuccessMsg(false)} className="text-emerald-700 hover:text-emerald-900">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3 aspect-video sm:aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=350&q=85"
                        alt="Kedarkantha Trek"
                        className={`w-full h-full object-cover ${isCancelled ? "grayscale" : ""}`}
                      />
                    </div>

                    <div className="flex-grow space-y-4 text-xs text-gray-500">
                      <h3 className="text-base font-extrabold text-brand-dark-text font-serif">
                        Kedarkantha Winter Summit {isCancelled && <span className="text-xs text-red-500 font-sans font-bold">(Cancelled)</span>}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider block text-gray-400">Departure Batch</span>
                          <span className="font-extrabold text-brand-forest block">10 Dec - 15 Dec 2026</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider block text-gray-400">Base Camp Town</span>
                          <span className="font-extrabold text-brand-forest block">Sankri, Uttarakhand</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider block text-gray-400">Group Size</span>
                          <span className="font-extrabold text-brand-forest block">12 Trekkers</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider block text-gray-400">Payment Status</span>
                          <span className="font-extrabold block">
                            {isCancelled ? (
                              <span className="text-amber-600 font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Refund Initiated (₹7,500)</span>
                              </span>
                            ) : (
                              <span className="text-brand-forest font-extrabold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                <span>Paid (₹7,500)</span>
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Downloading simulated PDF invoice folder...");
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-150 rounded-full hover:bg-gray-50 font-bold transition text-[11px] text-brand-forest"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-dusk-orange" />
                          <span>Get PDF Invoice</span>
                        </a>
                        <button
                          onClick={() => router.push("/treks/kedarkantha-trek")}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-forest text-white rounded-full hover:bg-brand-forest-light font-bold transition text-[11px] shadow-xs"
                        >
                          <span>Review Trail details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {/* CANCEL BOOKING BUTTON */}
                        {!isCancelled ? (
                          <button
                            onClick={() => setIsCancelModalOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded-full font-bold transition text-[11px]"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setIsCancelled(false);
                              setCancelSuccessMsg(false);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full font-bold transition text-[11px]"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-activate Booking</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Document Uploads</h2>
                  <p className="text-[10px] text-gray-400">Mandatory files required for trek clearances and forest permission slips.</p>
                </div>

                <div className="space-y-4">
                  {/* Document Card 1 */}
                  <div className="p-4 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-warm-bg/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-forest" />
                        <span className="text-xs font-bold text-brand-dark-text">Medical Fitness Declaration</span>
                      </div>
                      <p className="text-[10px] text-gray-400 pl-6">Must be signed by a registered MBBS physician.</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Uploaded</span>
                      </div>
                      <a
                        href="/Documents/Trip_My_Soul_Medical_Fitness_Declaration.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-forest hover:bg-brand-forest-light text-white rounded-full text-[10px] font-bold shadow-xs transition w-full sm:w-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>

                  {/* Document Card 2 */}
                  <div className="p-4 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-warm-bg/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-forest" />
                        <span className="text-xs font-bold text-brand-dark-text">Government Photo ID Slip</span>
                      </div>
                      <p className="text-[10px] text-gray-400 pl-6">Aadhaar card, Passport, or Voter ID copy.</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Uploaded</span>
                      </div>
                      <a
                        href="/Documents/Trip_My_Soul_Govt_ID_Photo_Upload_Slip.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-forest hover:bg-brand-forest-light text-white rounded-full text-[10px] font-bold shadow-xs transition w-full sm:w-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PAST TRIPS */}
            {activeTab === "history" && (
              <div className="space-y-6">
                {/* Past trip log */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-brand-dark-text font-serif">Completed Journeys</h2>
                      <p className="text-[10px] text-gray-400">1 past trek found</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start text-xs text-gray-500">
                    <div className="w-16 h-16 bg-brand-warm-bg rounded-xl shrink-0 border border-gray-150 flex items-center justify-center text-brand-forest font-black uppercase text-[10px]">
                      Valley
                    </div>
                    <div className="space-y-1 leading-none">
                      <span className="font-extrabold text-brand-dark-text text-sm block">Valley of Flowers Trek</span>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">Uttarakhand • Aug 2025</span>
                      <span className="block text-green-600 font-bold pt-1.5">Successfully Climbed 🌸</span>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-dark-text font-serif">Submit Trek Review Feedback</h3>
                  
                  {feedbackSuccess ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex items-center gap-2 text-xs font-bold justify-center">
                      <CheckCircle className="w-4 h-4" />
                      <span>Review submitted successfully! Thank you for sharing your experience.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 pl-1 block">Rating score</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSelectedStars(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${star <= selectedStars ? "text-amber-400 fill-current" : "text-gray-300"}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 pl-1 block">Write your experience</label>
                        <textarea
                          rows={3}
                          required
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="How were the guides, food, camp stay, and trail guidelines?"
                          className="w-full p-3 bg-brand-warm-bg border border-gray-150 rounded-2xl text-base lg:text-xs text-brand-dark-text focus:outline-none placeholder-gray-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-brand-forest hover:bg-brand-forest-light text-white px-5 py-2.5 rounded-full text-[10px] font-bold shadow-xs transition"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Area (Quick info / Calendar countdown) */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-brand-dark-text font-serif flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-dusk-orange" />
                <span>Expedition Countdown</span>
              </h3>
              
              <div className="bg-brand-warm-bg rounded-2xl p-4 text-center border border-gray-150 space-y-1.5">
                <span className="text-3xl font-extrabold font-serif text-brand-forest block">142</span>
                <span className="text-[10px] font-extrabold text-gray-450 uppercase tracking-widest block">Days Remaining</span>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] text-amber-700 leading-relaxed flex items-start gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Ensure medical sheets are uploaded at least 30 days prior to departure for pass clearances.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative font-sans">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-dark-text font-serif">Cancel Registration</h3>
                <p className="text-xs text-gray-500">Kedarkantha Winter Summit (10 Dec - 15 Dec 2026)</p>
              </div>
            </div>

            {/* Cancellation Policy terms notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>TripMySoul Refund Policy Terms</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed text-amber-950 font-medium">
                <li>30+ days prior to departure: <strong>100% full refund</strong> or 100% trek voucher credit without deduction.</li>
                <li>Refund will be credited to your original payment method within 3 to 5 business days.</li>
              </ul>
            </div>

            {/* Reason selector form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCancelled(true);
                setIsCancelModalOpen(false);
                setCancelSuccessMsg(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Reason for Cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none font-semibold text-gray-700 bg-white text-base lg:text-sm"
                >
                  <option value="Schedule Conflict">Schedule Conflict / Work Commitments</option>
                  <option value="Health / Medical Issue">Health / Fitness / Medical Issue</option>
                  <option value="Family Emergency">Family Emergency</option>
                  <option value="Changed Travel Plan">Changed Travel Plans / Switched Trek</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Additional Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share any comments or feedback for our team..."
                  value={cancelNotes}
                  onChange={(e) => setCancelNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-base lg:text-xs"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="w-full sm:w-1/2 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition"
                >
                  Keep My Booking
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-1/2 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
