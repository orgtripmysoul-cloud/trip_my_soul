export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "SEATS_UNAVAILABLE",
  "HOLD_EXPIRED",
  "DUPLICATE_REQUEST",
  "REQUEST_IN_PROGRESS",
  "PAYMENT_VERIFICATION_FAILED",
  "GATEWAY_UNAVAILABLE",
  "NOT_FOUND",
  "DB_OPERATION_FAILED",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE",
  "EMAIL_NOT_VERIFIED",
  "RATE_LIMITED",
  "FORBIDDEN",
  "UNAUTHORIZED",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  SEATS_UNAVAILABLE: 409,
  HOLD_EXPIRED: 409,
  DUPLICATE_REQUEST: 409,
  REQUEST_IN_PROGRESS: 409,
  PAYMENT_VERIFICATION_FAILED: 400,
  GATEWAY_UNAVAILABLE: 502,
  NOT_FOUND: 404,
  DB_OPERATION_FAILED: 500,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  EMAIL_NOT_VERIFIED: 403,
  RATE_LIMITED: 429,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

/** Thrown by route handlers; never leaks stack traces or secrets to the client. */
export class AppError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = STATUS_BY_CODE[code];
  }
}

export function errorResponseBody(error: unknown): { code: ErrorCode; message: string } {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message };
  }
  return { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." };
}

export function statusForError(error: unknown): number {
  return error instanceof AppError ? error.status : 500;
}

/** Maps a Postgres error raised by our RPC functions (see 0007_functions_triggers.sql) to an AppError. */
export function fromPostgresError(error: { code?: string; message?: string }): AppError {
  const message = error.message ?? "";
  if (message.includes("SEATS_UNAVAILABLE")) {
    return new AppError("SEATS_UNAVAILABLE", "Sorry, these seats are no longer available. Please choose another departure.");
  }
  if (
    message.includes("DEPARTURE_NOT_FOUND") ||
    message.includes("PAYMENT_NOT_FOUND") ||
    message.includes("BOOKING_NOT_FOUND")
  ) {
    return new AppError("NOT_FOUND", "We couldn't find that booking.");
  }
  if (message.includes("BOOKING_NOT_CANCELLABLE")) {
    return new AppError("VALIDATION_FAILED", "This booking is already cancelled or completed.");
  }
  if (message.includes("BOOKING_NOT_PAYABLE")) {
    return new AppError("VALIDATION_FAILED", "This booking cannot accept further payments.");
  }
  if (message.includes("INVALID_AMOUNT") || message.includes("INVALID_INITIAL_PAYMENT_AMOUNT")) {
    return new AppError("VALIDATION_FAILED", "Please enter a valid amount.");
  }
  if (message.includes("AMOUNT_EXCEEDS_BALANCE")) {
    return new AppError("VALIDATION_FAILED", "This amount exceeds the outstanding balance.");
  }
  if (message.includes("INVALID_METHOD")) {
    return new AppError("VALIDATION_FAILED", "Unsupported payment method.");
  }
  // A Postgres error code with none of our own raise-exception messages means
  // the database itself rejected the statement (a type mismatch, a constraint,
  // a missing function) rather than a business rule we raised deliberately.
  // Distinguishing it from a generic failure makes these visible in logs and
  // dashboards instead of being lost in the INTERNAL_ERROR bucket — the
  // 42804 cast regression (see 0019_restore_payment_kind_cast.sql) looked
  // exactly like any other 500 from the outside.
  if (error.code) {
    return new AppError("DB_OPERATION_FAILED", "We couldn't save your booking. Please try again.");
  }
  return new AppError("INTERNAL_ERROR", "Something went wrong. Please try again.");
}

/**
 * Logs the shape of a server-side failure for debugging.
 *
 * Deliberately logs only the error's own diagnostic fields. Request bodies
 * (traveller names, emails, phone numbers), environment values, tokens and
 * API keys must never reach the logs, so nothing but the error is accepted
 * here and nothing but these five fields is read off it.
 */
export function logError(endpoint: string, error: unknown): void {
  const e = (error ?? {}) as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown; stack?: unknown };
  console.error(`[${endpoint}]`, {
    message: typeof e.message === "string" ? e.message : undefined,
    code: typeof e.code === "string" ? e.code : undefined,
    details: typeof e.details === "string" ? e.details : undefined,
    hint: typeof e.hint === "string" ? e.hint : undefined,
    stack: typeof e.stack === "string" ? e.stack : undefined,
  });
}
