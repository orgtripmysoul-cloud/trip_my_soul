"use client";

import React, { useState } from "react";
import { Bell, X } from "lucide-react";

export default function TrekNotifyBar() {
  const [showNotifyBar, setShowNotifyBar] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);

  if (!showNotifyBar) return null;

  return (
    <div className="fixed bottom-[4.75rem] left-3 right-3 lg:bottom-4 lg:right-4 lg:left-auto z-40 bg-[#0B2545]/95 backdrop-blur-md border border-white/10 text-white rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 lg:max-w-sm animate-fade-in font-sans">
      <div className="w-8 h-8 rounded-full bg-brand-dusk-orange/10 border border-brand-dusk-orange/20 text-brand-dusk-orange flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4" />
      </div>

      {notifySuccess ? (
        <span className="text-[10px] font-bold text-green-400">
          Notification registered! We will email you future dates.
        </span>
      ) : (
        <div className="space-y-1.5 flex-grow pr-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-dusk-orange block leading-none">
            Notify Me of Future Dates
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="email"
              placeholder="your-email@mail.com"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs px-3 py-2 rounded-lg focus:outline-none flex-1 min-w-0 text-white"
            />
            <button
              onClick={() => {
                if (notifyEmail.trim()) {
                  setNotifySuccess(true);
                  setTimeout(() => {
                    setNotifySuccess(false);
                    setNotifyEmail("");
                    setShowNotifyBar(false);
                  }, 2500);
                }
              }}
              className="bg-brand-dusk-orange hover:bg-brand-dusk-orange/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition shrink-0 min-h-[40px]"
            >
              Join
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowNotifyBar(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
