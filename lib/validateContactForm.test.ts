import { describe, it, expect } from "vitest";
import { validateContactForm } from "./validateContactForm";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello!", honeypot: "" };

describe("validateContactForm", () => {
  it("accepts a valid submission", () => {
    expect(validateContactForm(valid)).toEqual({ valid: true });
  });

  it("rejects when the honeypot field is filled (bot)", () => {
    const result = validateContactForm({ ...valid, honeypot: "spam" });
    expect(result.valid).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = validateContactForm({ ...valid, name: "" });
    expect(result.valid).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = validateContactForm({ ...valid, email: "not-an-email" });
    expect(result.valid).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = validateContactForm({ ...valid, message: "  " });
    expect(result.valid).toBe(false);
  });
});
