"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

/**
 * Landing page for Supabase auth email links (signup confirmation, etc).
 *
 * This app's browser client uses the default implicit flow (no @supabase/ssr,
 * no PKCE code verifier storage), so GoTrue's ConfirmationURL redirects here
 * with the session tokens in the URL hash. supabase-js's detectSessionInUrl
 * (on by default) parses that hash and sets the session before this
 * component's effect runs — we just wait for it and redirect.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setError("Authentication is not configured. Please contact the site admin.");
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (cancelled) return;

      if (sessionError || !data.session) {
        setError("This confirmation link is invalid or has expired. Please try signing up again or log in.");
        return;
      }

      router.replace("/dashboard");
    });

    return () => {
      cancelled = true;
    };
  }, [supabase, router]);

  return (
    <div className="min-h-[80vh] bg-brand-warm-bg flex items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 text-center">
        {error ? (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-start gap-2 text-xs font-semibold text-left">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Confirming your email&hellip;</p>
        )}

        <p className="text-xs text-gray-400">
          <Link href="/login" className="text-brand-forest font-bold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
