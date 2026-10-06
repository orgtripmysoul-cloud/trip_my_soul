import { NextResponse, type NextRequest } from "next/server";

/**
 * Google indexed `/checkout?slug=<slug>` URLs and still links to them, so a
 * search visitor lands on a payment form for a trip they have not read about
 * yet. Deindexing is under way (see `src/app/robots.ts` and
 * `src/app/checkout/layout.tsx`) but takes weeks, so until the links age out
 * we send those visitors to the detail page the slug actually describes.
 *
 * Only a *bare* visit is redirected. Anything carrying a booking marker — what
 * Book Now sends — is passed straight through to the checkout flow untouched.
 *
 * Node runtime: the catalogue this resolves against is far too large for the
 * edge bundle, and it is pulled in lazily so only a redirected request pays
 * for loading it.
 */
export const config = {
  matcher: "/checkout",
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const { hasBookingSelection, resolveDetailPath } = await import("@/lib/detailPath");

  if (hasBookingSelection(searchParams)) {
    return NextResponse.next();
  }

  // `trek` is the legacy spelling checkout still accepts for `slug`.
  const slug = searchParams.get("slug") ?? searchParams.get("trek");
  const destination = resolveDetailPath(slug) ?? "/";

  return NextResponse.redirect(new URL(destination, request.nextUrl), 302);
}
