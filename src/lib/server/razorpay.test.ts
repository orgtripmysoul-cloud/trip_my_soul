import crypto from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.RAZORPAY_KEY_ID = "rzp_test_dummy";
  process.env.RAZORPAY_KEY_SECRET = "test_key_secret";
  process.env.RAZORPAY_WEBHOOK_SECRET = "test_webhook_secret";
});

describe("verifyWebhookSignature / verifyCheckoutCallbackSignature", () => {
  it("accepts a correctly signed webhook body and rejects a tampered one", async () => {
    const { verifyWebhookSignature } = await import("./razorpay");
    const rawBody = JSON.stringify({ event: "payment.captured", payload: {} });
    const validSignature = crypto.createHmac("sha256", "test_webhook_secret").update(rawBody).digest("hex");

    expect(verifyWebhookSignature(rawBody, validSignature)).toBe(true);
    expect(verifyWebhookSignature(rawBody, "0".repeat(64))).toBe(false);
    expect(verifyWebhookSignature(rawBody, null)).toBe(false);
    // Tampering with the body after signing must invalidate the signature —
    // this is the whole point of "never trust the webhook without it".
    expect(verifyWebhookSignature(rawBody + "x", validSignature)).toBe(false);
  });

  it("verifies the advisory client checkout callback signature the same way Razorpay computes it", async () => {
    const { verifyCheckoutCallbackSignature } = await import("./razorpay");
    const orderId = "order_ABC123";
    const paymentId = "pay_XYZ789";
    const validSignature = crypto
      .createHmac("sha256", "test_key_secret")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(verifyCheckoutCallbackSignature(orderId, paymentId, validSignature)).toBe(true);
    expect(verifyCheckoutCallbackSignature(orderId, paymentId, "bad")).toBe(false);
  });
});
