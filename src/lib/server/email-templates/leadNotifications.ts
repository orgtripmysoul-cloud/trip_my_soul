import "server-only";
import { render } from "@react-email/render";
import * as React from "react";
import LeadNotification from "../../../../emails/lead-notification";
import LeadAutoReply from "../../../../emails/lead-auto-reply";
import { SITE_URL } from "@/lib/seo";
import { LEAD_FORM_TYPE_LABELS, type LeadFormType } from "@/lib/types/crm";

type Rendered = { subject: string; html: string; text: string };

/**
 * Shape of `vars` on lead.* notification_outbox rows. `lead.new_assigned` and
 * `lead.duplicate_enquiry` are queued by create_lead() (0016/0017 migrations);
 * `lead.new_team` is queued by the public leads route with the richer fields.
 */
export interface LeadNotificationVars {
  lead_no: string;
  name: string;
  phone: string;
  email?: string | null;
  trek?: string | null;
  form_type?: string | null;
  message?: string | null;
  travel_month?: string | null;
  owner_name?: string | null;
  company?: string | null;
}

export interface LeadAutoReplyVars {
  name: string;
  trek?: string | null;
}

function adminLeadUrl(leadNo: string): string {
  return `${SITE_URL}/admin/leads/${encodeURIComponent(leadNo)}`;
}

function formLabel(formType?: string | null): string {
  if (!formType) return "Website";
  return LEAD_FORM_TYPE_LABELS[formType as LeadFormType] ?? formType;
}

function rowsFor(vars: LeadNotificationVars): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: "Lead No", value: vars.lead_no },
    { label: "Name", value: vars.name },
    { label: "Phone", value: vars.phone },
  ];
  if (vars.email) rows.push({ label: "Email", value: vars.email });
  if (vars.company) rows.push({ label: "Company", value: vars.company });
  rows.push({ label: "Form", value: formLabel(vars.form_type) });
  if (vars.trek) rows.push({ label: "Trip / Trek", value: vars.trek });
  if (vars.travel_month) rows.push({ label: "Travel month", value: vars.travel_month });
  if (vars.message) rows.push({ label: "Message", value: vars.message.slice(0, 1000) });
  if (vars.owner_name !== undefined) rows.push({ label: "Assigned to", value: vars.owner_name || "Unassigned" });
  return rows;
}

async function renderElement(subject: string, element: React.ReactElement): Promise<Rendered> {
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject, html, text };
}

/** To the salesperson the lead was auto-assigned to. */
export function renderLeadNewAssignedEmail(vars: LeadNotificationVars): Promise<Rendered> {
  return renderElement(
    `[New lead] ${vars.lead_no} — ${vars.name} (${formLabel(vars.form_type)})`,
    React.createElement(LeadNotification, {
      heading: "A new lead has been assigned to you",
      intro: "Please call the customer as soon as possible — fast responses convert best.",
      rows: rowsFor(vars),
      adminUrl: adminLeadUrl(vars.lead_no),
    })
  );
}

/** To the team inbox for every new website enquiry. */
export function renderLeadNewTeamEmail(vars: LeadNotificationVars): Promise<Rendered> {
  return renderElement(
    `[Enquiry] ${vars.lead_no} — ${vars.name} via ${formLabel(vars.form_type)}`,
    React.createElement(LeadNotification, {
      heading: "New enquiry received on the website",
      intro: "A visitor just submitted an enquiry. Details are below.",
      rows: rowsFor(vars),
      adminUrl: adminLeadUrl(vars.lead_no),
    })
  );
}

/** To the lead owner when the same phone number enquires again. */
export function renderLeadDuplicateEnquiryEmail(vars: LeadNotificationVars): Promise<Rendered> {
  return renderElement(
    `[Repeat enquiry] ${vars.lead_no} — ${vars.name}`,
    React.createElement(LeadNotification, {
      heading: "Your lead enquired again",
      intro: "This customer submitted another enquiry. Their new message has been added to the lead timeline.",
      rows: rowsFor(vars),
      adminUrl: adminLeadUrl(vars.lead_no),
    })
  );
}

/** Auto-reply to the customer. */
export function renderLeadAutoReplyEmail(vars: LeadAutoReplyVars): Promise<Rendered> {
  return renderElement(
    "We received your enquiry – Trip My Soul",
    React.createElement(LeadAutoReply, {
      customerName: vars.name || "Traveller",
      trekName: vars.trek || "your trip",
    })
  );
}
