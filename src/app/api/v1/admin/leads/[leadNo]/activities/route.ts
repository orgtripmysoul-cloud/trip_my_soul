import { NextRequest, NextResponse } from "next/server";
import "server-only";
import { supabaseAdmin } from "@/lib/server/supabase";
import { requireStaff } from "@/lib/server/adminAuth";
import { requirePermission, canSeeAllLeads } from "@/lib/server/permissions";
import { AppError, errorResponseBody, statusForError } from "@/lib/server/errors";
import type { CreateLeadActivityRequest } from "@/lib/types/crm";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["note", "call", "whatsapp", "email"] as const;

/** Logs a call, note, WhatsApp message or email against a lead's timeline. */
export async function POST(request: NextRequest, { params }: { params: Promise<{ leadNo: string }> }) {
  try {
    const staff = await requireStaff(request);
    await requirePermission(staff, "leads", "edit");

    const { leadNo } = await params;

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      throw new AppError("VALIDATION_FAILED", "Invalid JSON body.");
    }
    const body = rawBody as CreateLeadActivityRequest;

    if (!body.type || !(ALLOWED_TYPES as readonly string[]).includes(body.type)) {
      throw new AppError("VALIDATION_FAILED", "Choose what kind of activity this is.");
    }
    if (!body.body?.trim() && !body.outcome?.trim()) {
      throw new AppError("VALIDATION_FAILED", "Add a note or an outcome.");
    }

    const db = supabaseAdmin();
    const { data: lead, error } = await db
      .from("leads")
      .select("id, owner_id, status, first_contacted_at")
      .eq("lead_no", leadNo)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) throw error;
    if (!lead) throw new AppError("NOT_FOUND", "We could not find that lead.");
    if (!canSeeAllLeads(staff) && lead.owner_id !== staff.id) {
      throw new AppError("FORBIDDEN", "This lead belongs to another salesperson.");
    }

    const { error: insertError } = await db.from("lead_activities").insert({
      lead_id: lead.id,
      type: body.type,
      body: body.body?.trim() || null,
      outcome: body.outcome?.trim() || null,
      duration_seconds: typeof body.durationSeconds === "number" && body.durationSeconds >= 0 ? body.durationSeconds : null,
      staff_id: staff.id,
    });
    if (insertError) {
      console.error("[admin/leads] activity insert failed", insertError);
      throw new AppError("INTERNAL_ERROR", "Could not save the activity.");
    }

    // Logging a real contact attempt stamps first contact, so the response-time
    // report reflects reality even if the salesperson has not moved the status.
    if (!lead.first_contacted_at && body.type !== "note") {
      await db.from("leads").update({ first_contacted_at: new Date().toISOString() }).eq("id", lead.id);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(errorResponseBody(err), { status: statusForError(err) });
  }
}
