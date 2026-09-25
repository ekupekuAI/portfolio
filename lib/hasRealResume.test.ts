import { describe, it, expect } from "vitest";
import { hasRealResume } from "./hasRealResume";

describe("hasRealResume", () => {
  it("rejects the shipped placeholder file", () => {
    expect(hasRealResume("/resume-placeholder.txt")).toBe(false);
  });

  it("rejects empty or whitespace URLs", () => {
    expect(hasRealResume("")).toBe(false);
    expect(hasRealResume("   ")).toBe(false);
  });

  it("accepts a real PDF path", () => {
    expect(hasRealResume("/Ekansh-Resume.pdf")).toBe(true);
    expect(hasRealResume("https://example.com/cv.pdf")).toBe(true);
  });
});
