import { describe, it, expect } from "vitest";
import { content } from "./content";

describe("content", () => {
  it("has required top-level fields populated", () => {
    expect(content.name.length).toBeGreaterThan(0);
    expect(content.role.length).toBeGreaterThan(0);
    expect(content.bioLead.length).toBeGreaterThan(0);
    expect(content.bio.length).toBeGreaterThan(0);
    expect(content.resumeUrl.length).toBeGreaterThan(0);
  });

  it("has a non-empty tech stack", () => {
    expect(content.techStack.length).toBeGreaterThan(0);
  });

  it("has at least one project with required fields", () => {
    expect(content.projects.length).toBeGreaterThan(0);
    const p = content.projects[0];
    expect(p.id).toBeTruthy();
    expect(p.title).toBeTruthy();
    expect(p.category).toBeTruthy();
    expect(p.description).toBeTruthy();
  });

  it("every project has a category (used as the numbered card label)", () => {
    for (const p of content.projects) {
      expect(p.category).toBeTruthy();
    }
  });

  it("has all four social links present (even as placeholders)", () => {
    expect(content.social.github).toBeTruthy();
    expect(content.social.linkedin).toBeTruthy();
    expect(content.social.instagram).toBeTruthy();
    expect(content.social.twitter).toBeTruthy();
  });
});
