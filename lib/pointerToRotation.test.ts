import { describe, it, expect } from "vitest";
import { pointerToRotation } from "./pointerToRotation";

describe("pointerToRotation", () => {
  it("returns zero rotation when pointer is at the exact center", () => {
    const r = pointerToRotation(400, 300, 800, 600);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(0);
  });

  it("returns positive y-rotation when pointer is at the right edge", () => {
    const r = pointerToRotation(800, 300, 800, 600);
    expect(r.y).toBeGreaterThan(0);
  });

  it("returns negative x-rotation when pointer is at the top edge", () => {
    const r = pointerToRotation(400, 0, 800, 600);
    expect(r.x).toBeLessThan(0);
  });
});
