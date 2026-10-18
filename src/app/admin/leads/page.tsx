"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, LayoutGrid, List, Phone, Plus, Search, UserPlus, X } from "lucide-react";
import { adminGet, adminSend, formatDate, relativeTime } from "@/lib/client/adminApi";
import LeadStatusPill from "@/components/admin/LeadStatusPill";
import {
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  PIPELINE_STATUSES,
  type AdminLeadListItem,
  type AdminLeadListResponse,
  type AdminStaffOption,
  type LeadStatus,
} from "@/lib/types/crm";

type View = "list" | "board";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<AdminLeadListItem[]>([]);
  const [counts, setCounts] = useState<Record<LeadStatus, number> | null>(null);
  const [staff, setStaff] = useState<AdminStaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("list");
  const [showNew, setShowNew] = useState(false);

  const [filters, setFilters] = useState({ status: "", source: "", ownerId: "", due: "", search: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (filters.status) params.set("status", filters.status);
      if (filters.source) params.set("source", filters.source);
      if (filters.ownerId) params.set("ownerId", filters.ownerId);
      if (filters.due) params.set("due", filters.due);
      if (filters.search.trim()) params.set("search", filters.search.trim());

      const data = await adminGet<AdminLeadListResponse>(`/api/v1/admin/leads?${params}`);
      setLeads(data.leads);
      setCounts(data.counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Debounced so typing in the search box does not fire a request per keystroke.
    const timer = setTimeout(load, filters.search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [load, filters.search]);

  useEffect(() => {
    adminGet<{ staff: AdminStaffOption[] }>("/api/v1/admin/staff")
      .then((d) => setStaff(d.staff))
      .catch(() => setStaff([]));
  }, []);

  const overdueCount = useMemo(() => leads.filter((l) => l.isOverdue).length, [leads]);

  const resetFilters = () => setFilters({ status: "", source: "", ownerId: "", due: "", search: "" });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Leads</h1>
          <p className="text-xs text-gray-500 mt-1">
            {loading ? "Loading…" : `${leads.length} lead${leads.length === 1 ? "" : "s"}`}
            {overdueCount > 0 && (
              <span className="text-red-600 font-bold"> · {overdueCount} overdue follow-up{overdueCount === 1 ? "" : "s"}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-full p-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                view === "list" ? "bg-brand-forest text-white" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                view === "board" ? "bg-brand-forest text-white" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Pipeline
            </button>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search name, phone, email or lead no."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-9 p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="">All sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {LEAD_SOURCE_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={filters.ownerId}
          onChange={(e) => setFilters({ ...filters, ownerId: e.target.value })}
          className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="">All owners</option>
          <option value="unassigned">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
            </option>
          ))}
        </select>
        <select
          value={filters.due}
          onChange={(e) => setFilters({ ...filters, due: e.target.value })}
          className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="">Any follow-up</option>
          <option value="today">Due today</option>
          <option value="overdue">Overdue</option>
        </select>
        {hasFilters && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-brand-forest">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">{error}</div>}

      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400 font-semibold">Loading leads…</div>
      ) : leads.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl">
          <p className="text-sm font-bold text-brand-dark-text">No leads yet</p>
          <p className="text-xs text-gray-500 mt-1">
            {hasFilters ? "Try clearing the filters." : "Enquiries from the website will appear here within seconds."}
          </p>
        </div>
      ) : view === "list" ? (
        <LeadTable leads={leads} />
      ) : (
        <LeadBoard leads={leads} counts={counts} onMoved={load} />
      )}

      {showNew && <NewLeadModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />}
    </div>
  );
}

function LeadTable({ leads }: { leads: AdminLeadListItem[] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
            <th className="p-3">Lead</th>
            <th className="p-3">Trek / Trip</th>
            <th className="p-3">Travel</th>
            <th className="p-3">Source</th>
            <th className="p-3">Owner</th>
            <th className="p-3">Follow-up</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.leadNo} className="border-b border-gray-50 last:border-0 hover:bg-brand-warm-bg/50 transition">
              <td className="p-3">
                <Link href={`/admin/leads/${lead.leadNo}`} className="font-semibold text-brand-forest hover:underline">
                  {lead.name}
                </Link>
                <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> {lead.phone}
                </div>
                <div className="text-[10px] text-gray-300 font-mono">{lead.leadNo}</div>
              </td>
              <td className="p-3">
                <div>{lead.trekName ?? <span className="text-gray-300">Not specified</span>}</div>
                {lead.pax > 1 && <div className="text-[10px] text-gray-400">{lead.pax} pax</div>}
              </td>
              <td className="p-3 text-[11px]">{lead.travelDate ? formatDate(lead.travelDate) : lead.travelMonth ?? "—"}</td>
              <td className="p-3 text-[11px]">{LEAD_SOURCE_LABELS[lead.source]}</td>
              <td className="p-3 text-[11px]">
                {lead.ownerName ?? <span className="text-brand-dusk font-bold">Unassigned</span>}
              </td>
              <td className="p-3 text-[11px]">
                {lead.followUpAt ? (
                  <span className={lead.isOverdue ? "text-red-600 font-bold flex items-center gap-1" : ""}>
                    {lead.isOverdue && <AlertTriangle className="w-3 h-3" />}
                    {relativeTime(lead.followUpAt)}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="p-3">
                <LeadStatusPill status={lead.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Kanban pipeline. Drag a card to a column to change status — the same PATCH
 * the detail page uses, so the follow-up and lost-reason rules still apply and
 * a rejected move rolls the card back with the server's message.
 */
function LeadBoard({
  leads,
  counts,
  onMoved,
}: {
  leads: AdminLeadListItem[];
  counts: Record<LeadStatus, number> | null;
  onMoved: () => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<LeadStatus | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);

  const handleDrop = async (status: LeadStatus) => {
    const leadNo = dragging;
    setDragging(null);
    setOver(null);
    if (!leadNo) return;

    const lead = leads.find((l) => l.leadNo === leadNo);
    if (!lead || lead.status === status) return;

    setMoveError(null);
    try {
      await adminSend(`/api/v1/admin/leads/${leadNo}`, "PATCH", { status });
      onMoved();
    } catch (err) {
      // Statuses that need a follow-up date or a lost reason are refused here
      // by design — the detail page is where those are supplied.
      setMoveError(err instanceof Error ? err.message : "Could not move that lead.");
    }
  };

  return (
    <div className="space-y-3">
      {moveError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
          {moveError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PIPELINE_STATUSES.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status);
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(status);
              }}
              onDragLeave={() => setOver((s) => (s === status ? null : s))}
              onDrop={() => handleDrop(status)}
              className={`rounded-2xl border p-2.5 min-h-[200px] transition ${
                over === status ? "border-brand-dusk-orange bg-brand-dusk-orange/5" : "border-gray-100 bg-brand-warm-card/40"
              }`}
            >
              <div className="flex items-center justify-between px-1 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-dark-text">
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <span className="text-[10px] font-bold text-gray-400">{counts?.[status] ?? columnLeads.length}</span>
              </div>

              <div className="space-y-2">
                {columnLeads.map((lead) => (
                  <div
                    key={lead.leadNo}
                    draggable
                    onDragStart={() => setDragging(lead.leadNo)}
                    onDragEnd={() => setDragging(null)}
                    className={`bg-white border rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing transition ${
                      dragging === lead.leadNo ? "opacity-40" : "border-gray-100 hover:border-brand-forest-light/40"
                    }`}
                  >
                    <Link href={`/admin/leads/${lead.leadNo}`} className="font-bold text-xs text-brand-forest hover:underline">
                      {lead.name}
                    </Link>
                    <div className="text-[10px] text-gray-400 mt-0.5">{lead.phone}</div>
                    {lead.trekName && <div className="text-[10px] text-gray-600 mt-1.5 font-semibold">{lead.trekName}</div>}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <span className="text-[9px] text-gray-400 uppercase font-bold">{lead.ownerName ?? "Unassigned"}</span>
                      {lead.followUpAt && (
                        <span className={`text-[9px] font-bold ${lead.isOverdue ? "text-red-600" : "text-gray-400"}`}>
                          {relativeTime(lead.followUpAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {columnLeads.length === 0 && (
                  <div className="text-[10px] text-gray-300 text-center py-6 font-semibold">Drop here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    trekName: "",
    travelDate: "",
    paxAdults: 1,
    source: "phone_call",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminSend("/api/v1/admin/leads", "POST", {
        ...form,
        email: form.email.trim() || undefined,
        trekName: form.trekName.trim() || undefined,
        travelDate: form.travelDate || undefined,
        message: form.message.trim() || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the lead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-extrabold text-lg text-brand-dark-text flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-dusk-orange" /> Add a lead
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-dark-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Customer name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <input
              required
              placeholder="Mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="Trek / trip"
              value={form.trekName}
              onChange={(e) => setForm({ ...form, trekName: e.target.value })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm col-span-2"
            />
            <input
              type="number"
              min={1}
              value={form.paxAdults}
              onChange={(e) => setForm({ ...form, paxAdults: Number(e.target.value) || 1 })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={form.travelDate}
              onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm"
            />
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white"
            >
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_SOURCE_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <textarea
            rows={2}
            placeholder="What did they ask for?"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
          />

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Create Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
