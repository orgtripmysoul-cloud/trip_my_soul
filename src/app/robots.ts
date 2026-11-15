import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // TEMPORARY (added 2026-10-06): `/checkout` and `/pay` are deliberately
      // absent from this list.
      //
      // They were disallowed, which is why `/checkout?slug=...` URLs were still
      // indexed and showing as sitelinks: a disallowed URL is never fetched, so
      // Google never read the page and fell back to the inherited homepage
      // title and canonical. Blocking a URL does not deindex it — only a
      // noindex tag Google is allowed to see does.
      //
      // Both routes now serve `noindex, nofollow` (see their layout.tsx).
      // Leaving them crawlable lets Google fetch, read the tag and drop them.
      //
      // RESTORE once Search Console shows zero indexed /checkout and /pay URLs
      // (expect a few weeks). Re-add "/checkout" and "/pay" below, and delete
      // this comment. Keep the noindex tags either way — they are the real
      // instruction; the Disallow is only a crawl-budget saving.
      disallow: [
        "/auth",
        "/dashboard",
        "/login",
        "/signup",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
