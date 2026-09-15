import "server-only";
import crypto from "node:crypto";
import { supabaseAdmin } from "./supabase";
import { AppError } from "./errors";

export function hashRequestBody(body: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

type Claim =
  | { kind: "new" }
  | { kind: "replay"; statusCode: number; response: unknown };

/**
 * Claims an Idempotency-Key for one endpoint. Call this before doing any
 * mutating work; on `{kind: "new"}`, do the work and then call
 * `completeIdempotencyKey` with the result. Throws AppError("DUPLICATE_REQUEST")
 * if the same key was used with a different request body, and
 * AppError("REQUEST_IN_PROGRESS") if a concurrent request with the same key
 * is still being processed.
 */
export async function claimIdempotencyKey(
  endpoint: string,
  key: string,
  actorId: string | null,
  requestBody: unknown
): Promise<Claim> {
  const requestHash = hashRequestBody(requestBody);
  const db = supabaseAdmin();

  const { error: insertError } = await db
    .from("idempotency_keys")
    .insert({ endpoint, key, actor_id: actorId, request_hash: requestHash, locked_at: new Date().toISOString() });

  if (!insertError) {
    return { kind: "new" };
  }

  // 23505 = unique_violation -> a row for (endpoint, key) already exists.
  if (insertError.code !== "23505") {
    throw new AppError("INTERNAL_ERROR", "Could not process request.");
  }

  const { data: existing } = await db
    .from("idempotency_keys")
    .select("request_hash, status_code, response")
    .eq("endpoint", endpoint)
    .eq("key", key)
    .single();

  if (!existing) {
    throw new AppError("INTERNAL_ERROR", "Could not process request.");
  }

  if (existing.request_hash !== requestHash) {
    throw new AppError("DUPLICATE_REQUEST", "This idempotency key was already used with a different request.");
  }

  if (existing.status_code === null) {
    throw new AppError("REQUEST_IN_PROGRESS", "This request is still being processed.");
  }

  return { kind: "replay", statusCode: existing.status_code, response: existing.response };
}

export async function completeIdempotencyKey(
  endpoint: string,
  key: string,
  statusCode: number,
  response: unknown
): Promise<void> {
  await supabaseAdmin()
    .from("idempotency_keys")
    .update({ status_code: statusCode, response })
    .eq("endpoint", endpoint)
    .eq("key", key);
}

/** Releases a claimed key on failure so the client can retry with the same key. */
export async function releaseIdempotencyKey(endpoint: string, key: string): Promise<void> {
  await supabaseAdmin().from("idempotency_keys").delete().eq("endpoint", endpoint).eq("key", key).is("status_code", null);
}
