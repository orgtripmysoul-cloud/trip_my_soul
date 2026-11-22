import type { NextConfig } from "next";
import path from "path";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// NEXT_PUBLIC_ vars are inlined into the browser bundle at build time, so a
// missing one can't be fixed by setting it later on a running deployment —
// only a rebuild picks it up. That makes "fail the build" the right place to
// catch this, rather than letting the login/signup pages silently render
// broken (see src/lib/supabase/client.ts, which still fails soft at runtime
// as a second line of defense for `next dev` and any path this check misses).
const REQUIRED_PUBLIC_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  // NEXT_PUBLIC_RAZORPAY_KEY_ID deliberately does NOT belong here, despite the
  // prefix. Nothing in the browser bundle reads it: it is read server-side via
  // env.publicRazorpayKeyId (src/lib/server/env.ts) inside force-dynamic API
  // routes and handed to the browser in the response body. So it is never
  // inlined at build time, setting it on a running deployment takes effect on
  // the next request, and gating the build on it only breaks deploys that
  // would otherwise work. Its absence is already caught at runtime by
  // required() in env.ts.
] as const;

function assertPublicEnvVars() {
  const missing = REQUIRED_PUBLIC_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length === 0) return;

  throw new Error(
    `\n\nBuild failed: missing required environment variable(s): ${missing.join(", ")}.\n` +
      "These are NEXT_PUBLIC_ vars baked into the browser bundle at build time — the " +
      "traveler login/signup pages cannot work without them, and setting them after this " +
      "build won't help without a rebuild.\n" +
      "Fix: add them in Vercel under Project Settings > Environment Variables (Production, " +
      "Preview, and Development), or in .env.local for a local build. See .env.example.\n"
  );
}

const NO_INDEX_HEADER = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Private surfaces must never be indexed. The header is the instruction that
  // also covers non-HTML responses (API JSON, CSV exports) where a <meta>
  // robots tag can't exist.
  async headers() {
    return [
      { source: "/api/:path*", headers: NO_INDEX_HEADER },
    ];
  },
};

export default (phase: string) => {
  // Only gate `next build` (what Vercel runs for every deployment, Production
  // and Preview alike) — not `next dev`, so working on unrelated pages
  // locally doesn't require a Supabase project to be configured.
  if (phase === PHASE_PRODUCTION_BUILD) {
    assertPublicEnvVars();
  }
  return nextConfig;
};
