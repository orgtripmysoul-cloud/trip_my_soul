import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the traveler auth portal. Uses the public
 * anon/publishable key only — safe to ship to the client, RLS governs what
 * it can touch. Session (access/refresh tokens) is persisted by the SDK
 * itself in localStorage under its own key, so login survives a page
 * refresh.
 *
 * Returns null (and logs) instead of throwing when env vars are missing, so
 * a misconfigured deploy shows a "not configured" message in the UI rather
 * than crashing the whole page render.
 */
let cached: SupabaseClient | null = null;
let warned = false;

export function supabaseBrowser(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is Supabase's newer name for this
  // key (replacing "anon key" in dashboards created after the rotation to
  // sb_publishable_... keys) — accept either so renaming in the dashboard
  // doesn't silently break auth.
  const publicKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publicKey) {
    if (!warned) {
      console.error(
        "Supabase browser client not configured: missing NEXT_PUBLIC_SUPABASE_URL or " +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) env vars. " +
          "Set them in Vercel and redeploy — NEXT_PUBLIC_ vars are inlined at build time."
      );
      warned = true;
    }
    return null;
  }

  cached = createClient(url, publicKey);
  return cached;
}
