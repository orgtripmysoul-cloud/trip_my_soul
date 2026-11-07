import { describe, expect, it } from "vitest";
import {
  channelFromLeadSource,
  classifyChannel,
  istMonthStart,
  istStartOfDay,
  normalisePath,
  sanitizeAttribution,
} from "./attribution";

describe("classifyChannel", () => {
  it("treats no referrer and no tags as direct, including internal navigation", () => {
    expect(classifyChannel(undefined)).toBe("direct");
    expect(classifyChannel({})).toBe("direct");
    expect(classifyChannel({ referrer: "https://www.tripmysoul.in/treks" })).toBe("direct");
  });

  it("detects organic search engines by referrer, including country domains", () => {
    expect(classifyChannel({ referrer: "https://www.google.com/" })).toBe("organic_search");
    expect(classifyChannel({ referrer: "https://www.google.co.in/" })).toBe("organic_search");
    expect(classifyChannel({ referrer: "https://www.bing.com/search" })).toBe("organic_search");
    expect(classifyChannel({ referrer: "https://duckduckgo.com/" })).toBe("organic_search");
    expect(classifyChannel({ referrer: "https://mygoogle.com/" })).toBe("referral");
  });

  it("detects paid search from click IDs and paid mediums", () => {
    expect(classifyChannel({ utm: { gclid: "abc" }, referrer: "https://www.google.com/" })).toBe("paid_search");
    expect(classifyChannel({ utm: { gbraid: "x" } })).toBe("paid_search");
    expect(classifyChannel({ utm: { source: "google", medium: "cpc" } })).toBe("paid_search");
  });

  it("separates paid social from organic social", () => {
    expect(classifyChannel({ utm: { source: "instagram", medium: "cpc" } })).toBe("paid_social");
    expect(classifyChannel({ utm: { source: "facebook", medium: "paid_social" } })).toBe("paid_social");
    expect(classifyChannel({ referrer: "https://l.instagram.com/" })).toBe("organic_social");
    expect(classifyChannel({ referrer: "https://lm.facebook.com/l.php" })).toBe("organic_social");
    expect(classifyChannel({ utm: { fbclid: "abc" } })).toBe("organic_social");
    expect(classifyChannel({ utm: { source: "instagram", medium: "bio" } })).toBe("organic_social");
  });

  it("detects WhatsApp, email and generic referrals", () => {
    expect(classifyChannel({ referrer: "https://web.whatsapp.com/" })).toBe("whatsapp");
    expect(classifyChannel({ utm: { source: "whatsapp" } })).toBe("whatsapp");
    expect(classifyChannel({ utm: { source: "mailchimp", medium: "email" } })).toBe("email");
    expect(classifyChannel({ referrer: "https://mail.google.com/" })).toBe("email");
    expect(classifyChannel({ referrer: "https://www.tripadvisor.in/x" })).toBe("referral");
    expect(classifyChannel({ utm: { source: "partner-blog" } })).toBe("referral");
  });
});

describe("channelFromLeadSource", () => {
  it("maps staff-entered sources", () => {
    expect(channelFromLeadSource("phone_call")).toBe("offline");
    expect(channelFromLeadSource("google_ads")).toBe("paid_search");
    expect(channelFromLeadSource("whatsapp")).toBe("whatsapp");
    expect(channelFromLeadSource("website_form")).toBe("unknown");
  });
});

describe("sanitizeAttribution", () => {
  it("keeps valid fields and strips query strings from referrers", () => {
    const clean = sanitizeAttribution({
      touch: {
        referrer: "https://www.google.com/search?q=private",
        landingPage: "/treks/kedarkantha?utm_source=x",
        utm: { source: "x", evil: "drop me" },
        at: "2026-11-07T10:00:00.000Z",
      },
      conversionPage: "/contact-us",
    });
    expect(clean.touch?.referrer).toBe("https://www.google.com/search");
    expect(clean.touch?.landingPage).toBe("/treks/kedarkantha?utm_source=x");
    expect(clean.touch?.utm).toEqual({ source: "x" });
    expect(clean.conversionPage).toBe("/contact-us");
  });

  it("rejects non-path pages, script URLs and garbage", () => {
    const clean = sanitizeAttribution({
      touch: { referrer: "javascript:alert(1)", landingPage: "https://evil.example/x" },
      conversionPage: "//evil.example",
    });
    expect(clean.touch).toBeUndefined();
    expect(clean.conversionPage).toBeUndefined();
    expect(sanitizeAttribution("nonsense")).toEqual({});
    expect(sanitizeAttribution(null)).toEqual({});
  });
});

describe("normalisePath", () => {
  it("groups pages by path", () => {
    expect(normalisePath("/treks/kedarkantha/?utm_source=x#faq")).toBe("/treks/kedarkantha");
    expect(normalisePath("/")).toBe("/");
    expect(normalisePath(null)).toBe("(not recorded)");
  });
});

describe("IST calendar boundaries", () => {
  it("starts the day at midnight India time, not UTC", () => {
    // 2026-11-07 01:00 IST == 2026-11-06 19:30 UTC — still Nov 7 in India.
    const start = istStartOfDay(new Date("2026-11-06T19:30:00.000Z"));
    expect(start.toISOString()).toBe("2026-11-06T18:30:00.000Z");
  });

  it("computes month starts in India time", () => {
    const now = new Date("2026-11-30T20:00:00.000Z"); // 1 Dec 01:30 IST
    expect(istMonthStart(0, now).toISOString()).toBe("2026-11-30T18:30:00.000Z");
    expect(istMonthStart(-1, now).toISOString()).toBe("2026-10-31T18:30:00.000Z");
  });
});
