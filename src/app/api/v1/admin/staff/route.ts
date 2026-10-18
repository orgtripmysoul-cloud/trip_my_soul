import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { errorResponseBody, statusForError } from "@/lib/server/errors";
import type { AdminStaffOption, StaffRole } from "@/lib/types/crm";

export const dynamic = "force-dynamic";

/** Active staff, for the owner dropdown and assignment filters. */
export async function GET(request: NextRequest) {
  try {
    await requireStaff(request);

    const { data, error } = await supabaseAdmin()
      .from("staff")
      .select("id, full_name, role")
      .eq("active", true)
      .order("full_name", { ascending: true });

    if (error) throw error;

    const staff: AdminStaffOption[] = (data ?? []).map((s) => ({
      id: s.id,
      fullName: s.full_name,
      role: s.role as StaffRole,
    }));

    return NextResponse.json({ staff }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
