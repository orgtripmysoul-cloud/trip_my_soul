import { describe, expect, it } from "vitest";

const vars = {
  lead_no: "TMS-L-26-00042",
  name: "Asha Rao",
  phone: "+919876543210",
  email: "asha@example.com",
  trek: "Kedarkantha Trek",
  form_type: "corporate",
  message: "Group of 30 in December",
  travel_month: "Dec 2026",
  owner_name: null,
  company: "Acme Pvt Ltd",
};

describe("lead notification emails", () => {
  it("renders the team alert with contact details, form label and an admin link", async () => {
    const { renderLeadNewTeamEmail } = await import("./leadNotifications");
    const { subject, html, text } = await renderLeadNewTeamEmail(vars);

    expect(subject).toContain("TMS-L-26-00042");
    expect(subject).toContain("Corporate");
    expect(html).toContain("+919876543210");
    expect(html).toContain("Acme Pvt Ltd");
    expect(html).toContain("Unassigned");
    expect(html).toContain("/admin/leads/TMS-L-26-00042");
    expect(text).toContain("Asha Rao");
  });

  it("renders the assigned and repeat-enquiry alerts from the minimal create_lead vars", async () => {
    const { renderLeadNewAssignedEmail, renderLeadDuplicateEnquiryEmail } = await import("./leadNotifications");
    const minimal = { lead_no: "TMS-L-26-00001", name: "Ravi", phone: "+919000000000" };

    const assigned = await renderLeadNewAssignedEmail({ ...minimal, trek: "Not specified", form_type: "callback" });
    expect(assigned.subject).toContain("Callback");
    expect(assigned.html).toContain("Ravi");

    const repeat = await renderLeadDuplicateEnquiryEmail(minimal);
    expect(repeat.subject).toContain("Repeat enquiry");
    expect(repeat.html).toContain("TMS-L-26-00001");
  });

  it("renders the customer auto-reply with a fallback trip name", async () => {
    const { renderLeadAutoReplyEmail } = await import("./leadNotifications");
    const { html } = await renderLeadAutoReplyEmail({ name: "Asha", trek: null });
    expect(html).toContain("Asha");
    expect(html).toContain("your trip");
  });
});
