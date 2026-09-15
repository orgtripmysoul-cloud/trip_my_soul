import "server-only";
import type { NextRequest } from "next/server";

/** Best-effort client IP from the reverse-proxy header Vercel/most CDNs set. Never trust this for anything beyond abuse-rate-limiting. */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
