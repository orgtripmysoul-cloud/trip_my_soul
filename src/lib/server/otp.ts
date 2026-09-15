import "server-only";
import crypto from "node:crypto";
import { supabaseAdmin } from "./supabase";
import { env } from "./env";

export const OTP_CODE_TTL_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_VERIFIED_TTL_MINUTES = 30;

export const OTP_SEND_LIMIT = 3;
export const OTP_SEND_WINDOW_MINUTES = 15;

const PURPOSE = "booking";

/** Cryptographically random 6-digit code, zero-padded (e.g. "004821" is valid). */
export function generateOtpCode(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/**
 * HMAC-SHA256 of the code, salted with email+purpose so the same hash can
 * never be replayed against a different email, and with a server secret so a
 * DB read alone can't be brute-forced offline into the plaintext code.
 */
export function hashOtpCode(email: string, purpose: string, code: string): string {
  return crypto
    .createHmac("sha256", env.emailVerificationSecret)
    .update(`${email.toLowerCase()}:${purpose}:${code}`)
    .digest("hex");
}

export function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export interface RateLimitResult {
  allowed: boolean;
  /** Only set when `allowed` is false. */
  retryAfterSeconds?: number;
}

/**
 * Pure decision logic for the send rate limit: given the send timestamps
 * already recorded in the last OTP_SEND_WINDOW_MINUTES for this email and for
 * this IP, is a new send allowed? The stricter (first to hit the limit) of
 * the two wins.
 */
export function evaluateSendRateLimit(emailTimestamps: string[], ipTimestamps: string[], now: number = Date.now()): RateLimitResult {
  const limitedRows = [emailTimestamps, ipTimestamps].filter((rows) => rows.length >= OTP_SEND_LIMIT);
  if (limitedRows.length === 0) {
    return { allowed: true };
  }

  const oldestAcrossLimited = limitedRows.map((rows) => [...rows].sort()[0]).sort()[0];
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((new Date(oldestAcrossLimited).getTime() + OTP_SEND_WINDOW_MINUTES * 60_000 - now) / 1000)
  );
  return { allowed: false, retryAfterSeconds };
}

interface SendRow {
  created_at: string;
}

/** Checks the rolling 15-minute window for both the email and the IP. */
export async function checkSendRateLimit(email: string, ip: string): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - OTP_SEND_WINDOW_MINUTES * 60_000).toISOString();
  const db = supabaseAdmin();

  const [byEmail, byIp] = await Promise.all([
    db.from("email_verification_sends").select("created_at").eq("email", email.toLowerCase()).gte("created_at", windowStart),
    db.from("email_verification_sends").select("created_at").eq("ip", ip).gte("created_at", windowStart),
  ]);

  const emailTimestamps = ((byEmail.data ?? []) as SendRow[]).map((row) => row.created_at);
  const ipTimestamps = ((byIp.data ?? []) as SendRow[]).map((row) => row.created_at);

  return evaluateSendRateLimit(emailTimestamps, ipTimestamps);
}

export async function recordSendAttempt(email: string, ip: string): Promise<void> {
  await supabaseAdmin()
    .from("email_verification_sends")
    .insert({ email: email.toLowerCase(), ip });
}

/** Creates a new OTP row for `email` and returns the plaintext code to send — never persisted in the clear. */
export async function createEmailVerificationCode(email: string): Promise<string> {
  const code = generateOtpCode();
  const codeHash = hashOtpCode(email, PURPOSE, code);
  const expiresAt = new Date(Date.now() + OTP_CODE_TTL_MINUTES * 60_000).toISOString();

  const { error } = await supabaseAdmin().from("email_verifications").insert({
    email: email.toLowerCase(),
    purpose: PURPOSE,
    code_hash: codeHash,
    expires_at: expiresAt,
    max_attempts: OTP_MAX_ATTEMPTS,
  });
  if (error) throw new Error(error.message);

  return code;
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; reason: "no_active_code" | "too_many_attempts" | "incorrect_code" };

export interface OtpRow {
  consumedAt: string | null;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  codeHash: string;
}

/** A row is a live candidate to verify against only if unconsumed and not yet expired. */
export function isOtpRowActive(row: Pick<OtpRow, "consumedAt" | "expiresAt">, now: number = Date.now()): boolean {
  return row.consumedAt === null && new Date(row.expiresAt).getTime() > now;
}

/**
 * Pure decision logic for one verification attempt against the latest OTP
 * row for an email (or `null` if none exists / it was already consumed).
 * Handles expiry, the attempts ceiling, and the constant-time code compare —
 * all without touching the database, so "expired", "exhausted" and
 * "wrong code" are each directly testable.
 */
export function evaluateOtpAttempt(row: OtpRow | null, expectedHash: string, now: number = Date.now()): VerifyOtpResult {
  if (!row || !isOtpRowActive(row, now)) {
    return { ok: false, reason: "no_active_code" };
  }
  if (row.attempts >= row.maxAttempts) {
    return { ok: false, reason: "too_many_attempts" };
  }
  if (!constantTimeEqual(row.codeHash, expectedHash)) {
    const exhausted = row.attempts + 1 >= row.maxAttempts;
    return { ok: false, reason: exhausted ? "too_many_attempts" : "incorrect_code" };
  }
  return { ok: true };
}

interface VerificationDbRow {
  id: string;
  code_hash: string;
  attempts: number;
  max_attempts: number;
  expires_at: string;
  consumed_at: string | null;
}

/** Verifies `code` against the latest unconsumed code for `email`, applying `evaluateOtpAttempt`, then persists the outcome. */
export async function verifyEmailCode(email: string, code: string): Promise<VerifyOtpResult> {
  const db = supabaseAdmin();

  const { data } = await db
    .from("email_verifications")
    .select("id, code_hash, attempts, max_attempts, expires_at, consumed_at")
    .eq("email", email.toLowerCase())
    .eq("purpose", PURPOSE)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  const dbRow = (data ?? [])[0] as VerificationDbRow | undefined;
  const row: OtpRow | null = dbRow
    ? {
        consumedAt: dbRow.consumed_at,
        expiresAt: dbRow.expires_at,
        attempts: dbRow.attempts,
        maxAttempts: dbRow.max_attempts,
        codeHash: dbRow.code_hash,
      }
    : null;

  const expectedHash = hashOtpCode(email, PURPOSE, code);
  const result = evaluateOtpAttempt(row, expectedHash);

  if (!dbRow) {
    return result;
  }

  if (result.ok) {
    const verifiedUntil = new Date(Date.now() + OTP_VERIFIED_TTL_MINUTES * 60_000).toISOString();
    await db.from("email_verifications").update({ consumed_at: new Date().toISOString(), verified_until: verifiedUntil }).eq("id", dbRow.id);
  } else if (result.reason !== "no_active_code") {
    const attempts = dbRow.attempts + 1;
    const exhausted = result.reason === "too_many_attempts";
    await db
      .from("email_verifications")
      .update(exhausted ? { attempts, expires_at: new Date().toISOString() } : { attempts })
      .eq("id", dbRow.id);
  }

  return result;
}
