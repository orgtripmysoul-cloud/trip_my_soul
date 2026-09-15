import "server-only";
import { TREKS, WILDLIFE, YATRAS, type Trek } from "@/data/db";
import { ALL_TRIPS, tripToTrek } from "@/data/trips";
import { AppError } from "./errors";

export interface ResolvedCatalogTrek {
  slug: string;
  name: string;
  /** Authoritative per-person price, in INR rupees. `null` = "on request" (not payable online yet). */
  price: number | null;
  durationDays: number;
  region: string;
  difficulty: string;
}

/**
 * Resolves a trek/trip by slug against the static catalogue — the same
 * lookup src/app/checkout/page.tsx already does client-side. This is the
 * server's only source of truth for name/price; a client-sent price is
 * never used for anything.
 */
export function resolveCatalogTrek(slug: string): ResolvedCatalogTrek {
  const fromCatalogue = [...TREKS, ...YATRAS, ...WILDLIFE].find((t) => t.slug === slug);
  const trek: Trek | null = fromCatalogue ?? (() => {
    const fromTrips = ALL_TRIPS.find((t) => t.slug === slug);
    return fromTrips ? tripToTrek(fromTrips) : null;
  })();

  if (!trek) {
    throw new AppError("NOT_FOUND", "We could not find a package matching this link.");
  }

  const days = typeof trek.days === "number" ? trek.days : parseInt(String(trek.days ?? "5"), 10) || 5;

  return {
    slug: trek.slug,
    name: trek.name,
    price: trek.price,
    durationDays: days,
    region: trek.region,
    difficulty: trek.difficulty,
  };
}
