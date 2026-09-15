import { describe, expect, it } from "vitest";
import { hashRequestBody } from "./idempotency";

describe("hashRequestBody", () => {
  it("is deterministic for the same body", () => {
    const body = { trekSlug: "valley-of-flowers-trek", pax: 2 };
    expect(hashRequestBody(body)).toBe(hashRequestBody(body));
  });

  it("differs when the body differs — this is what turns DUPLICATE_REQUEST into a real check", () => {
    const a = hashRequestBody({ trekSlug: "x", pax: 1 });
    const b = hashRequestBody({ trekSlug: "x", pax: 2 });
    expect(a).not.toBe(b);
  });
});
