import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.EMAIL_VERIFICATION_SECRET = "test_verification_secret";
});

describe("renderVerifyEmail", () => {
  it("renders both html and text with the code visible", async () => {
    const { renderVerifyEmail } = await import("./verifyEmail");
    const { subject, html, text } = await renderVerifyEmail("042817");

    expect(subject).toContain("042817");
    expect(html).toContain("042817");
    expect(html.toLowerCase()).toContain("<table");
    expect(text).toContain("042817");
  });
});

describe("renderBookingConfirmationEmail", () => {
  const vars = {
    booking_no: "TMS-0001",
    pax: 2,
    customer_name: "Asha Rao",
    customer_email: "asha@example.com",
    customer_phone: "+919999999999",
    trek_name: "Valley of Flowers Trek",
    region: "Uttarakhand",
    difficulty: "Moderate",
    duration_days: 6,
    batch_label: "06 Aug-11 Aug 2026",
    start_date: "2026-08-06",
    total_amount: 185000,
    amount_paid: 185000,
    gateway_payment_id: "pay_test123",
  };

  it("renders the customer confirmation with region/difficulty/₹ formatting and a booking reference", async () => {
    const { renderBookingConfirmationEmail } = await import("./bookingConfirmation");
    const { subject, html, text } = await renderBookingConfirmationEmail(vars);

    expect(subject).toContain("TMS-0001");
    expect(html).toContain("Valley of Flowers Trek");
    expect(html).toContain("Uttarakhand");
    expect(html).toContain("Moderate");
    expect(html).toContain("₹1,85,000");
    expect(html.toLowerCase()).toContain("<table");
    expect(text).toContain("TMS-0001");
    expect(text).toContain("₹1,85,000");
  });

  it("falls back to the batch label when there is no fixed start date", async () => {
    const { renderBookingConfirmationEmail } = await import("./bookingConfirmation");
    const { html } = await renderBookingConfirmationEmail({ ...vars, start_date: null });
    expect(html).toContain(vars.batch_label);
  });

  it("renders the internal notification with operational detail (customer contact, payment id)", async () => {
    const { renderBookingInternalNotificationEmail } = await import("./bookingConfirmation");
    const { subject, html, text } = await renderBookingInternalNotificationEmail(vars);

    expect(subject).toContain("TMS-0001");
    expect(html).toContain("asha@example.com");
    expect(html).toContain("pay_test123");
    expect(text).toContain("asha@example.com");
  });
});

describe("renderPaymentReceivedEmail", () => {
  it("renders the payment receipt with booking id, amount and transaction id", async () => {
    const { renderPaymentReceivedEmail } = await import("./paymentReceived");
    const { subject, html, text } = await renderPaymentReceivedEmail({
      booking_no: "TMS-0001",
      customer_name: "Asha Rao",
      trek_name: "Valley of Flowers Trek",
      batch_label: "06 Aug-11 Aug 2026",
      start_date: "2026-08-06",
      amount_paid: 92500,
      payment_status: "captured",
      gateway_payment_id: "pay_test123",
      booking_status: "partially_paid",
    });

    expect(subject).toContain("TMS-0001");
    expect(html).toContain("₹92,500");
    expect(html).toContain("pay_test123");
    expect(html).toContain("Booking Confirmation email shortly");
    expect(text).toContain("TMS-0001");
  });
});

describe("renderTripReminderEmail", () => {
  it("renders the 3-day reminder with departure details and packing list", async () => {
    const { renderTripReminderEmail } = await import("./tripReminder");
    const { subject, html, text } = await renderTripReminderEmail({
      booking_no: "TMS-0001",
      customer_name: "Asha Rao",
      trek_name: "Valley of Flowers Trek",
      start_date: "2026-08-06",
      end_date: "2026-08-11",
      reporting_time: "6:00 AM",
      pickup_location: "Haridwar Railway Station",
    });

    expect(subject).toContain("Valley of Flowers Trek");
    expect(html).toContain("TMS-0001");
    expect(html).toContain("Haridwar Railway Station");
    expect(html).toContain("6:00 AM");
    expect(text).toContain("3 Days to Go");
  });
});
