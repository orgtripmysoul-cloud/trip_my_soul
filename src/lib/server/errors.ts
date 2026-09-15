export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "SEATS_UNAVAILABLE",
  "HOLD_EXPIRED",
  "DUPLICATE_REQUEST",
  "REQUEST_IN_PROGRESS",
  "PAYMENT_VERIFICATION_FAILED",
  "GATEWAY_UNAVAILABLE",
  "NOT_FOUND",
  "INTERNAL_ERROR",
  "SERVICE_UNAVAILABLE",
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
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
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
  if (message.includes("DEPARTURE_NOT_FOUND") || message.includes("PAYMENT_NOT_FOUND")) {
    return new AppError("NOT_FOUND", "We couldn't find that booking.");
  }
  return new AppError("INTERNAL_ERROR", "Something went wrong. Please try again.");
}
