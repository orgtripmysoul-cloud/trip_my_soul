"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarClock, TrendingUp, UserPlus, Users } from "lucide-react";
import { adminGet } from "@/lib/client/adminApi";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  PIPELINE_STATUSES,
  type AdminDashboardResponse,
} from "@/lib/types/crm";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGet<AdminDashboardResponse>("/api/v1/admin/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load the dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-xs text-gray-400 font-semibold">Loading…</div>;
  if (error || !data)
    return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">{error}</div>;

  const { today, pipeline, bySource, conversion, leaderboard } = data;
  const maxSource = Math.max(1, ...bySource.map((s) => s.count));
  const trend = conversion.thisMonth.rate - conversion.lastMonth.rate;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold font-serif text-brand-dark-text">Today</h1>

      {/* Today's numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="New leads today"
          value={today.newLeads}
          icon={<UserPlus className="w-4 h-4" />}
          href="/admin/leads?status=new"
        />
        <StatTile
          label="Follow-ups due"
          value={today.followUpsDue}
          icon={<CalendarClock className="w-4 h-4" />}
          href="/admin/leads?due=today"
        />
        <StatTile
          label="Overdue"
          value={today.followUpsOverdue}
          icon={<AlertTriangle className="w-4 h-4" />}
          href="/admin/leads?due=overdue"
          tone={today.followUpsOverdue > 0 ? "alert" : "default"}
        />
        <StatTile
          label="Unassigned"
          value={today.unassigned}
          icon={<Users className="w-4 h-4" />}
          href="/admin/leads?ownerId=unassigned"
          tone={today.unassigned > 0 ? "warn" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-dark-text mb-4">Pipeline</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PIPELINE_STATUSES.map((status) => (
              <Link
                key={status}
                href={`/admin/leads?status=${status}`}
                className="p-3 rounded-xl bg-brand-warm-card/50 hover:bg-brand-warm-card transition"
              >
                <div className="text-xl font-extrabold text-brand-forest">{pipeline[status] ?? 0}</div>
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-0.5">
                  {LEAD_STATUS_LABELS[status]}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-50">
            <h3 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-3">Leads by source</h3>
            <div className="space-y-2">
              {bySource.length === 0 && <p className="text-xs text-gray-400">No leads yet.</p>}
              {bySource.map(({ source, count }) => (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-600 w-28 shrink-0">{LEAD_SOURCE_LABELS[source]}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-forest-light rounded-full"
                      style={{ width: `${(count / maxSource) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-brand-dark-text mb-4">Conversion</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-forest">{conversion.thisMonth.rate}%</span>
              {conversion.lastMonth.total > 0 && (
                <span className={`text-xs font-bold flex items-center gap-0.5 ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${trend < 0 ? "rotate-180" : ""}`} />
                  {Math.abs(Math.round(trend * 10) / 10)}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              {conversion.thisMonth.converted} of {conversion.thisMonth.total} leads this month
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Last month: {conversion.lastMonth.rate}% ({conversion.lastMonth.converted}/{conversion.lastMonth.total})
            </p>
          </div>

          {leaderboard.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-brand-dark-text mb-4">Team this month</h2>
              <ol className="space-y-3">
                {leaderboard.map((row, i) => (
                  <li key={row.staffId} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-warm-card text-[10px] font-extrabold text-brand-forest flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-brand-dark-text flex-1 truncate">{row.name}</span>
                    <span className="text-[11px] text-gray-500">
                      {row.converted}/{row.assigned}
                    </span>
                    <span className="text-[11px] font-bold text-brand-forest w-10 text-right">{row.rate}%</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  href,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  tone?: "default" | "warn" | "alert";
}) {
  const toneClasses = {
    default: "text-brand-forest",
    warn: "text-brand-dusk",
    alert: "text-red-600",
  }[tone];

  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-brand-forest-light/40 transition block"
    >
      <div className={`flex items-center gap-1.5 ${toneClasses}`}>
        {icon}
        <span className="text-2xl font-extrabold">{value}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1.5">{label}</div>
    </Link>
  );
}
