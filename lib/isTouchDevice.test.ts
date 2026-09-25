import { describe, it, expect, afterEach } from "vitest";
import { isTouchDevice } from "./isTouchDevice";

describe("isTouchDevice", () => {
  afterEach(() => {
    // @ts-expect-error resetting jsdom matchMedia mock between tests
    delete window.matchMedia;
  });

  it("returns true when the (pointer: coarse) media query matches", () => {
    window.matchMedia = ((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
    })) as unknown as typeof window.matchMedia;

    expect(isTouchDevice()).toBe(true);
  });

  it("returns false when the (pointer: coarse) media query does not match", () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
    })) as unknown as typeof window.matchMedia;

    expect(isTouchDevice()).toBe(false);
  });
});
