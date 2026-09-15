import "server-only";
import { Resend } from "resend";
import { env } from "./env";

let client: Resend | null = null;

function resendClient(): Resend {
  if (!client) client = new Resend(env.resendApiKey);
  return client;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<string> {
  const result = await resendClient().emails.send({
    from: env.resendFromEmail,
    to,
    subject,
    html,
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data?.id ?? "";
}
