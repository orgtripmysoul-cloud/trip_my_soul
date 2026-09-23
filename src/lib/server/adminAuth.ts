import "server-only";
import { supabaseAdmin } from "./supabase";
import { AppError } from "./errors";

export interface StaffContext {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "staff";
}

/**
 * Authenticates a request against the admin panel: verifies the Supabase
 * Auth bearer token (same extraction as bookings/mine/route.ts), then
 * resolves that auth user to a `staff` row. A valid Supabase session alone
 * is not enough — only a matching, active `staff` row grants access.
 */
export async function requireStaff(request: Request): Promise<StaffContext> {
  const authHeader = request.headers.get("authorization") ?? "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  if (!accessToken) {
    throw new AppError("UNAUTHORIZED", "Missing bearer token.");
  }

  const db = supabaseAdmin();
  const { data: userData, error: userError } = await db.auth.getUser(accessToken);
  if (userError || !userData.user) {
    throw new AppError("UNAUTHORIZED", "Not signed in.");
  }

  const { data: staff } = await db
    .from("staff")
    .select("id, full_name, email, role, active")
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();

  if (!staff || !staff.active) {
    throw new AppError("FORBIDDEN", "You are not authorized to access the admin panel.");
  }

  return {
    id: staff.id,
    fullName: staff.full_name,
    email: staff.email,
    role: staff.role,
  };
}
