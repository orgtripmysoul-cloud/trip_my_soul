import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the traveler auth portal. Uses the public
 * anon key only — safe to ship to the client, RLS governs what it can touch.
 * Session (access/refresh tokens) is persisted by the SDK itself in
 * localStorage under its own key, so login survives a page refresh.
 */
let cached: ReturnType<typeof createClient> | null = null;

export function supabaseBrowser() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
    );
  }

  cached = createClient(url, anonKey);
  return cached;
}
