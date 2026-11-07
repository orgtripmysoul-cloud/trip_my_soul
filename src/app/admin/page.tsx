"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarClock, ExternalLink, TrendingUp, UserPlus, Users } from "lucide-react";
import { adminGet } from "@/lib/client/adminApi";
import { SITE_URL } from "@/lib/seo";
import {
  LEAD_STATUS_LABELS,
  PIPELINE_STATUSES,
  type AdminDashboardResponse,
  type AdminMarketingSummary,
  type MarketingRange,
} from "@/lib/types/crm";

const RANGE_LABELS: Record<MarketingRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  month: "This month",
};

function formatInr(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<MarketingRange>("30d");

  useEffect(() => {
    adminGet<AdminDashboardResponse>(`/api/v1/admin/dashboard?range=${range}`)
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load the dashboard."))
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="p-12 text-center text-xs text-gray-400 font-semibold">Loading…</div>;
  if (error || !data)
    return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">{error}</div>;

  const { today, pipeline, conversion, leaderboard, marketing } = data;
  const refreshing = marketing.range !== range;
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

      <MarketingSection marketing={marketing} range={range} onRangeChange={setRange} refreshing={refreshing} />
    </div>
  );
}

function MarketingSection({
  marketing,
  range,
  onRangeChange,
  refreshing,
}: {
  marketing: AdminMarketingSummary;
  range: MarketingRange;
  onRangeChange: (r: MarketingRange) => void;
  refreshing: boolean;
}) {
  const maxLeads = Math.max(1, ...marketing.byChannel.map((c) => c.leads));
  const untracked = marketing.totalLeads - marketing.trackedLeads;
  const seo = marketing.byChannel.find((c) => c.channel === "organic_search");

  return (
    <section className={`space-y-4 transition-opacity ${refreshing ? "opacity-50" : ""}`} aria-busy={refreshing}>
      <div className="flex flex-wrap items-end justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl font-extrabold font-serif text-brand-dark-text">Marketing performance</h2>
          <p className="text-xs text-gray-500">Which channels and pages bring enquiries and bookings.</p>
        </div>
        <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm" role="tablist" aria-label="Date range">
          {(Object.keys(RANGE_LABELS) as MarketingRange[]).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              onClick={() => onRangeChange(r)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                range === r ? "bg-brand-forest text-white" : "text-gray-500 hover:text-brand-forest"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryTile label="Enquiries" value={String(marketing.totalLeads)} />
        <SummaryTile
          label="From Google search (SEO)"
          value={String(seo?.leads ?? 0)}
          hint={marketing.totalLeads > 0 ? `${Math.round(((seo?.leads ?? 0) / marketing.totalLeads) * 100)}% of enquiries` : undefined}
        />
        {marketing.revenue && (
          <>
            <SummaryTile label="Paid bookings" value={String(marketing.revenue.bookings)} />
            <SummaryTile label="Cash collected" value={formatInr(marketing.revenue.collected)} />
          </>
        )}
      </div>

      {untracked > 0 && (
        <p className="text-[11px] text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
          {untracked} of {marketing.totalLeads} enquiries came in before channel tracking started, so they show as
          &ldquo;Unknown&rdquo;. New enquiries are tracked automatically.
        </p>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        <h3 className="px-6 pt-5 text-sm font-bold text-brand-dark-text">Channels</h3>
        {marketing.byChannel.length === 0 ? (
          <p className="px-6 py-5 text-xs text-gray-400">No enquiries or bookings in this period yet.</p>
        ) : (
          <table className="w-full text-xs mt-2">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                <th className="px-6 py-2">Channel</th>
                <th className="px-3 py-2 w-1/3">Enquiries</th>
                <th className="px-3 py-2 text-right">Converted</th>
                <th className="px-3 py-2 text-right">Conv. rate</th>
                {marketing.revenue && <th className="px-3 py-2 text-right">Bookings</th>}
                {marketing.revenue && <th className="px-6 py-2 text-right">Collected</th>}
              </tr>
            </thead>
            <tbody>
              {marketing.byChannel.map((c) => (
                <tr key={c.channel} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-2.5 font-semibold text-brand-dark-text whitespace-nowrap">{c.label}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[60px]">
                        <div
                          className="h-full bg-brand-forest-light rounded-full"
                          style={{ width: `${(c.leads / maxLeads) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-600 w-8 text-right">{c.leads}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right">{c.converted}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-brand-forest">{c.leads > 0 ? `${c.rate}%` : "—"}</td>
                  {marketing.revenue && <td className="px-3 py-2.5 text-right">{c.bookings}</td>}
                  {marketing.revenue && <td className="px-6 py-2.5 text-right font-bold">{formatInr(c.revenue)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
          <h3 className="px-6 pt-5 text-sm font-bold text-brand-dark-text">Top entry pages</h3>
          <p className="px-6 text-[11px] text-gray-500">
            The first page visitors saw before enquiring — improve these first.
          </p>
          {marketing.topLandingPages.length === 0 ? (
            <p className="px-6 py-5 text-xs text-gray-400">No tracked entry pages in this period yet.</p>
          ) : (
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 text-left">
                  <th className="px-6 py-2">Page</th>
                  <th className="px-3 py-2 text-right">Enquiries</th>
                  <th className="px-3 py-2 text-right">Converted</th>
                  <th className="px-6 py-2 text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {marketing.topLandingPages.map((p) => (
                  <tr key={p.page} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-2.5 max-w-[320px]">
                      {p.page.startsWith("/") ? (
                        <a
                          href={`${SITE_URL}${p.page}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-brand-forest hover:underline break-all"
                        >
                          {p.page}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-400">{p.page}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold">{p.leads}</td>
                    <td className="px-3 py-2.5 text-right">{p.converted}</td>
                    <td className="px-6 py-2.5 text-right font-bold text-brand-forest">{p.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-brand-dark-text">Most-enquired trips</h3>
          <p className="text-[11px] text-gray-500 mb-3">Demand signal for departures and content.</p>
          {marketing.topTreks.length === 0 ? (
            <p className="text-xs text-gray-400">No trip-specific enquiries yet.</p>
          ) : (
            <ol className="space-y-2.5">
              {marketing.topTreks.map((t, i) => (
                <li key={t.trek} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-warm-card text-[10px] font-extrabold text-brand-forest flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-brand-dark-text flex-1 truncate" title={t.trek}>
                    {t.trek}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {t.converted}/{t.leads}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="text-2xl font-extrabold text-brand-forest">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mt-1.5">{label}</div>
      {hint && <div className="text-[10px] text-gray-500 mt-0.5">{hint}</div>}
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
