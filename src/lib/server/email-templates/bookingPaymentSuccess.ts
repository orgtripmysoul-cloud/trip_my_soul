import "server-only";
import { DEFAULT_PHONE } from "@/config/contact";

interface TravellerVar {
  full_name: string;
  email?: string | null;
  is_primary: boolean;
}

export interface BookingPaymentSuccessVars {
  booking_no: string;
  booking_status: string;
  pax: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travellers: TravellerVar[];
  trek_name: string;
  trek_slug: string;
  batch_label: string;
  start_date: string | null;
  end_date: string | null;
  amount_paid: number;
  currency: string;
  payment_status: string;
  gateway_payment_id: string;
  gateway_order_id: string;
  captured_at: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return iso;
  }
}

function formatMoney(amount: number, currency: string): string {
  return `${currency === "INR" ? "₹" : currency + " "}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

/**
 * Renders the payment-success confirmation email. Deliberately excludes any
 * database internals (raw UUIDs, gateway secrets, card data) — only the
 * fields a customer needs, per the HLD's email content requirements.
 */
export function renderBookingPaymentSuccessEmail(vars: BookingPaymentSuccessVars): { subject: string; html: string } {
  const subject = `Payment Successful — ${vars.trek_name} (${vars.booking_no})`;

  const travellerRows = vars.travellers
    .map(
      (t) =>
        `<tr><td style="padding:6px 0;color:#334155;">${escapeHtml(t.full_name)}${t.is_primary ? " (Primary)" : ""}</td></tr>`
    )
    .join("");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#F7F9FC;padding:24px;">
    <div style="text-align:center;padding-bottom:16px;">
      <span style="font-size:20px;font-weight:800;color:#0B2545;">TripMySoul</span>
    </div>
    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #E5E7EB;">
      <h1 style="font-size:20px;color:#0B2545;margin:0 0 4px;">Payment Successful — Booking Confirmed</h1>
      <p style="color:#64748B;font-size:13px;margin:0 0 24px;">Booking Reference: <strong>${escapeHtml(vars.booking_no)}</strong></p>

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#94A3B8;margin:20px 0 8px;">Traveller</h2>
      <table style="width:100%;font-size:13px;color:#334155;">
        <tr><td style="padding:4px 0;color:#94A3B8;width:140px;">Name</td><td>${escapeHtml(vars.customer_name)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Email</td><td>${escapeHtml(vars.customer_email)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Phone</td><td>${escapeHtml(vars.customer_phone)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Travellers</td><td>${vars.pax}</td></tr>
      </table>
      ${travellerRows ? `<table style="width:100%;font-size:13px;margin-top:4px;">${travellerRows}</table>` : ""}

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#94A3B8;margin:20px 0 8px;">Trip</h2>
      <table style="width:100%;font-size:13px;color:#334155;">
        <tr><td style="padding:4px 0;color:#94A3B8;width:140px;">Trek</td><td>${escapeHtml(vars.trek_name)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Departure Batch</td><td>${escapeHtml(vars.batch_label)}</td></tr>
        ${vars.start_date ? `<tr><td style="padding:4px 0;color:#94A3B8;">Start Date</td><td>${escapeHtml(vars.start_date)}</td></tr>` : ""}
        ${vars.end_date ? `<tr><td style="padding:4px 0;color:#94A3B8;">End Date</td><td>${escapeHtml(vars.end_date)}</td></tr>` : ""}
      </table>

      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#94A3B8;margin:20px 0 8px;">Payment</h2>
      <table style="width:100%;font-size:13px;color:#334155;">
        <tr><td style="padding:4px 0;color:#94A3B8;width:140px;">Amount Paid</td><td style="font-weight:700;color:#0F766E;">${formatMoney(vars.amount_paid, vars.currency)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Status</td><td>${escapeHtml(vars.payment_status)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Payment ID</td><td style="font-family:monospace;">${escapeHtml(vars.gateway_payment_id)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Order ID</td><td style="font-family:monospace;">${escapeHtml(vars.gateway_order_id)}</td></tr>
        <tr><td style="padding:4px 0;color:#94A3B8;">Paid On</td><td>${escapeHtml(formatDate(vars.captured_at))}</td></tr>
      </table>

      <div style="margin-top:24px;padding:16px;background:#F0FDF4;border-radius:12px;border:1px solid #BBF7D0;">
        <p style="margin:0;font-size:13px;color:#166534;font-weight:700;">Your booking has been recorded and confirmed.</p>
        <p style="margin:6px 0 0;font-size:12px;color:#166534;">Our team will reach out with your trek briefing and joining instructions closer to the departure date. Keep your booking reference (${escapeHtml(vars.booking_no)}) handy for any queries.</p>
      </div>

      <p style="margin-top:24px;font-size:12px;color:#94A3B8;">
        Need help? Call us at ${escapeHtml(DEFAULT_PHONE.display)}.
      </p>
    </div>
  </div>`;

  return { subject, html };
}

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
