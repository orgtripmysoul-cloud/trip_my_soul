"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

/** Bearer token for every admin API call. Throws if the session has gone. */
export async function authHeader(): Promise<Record<string, string>> {
  const supabase = supabaseBrowser();
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  if (!session) throw new Error("Not signed in.");
  return { Authorization: `Bearer ${session.access_token}` };
}

async function parse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as T & { message?: string };
  if (!res.ok) throw new Error(body.message ?? "Something went wrong.");
  return body;
}

export async function adminGet<T>(path: string): Promise<T> {
  return parse<T>(await fetch(path, { headers: await authHeader() }));
}

export async function adminSend<T>(path: string, method: "POST" | "PATCH", body: unknown): Promise<T> {
  return parse<T>(
    await fetch(path, {
      method,
      headers: { "Content-Type": "application/json", ...(await authHeader()) },
      body: JSON.stringify(body),
    })
  );
}

/** "in 2 days", "3 hours ago" — short relative time for timelines and due dates. */
export function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diffMs = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const format = (value: number, unit: string) => {
    const rounded = Math.round(value);
    const plural = rounded === 1 ? unit : `${unit}s`;
    return diffMs < 0 ? `${rounded} ${plural} ago` : `in ${rounded} ${plural}`;
  };

  if (abs < minute) return "just now";
  if (abs < hour) return format(abs / minute, "min");
  if (abs < day) return format(abs / hour, "hour");
  if (abs < 30 * day) return format(abs / day, "day");
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Value for a `datetime-local` input, offset to the viewer's timezone. */
export function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}
