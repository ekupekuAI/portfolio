import { describe, it, expect } from "vitest";
import { githubUsername } from "./githubUsername";

describe("githubUsername", () => {
  it("extracts the username from a plain profile URL", () => {
    expect(githubUsername("https://github.com/ekupekuAI")).toBe("ekupekuAI");
  });

  it("extracts the username with a trailing slash", () => {
    expect(githubUsername("https://github.com/ekupekuAI/")).toBe("ekupekuAI");
  });

  it("returns null for a non-GitHub URL", () => {
    expect(githubUsername("https://example.com/foo")).toBeNull();
  });
});
