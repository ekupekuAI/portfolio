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

  it("has a hero claim, availability line, and verifiable highlights", () => {
    expect(content.claim.length).toBeGreaterThan(20);
    expect(content.availability.length).toBeGreaterThan(0);
    expect(content.highlights.length).toBeGreaterThan(0);
    for (const h of content.highlights) {
      expect(h.value).toBeTruthy();
      expect(h.label).toBeTruthy();
    }
  });

  it("features at least one project and leaves some for the list", () => {
    const featured = content.projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.length).toBeLessThan(content.projects.length);
  });

  it("has real, positive stats", () => {
    expect(content.stats.githubRepoCount).toBeGreaterThan(0);
    expect(content.stats.hackathonsCompeted).toBeGreaterThan(0);
  });
});
