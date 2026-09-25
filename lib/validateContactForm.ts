export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  input: ContactFormInput
): { valid: true } | { valid: false; error: string } {
  if (input.honeypot.trim() !== "") {
    return { valid: false, error: "Spam detected." };
  }
  if (input.name.trim().length === 0) {
    return { valid: false, error: "Name is required." };
  }
  if (!EMAIL_RE.test(input.email.trim())) {
    return { valid: false, error: "A valid email is required." };
  }
  if (input.message.trim().length === 0) {
    return { valid: false, error: "Message is required." };
  }
  return { valid: true };
}
