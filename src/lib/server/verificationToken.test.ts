import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  process.env.EMAIL_VERIFICATION_SECRET = "test_verification_secret";
});

describe("issueVerificationToken / verifyVerificationToken", () => {
  it("accepts a token for the email it was issued for", async () => {
    const { issueVerificationToken, verifyVerificationToken } = await import("./verificationToken");
    const token = issueVerificationToken("Traveller@Example.com", 30);
    expect(verifyVerificationToken(token, "traveller@example.com")).toBe(true);
  });

  it("rejects the token for a different email — the booking endpoint must not accept a token issued for someone else", async () => {
    const { issueVerificationToken, verifyVerificationToken } = await import("./verificationToken");
    const token = issueVerificationToken("a@example.com", 30);
    expect(verifyVerificationToken(token, "b@example.com")).toBe(false);
  });

  it("rejects an expired token", async () => {
    const { issueVerificationToken, verifyVerificationToken } = await import("./verificationToken");
    vi.useFakeTimers();
    const token = issueVerificationToken("a@example.com", 30);
    vi.advanceTimersByTime(31 * 60_000);
    expect(verifyVerificationToken(token, "a@example.com")).toBe(false);
    vi.useRealTimers();
  });

  it("rejects a tampered payload and a tampered signature", async () => {
    const { issueVerificationToken, verifyVerificationToken } = await import("./verificationToken");
    const token = issueVerificationToken("a@example.com", 30);
    const [payload, signature] = token.split(".");

    const tamperedPayload = Buffer.from(JSON.stringify({ email: "b@example.com", purpose: "booking", exp: Date.now() + 60_000 })).toString(
      "base64url"
    );
    expect(verifyVerificationToken(`${tamperedPayload}.${signature}`, "b@example.com")).toBe(false);
    expect(verifyVerificationToken(`${payload}.${"0".repeat(signature.length)}`, "a@example.com")).toBe(false);
  });

  it("rejects malformed tokens instead of throwing", async () => {
    const { verifyVerificationToken } = await import("./verificationToken");
    expect(verifyVerificationToken(null, "a@example.com")).toBe(false);
    expect(verifyVerificationToken("not-a-token", "a@example.com")).toBe(false);
    expect(verifyVerificationToken("", "a@example.com")).toBe(false);
  });
});
