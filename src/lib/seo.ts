import type { Metadata } from "next";

/**
 * Canonical origin, `www` included: the apex 308-redirects to `www`, so every
 * URL we hand a crawler has to carry the host it will actually land on —
 * otherwise each crawl pays for a redirect hop.
 *
 * Single source of truth for the site's origin. `sitemap.ts`, `robots.ts` and
 * the root layout's Organization JSON-LD all read it from here.
 */
export const SITE_URL = "https://www.tripmysoul.in";

export const SITE_NAME = "TripMySoul";

/** Appended to page titles so every tab and SERP entry carries the brand. */
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Google truncates snippets around 155 characters, so trim to the last whole
 * word before that rather than letting it cut mid-word in the SERP.
 */
export function clampDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export interface PageSeo {
  /** Without the brand suffix — `buildMetadata` appends it. */
  title: string;
  description: string;
  /** Route path, leading slash, no origin. Becomes the canonical URL. */
  path: string;
  /** Absolute or root-relative image for social previews. */
  image?: string;
  /** Articles render as `article` so social cards show the byline slot. */
  type?: "website" | "article";
}

/**
 * Builds the per-page metadata every route needs: a unique title, a clamped
 * description, a self-referencing canonical, and matching OpenGraph tags.
 *
 * The canonical matters most here — without one, near-identical listing pages
 * compete with each other and Google picks a winner on its own.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const clamped = clampDescription(description);

  return {
    title: `${title}${TITLE_SUFFIX}`,
    description: clamped,
    alternates: { canonical: url },
    openGraph: {
      title: `${title}${TITLE_SUFFIX}`,
      description: clamped,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
