import { Resend } from "resend";
import type { ContactFormInput } from "./validateContactForm";

export async function sendContactEmail(input: ContactFormInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    throw new Error("Email service is not configured (missing env vars).");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to,
    replyTo: input.email,
    subject: `New message from ${input.name}`,
    text: input.message,
  });
}
