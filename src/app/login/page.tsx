"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, ShieldAlert, KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Mock Authentication
    setTimeout(() => {
      if (email === "trekker@tripmysoul.com" && password === "password123") {
        // Mock successful login
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Use mock credentials shown below.");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleFillMockCredentials = () => {
    setEmail("trekker@tripmysoul.com");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-[80vh] bg-brand-warm-bg flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto text-brand-forest">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark-text font-serif">Traveler Portal</h1>
          <p className="text-xs text-gray-400">Log in to manage your treks, upload medical sheets, and download invoices.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-start gap-2 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-brand-warm-bg border border-gray-150 rounded-xl">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-0 text-sm focus:outline-none w-full text-brand-dark-text"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-brand-warm-bg border border-gray-150 rounded-xl relative">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-0 text-sm focus:outline-none w-full text-brand-dark-text"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-brand-forest transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? "Authenticating..." : "Login to Portal"}</span>
          </button>
        </form>

        {/* Mock Credentials Sandbox callout */}
        <div className="p-4 bg-brand-warm-bg border border-gray-150 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-brand-forest">Demo/Test Credentials:</span>
            <button
              onClick={handleFillMockCredentials}
              className="text-[10px] text-brand-dusk-orange font-bold uppercase tracking-wider hover:underline"
            >
              Auto-Fill
            </button>
          </div>
          <div className="space-y-1 text-gray-500 font-medium font-mono text-[11px]">
            <p>Email: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-bold">trekker@tripmysoul.com</code></p>
            <p>Password: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 font-bold">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
