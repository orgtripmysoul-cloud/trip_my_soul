#!/usr/bin/env node
/**
 * Creates (or re-activates) an admin-panel login.
 *
 * The panel needs two things that must agree: a Supabase Auth user, and a
 * `staff` row pointing at that user's id. requireStaff() rejects a valid
 * Supabase session that has no active staff row, so creating the auth user
 * alone is not enough — that is the most common reason a fresh login bounces
 * straight back to /admin/login.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-staff.mjs <email> <password> [role] [full name]
 *
 * Roles: super_admin (default), sales_manager, salesperson, operations,
 *        accounts, content_editor
 *
 * Safe to re-run: an existing auth user is reused and its staff row updated.
 */
import { createClient } from "@supabase/supabase-js";

const [, , email, password, role = "super_admin", ...nameParts] = process.argv;

const VALID_ROLES = [
  "super_admin",
  "sales_manager",
  "salesperson",
  "operations",
  "accounts",
  "content_editor",
];

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/create-staff.mjs <email> <password> [role] [full name]");
  console.error(`Roles: ${VALID_ROLES.join(", ")}`);
  process.exit(1);
}
if (!VALID_ROLES.includes(role)) {
  console.error(`Unknown role "${role}". Valid roles: ${VALID_ROLES.join(", ")}`);
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Pass --env-file=.env.local and retry.");
  process.exit(1);
}

const fullName = nameParts.join(" ") || email.split("@")[0];
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

console.log(`Target project: ${url}`);
console.log(`Creating staff login: ${email} (${role})\n`);

// 1. Auth user ---------------------------------------------------------------
let authUserId;

const { data: created, error: createError } = await db.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (created?.user) {
  authUserId = created.user.id;
  console.log("✓ Auth user created");
} else if (createError?.message?.match(/already|registered|exists/i)) {
  // Re-run against an existing user: find them and reset the password so the
  // caller definitely knows the credentials.
  const { data: list, error: listError } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (listError) {
    console.error("Could not list existing users:", listError.message);
    process.exit(1);
  }
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!existing) {
    console.error(`User "${email}" reported as existing but was not found. Aborting.`);
    process.exit(1);
  }
  authUserId = existing.id;
  await db.auth.admin.updateUserById(authUserId, { password, email_confirm: true });
  console.log("✓ Auth user already existed — password reset");
} else {
  console.error("Could not create the auth user:", createError?.message ?? "unknown error");
  process.exit(1);
}

// 2. Staff row ---------------------------------------------------------------
const { data: existingStaff } = await db
  .from("staff")
  .select("id")
  .eq("auth_user_id", authUserId)
  .maybeSingle();

if (existingStaff) {
  const { error } = await db
    .from("staff")
    .update({ role, active: true, full_name: fullName, accepts_leads: role === "salesperson" })
    .eq("id", existingStaff.id);
  if (error) {
    console.error("Could not update the staff row:", error.message);
    process.exit(1);
  }
  console.log("✓ Staff row updated");
} else {
  const { error } = await db.from("staff").insert({
    auth_user_id: authUserId,
    full_name: fullName,
    email,
    role,
    active: true,
    // Only salespeople are in the round-robin; a super_admin should not be
    // assigned website leads by default.
    accepts_leads: role === "salesperson",
  });
  if (error) {
    console.error("Could not create the staff row:", error.message);
    if (error.message.includes("accepts_leads") || error.message.includes("column")) {
      console.error("\nHint: migration 0016_crm_leads.sql has not been applied to this database yet.");
    }
    process.exit(1);
  }
  console.log("✓ Staff row created");
}

console.log(`\nDone. Sign in at /admin/login as ${email}`);
