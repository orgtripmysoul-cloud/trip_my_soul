import { z } from "zod";

/** Shared between the API routes (server-side, authoritative) and the checkout form (client-side, for inline errors). */

export const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const confirmOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code."),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type ConfirmOtpInput = z.infer<typeof confirmOtpSchema>;
