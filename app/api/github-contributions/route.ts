import { NextResponse } from "next/server";
import { content } from "@/lib/content";
import { githubUsername } from "@/lib/githubUsername";
import { preflight, withCors } from "@/lib/cors";

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

export function OPTIONS(request: Request) {
  return preflight(request);
}

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const username = githubUsername(content.social.github);

  if (!token || !username) {
    return withCors(
      NextResponse.json({ ok: false, error: "GitHub contributions are not configured." }, { status: 501 }),
      request
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
      return withCors(
        NextResponse.json({ ok: false, error: `GitHub API responded with ${res.status}.` }, { status: 502 }),
        request
      );
    }

    const data = await res.json();
    const calendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      return withCors(
        NextResponse.json({ ok: false, error: "Unexpected response shape from GitHub." }, { status: 502 }),
        request
      );
    }

    return withCors(NextResponse.json({ ok: true, calendar }), request);
  } catch {
    return withCors(NextResponse.json({ ok: false, error: "Failed to reach GitHub." }, { status: 502 }), request);
  }
}
