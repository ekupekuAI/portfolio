import { NextResponse } from "next/server";
import { content } from "@/lib/content";
import { githubUsername } from "@/lib/githubUsername";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const username = githubUsername(content.social.github);

  if (!token || !username) {
    return NextResponse.json(
      { ok: false, error: "GitHub contributions are not configured." },
      { status: 501 }
    );
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: username } }),
      // Contribution data changes slowly — cache for an hour rather than refetching
      // GitHub's GraphQL API on every page load.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API responded with ${res.status}.` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      return NextResponse.json(
        { ok: false, error: "Unexpected response shape from GitHub." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, calendar });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to reach GitHub." },
      { status: 502 }
    );
  }
}
