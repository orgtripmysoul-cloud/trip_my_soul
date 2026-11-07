"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Mail, Pencil, Phone } from "lucide-react";
import { adminGet, adminSend, formatDate, formatDateTime } from "@/lib/client/adminApi";
import type { AdminCustomerDetailResponse } from "@/lib/types/customer";

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function label(value: string): string {
  return value.replace(/_/g, " ");
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{title}</div>
      <div className="text-xl font-extrabold text-brand-dark-text mt-1">{value}</div>
    </div>
  );
}

export default function AdminCustomerDetailPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;

  const [data, setData] = useState<AdminCustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminGet<AdminCustomerDetailResponse>(`/api/v1/admin/customers/${customerId}`);
      setData(d);
      setForm({ name: d.customer.name, email: d.customer.email, phone: d.customer.phone });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the customer.");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setSaveError(null);
    try {
      const body: Record<string, string> = {};
      if (form.name !== data.customer.name) body.name = form.name;
      if (form.email !== data.customer.email) body.email = form.email;
      if (form.phone !== data.customer.phone) body.phone = form.phone;
      if (Object.keys(body).length > 0) {
        await adminSend(`/api/v1/admin/customers/${customerId}`, "PATCH", body);
      }
      setEditing(false);
      await load();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !data) return <div className="p-8 text-center text-xs text-gray-400 font-semibold">Loading...</div>;
  if (error || !data) return <div className="p-8 text-center text-xs text-red-500 font-semibold">{error ?? "Not found."}</div>;

  const { customer, stats, bookings, payments, leads } = data;
  const digits = customer.phone.replace(/[^\d]/g, "");

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-brand-forest">
        <ArrowLeft className="w-3.5 h-3.5" /> All customers
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        {!editing ? (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">{customer.name}</h1>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                <a href={`mailto:${customer.email}`} className="flex items-center gap-1 hover:text-brand-forest">
                  <Mail className="w-3.5 h-3.5" /> {customer.email}
                </a>
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-brand-forest">
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </a>
                {digits.length >= 10 && (
                  <a
                    href={`https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
              <div className="text-[11px] text-gray-400">Customer since {formatDate(customer.createdAt)}</div>
            </div>
            {data.canEdit && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-brand-warm-bg"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit details
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={save} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["name", "email", "phone"] as const).map((field) => (
                <label key={field} className="text-[10px] uppercase tracking-wider font-bold text-gray-500 space-y-1">
                  <span>{field}</span>
                  <input
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    required
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-warm-bg border border-gray-150 rounded-xl text-sm normal-case font-normal text-brand-dark-text"
                  />
                </label>
              ))}
            </div>
            {saveError && <p className="text-xs font-semibold text-red-600">{saveError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-brand-forest text-white rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setForm({ name: customer.name, email: customer.email, phone: customer.phone });
                }}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat title="Bookings" value={String(stats.bookingsCount)} />
        <Stat title="Total billed" value={formatInr(stats.totalBilled)} />
        <Stat title="Total paid" value={formatInr(stats.totalPaid)} />
        <Stat title="Outstanding" value={formatInr(stats.outstanding)} />
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        <h2 className="p-4 pb-2 text-sm font-extrabold text-brand-dark-text">Bookings</h2>
        {bookings.length === 0 ? (
          <p className="p-4 pt-0 text-xs text-gray-400">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="p-3">Booking</th>
                <th className="p-3">Trip</th>
                <th className="p-3">Pax</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingNo} className="border-b border-gray-50 last:border-0">
                  <td className="p-3">
                    <Link href={`/admin/bookings/${b.bookingNo}`} className="font-bold text-brand-forest hover:underline">
                      {b.bookingNo}
                    </Link>
                    <div className="text-[10px] text-gray-400">{formatDate(b.createdAt)}</div>
                  </td>
                  <td className="p-3">
                    <div>{b.trekName || "—"}</div>
                    <div className="text-[10px] text-gray-400">{b.batchLabel}</div>
                  </td>
                  <td className="p-3">{b.pax}</td>
                  <td className="p-3">{formatInr(b.totalAmount)}</td>
                  <td className="p-3">{formatInr(b.paidAmount)}</td>
                  <td className="p-3 text-[11px] uppercase font-bold">{label(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
          <h2 className="p-4 pb-2 text-sm font-extrabold text-brand-dark-text">Payments</h2>
          {payments.length === 0 ? (
            <p className="p-4 pt-0 text-xs text-gray-400">No payments yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-gray-50">
                    <td className="p-3">
                      <div className="font-bold">{formatInr(p.amount)}</div>
                      <div className="text-[10px] text-gray-400">{formatDateTime(p.capturedAt ?? p.createdAt)}</div>
                    </td>
                    <td className="p-3 text-xs">
                      <div>{p.bookingNo}</div>
                      <div className="text-[10px] text-gray-400 uppercase">{label(p.method ?? p.gateway)}</div>
                    </td>
                    <td className="p-3 text-[11px] uppercase font-bold">{label(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
          <h2 className="p-4 pb-2 text-sm font-extrabold text-brand-dark-text">Enquiries (leads)</h2>
          {leads.length === 0 ? (
            <p className="p-4 pt-0 text-xs text-gray-400">No linked enquiries.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {leads.map((l) => (
                  <tr key={l.leadNo} className="border-t border-gray-50">
                    <td className="p-3">
                      <Link href={`/admin/leads/${l.leadNo}`} className="font-bold text-brand-forest hover:underline">
                        {l.leadNo}
                      </Link>
                      <div className="text-[10px] text-gray-400">{formatDate(l.createdAt)}</div>
                    </td>
                    <td className="p-3 text-xs">{l.trekName ?? label(l.formType)}</td>
                    <td className="p-3 text-[11px] uppercase font-bold">{label(l.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
