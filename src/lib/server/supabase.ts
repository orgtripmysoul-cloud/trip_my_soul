import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Service-role Supabase client. Server-only — never import this module (or
 * re-export its client) from a client component. It bypasses RLS entirely,
 * which is why all business mutations go through the RPC functions in
 * supabase/migrations/0007_functions_triggers.sql rather than raw table
 * writes from route handlers.
 */
let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  cached = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
