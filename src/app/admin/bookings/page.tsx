"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { AdminBookingListItem, AdminBookingListResponse } from "@/lib/types/booking";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AdminBookingsListPage() {
  const [bookings, setBookings] = useState<AdminBookingListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [paymentState, setPaymentState] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = supabaseBrowser();
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      if (!session) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (paymentState) params.set("paymentState", paymentState);
      params.set("limit", String(limit));
      params.set("offset", String(offset));

      const res = await fetch(`/api/v1/admin/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = (await res.json()) as AdminBookingListResponse & { code?: string; message?: string };
      if (!res.ok) {
        setError(body.message ?? "Failed to load bookings.");
        setBookings([]);
        setTotal(0);
        return;
      }
      setBookings(body.bookings);
      setTotal(body.total);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [q, status, paymentState, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Bookings</h1>
      </div>

      <form onSubmit={handleSearchSubmit} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl flex-grow">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search booking no, email or phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-transparent border-0 text-sm focus:outline-none w-full min-w-0"
          />
        </div>
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
          <option value="completed">Completed</option>
        </select>
        <select
          value={paymentState}
          onChange={(e) => {
            setPaymentState(e.target.value);
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        >
          <option value="">All payment states</option>
          <option value="unpaid">Unpaid</option>
          <option value="advance_paid">Advance paid</option>
          <option value="fully_paid">Fully paid</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-sm transition"
        >
          Search
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        {loading && <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading bookings...</div>}
        {!loading && error && <div className="p-8 text-center text-xs text-red-500 font-semibold">{error}</div>}
        {!loading && !error && bookings.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400 font-semibold">No bookings found.</div>
        )}
        {!loading && !error && bookings.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-3">Booking No</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Trek</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Due</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingNo} className="border-b border-gray-50 last:border-0 hover:bg-brand-warm-bg/50">
                  <td className="p-3">
                    <Link href={`/admin/bookings/${b.bookingNo}`} className="font-bold text-brand-forest hover:underline">
                      {b.bookingNo}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-brand-dark-text">{b.customerName}</div>
                    <div className="text-[10px] text-gray-400">{b.customerEmail}</div>
                  </td>
                  <td className="p-3">
                    <div>{b.trekName}</div>
                    <div className="text-[10px] text-gray-400">{b.batchLabel}</div>
                  </td>
                  <td className="p-3">{formatInr(b.totalAmount)}</td>
                  <td className="p-3">{formatInr(b.paidAmount)}</td>
                  <td className="p-3 font-bold">{formatInr(Math.max(b.totalAmount - b.paidAmount, 0))}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{b.paymentState.replace(/_/g, " ")}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{b.status.replace(/_/g, " ")}</td>
                  <td className="p-3 text-[11px] text-gray-400">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {bookings.length === 0 ? 0 : offset + 1}-{offset + bookings.length} of {total}
        </span>
        <div className="flex gap-2">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
