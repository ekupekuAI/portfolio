import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormInput } from "@/lib/validateContactForm";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: ContactFormInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContactForm(body);
  if (!result.valid) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  try {
    await sendContactEmail(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send message.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
