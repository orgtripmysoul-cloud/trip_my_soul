import { describe, expect, it } from "vitest";

import { TREKS, WILDLIFE, YATRAS } from "@/data/db";
import { ALL_TRIPS, CANONICAL_TRIP_PATHS } from "@/data/trips";
import { hasBookingSelection, resolveDetailPath } from "./detailPath";

describe("resolveDetailPath", () => {
  it("sends a trek slug to its trek page", () => {
    expect(resolveDetailPath("spiti-valley")).toBe("/treks/spiti-valley");
  });

  it("returns null for a slug no catalogue claims", () => {
    expect(resolveDetailPath("does-not-exist")).toBeNull();
  });

  it("sends a retired slug to the listing that absorbed it", () => {
    expect(resolveDetailPath("spiti-valley-yatra")).toBe("/treks/spiti-valley");
  });

  it("returns null for a missing slug", () => {
    expect(resolveDetailPath(null)).toBeNull();
    expect(resolveDetailPath("")).toBeNull();
  });

  it("prefers the canonical trip page over a thin trek duplicate", () => {
    for (const [slug, path] of Object.entries(CANONICAL_TRIP_PATHS)) {
      expect(resolveDetailPath(slug)).toBe(path);
    }
  });

  it("sends a trip-only slug to its own route", () => {
    const tripOnly = ALL_TRIPS.find(
      (t) => ![...TREKS, ...YATRAS, ...WILDLIFE].some((c) => c.slug === t.slug)
    );
    expect(tripOnly).toBeDefined();
    expect(resolveDetailPath(tripOnly!.slug)).toBe(tripOnly!.detailsPath);
  });

  // The whole point of the redirect is that it never lands on a "not found"
  // page, so every slug checkout can resolve must map to a real route.
  it("resolves every slug checkout accepts", () => {
    const slugs = [
      ...[...TREKS, ...YATRAS, ...WILDLIFE].map((t) => t.slug),
      ...ALL_TRIPS.map((t) => t.slug),
    ];
    for (const slug of slugs) {
      expect(resolveDetailPath(slug), slug).toMatch(/^\/(treks|trips)\//);
    }
  });
});

describe("hasBookingSelection", () => {
  it("is false for a bare search-engine link", () => {
    expect(hasBookingSelection(new URLSearchParams("slug=spiti-valley"))).toBe(false);
    expect(hasBookingSelection(new URLSearchParams(""))).toBe(false);
  });

  it("is false when a marker is present but empty", () => {
    expect(hasBookingSelection(new URLSearchParams("slug=spiti-valley&batch="))).toBe(false);
  });

  it("is true for what Book Now sends", () => {
    expect(
      hasBookingSelection(new URLSearchParams("slug=spiti-valley&step=book&batch=06%20Aug&price=100"))
    ).toBe(true);
  });
});
