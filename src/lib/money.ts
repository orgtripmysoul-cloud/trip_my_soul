/**
 * INR is stored and computed as rupees with 2 decimal places everywhere.
 * Conversion to integer paise happens ONLY at the Razorpay boundary — never
 * store or compare paise anywhere else.
 */

export const MAX_INR_AMOUNT = 10_000_000;

/** Rounds to 2 decimal places using standard rounding, avoiding float drift. */
export function round2(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/** True for amounts the LLD allows: > 0, <= 10,000,000, exactly 2 decimals. */
export function isValidInrAmount(amount: number): boolean {
  if (!Number.isFinite(amount)) return false;
  if (amount <= 0 || amount > MAX_INR_AMOUNT) return false;
  return round2(amount) === amount;
}

/** INR rupees -> integer paise, at the Razorpay API boundary only. */
export function toPaise(inrAmount: number): number {
  return Math.round(inrAmount * 100);
}

export function isValidPax(pax: number): boolean {
  return Number.isInteger(pax) && pax >= 1 && pax <= 60;
}

/** ₹ with Indian digit grouping, e.g. formatInr(185000) === "₹1,85,000". */
export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
