"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type {
  AdminBookingDetailResponse,
  AdminManualPaymentKind,
  AdminManualPaymentMethod,
  AdminRecordPaymentRequest,
  AdminRecordPaymentResponse,
} from "@/lib/types/booking";

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

async function getAccessToken(): Promise<string | null> {
  const supabase = supabaseBrowser();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export default function AdminBookingDetailPage() {
  const params = useParams<{ bookingNo: string }>();
  const bookingNo = params.bookingNo;

  const [detail, setDetail] = useState<AdminBookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<AdminManualPaymentMethod>("cash");
  const [kind, setKind] = useState<AdminManualPaymentKind>("installment");
  const [transactionReference, setTransactionReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setError("Not signed in.");
        return;
      }
      const res = await fetch(`/api/v1/admin/bookings/${encodeURIComponent(bookingNo)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await res.json()) as AdminBookingDetailResponse & { code?: string; message?: string };
      if (!res.ok) {
        setError(body.message ?? "Failed to load booking.");
        return;
      }
      setDetail(body);
    } catch {
      setError("Failed to load booking.");
    } finally {
      setLoading(false);
    }
  }, [bookingNo]);

  useEffect(() => {
    load();
  }, [load]);

  const due = detail ? Math.max(detail.totalAmount - detail.paidAmount, 0) : 0;

  const openForm = () => {
    setAmount(due > 0 ? String(due) : "");
    setKind(due > 0 ? "installment" : "final");
    setMethod("cash");
    setTransactionReference("");
    setNotes("");
    setFormError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }
    if (parsedAmount > due) {
      setFormError(`Amount cannot exceed the outstanding balance of ${formatInr(due)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setFormError("Not signed in.");
        setSubmitting(false);
        return;
      }

      const requestBody: AdminRecordPaymentRequest = {
        amount: parsedAmount,
        method,
        kind,
        transactionReference: transactionReference.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      const res = await fetch(`/api/v1/admin/bookings/${encodeURIComponent(bookingNo)}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify(requestBody),
      });
      const body = (await res.json()) as AdminRecordPaymentResponse & { code?: string; message?: string };
      if (!res.ok) {
        setFormError(body.message ?? "Failed to record payment.");
        return;
      }

      setShowForm(false);
      await load();
    } catch {
      setFormError("Failed to record payment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading booking...</div>;
  }

  if (error || !detail) {
    return <div className="p-8 text-center text-xs text-red-500 font-semibold">{error ?? "Booking not found."}</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-forest transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to bookings</span>
      </Link>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold font-serif text-brand-dark-text">{detail.bookingNo}</h1>
            <p className="text-xs text-gray-400">
              {detail.trekName} — {detail.batchLabel}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] uppercase font-bold bg-brand-forest/10 text-brand-forest px-3 py-1 rounded-full">
              {detail.status.replace(/_/g, " ")}
            </span>
            <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-700 px-3 py-1 rounded-full">
              {detail.paymentState.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600 border-t border-gray-100 pt-4">
          <div>
            <span className="block text-[9px] uppercase text-gray-400 font-bold">Customer</span>
            <span className="block font-bold text-brand-dark-text">{detail.customer.name}</span>
            <span className="block text-gray-400">{detail.customer.email}</span>
            <span className="block text-gray-400">{detail.customer.phone}</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase text-gray-400 font-bold">Trek Date</span>
            <span className="block font-bold text-brand-dark-text">
              {formatDate(detail.startDate)} - {formatDate(detail.endDate)}
            </span>
            <span className="block text-gray-400">{detail.pax} traveller(s)</span>
          </div>
          <div>
            <span className="block text-[9px] uppercase text-gray-400 font-bold">Travellers</span>
            {detail.travellers.map((t, i) => (
              <span key={i} className="block text-gray-400">
                {t.fullName} {t.isPrimary ? "(Primary)" : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <span className="block text-[9px] uppercase text-gray-400 font-bold">Total Amount</span>
          <span className="block text-xl font-extrabold text-brand-dark-text">{formatInr(detail.totalAmount)}</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <span className="block text-[9px] uppercase text-gray-400 font-bold">Total Paid</span>
          <span className="block text-xl font-extrabold text-emerald-600">{formatInr(detail.paidAmount)}</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <span className="block text-[9px] uppercase text-gray-400 font-bold">Amount Due</span>
          <span className="block text-xl font-extrabold text-red-500">{formatInr(due)}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold font-serif text-brand-dark-text">Payment History</h2>
          {due > 0 && (
            <button
              onClick={openForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-forest text-white rounded-full font-bold text-xs hover:bg-brand-forest-light transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-2">Amount</th>
                <th className="p-2">Method</th>
                <th className="p-2">Kind</th>
                <th className="p-2">Status</th>
                <th className="p-2">Reference</th>
                <th className="p-2">Collected By</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {detail.payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No payments recorded yet.
                  </td>
                </tr>
              )}
              {detail.payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="p-2 font-bold">{formatInr(p.amount)}</td>
                  <td className="p-2 uppercase">{p.method ?? p.gateway}</td>
                  <td className="p-2 uppercase">{p.kind}</td>
                  <td className="p-2 uppercase">{p.status}</td>
                  <td className="p-2">{p.transactionReference ?? "—"}</td>
                  <td className="p-2">{p.collectedByName ?? "—"}</td>
                  <td className="p-2 text-gray-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-extrabold font-serif text-brand-dark-text">Record Manual Payment</h3>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Amount (max {formatInr(due)})</label>
                <input
                  type="number"
                  min={0}
                  max={due}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as AdminManualPaymentMethod)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi_manual">UPI Manual</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">Kind</label>
                  <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as AdminManualPaymentKind)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
                  >
                    <option value="advance">Advance</option>
                    <option value="installment">Installment</option>
                    <option value="final">Final</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">
                  Transaction Reference {(method === "upi_manual" || method === "bank_transfer") && <span className="text-gray-400 font-normal">(recommended)</span>}
                </label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="UTR / UPI ref / transaction id"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-1/2 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-3 rounded-full bg-brand-forest hover:bg-brand-forest-light text-white font-bold transition disabled:opacity-50"
                >
                  {submitting ? "Recording..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
