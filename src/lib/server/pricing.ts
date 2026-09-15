import "server-only";
import { TREK_ADD_ONS, type TrekAddOnKey } from "@/data/addOns";
import { round2 } from "@/lib/money";
import { AppError } from "./errors";

const GST_RATE = 0.05;

const COUPONS: Record<string, number> = {
  TRIPMYSOUL10: 10,
  HIMALAYA5: 5,
};

export interface TravellerInput {
  fullName: string;
  email?: string;
  isPrimary: boolean;
  addOns: TrekAddOnKey[];
}

export interface PricingResult {
  grossAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  discountPercent: number;
}

/** Resolves a coupon code server-side. Unknown codes are rejected, never silently ignored. */
export function resolveDiscountPercent(couponCode: string | undefined | null): number {
  if (!couponCode) return 0;
  const percent = COUPONS[couponCode.trim().toUpperCase()];
  if (percent === undefined) {
    throw new AppError("VALIDATION_FAILED", "Invalid promo code.");
  }
  return percent;
}

/**
 * Computes the authoritative booking total from the departure's server-side
 * price, the traveller list, and their selected add-ons. Nothing here comes
 * from a client-sent amount.
 */
export function computeBookingPricing(
  pricePerPerson: number,
  travellers: TravellerInput[],
  couponCode: string | undefined | null
): PricingResult {
  const totalBasePrice = round2(pricePerPerson * travellers.length);

  const totalAddOns = travellers.reduce((sum, traveller) => {
    const addOnSum = traveller.addOns.reduce((s, key) => {
      const addOn = TREK_ADD_ONS.find((a) => a.key === key);
      return addOn ? s + addOn.price : s;
    }, 0);
    return sum + addOnSum;
  }, 0);

  const discountPercent = resolveDiscountPercent(couponCode);
  const grossAmount = round2(totalBasePrice + totalAddOns);
  const discountAmount = round2((grossAmount * discountPercent) / 100);
  const taxableSubtotal = round2(grossAmount - discountAmount);
  const taxAmount = round2(taxableSubtotal * GST_RATE);
  const totalAmount = round2(taxableSubtotal + taxAmount);

  return { grossAmount, discountAmount, taxAmount, totalAmount, discountPercent };
}
