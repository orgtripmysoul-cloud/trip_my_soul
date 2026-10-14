/**
 * Path normalisation and the "this app serves it" guard, kept deliberately free
 * of any data import so the middleware can run it on every request. The
 * catalogue-backed lookup in `./legacyRedirects` is loaded only once this has
 * ruled a request out.
 */

/**
 * Routes with children — a dynamic segment, or a whole sub-tree. Everything
 * beneath them belongs to this app, so `/treks/<anything>` is live even when
 * the slug is unknown (the route itself answers, with a 404).
 */
const LIVE_SUBTREES = [
  "/treks",
  "/trips",
  "/regions",
  "/blogs",
  "/policies",
  "/pay",
  "/admin",
  "/auth",
  "/api",
  "/dashboard",
];

/**
 * Leaf pages: this app serves the path itself and nothing under it. The
 * distinction matters — the old site had `/about-us/core-values`, and treating
 * `/about-us` as a sub-tree would pass that through to a 404 instead of
 * redirecting it.
 */
const LIVE_PAGES = [
  "/weekend-trips",
  "/backpacking-trips",
  "/south-trips",
  "/premium-trips",
  "/yatra",
  "/about-us",
  "/contact-us",
  "/careers",
  "/compare-treks",
  "/corporate-expeditions",
  "/heal-himala",
  "/learning-programs",
  "/summer-camps",
  "/suggest-a-trek",
  "/updates",
  "/store",
  "/rent",
  "/cabs",
  "/checkout",
  "/login",
  "/signup",
];

/**
 * Lower-cased, de-escaped, extension-free and without a trailing slash. The old
 * site served the same page under several casings and as both `/x` and
 * `/x/index.html`, so everything is folded together before any lookup.
 */
export function normalisePath(pathname: string): string {
  let path = pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    // A malformed escape sequence is not a URL we ever served; match on the raw
    // form rather than throwing out of the middleware.
  }
  path = path.replace(/\/index\.html$/i, "").replace(/\.html?$/i, "");
  path = path.replace(/\/+$/, "");
  return path.toLowerCase();
}

/**
 * The old site served flat files, so half its pages are archived as
 * `/contact-us/index.html` and `/contact.html`. This app serves neither, and
 * the extension survives `isLivePath` folding the path down to a live route —
 * so the suffix has to be detected on its own and redirected away.
 *
 * Unlike `normalisePath` this preserves case: `/pay/<token>` and the API routes
 * are case-sensitive, and this result is used as a redirect target.
 *
 * Returns `null` when there is no such suffix to strip.
 */
export function stripDocumentSuffix(pathname: string): string | null {
  const stripped = pathname.replace(/\/index\.html?$/i, "").replace(/\.html?$/i, "");
  if (stripped === pathname) return null;
  return stripped === "" ? "/" : stripped;
}

/** True when this app serves the path itself and no legacy lookup should run. */
export function isLivePath(pathname: string): boolean {
  const path = normalisePath(pathname);
  if (path === "" || path === "/") return true;
  if (LIVE_PAGES.includes(path)) return true;
  return LIVE_SUBTREES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
