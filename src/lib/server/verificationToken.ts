import "server-only";
import crypto from "node:crypto";
import { env } from "./env";

const PURPOSE = "booking" as const;

interface TokenPayload {
  email: string;
  purpose: typeof PURPOSE;
  exp: number;
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function sign(payload: string): string {
  return base64url(crypto.createHmac("sha256", env.emailVerificationSecret).update(payload).digest());
}

/** Issues a signed, stateless token proving `email` completed OTP verification within the last `ttlMinutes`. */
export function issueVerificationToken(email: string, ttlMinutes: number): string {
  const payload: TokenPayload = { email: email.toLowerCase(), purpose: PURPOSE, exp: Date.now() + ttlMinutes * 60_000 };
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/** Verifies a token was issued by us, is unexpired, and matches `email`. Returns false on any mismatch — never throws. */
export function verifyVerificationToken(token: string | undefined | null, email: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [encodedPayload, signature] = parts;

  const expectedSignature = sign(encodedPayload);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (signatureBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(signatureBuf, expectedBuf)) {
    return false;
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  } catch {
    return false;
  }

  if (payload.purpose !== PURPOSE) return false;
  if (payload.email !== email.toLowerCase()) return false;
  if (typeof payload.exp !== "number" || payload.exp < Date.now()) return false;

  return true;
}
