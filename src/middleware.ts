import { NextResponse, type NextRequest } from "next/server";

import { isLivePath, stripDocumentSuffix } from "@/lib/legacyPaths";

/**
 * Two jobs, both about URLs Google still holds that this app no longer serves.
 *
 * 1. `/checkout?slug=<slug>` — indexed and still linked, so a search visitor
 *    lands on a payment form for a trip they have not read about yet.
 *    Deindexing is under way (see `src/app/robots.ts` and
 *    `src/app/checkout/layout.tsx`) but takes weeks, so until the links age out
 *    we send those visitors to the detail page the slug actually describes.
 *    Only a *bare* visit is redirected; anything carrying a booking marker —
 *    what Book Now sends — passes straight through untouched. 302, because the
 *    rule goes away once the old URLs drop out of the index.
 *
 * 2. Every URL shape of the previous tripmysoul.in — `/rupin-pass-trek`,
 *    `/himachal-pradesh`, `/weekend-getaways/weekend-gateway-104`,
 *    `/trek/Kedarkantha-details-201` and the rest. Those are permanently gone,
 *    so they 301 to wherever the package or section lives now, and the link
 *    equity transfers. See `src/lib/legacyRedirects.ts` for the inventory.
 *
 * Node runtime: the catalogue both resolve against is far too large for the
 * edge bundle. It is imported lazily and only after `isLivePath` has ruled out
 * the request, so a visit to a page this app actually serves never pays for it.
 */
export const config = {
  matcher: [
    /*
     * Everything except Next's own assets and the files served from /public.
     * A legacy URL can be at any depth, so the matcher cannot enumerate paths —
     * `isLivePath` is what keeps the work off live routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|css|js|woff2?|ttf|mp4|pdf)$).*)",
  ],
  runtime: "nodejs",
};

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/checkout") {
    const { hasBookingSelection, resolveDetailPath } = await import("@/lib/detailPath");

    if (hasBookingSelection(searchParams)) {
      return NextResponse.next();
    }

    // `trek` is the legacy spelling checkout still accepts for `slug`.
    const slug = searchParams.get("slug") ?? searchParams.get("trek");
    const destination = resolveDetailPath(slug) ?? "/";

    return NextResponse.redirect(new URL(destination, request.nextUrl), 302);
  }

  // `.html` never belongs to a live route, so a path carrying one still needs
  // the lookup even when it folds down to a page this app serves.
  if (isLivePath(pathname) && !stripDocumentSuffix(pathname)) {
    return NextResponse.next();
  }

  const { resolveLegacyRedirect } = await import("@/lib/legacyRedirects");

  const destination = resolveLegacyRedirect(pathname);
  if (!destination) {
    // Not a URL the old site served either — let it 404 honestly rather than
    // dumping an unrelated visitor on a listing page.
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(destination, request.nextUrl), 301);
}
