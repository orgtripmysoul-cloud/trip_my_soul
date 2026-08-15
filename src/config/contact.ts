/**
 * Contact numbers, and which routes override the site-wide default.
 *
 * Keeping the mapping here means adding a campaign or category number is a
 * one-line change, rather than a conditional scattered through components.
 */

export interface ContactPhone {
  /** Human-readable, as shown in the UI. */
  display: string;
  /** E.164 form for `tel:` hrefs. */
  tel: string;
  /** Digits only, for `wa.me` links. */
  whatsapp: string;
}

export const DEFAULT_PHONE: ContactPhone = {
  display: "+91 81786 13438",
  tel: "+918178613438",
  whatsapp: "918178613438",
};

/** Weekend & backpacking trips are handled by a separate desk. */
export const TRIPS_PHONE: ContactPhone = {
  display: "+91-9121343330",
  tel: "+919121343330",
  whatsapp: "919121343330",
};

/** First matching entry wins. */
export const PHONE_BY_ROUTE_PREFIX: { prefixes: string[]; phone: ContactPhone }[] = [
  {
    prefixes: ["/weekend-trips", "/trips/weekend", "/backpacking-trips", "/trips/backpacking"],
    phone: TRIPS_PHONE,
  },
];

/**
 * Resolves the number for a route.
 *
 * Matches a prefix exactly or as a path segment, so `/weekend-trips` and
 * `/trips/weekend/ooty-coonoor` match while `/weekend-trips-archive` does not.
 */
export function getPhoneForPath(pathname: string | null | undefined): ContactPhone {
  if (!pathname) return DEFAULT_PHONE;
  const match = PHONE_BY_ROUTE_PREFIX.find(({ prefixes }) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
  return match?.phone ?? DEFAULT_PHONE;
}
