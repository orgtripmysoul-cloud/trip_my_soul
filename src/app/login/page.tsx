"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Compass, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-brand-forest overflow-hidden py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt="Himalayan Background"
          className="w-full h-full object-cover opacity-25 scale-105 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-forest via-brand-forest/60 to-brand-forest" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-6">
          
          {/* Logo */}
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-dusk flex items-center justify-center mx-auto shadow-md">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wider">Traveler Dashboard</h2>
            <p className="text-[10px] text-brand-dusk-orange font-semibold uppercase tracking-widest">
              Manage your upcoming Himalayan trips
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block pl-1">
                Email Address
              </label>
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block pl-1">
                Password
              </label>
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-white placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Helper links */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 px-1 pt-1">
              <button type="button" className="hover:text-white transition">Forgot password?</button>
              <button type="button" className="hover:text-white transition">Create account</button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brand-dusk hover:bg-brand-dusk-orange text-white py-3.5 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
