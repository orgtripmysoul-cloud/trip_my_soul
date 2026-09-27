"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { AdminPaymentListItem, AdminPaymentListResponse } from "@/lib/types/booking";

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

async function authHeader(): Promise<Record<string, string>> {
  const supabase = supabaseBrowser();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  if (!session) throw new Error("Not signed in.");
  return { Authorization: `Bearer ${session.access_token}` };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPaymentListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [status, setStatus] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (bookingType) params.set("bookingType", bookingType);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return params;
  }, [status, bookingType, dateFrom, dateTo]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeader();
      const params = buildParams();
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      const res = await fetch(`/api/v1/admin/payments?${params.toString()}`, { headers });
      const body = (await res.json()) as AdminPaymentListResponse & { message?: string };
      if (!res.ok) {
        setError(body.message ?? "Failed to load payments.");
        return;
      }
      setPayments(body.payments);
      setTotal(body.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }, [buildParams, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const headers = await authHeader();
      const params = buildParams();
      params.set("format", "csv");
      const res = await fetch(`/api/v1/admin/payments?${params.toString()}`, { headers });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "payments.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Payments</h1>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending_payment">Pending payment</option>
          <option value="partially_paid">Partially paid</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={bookingType}
          onChange={(e) => {
            setBookingType(e.target.value);
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        >
          <option value="">All types</option>
          <option value="trek">Trek bookings</option>
          <option value="custom">Custom payments</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value);
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value);
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        {loading && <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading payments...</div>}
        {!loading && error && <div className="p-8 text-center text-xs text-red-500 font-semibold">{error}</div>}
        {!loading && !error && payments.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400 font-semibold">No payments found.</div>
        )}
        {!loading && !error && payments.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-3">Booking No</th>
                <th className="p-3">Type</th>
                <th className="p-3">Trek</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.bookingNo} className="border-b border-gray-50 last:border-0 hover:bg-brand-warm-bg/50">
                  <td className="p-3 font-mono text-xs">{p.bookingNo}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{p.bookingType}</td>
                  <td className="p-3">{p.trekName}</td>
                  <td className="p-3">
                    <div className="font-semibold">{p.customerName}</div>
                    <div className="text-[10px] text-gray-400">{p.customerEmail}</div>
                  </td>
                  <td className="p-3">{formatInr(p.totalAmount)}</td>
                  <td className="p-3">{formatInr(p.paidAmount)}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{p.status.replace(/_/g, " ")}</td>
                  <td className="p-3 text-[11px] text-gray-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {payments.length === 0 ? 0 : offset + 1}-{offset + payments.length} of {total}
        </span>
        <div className="flex gap-2">
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))} className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold disabled:opacity-40">
            Previous
          </button>
          <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)} className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold disabled:opacity-40">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
