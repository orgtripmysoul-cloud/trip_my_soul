import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.EMAIL_VERIFICATION_SECRET = "test_verification_secret";
});

describe("generateOtpCode", () => {
  it("always produces a 6-digit numeric string, including with leading zeros", async () => {
    const { generateOtpCode } = await import("./otp");
    for (let i = 0; i < 200; i++) {
      const code = generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
    }
  });
});

describe("hashOtpCode", () => {
  it("is deterministic for the same email/purpose/code", async () => {
    const { hashOtpCode } = await import("./otp");
    expect(hashOtpCode("a@example.com", "booking", "123456")).toBe(hashOtpCode("a@example.com", "booking", "123456"));
  });

  it("is case-insensitive on email, so a re-typed email still matches", async () => {
    const { hashOtpCode } = await import("./otp");
    expect(hashOtpCode("A@Example.com", "booking", "123456")).toBe(hashOtpCode("a@example.com", "booking", "123456"));
  });

  it("differs when the code, email, or purpose differs — a hash can't be replayed across contexts", async () => {
    const { hashOtpCode } = await import("./otp");
    const base = hashOtpCode("a@example.com", "booking", "123456");
    expect(hashOtpCode("a@example.com", "booking", "654321")).not.toBe(base);
    expect(hashOtpCode("b@example.com", "booking", "123456")).not.toBe(base);
    expect(hashOtpCode("a@example.com", "signup", "123456")).not.toBe(base);
  });
});

describe("constantTimeEqual", () => {
  it("matches equal strings and rejects different ones, including different lengths", async () => {
    const { constantTimeEqual } = await import("./otp");
    expect(constantTimeEqual("abc123", "abc123")).toBe(true);
    expect(constantTimeEqual("abc123", "abc124")).toBe(false);
    expect(constantTimeEqual("abc123", "abc12")).toBe(false);
  });
});

describe("evaluateSendRateLimit", () => {
  it("allows a send when neither the email nor the IP has hit the limit", async () => {
    const { evaluateSendRateLimit } = await import("./otp");
    const now = Date.parse("2026-01-01T00:10:00.000Z");
    expect(evaluateSendRateLimit(["2026-01-01T00:00:00.000Z"], [], now)).toEqual({ allowed: true });
  });

  it("blocks once the email hits OTP_SEND_LIMIT within the window, with a retry-after based on the oldest send", async () => {
    const { evaluateSendRateLimit, OTP_SEND_LIMIT, OTP_SEND_WINDOW_MINUTES } = await import("./otp");
    const oldest = "2026-01-01T00:00:00.000Z";
    const timestamps = Array.from({ length: OTP_SEND_LIMIT }, (_, i) => new Date(Date.parse(oldest) + i * 1000).toISOString());
    const now = Date.parse(oldest) + 60_000; // 1 minute after the oldest send

    const result = evaluateSendRateLimit(timestamps, [], now);
    expect(result.allowed).toBe(false);
    const expectedRetryAfter = Math.ceil((Date.parse(oldest) + OTP_SEND_WINDOW_MINUTES * 60_000 - now) / 1000);
    expect(result.retryAfterSeconds).toBe(expectedRetryAfter);
  });

  it("blocks on the IP limit even when the email is under its own limit", async () => {
    const { evaluateSendRateLimit, OTP_SEND_LIMIT } = await import("./otp");
    const ipTimestamps = Array.from({ length: OTP_SEND_LIMIT }, () => new Date().toISOString());
    expect(evaluateSendRateLimit([], ipTimestamps).allowed).toBe(false);
  });

  it("allows again once the window has fully passed — the caller's query already excludes rows outside the window", async () => {
    // checkSendRateLimit only ever passes timestamps that its DB query already
    // filtered with `.gte("created_at", windowStart)`, so once every prior
    // send has aged out of the window, the array it hands to this pure
    // function is simply empty.
    const { evaluateSendRateLimit } = await import("./otp");
    expect(evaluateSendRateLimit([], [])).toEqual({ allowed: true });
  });
});

describe("isOtpRowActive", () => {
  it("is active when unconsumed and not yet expired", async () => {
    const { isOtpRowActive } = await import("./otp");
    const now = Date.parse("2026-01-01T00:05:00.000Z");
    expect(isOtpRowActive({ consumedAt: null, expiresAt: "2026-01-01T00:10:00.000Z" }, now)).toBe(true);
  });

  it("expires once past expires_at", async () => {
    const { isOtpRowActive } = await import("./otp");
    const now = Date.parse("2026-01-01T00:15:00.000Z");
    expect(isOtpRowActive({ consumedAt: null, expiresAt: "2026-01-01T00:10:00.000Z" }, now)).toBe(false);
  });

  it("is inactive once consumed, even if not yet expired", async () => {
    const { isOtpRowActive } = await import("./otp");
    const now = Date.parse("2026-01-01T00:05:00.000Z");
    expect(isOtpRowActive({ consumedAt: "2026-01-01T00:01:00.000Z", expiresAt: "2026-01-01T00:10:00.000Z" }, now)).toBe(false);
  });
});

describe("evaluateOtpAttempt", () => {
  const activeRow = (overrides: Partial<import("./otp").OtpRow> = {}) => ({
    consumedAt: null,
    expiresAt: "2026-01-01T01:00:00.000Z",
    attempts: 0,
    maxAttempts: 5,
    codeHash: "expected-hash",
    ...overrides,
  });

  it("succeeds when the row is active and the hash matches", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    expect(evaluateOtpAttempt(activeRow(), "expected-hash", now)).toEqual({ ok: true });
  });

  it("reports no_active_code when there is no row at all", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    expect(evaluateOtpAttempt(null, "expected-hash")).toEqual({ ok: false, reason: "no_active_code" });
  });

  it("reports no_active_code when the code has expired — never leaks 'wrong code' for a stale code", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    const now = Date.parse("2026-01-01T02:00:00.000Z"); // after expiresAt
    expect(evaluateOtpAttempt(activeRow(), "expected-hash", now)).toEqual({ ok: false, reason: "no_active_code" });
  });

  it("reports incorrect_code on a wrong guess with attempts remaining", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    expect(evaluateOtpAttempt(activeRow({ attempts: 1 }), "wrong-hash", now)).toEqual({ ok: false, reason: "incorrect_code" });
  });

  it("reports too_many_attempts once a wrong guess exhausts the attempt ceiling", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    // attempts=4, maxAttempts=5 — this wrong guess would be the 5th.
    expect(evaluateOtpAttempt(activeRow({ attempts: 4 }), "wrong-hash", now)).toEqual({ ok: false, reason: "too_many_attempts" });
  });

  it("reports too_many_attempts immediately once already exhausted, without checking the code", async () => {
    const { evaluateOtpAttempt } = await import("./otp");
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    expect(evaluateOtpAttempt(activeRow({ attempts: 5 }), "expected-hash", now)).toEqual({ ok: false, reason: "too_many_attempts" });
  });
});
