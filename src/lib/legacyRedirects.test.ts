import { describe, expect, it } from "vitest";

import { CANONICAL_TRIP_PATHS } from "@/data/trips";
import { isServedPath } from "@/test/servedPaths";

import { ARCHIVED_LEGACY_URLS } from "./__fixtures__/legacyUrls";
import { isLivePath, normalisePath, stripDocumentSuffix } from "./legacyPaths";
import { resolveLegacyRedirect } from "./legacyRedirects";

describe("normalisePath", () => {
  it("folds the casings, escapes and suffixes the old site served", () => {
    expect(normalisePath("/Himachal%20Pardesh/himachal-pardesh-112")).toBe(
      "/himachal pardesh/himachal-pardesh-112",
    );
    expect(normalisePath("/contact-us/index.html")).toBe("/contact-us");
    expect(normalisePath("/contact.html")).toBe("/contact");
    expect(normalisePath("/blogs/")).toBe("/blogs");
  });

  it("does not throw on a malformed escape sequence", () => {
    expect(() => normalisePath("/%E0%A4")).not.toThrow();
  });
});

describe("isLivePath", () => {
  it("claims the routes this app serves", () => {
    for (const path of ["/", "/treks", "/treks/kedarkantha-trek", "/trips/weekend/kerala", "/api/v1/public"]) {
      expect(isLivePath(path), path).toBe(true);
    }
  });

  it("does not claim a legacy path", () => {
    for (const path of ["/rupin-pass-trek", "/himachal-pradesh", "/trek/Kuari-pass-302"]) {
      expect(isLivePath(path), path).toBe(false);
    }
  });
});

describe("resolveLegacyRedirect", () => {
  it("sends an old flat trek URL to its /treks page", () => {
    expect(resolveLegacyRedirect("/rupin-pass-trek")).toBe("/treks/rupin-pass-trek");
  });

  it("adds the -trek suffix the old site left off", () => {
    expect(resolveLegacyRedirect("/har-ki-dun")).toBe("/treks/har-ki-dun-trek");
  });

  it("sends an old state URL to its region page", () => {
    expect(resolveLegacyRedirect("/himachal-pradesh")).toBe("/regions/himachal-pradesh");
    expect(resolveLegacyRedirect("/uttarakhand")).toBe("/regions/uttarakhand");
  });

  it("sends an old category listing to the nearest current listing", () => {
    expect(resolveLegacyRedirect("/weekend-getaways/weekend-gateway-104")).toBe("/weekend-trips");
    expect(
      resolveLegacyRedirect("/best-monsoon-treks-in-july,-august-and-september-2025/mansoon-treks-110"),
    ).toBe("/treks");
    expect(resolveLegacyRedirect("/spiritual-journey/Spirituals-Journey-101")).toBe("/yatra");
  });

  it("resolves a trailing numeric id against the catalogue", () => {
    expect(resolveLegacyRedirect("/trek/Kedarkantha-details-201")).toBe("/treks/kedarkantha-trek");
    expect(resolveLegacyRedirect("/trek/brahmatal-trek-110")).toBe("/treks/brahmatal-trek");
    expect(
      resolveLegacyRedirect("/uttarakhand/uttarakhand-110/kuari-pass-trek/Kuari-pass-302"),
    ).toBe("/treks/kuari-pass-trek");
  });

  it("matches a key whatever case the old site wrote it in", () => {
    expect(resolveLegacyRedirect("/trek/KEDARKANTHA-DETAILS-201")).toBe("/treks/kedarkantha-trek");
  });

  it("follows the catalogue's canonical choice rather than assuming /treks", () => {
    // `chopta-tungnath-trek` is a thin trek stub superseded by a full trip page;
    // a redirect landing on /treks/… would immediately redirect again.
    expect(resolveLegacyRedirect("/trek/Chopta-Tungnath-Trek-details-103")).toBe(
      CANONICAL_TRIP_PATHS["chopta-tungnath-trek"],
    );
  });

  it("sends a package we no longer sell to the section that covered it", () => {
    expect(resolveLegacyRedirect("/spiritual-journey/Spirituals-Journey-101/amarnath-yatra/Amarnath-yatra-6")).toBe(
      "/yatra",
    );
    expect(
      resolveLegacyRedirect("/upcoming-winter-treks/upcoming-winter-trek-102/chadar-trek/chadar-trek-22"),
    ).toBe("/treks");
  });

  it("falls back to the section in the path rather than the homepage", () => {
    expect(resolveLegacyRedirect("/mansoon-treks/mansoon-treks-110/some-trek-we-never-listed/xyz-999")).toBe(
      "/treks",
    );
  });

  it("redirects the old flat-file filenames to the page itself", () => {
    expect(resolveLegacyRedirect("/contact-us/index.html")).toBe("/contact-us");
    expect(resolveLegacyRedirect("/careers/index.html")).toBe("/careers");
    expect(resolveLegacyRedirect("/contact.html")).toBe("/contact-us");
  });

  it("maps the old policy and about spellings", () => {
    expect(resolveLegacyRedirect("/privacypolicy")).toBe("/policies/privacy-policy");
    expect(resolveLegacyRedirect("/termcondition")).toBe("/policies/terms-conditions");
    expect(resolveLegacyRedirect("/aboutus")).toBe("/about-us");
    expect(resolveLegacyRedirect("/about-us/core-values/index.html")).toBe("/about-us");
  });

  it("leaves a path neither site ever served alone, so it 404s honestly", () => {
    expect(resolveLegacyRedirect("/wp-admin")).toBeNull();
    expect(resolveLegacyRedirect("/some/random/path")).toBeNull();
  });

  it("never sends a recognised old URL to the homepage", () => {
    for (const url of ARCHIVED_LEGACY_URLS) {
      expect(resolveLegacyRedirect(url), url).not.toBe("/");
    }
  });

  // The point of the whole exercise: a 301 that lands on another 404 or another
  // redirect is worth no more to a crawler than the 404 it replaced.
  it("sends every archived URL to a page that returns 200", () => {
    const unresolved: string[] = [];

    for (const url of ARCHIVED_LEGACY_URLS) {
      // Mirrors the middleware's own guard. Checked against the *raw* path, not
      // the normalised one: `/contact-us/index.html` folds down to a live route
      // but is not itself served, and passing it through 404s it.
      if (isLivePath(url) && !stripDocumentSuffix(url)) {
        if (!isServedPath(url)) unresolved.push(`${url} (passed through, not served)`);
        continue;
      }

      const target = resolveLegacyRedirect(url);
      if (!target) {
        unresolved.push(`${url} -> no redirect`);
      } else if (!isServedPath(target)) {
        unresolved.push(`${url} -> ${target} (target not served)`);
      }
    }

    expect(unresolved).toEqual([]);
  });

  it("never redirects to another redirect", () => {
    for (const url of ARCHIVED_LEGACY_URLS) {
      const target = resolveLegacyRedirect(url);
      if (!target) continue;

      expect(resolveLegacyRedirect(target), `${url} -> ${target}`).toBeNull();

      // A /treks/<slug> target superseded by a trip page would be re-redirected
      // by the trek layout, costing a second hop.
      const trek = /^\/treks\/(.+)$/.exec(target);
      if (trek) expect(CANONICAL_TRIP_PATHS[trek[1]], `${url} -> ${target}`).toBeUndefined();
    }
  });
});
