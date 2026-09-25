import { NextResponse } from "next/server";
import { content } from "@/lib/content";
import { githubUsername } from "@/lib/githubUsername";
import { repoNameFromUrl } from "@/lib/repoStatus";

export interface RepoSummary {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  pushedAt: string;
  stars: number;
}

// Markup and glue languages say nothing about what a project is built with.
const IGNORED_LANGUAGES = new Set([
  "HTML",
  "CSS",
  "Shell",
  "PowerShell",
  "VBScript",
  "Dockerfile",
  "Batchfile",
  "Makefile",
]);

async function fetchLanguages(
  owner: string,
  repo: string,
  headers: HeadersInit
): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as Record<string, number>;
  return Object.entries(data)
    .filter(([lang]) => !IGNORED_LANGUAGES.has(lang))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);
}

/**
 * Public repos plus per-project languages, straight from GitHub. Project status
 * badges, "key technologies" and the Lab are derived from this so nothing on the
 * page is hand-typed marketing. Works without a token (public data) but uses one
 * when present to avoid the anonymous rate limit.
 */
export async function GET() {
  const username = githubUsername(content.social.github);
  if (!username) {
    return NextResponse.json({ ok: false, error: "No GitHub profile configured." }, { status: 501 });
  }
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `GitHub API responded with ${res.status}.` },
        { status: 502 }
      );
    }
    const raw = (await res.json()) as Array<{
      name: string;
      html_url: string;
      description: string | null;
      language: string | null;
      pushed_at: string;
      fork: boolean;
      stargazers_count: number;
    }>;

    const repos: RepoSummary[] = raw
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        language: r.language,
        pushedAt: r.pushed_at,
        stars: r.stargazers_count,
      }));

    const projectRepos = content.projects
      .map((p) => (p.repoUrl ? repoNameFromUrl(p.repoUrl) : null))
      .filter((n): n is string => !!n);
    const languageEntries = await Promise.all(
      projectRepos.map(async (name) => [name, await fetchLanguages(username, name, headers)] as const)
    );
    const languages = Object.fromEntries(languageEntries);

    return NextResponse.json({ ok: true, repos, languages });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to reach GitHub." }, { status: 502 });
  }
}
