"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type {
  AdminCreateQuoteRequest,
  AdminCreateQuoteResponse,
  AdminQuoteListItem,
  AdminQuoteListResponse,
  CustomPaymentPurpose,
} from "@/lib/types/booking";

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

async function authHeader(): Promise<Record<string, string>> {
  const supabase = supabaseBrowser();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  if (!session) throw new Error("Not signed in.");
  return { Authorization: `Bearer ${session.access_token}` };
}

const PURPOSE_OPTIONS: { value: CustomPaymentPurpose; label: string }[] = [
  { value: "advance", label: "Advance / booking deposit" },
  { value: "full", label: "Full trip amount" },
  { value: "balance", label: "Balance payment" },
  { value: "addon", label: "Add-on (gear rental, transport, private batch)" },
];

const defaultExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<AdminQuoteListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tripLabel: "",
    departureDate: "",
    pax: 1,
    amount: "",
    purpose: "advance" as CustomPaymentPurpose,
    addonDetail: "",
    notes: "",
    expiryDate: defaultExpiry(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeader();
      const res = await fetch("/api/v1/admin/quotes?limit=50", { headers });
      const body = (await res.json()) as AdminQuoteListResponse & { message?: string };
      if (!res.ok) {
        setError(body.message ?? "Failed to load quotes.");
        return;
      }
      setQuotes(body.quotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quotes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    setCreatedUrl(null);
    try {
      const headers = await authHeader();
      const body: AdminCreateQuoteRequest = {
        customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
        tripLabel: form.tripLabel.trim(),
        departureDate: form.departureDate || null,
        pax: form.pax,
        amount: Number(form.amount),
        purpose: form.purpose,
        addonDetail: form.addonDetail.trim() || undefined,
        notes: form.notes.trim() || undefined,
        expiryDate: form.expiryDate,
      };
      const res = await fetch("/api/v1/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as AdminCreateQuoteResponse & { message?: string };
      if (!res.ok) {
        setFormError(data.message ?? "Could not create the payment link.");
        return;
      }
      setCreatedUrl(`${window.location.origin}${data.payUrl}`);
      setForm((f) => ({ ...f, name: "", email: "", phone: "", tripLabel: "", amount: "", notes: "", addonDetail: "" }));
      load();
    } catch {
      setFormError("Could not create the payment link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (token: string) => {
    const url = `${window.location.origin}/pay/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Custom Payment Quotes</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-brand-dark-text">Create a new payment link</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="Customer name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            type="email"
            placeholder="Customer email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            placeholder="Customer phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            placeholder="Trek / trip name"
            required
            value={form.tripLabel}
            onChange={(e) => setForm({ ...form, tripLabel: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm sm:col-span-2"
          />
          <input
            type="date"
            value={form.departureDate}
            onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="number"
            min={1}
            max={60}
            placeholder="Pax"
            value={form.pax}
            onChange={(e) => setForm({ ...form, pax: Number(e.target.value) || 1 })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <input
            type="number"
            min={500}
            placeholder="Amount (₹)"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
          <select
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value as CustomPaymentPurpose })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm bg-white sm:col-span-1"
          >
            {PURPOSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className="p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        </div>
        {form.purpose === "addon" && (
          <input
            placeholder="Add-on details (e.g. gear rental, private transport)"
            value={form.addonDetail}
            onChange={(e) => setForm({ ...form, addonDetail: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
          />
        )}
        <textarea
          placeholder="Internal notes (optional)"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
        />

        {formError && <p className="text-xs font-bold text-red-600">{formError}</p>}
        {createdUrl && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-xs">
            <span className="font-bold text-emerald-700">Link created:</span>
            <a href={createdUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all">
              {createdUrl}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Payment Link"}
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        {loading && <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading...</div>}
        {!loading && error && <div className="p-8 text-center text-xs text-red-500 font-semibold">{error}</div>}
        {!loading && !error && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-3">Customer</th>
                <th className="p-3">Trip</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Purpose</th>
                <th className="p-3">Status</th>
                <th className="p-3">Booking</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.token} className="border-b border-gray-50 last:border-0 hover:bg-brand-warm-bg/50">
                  <td className="p-3">
                    <div className="font-semibold">{q.customerName}</div>
                    <div className="text-[10px] text-gray-400">{q.customerEmail}</div>
                  </td>
                  <td className="p-3">{q.tripLabel}</td>
                  <td className="p-3">{formatInr(q.amount)}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{q.purpose}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{q.status}</td>
                  <td className="p-3 text-[11px] font-mono">{q.bookingNo ?? "—"}</td>
                  <td className="p-3 text-[11px]">{q.expiryDate}</td>
                  <td className="p-3">
                    <button onClick={() => handleCopy(q.token)} className="flex items-center gap-1 text-[11px] font-bold text-brand-forest hover:underline">
                      {copiedToken === q.token ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedToken === q.token ? "Copied" : "Copy link"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
