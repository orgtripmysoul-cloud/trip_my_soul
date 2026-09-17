"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Eye, EyeOff, ShieldAlert, KeyRound, Mail, CheckCircle } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const supabase = supabaseBrowser();
  const isConfigured = supabase !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    // If email confirmation is required, there is no session yet.
    if (!data.session) {
      setConfirmationSent(true);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] bg-brand-warm-bg flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto text-brand-forest">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark-text font-serif">Create Your Account</h1>
          <p className="text-xs text-gray-400">Sign up to manage your treks, upload medical sheets, and download invoices.</p>
        </div>

        {confirmationSent ? (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 rounded-2xl flex items-start gap-2 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Account created! Check {email} for a confirmation link, then log in.</span>
          </div>
        ) : (
          <>
            {!isConfigured && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-2xl flex items-start gap-2 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Authentication is not configured. This deployment is missing its Supabase environment variables — please contact the site admin.</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-start gap-2 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <fieldset disabled={!isConfigured} className="disabled:opacity-60">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Full Name</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-brand-warm-bg border border-gray-150 rounded-xl">
                  <UserPlus className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
                  />
                </div>
              </div>

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
                    className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
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
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-brand-forest transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 pl-1">Confirm Password</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-brand-warm-bg border border-gray-150 rounded-xl relative">
                  <KeyRound className="w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent border-0 text-base lg:text-sm focus:outline-none w-full min-w-0 text-brand-dark-text self-stretch py-3 -my-3"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isConfigured}
                className="w-full bg-brand-forest hover:bg-brand-forest-light text-white py-3.5 rounded-full font-bold shadow-lg transition flex items-center justify-center gap-2 hover:-translate-y-0.5 transform duration-200 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
              </button>
            </form>
            </fieldset>
          </>
        )}

        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-forest font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
