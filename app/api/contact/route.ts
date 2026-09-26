import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormInput } from "@/lib/validateContactForm";
import { sendContactEmail } from "@/lib/email";
import { preflight, withCors } from "@/lib/cors";

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function POST(request: Request) {
  let body: ContactFormInput;
  try {
    body = await request.json();
  } catch {
    return withCors(NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 }), request);
  }

  const result = validateContactForm(body);
  if (!result.valid) {
    return withCors(NextResponse.json({ ok: false, error: result.error }, { status: 400 }), request);
  }

  try {
    await sendContactEmail(body);
    return withCors(NextResponse.json({ ok: true }), request);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send message.";
    return withCors(NextResponse.json({ ok: false, error: message }, { status: 502 }), request);
  }
}
