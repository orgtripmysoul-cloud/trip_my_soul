import "server-only";
import { supabaseAdmin } from "./supabase";

export interface RateLimitResult {
  allowed: boolean;
  /** Only set when `allowed` is false. */
  retryAfterSeconds?: number;
}

/** Pure decision logic, mirroring evaluateSendRateLimit in src/lib/server/otp.ts, generalised across endpoints/keys. */
export function evaluateRateLimit(timestamps: string[], limit: number, windowMinutes: number, now: number = Date.now()): RateLimitResult {
  if (timestamps.length < limit) {
    return { allowed: true };
  }
  const oldest = [...timestamps].sort()[0];
  const retryAfterSeconds = Math.max(1, Math.ceil((new Date(oldest).getTime() + windowMinutes * 60_000 - now) / 1000));
  return { allowed: false, retryAfterSeconds };
}

/**
 * Rolling-window rate limit against `rate_limit_hits` (0015_custom_payments.sql),
 * keyed by an arbitrary string (an IP, an email, or "ip:email"). Call
 * `recordRateLimitHit` after this returns `allowed: true` and the request is
 * actually going to be processed.
 */
export async function checkRateLimit(endpoint: string, rateKey: string, limit: number, windowMinutes: number): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const { data } = await supabaseAdmin()
    .from("rate_limit_hits")
    .select("created_at")
    .eq("endpoint", endpoint)
    .eq("rate_key", rateKey)
    .gte("created_at", windowStart);

  const timestamps = (data ?? []).map((row) => row.created_at as string);
  return evaluateRateLimit(timestamps, limit, windowMinutes);
}

export async function recordRateLimitHit(endpoint: string, rateKey: string): Promise<void> {
  await supabaseAdmin().from("rate_limit_hits").insert({ endpoint, rate_key: rateKey });
}
