import "server-only";
import { supabaseAdmin } from "./supabase";
import { AppError } from "./errors";
import type { StaffContext } from "./adminAuth";

export type PermissionAction = "view" | "create" | "edit" | "export" | "delete";

/**
 * Permission check against the `role_permissions` table (module × action), so
 * a new role is a few rows rather than a deploy.
 *
 * super_admin is allowed everything in code and never consults the table — a
 * bad or missing grant row must not be able to lock the owner out of the panel.
 */
export async function hasPermission(
  staff: StaffContext,
  module: string,
  action: PermissionAction
): Promise<boolean> {
  if (staff.role === "super_admin") return true;

  const { data, error } = await supabaseAdmin()
    .from("role_permissions")
    .select("id")
    .eq("role", staff.role)
    .eq("module", module)
    .eq("action", action)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

/** Throws FORBIDDEN unless the staff member's role grants `module × action`. */
export async function requirePermission(
  staff: StaffContext,
  module: string,
  action: PermissionAction
): Promise<void> {
  if (!(await hasPermission(staff, module, action))) {
    throw new AppError("FORBIDDEN", "You do not have permission to perform this action.");
  }
}

/**
 * Whether this role sees the whole pipeline or only its own leads.
 * A salesperson is scoped to their own; managers and above see everything.
 */
export function canSeeAllLeads(staff: StaffContext): boolean {
  return staff.role === "super_admin" || staff.role === "sales_manager" || staff.role === "operations";
}

/** Only managers and above may reassign a lead to a different owner. */
export function canAssignLeads(staff: StaffContext): boolean {
  return staff.role === "super_admin" || staff.role === "sales_manager";
}

/**
 * Masks a phone number for roles that have no reason to call the customer.
 * Content editors can see that a lead exists without harvesting contact data.
 */
export function maskPhone(phone: string, staff: StaffContext): string {
  if (staff.role === "content_editor") {
    return phone.length <= 4 ? "••••" : `${"•".repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`;
  }
  return phone;
}
