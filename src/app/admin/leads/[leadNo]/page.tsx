"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  UserCog,
} from "lucide-react";
import { adminGet, adminSend, formatDate, formatDateTime, relativeTime, toLocalInputValue } from "@/lib/client/adminApi";
import LeadStatusPill from "@/components/admin/LeadStatusPill";
import {
  LEAD_FORM_TYPE_LABELS,
  LEAD_LOST_REASONS,
  LEAD_LOST_REASON_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  OPEN_LEAD_STATUSES,
  type AdminLeadDetail,
  type AdminLeadDetailResponse,
  type AdminStaffOption,
  type LeadActivityType,
  type LeadLostReason,
  type LeadStatus,
} from "@/lib/types/crm";

const ACTIVITY_ICONS: Record<LeadActivityType, React.ReactNode> = {
  note: <StickyNote className="w-3.5 h-3.5" />,
  call: <Phone className="w-3.5 h-3.5" />,
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  status_change: <ArrowLeft className="w-3.5 h-3.5 rotate-180" />,
  transfer: <UserCog className="w-3.5 h-3.5" />,
  follow_up_set: <CalendarClock className="w-3.5 h-3.5" />,
  created: <StickyNote className="w-3.5 h-3.5" />,
};

export default function AdminLeadDetailPage() {
  const params = useParams<{ leadNo: string }>();
  const leadNo = params.leadNo;

  const [lead, setLead] = useState<AdminLeadDetail | null>(null);
  const [staff, setStaff] = useState<AdminStaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminLeadDetailResponse>(`/api/v1/admin/leads/${leadNo}`);
      setLead(data.lead);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the lead.");
    } finally {
      setLoading(false);
    }
  }, [leadNo]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    adminGet<{ staff: AdminStaffOption[] }>("/api/v1/admin/staff")
      .then((d) => setStaff(d.staff))
      .catch(() => setStaff([]));
  }, []);

  const patch = async (body: Record<string, unknown>) => {
    setSaving(true);
    setActionError(null);
    try {
      await adminSend(`/api/v1/admin/leads/${leadNo}`, "PATCH", body);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the lead.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-xs text-gray-400 font-semibold">Loading…</div>;
  if (error || !lead)
    return (
      <div className="space-y-4">
        <BackLink />
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">{error}</div>
      </div>
    );

  return (
    <div className="space-y-6">
      <BackLink />

      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">{lead.name}</h1>
              <LeadStatusPill status={lead.status} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="font-mono text-[11px] text-gray-400">{lead.leadNo}</span>
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-brand-forest font-semibold">
                <Phone className="w-3.5 h-3.5" /> {lead.phone}
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-brand-forest">
                  <Mail className="w-3.5 h-3.5" /> {lead.email}
                </a>
              )}
              <a
                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            </div>
          </div>

          <div className="text-right text-[11px] text-gray-400">
            <div>Captured {formatDateTime(lead.createdAt)}</div>
            <div className="font-semibold text-gray-500">{LEAD_FORM_TYPE_LABELS[lead.formType]}</div>
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">{actionError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: enquiry detail + timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Enquiry">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <Field label="Trek / Trip" value={lead.trekName ?? "Not specified"} />
              <Field label="Travel" value={lead.travelDate ? formatDate(lead.travelDate) : lead.travelMonth ?? "—"} />
              <Field label="Pax" value={String(lead.pax)} />
              <Field label="Source" value={LEAD_SOURCE_LABELS[lead.source]} />
              <Field label="Form" value={LEAD_FORM_TYPE_LABELS[lead.formType]} />
              <Field label="Marketing consent" value={lead.consentMarketing ? "Given" : "Not given"} />
            </dl>

            {lead.message && (
              <div className="mt-4 p-3 bg-brand-warm-card/50 rounded-xl">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Their message</div>
                <p className="text-sm text-brand-dark-text whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}

            {Object.keys(lead.details).length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Form details</div>
                <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(lead.details).map(([key, value]) => (
                    <Field key={key} label={key.replace(/([A-Z])/g, " $1")} value={String(value)} />
                  ))}
                </dl>
              </div>
            )}

            {(lead.landingPage || Object.keys(lead.utm).length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Attribution</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(lead.utm).map(([key, value]) => (
                    <span key={key} className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-mono text-gray-600">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
                {lead.landingPage && <div className="text-[10px] text-gray-400 mt-2 break-all">{lead.landingPage}</div>}
              </div>
            )}
          </Card>

          <LogActivityCard leadNo={leadNo} onLogged={load} />

          <Card title="Timeline">
            {lead.activities.length === 0 ? (
              <p className="text-xs text-gray-400">Nothing logged yet.</p>
            ) : (
              <ol className="space-y-4">
                {lead.activities.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-warm-card flex items-center justify-center text-brand-forest shrink-0">
                      {ACTIVITY_ICONS[a.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-xs font-bold text-brand-dark-text capitalize">{a.type.replace(/_/g, " ")}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{formatDateTime(a.createdAt)}</span>
                      </div>
                      {a.type === "status_change" && (
                        <p className="text-xs text-gray-600">
                          {LEAD_STATUS_LABELS[a.oldValue as LeadStatus] ?? a.oldValue} →{" "}
                          <strong>{LEAD_STATUS_LABELS[a.newValue as LeadStatus] ?? a.newValue}</strong>
                        </p>
                      )}
                      {a.body && <p className="text-xs text-gray-600 whitespace-pre-wrap">{a.body}</p>}
                      {a.outcome && <p className="text-[11px] text-gray-500 mt-0.5">Outcome: {a.outcome}</p>}
                      {a.staffName && <p className="text-[10px] text-gray-400 mt-0.5">by {a.staffName}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Right: pipeline controls */}
        <div className="space-y-6">
          <Card title="Pipeline">
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={lead.status}
                  disabled={saving}
                  onChange={(e) => {
                    const next = e.target.value as LeadStatus;
                    // These need extra input, collected by the panels below
                    // rather than guessed at here.
                    if (next === "lost" && !lead.lostReason) {
                      setActionError("Choose a lost reason below, then set the status to Lost.");
                      return;
                    }
                    if (OPEN_LEAD_STATUSES.includes(next) && !lead.followUpAt) {
                      setActionError("Set a follow-up date below before moving to this status.");
                      return;
                    }
                    patch({ status: next });
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Owner</Label>
                <select
                  value={lead.ownerId ?? ""}
                  disabled={saving}
                  onChange={(e) => patch({ ownerId: e.target.value || null })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyed on the saved value so a successful save remounts the
                  field with fresh state, instead of syncing it in an effect. */}
              <FollowUpField
                key={lead.followUpAt ?? "none"}
                lead={lead}
                saving={saving}
                onSave={(value) => patch({ followUpAt: value })}
              />

              {(lead.status === "lost" || lead.lostReason) && (
                <div>
                  <Label>Lost reason</Label>
                  <select
                    value={lead.lostReason ?? ""}
                    disabled={saving}
                    onChange={(e) => patch({ lostReason: e.target.value as LeadLostReason })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    <option value="" disabled>
                      Choose a reason
                    </option>
                    {LEAD_LOST_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {LEAD_LOST_REASON_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>

          <Card title="Response">
            <dl className="space-y-3 text-xs">
              <Field label="First contacted" value={lead.firstContactedAt ? formatDateTime(lead.firstContactedAt) : "Not yet"} />
              <Field
                label="Next follow-up"
                value={lead.followUpAt ? `${formatDateTime(lead.followUpAt)} (${relativeTime(lead.followUpAt)})` : "None set"}
              />
            </dl>
            {!lead.firstContactedAt && (
              <p className="mt-3 text-[11px] text-brand-dusk font-bold">
                This lead has not been contacted yet. The plan calls for first contact within 15 minutes.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-forest">
      <ArrowLeft className="w-4 h-4" /> Back to leads
    </Link>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-bold text-brand-dark-text mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">{children}</div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-gray-400 font-bold capitalize">{label}</dt>
      <dd className="text-xs text-brand-dark-text font-semibold mt-0.5 break-words">{value}</dd>
    </div>
  );
}

function FollowUpField({
  lead,
  saving,
  onSave,
}: {
  lead: AdminLeadDetail;
  saving: boolean;
  onSave: (value: string | null) => void;
}) {
  const [value, setValue] = useState(toLocalInputValue(lead.followUpAt));
  const dirty = value !== toLocalInputValue(lead.followUpAt);

  return (
    <div>
      <Label>Next follow-up</Label>
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 min-w-0 p-2.5 rounded-xl border border-gray-200 text-sm"
        />
        {dirty && (
          <button
            onClick={() => onSave(value ? new Date(value).toISOString() : null)}
            disabled={saving}
            className="px-3 py-2 bg-brand-forest text-white rounded-xl text-[11px] font-bold disabled:opacity-50 shrink-0"
          >
            Save
          </button>
        )}
      </div>
      {lead.isOverdue && <p className="text-[10px] text-red-600 font-bold mt-1">Overdue</p>}
    </div>
  );
}

function LogActivityCard({ leadNo, onLogged }: { leadNo: string; onLogged: () => void }) {
  const [type, setType] = useState<"note" | "call" | "whatsapp" | "email">("call");
  const [body, setBody] = useState("");
  const [outcome, setOutcome] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminSend(`/api/v1/admin/leads/${leadNo}/activities`, "POST", {
        type,
        body: body.trim() || undefined,
        outcome: outcome.trim() || undefined,
      });
      setBody("");
      setOutcome("");
      onLogged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log that.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Log an activity">
      <form onSubmit={submit} className="space-y-3">
        <div className="flex gap-2">
          {(["call", "whatsapp", "email", "note"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize transition ${
                type === t ? "bg-brand-forest text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          rows={2}
          placeholder="What happened?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
        />
        {type === "call" && (
          <input
            placeholder="Outcome (connected, no answer, call back later…)"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        )}
        {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Log it"}
        </button>
      </form>
    </Card>
  );
}
