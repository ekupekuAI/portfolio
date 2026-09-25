"use client";

import { useEffect, useState } from "react";
import type { RepoSummary } from "@/app/api/github-repos/route";

export interface GithubData {
  repos: RepoSummary[];
  /** repo name -> top languages by bytes (markup excluded) */
  languages: Record<string, string[]>;
}

type State = { status: "loading" } | { status: "unavailable" } | { status: "ready"; data: GithubData };

// One fetch per page load, shared by every scene that needs it.
let cached: Promise<State> | null = null;

function load(): Promise<State> {
  if (!cached) {
    cached = fetch("/api/github-repos")
      .then((res) => res.json())
      .then((json) =>
        json?.ok
          ? ({ status: "ready", data: { repos: json.repos, languages: json.languages } } as State)
          : ({ status: "unavailable" } as State)
      )
      .catch(() => ({ status: "unavailable" }) as State);
  }
  return cached;
}

export function useGithubRepos(): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    load().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
