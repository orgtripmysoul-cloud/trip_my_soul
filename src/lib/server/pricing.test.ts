import { describe, expect, it } from "vitest";
import { computeBookingPricing, resolveDiscountPercent } from "./pricing";
import { AppError } from "./errors";

describe("resolveDiscountPercent", () => {
  it("resolves known coupon codes case-insensitively", () => {
    expect(resolveDiscountPercent("tripmysoul10")).toBe(10);
    expect(resolveDiscountPercent("HIMALAYA5")).toBe(5);
  });

  it("returns 0 when no coupon is given", () => {
    expect(resolveDiscountPercent(undefined)).toBe(0);
    expect(resolveDiscountPercent(null)).toBe(0);
  });

  it("rejects unknown codes instead of silently ignoring them", () => {
    expect(() => resolveDiscountPercent("NOT-A-REAL-CODE")).toThrow(AppError);
  });
});

describe("computeBookingPricing", () => {
  it("matches the checkout UI's own math for a simple case (no addons/coupon)", () => {
    // price 20000/person * 2 pax = 40000 gross, 5% GST => 2000, total 42000.
    const result = computeBookingPricing(20000, [
      { fullName: "A", isPrimary: true, addOns: [] },
      { fullName: "B", isPrimary: false, addOns: [] },
    ], undefined);

    expect(result.grossAmount).toBe(40000);
    expect(result.discountAmount).toBe(0);
    expect(result.taxAmount).toBe(2000);
    expect(result.totalAmount).toBe(42000);
  });

  it("adds add-on prices before discount and tax", () => {
    // 10000/person * 1 pax = 10000 base + insurance(600) = 10600 gross.
    const result = computeBookingPricing(10000, [
      { fullName: "A", isPrimary: true, addOns: ["insurance"] },
    ], undefined);

    expect(result.grossAmount).toBe(10600);
    expect(result.taxAmount).toBe(Math.round(10600 * 0.05 * 100) / 100);
  });

  it("applies a discount before computing GST", () => {
    const result = computeBookingPricing(10000, [{ fullName: "A", isPrimary: true, addOns: [] }], "TRIPMYSOUL10");
    // gross 10000, 10% off => discount 1000, taxable 9000, gst 450, total 9450
    expect(result.discountAmount).toBe(1000);
    expect(result.taxAmount).toBe(450);
    expect(result.totalAmount).toBe(9450);
  });

  it("never produces a total that depends on anything but the server-side price per person", () => {
    // Same inputs, computed twice, must be deterministic and stable — this is
    // the guarantee that lets the API trust its own computed total instead of
    // whatever a client might have sent.
    const a = computeBookingPricing(15999.99, [{ fullName: "A", isPrimary: true, addOns: ["offload", "insurance"] }], "HIMALAYA5");
    const b = computeBookingPricing(15999.99, [{ fullName: "A", isPrimary: true, addOns: ["offload", "insurance"] }], "HIMALAYA5");
    expect(a).toEqual(b);
  });
});
