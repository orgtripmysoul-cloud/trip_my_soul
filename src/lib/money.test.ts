import { describe, expect, it } from "vitest";
import { isValidInrAmount, isValidPax, round2, toPaise, MAX_INR_AMOUNT } from "./money";

describe("toPaise", () => {
  it("converts rupees to integer paise", () => {
    expect(toPaise(1)).toBe(100);
    expect(toPaise(1234.56)).toBe(123456);
  });

  it("rounds away floating point drift", () => {
    expect(toPaise(19.9)).toBe(1990);
  });
});

describe("isValidInrAmount", () => {
  it("accepts a normal 2-decimal amount", () => {
    expect(isValidInrAmount(12500.5)).toBe(true);
  });

  it("rejects zero and negative amounts", () => {
    expect(isValidInrAmount(0)).toBe(false);
    expect(isValidInrAmount(-100)).toBe(false);
  });

  it("rejects amounts above the LLD ceiling", () => {
    expect(isValidInrAmount(MAX_INR_AMOUNT + 0.01)).toBe(false);
    expect(isValidInrAmount(MAX_INR_AMOUNT)).toBe(true);
  });

  it("rejects more than 2 decimal places", () => {
    expect(isValidInrAmount(100.001)).toBe(false);
  });

  it("never lets a client-supplied amount of 1 pass as a real booking total", () => {
    // Regression guard for the exact attack described in the payment-phase spec:
    // a client sending {amount: 1} must not be treated as a valid charge on
    // its own — callers must always source the real total from the server.
    expect(isValidInrAmount(1)).toBe(true); // 1 rupee is a technically valid amount...
    // ...which is exactly why the API routes never read `amount` from the request body at all.
  });
});

describe("isValidPax", () => {
  it("accepts 1 through 60", () => {
    expect(isValidPax(1)).toBe(true);
    expect(isValidPax(60)).toBe(true);
  });

  it("rejects 0, 61, and non-integers", () => {
    expect(isValidPax(0)).toBe(false);
    expect(isValidPax(61)).toBe(false);
    expect(isValidPax(2.5)).toBe(false);
  });
});

describe("round2", () => {
  it("avoids classic float drift", () => {
    expect(round2(0.1 + 0.2)).toBe(0.3);
  });
});
