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
  // Canonical name in this codebase: NEXT_PUBLIC_SUPABASE_ANON_KEY. Newer
  // Supabase dashboards label this same value "publishable key" instead of
  // "anon key" — it's the same key, just paste it in under this var name
  // (see .env.example / README), not a second key to support here.
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (!warned) {
      console.error(
        "Supabase browser client not configured: missing NEXT_PUBLIC_SUPABASE_URL or " +
          "NEXT_PUBLIC_SUPABASE_ANON_KEY env vars. Set them in Vercel and redeploy — " +
          "NEXT_PUBLIC_ vars are inlined at build time. See .env.example."
      );
      warned = true;
    }
    return null;
  }

  cached = createClient(url, anonKey);
  return cached;
}
