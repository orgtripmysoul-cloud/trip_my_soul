import "server-only";
import { render } from "@react-email/render";
import * as React from "react";
import TripReminder from "../../../../emails/trip-reminder";

/** Shape of `vars` on a `booking.trip_reminder` notification_outbox row — see queue_trip_reminders() in supabase/migrations/0011_trip_reminders.sql. */
export interface TripReminderVars {
  booking_no: string;
  customer_name: string;
  trek_name: string;
  start_date: string | null;
  end_date: string | null;
  reporting_time: string | null;
  pickup_location: string | null;
}

function formatDepartureDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });
  } catch {
    return null;
  }
}

export async function renderTripReminderEmail(vars: TripReminderVars): Promise<{ subject: string; html: string; text: string }> {
  const subject = `3 Days to Go! 🏔️ Your ${vars.trek_name} Adventure Is Almost Here`;
  const element = React.createElement(TripReminder, {
    bookingNo: vars.booking_no,
    customerName: vars.customer_name,
    trekName: vars.trek_name,
    departureDateLabel: formatDepartureDate(vars.start_date),
    returnDateLabel: formatDepartureDate(vars.end_date),
    reportingLocation: vars.pickup_location,
    reportingTime: vars.reporting_time,
  });

  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject, html, text };
}
