import { describe, it, expect } from "vitest";
import { corsHeaders } from "./cors";

describe("corsHeaders", () => {
  it("allows the GitHub Pages site and local dev", () => {
    expect(corsHeaders("https://ekupekuai.github.io")["Access-Control-Allow-Origin"]).toBe(
      "https://ekupekuai.github.io"
    );
    expect(corsHeaders("http://localhost:5173")["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
  });

  it("returns no CORS headers for unknown or missing origins", () => {
    expect(corsHeaders("https://evil.example")).toEqual({});
    expect(corsHeaders(null)).toEqual({});
  });
});
