import { describe, it, expect } from "vitest";
import { parseIsMobile } from "./useIsMobile";

describe("parseIsMobile", () => {
  it("returns true below the 768px breakpoint", () => {
    expect(parseIsMobile(767)).toBe(true);
  });

  it("returns false at or above the 768px breakpoint", () => {
    expect(parseIsMobile(768)).toBe(false);
    expect(parseIsMobile(1024)).toBe(false);
  });
});
