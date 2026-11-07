"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { adminGet, authHeader, formatDate } from "@/lib/client/adminApi";
import type { AdminCustomerListItem, AdminCustomerListResponse } from "@/lib/types/customer";

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "name">("recent");
  const [offset, setOffset] = useState(0);
  const limit = 25;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort, limit: String(limit), offset: String(offset) });
      if (query) params.set("q", query);
      const data = await adminGet<AdminCustomerListResponse>(`/api/v1/admin/customers?${params.toString()}`);
      setCustomers(data.customers);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers.");
      setCustomers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query, sort, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    setQuery(q.trim());
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const params = new URLSearchParams({ format: "csv", sort });
      if (query) params.set("q", query);
      const res = await fetch(`/api/v1/admin/customers?${params.toString()}`, { headers: await authHeader() });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message ?? "Export failed.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tripmysoul-customers-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Customers</h1>
          <p className="text-xs text-gray-500">Everyone who has booked or paid, with their booking history.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-bold hover:bg-brand-warm-bg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl flex-grow">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search name, email or phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-transparent border-0 text-sm focus:outline-none w-full min-w-0"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "recent" | "name");
            setOffset(0);
          }}
          className="px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm"
        >
          <option value="recent">Newest first</option>
          <option value="name">Name A–Z</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-brand-forest hover:bg-brand-forest-light text-white rounded-xl font-bold text-sm transition"
        >
          Search
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        {loading && <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading customers...</div>}
        {!loading && error && <div className="p-8 text-center text-xs text-red-500 font-semibold">{error}</div>}
        {!loading && !error && customers.length === 0 && (
          <div className="p-8 text-center text-xs text-gray-400 font-semibold">No customers found.</div>
        )}
        {!loading && !error && customers.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Bookings</th>
                <th className="p-3">Total paid</th>
                <th className="p-3">Last booking</th>
                <th className="p-3">Customer since</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-brand-warm-bg/50">
                  <td className="p-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-bold text-brand-forest hover:underline">
                      {c.name}
                    </Link>
                    <div className="text-[10px] text-gray-400">{c.email}</div>
                  </td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3 font-bold">{c.bookingsCount}</td>
                  <td className="p-3">{formatInr(c.totalPaid)}</td>
                  <td className="p-3 text-[11px] text-gray-500">{formatDate(c.lastBookingAt)}</td>
                  <td className="p-3 text-[11px] text-gray-400">{formatDate(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Showing {customers.length === 0 ? 0 : offset + 1}-{offset + customers.length} of {total}
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
