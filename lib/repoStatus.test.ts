import { describe, it, expect } from "vitest";
import { repoStatus, relativeTime, repoNameFromUrl } from "./repoStatus";

const now = new Date("2026-09-26T00:00:00Z");

describe("repoStatus", () => {
  it("is LIVE whenever a demo exists, regardless of push date", () => {
    expect(repoStatus({ hasLiveUrl: true, pushedAt: "2025-01-01", now })).toBe("LIVE");
    expect(repoStatus({ hasLiveUrl: true, now })).toBe("LIVE");
  });

  it("is BUILDING within 30 days, ACTIVE within 120, STABLE after", () => {
    expect(repoStatus({ pushedAt: "2026-09-20T00:00:00Z", now })).toBe("BUILDING");
    expect(repoStatus({ pushedAt: "2026-07-01T00:00:00Z", now })).toBe("ACTIVE");
    expect(repoStatus({ pushedAt: "2025-12-24T00:00:00Z", now })).toBe("STABLE");
  });

  it("returns null when nothing is known, so no badge is shown", () => {
    expect(repoStatus({ now })).toBeNull();
    expect(repoStatus({ pushedAt: "not a date", now })).toBeNull();
  });
});

describe("relativeTime", () => {
  it("formats days, months and years", () => {
    expect(relativeTime("2026-09-26T00:00:00Z", now)).toBe("today");
    expect(relativeTime("2026-09-25T00:00:00Z", now)).toBe("yesterday");
    expect(relativeTime("2026-09-20T00:00:00Z", now)).toBe("6 days ago");
    expect(relativeTime("2026-07-20T00:00:00Z", now)).toBe("2 months ago");
    expect(relativeTime("2024-07-20T00:00:00Z", now)).toBe("2 years ago");
  });
});

describe("repoNameFromUrl", () => {
  it("extracts the repo name", () => {
    expect(repoNameFromUrl("https://github.com/ekupekuAI/NyayaPath")).toBe("NyayaPath");
    expect(repoNameFromUrl("https://example.com")).toBeNull();
  });
});
