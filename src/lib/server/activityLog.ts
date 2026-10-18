import "server-only";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabase";
import { getClientIp } from "./requestIp";
import type { StaffContext } from "./adminAuth";

export interface ActivityLogEntry {
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
}

/**
 * Appends to the admin audit trail.
 *
 * Deliberately never throws: an audit write failing must not roll back or
 * 500 the business action the user just performed. A dropped log line is
 * logged to the server console for investigation instead.
 */
export async function logActivity(
  staff: StaffContext,
  request: NextRequest,
  entry: ActivityLogEntry
): Promise<void> {
  try {
    await supabaseAdmin()
      .from("activity_logs")
      .insert({
        staff_id: staff.id,
        staff_email: staff.email,
        action: entry.action,
        module: entry.module,
        entity_type: entry.entityType ?? null,
        entity_id: entry.entityId ?? null,
        old_values: entry.oldValues ?? null,
        new_values: entry.newValues ?? null,
        ip: getClientIp(request),
        user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      });
  } catch (err) {
    console.error("[activity_log] failed to record entry", entry.action, entry.module, err);
  }
}

/** Returns only the keys whose value actually changed, for a compact audit diff. */
export function diffValues<T extends Record<string, unknown>>(
  before: T,
  after: Partial<T>
): { oldValues: Record<string, unknown>; newValues: Record<string, unknown> } {
  const oldValues: Record<string, unknown> = {};
  const newValues: Record<string, unknown> = {};

  for (const key of Object.keys(after)) {
    if (after[key] !== undefined && before[key] !== after[key]) {
      oldValues[key] = before[key] ?? null;
      newValues[key] = after[key] ?? null;
    }
  }

  return { oldValues, newValues };
}
