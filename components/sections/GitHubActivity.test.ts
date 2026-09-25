import { describe, it, expect } from "vitest";
import { levelForCount } from "./GitHubActivity";

describe("levelForCount", () => {
  it("returns 0 for no contributions", () => {
    expect(levelForCount(0)).toBe(0);
  });

  it("returns increasing levels as count rises", () => {
    expect(levelForCount(1)).toBe(1);
    expect(levelForCount(3)).toBe(2);
    expect(levelForCount(7)).toBe(3);
    expect(levelForCount(15)).toBe(4);
  });

  it("is monotonically non-decreasing", () => {
    let prev = -1;
    for (let count = 0; count <= 20; count++) {
      const level = levelForCount(count);
      expect(level).toBeGreaterThanOrEqual(prev);
      prev = level;
    }
  });
});
