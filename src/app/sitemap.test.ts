import { describe, expect, it } from "vitest";

import { SITE_URL } from "@/lib/seo";
import { isLivePath } from "@/lib/legacyPaths";
import { resolveLegacyRedirect } from "@/lib/legacyRedirects";
import { isServedPath } from "@/test/servedPaths";

import sitemap from "./sitemap";

const paths = () => sitemap().map((entry) => String(entry.url).replace(SITE_URL, ""));

describe("sitemap", () => {
  it("advertises only URLs that return 200", () => {
    const broken = paths().filter((path) => !isServedPath(path));
    expect(broken).toEqual([]);
  });

  it("advertises nothing the middleware would redirect", () => {
    // A sitemap entry that 301s wastes a crawl and tells Google the sitemap is
    // stale — the two have to agree.
    const redirected = paths().filter(
      (path) => !isLivePath(path) || resolveLegacyRedirect(path) !== null,
    );
    expect(redirected).toEqual([]);
  });

  it("lists every URL once", () => {
    const all = paths();
    expect(all.length).toBe(new Set(all).size);
  });

  it("uses the canonical origin, with no trailing slash on a path", () => {
    for (const entry of sitemap()) {
      const url = String(entry.url);
      expect(url.startsWith(`${SITE_URL}/`), url).toBe(true);
      expect(url === `${SITE_URL}/` || !url.endsWith("/"), url).toBe(true);
    }
  });
});
