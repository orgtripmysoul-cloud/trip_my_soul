"use client";

import type { CreateLeadRequest, CreateLeadResponse, LeadUtm } from "@/lib/types/crm";

/**
 * Reads campaign attribution from the current URL.
 *
 * Also persists it to sessionStorage: a visitor usually lands on an ad URL,
 * browses a few treks, and only then fills a form — by which point the utm_*
 * parameters are long gone from the address bar. Without this, every paid
 * lead would be attributed to "direct" and the source-ROI report would be
 * meaningless.
 */
export function captureUtm(): LeadUtm {
  if (typeof window === "undefined") return {};

  const KEY = "tms_utm";
  const params = new URLSearchParams(window.location.search);
  const fromUrl: LeadUtm = {};

  const map: Record<string, keyof LeadUtm> = {
    utm_source: "source",
    utm_medium: "medium",
    utm_campaign: "campaign",
    utm_term: "term",
    utm_content: "content",
    gclid: "gclid",
    fbclid: "fbclid",
  };

  for (const [param, key] of Object.entries(map)) {
    const value = params.get(param);
    if (value) fromUrl[key] = value.slice(0, 200);
  }

  try {
    if (Object.keys(fromUrl).length > 0) {
      window.sessionStorage.setItem(KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = window.sessionStorage.getItem(KEY);
    return stored ? (JSON.parse(stored) as LeadUtm) : {};
  } catch {
    // Private mode or blocked storage — attribution is best-effort, never a
    // reason to stop someone submitting an enquiry.
    return fromUrl;
  }
}

export function currentLandingPage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.pathname}${window.location.search}`.slice(0, 500);
}

export async function submitLead(body: CreateLeadRequest): Promise<CreateLeadResponse> {
  const res = await fetch("/api/v1/public/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      utm: body.utm ?? captureUtm(),
      landingPage: body.landingPage ?? currentLandingPage(),
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? "Could not send your enquiry. Please try again.");
  }
  return data as CreateLeadResponse;
}
