"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useGithubRepos } from "@/lib/useGithubRepos";
import { relativeTime } from "@/lib/repoStatus";
import { useReveal } from "@/lib/animations/useReveal";
import CountUp from "@/components/ui/CountUp";

interface Stat {
  value: React.ReactNode;
  label: string;
}

/**
 * A live status line between the opening and the story: repositories,
 * contributions this year, last commit, systems with a public demo. Every
 * number comes from GitHub or from the project list; none is typed by hand.
 */
export default function Pulse() {
  const ref = useRef<HTMLElement>(null);
  const github = useGithubRepos();
  const [contributions, setContributions] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-contributions")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok) setContributions(d.calendar.totalContributions);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const liveSystems = content.projects.filter((p) => p.liveUrl).length;
  const latest = github.status === "ready" ? github.data.repos[0]?.pushedAt : null;

  const stats: Stat[] = [
    {
      value: <CountUp value={github.status === "ready" ? github.data.repos.length : content.stats.githubRepoCount} />,
      label: "public repositories",
    },
    ...(contributions !== null
      ? [{ value: <CountUp value={contributions} />, label: "contributions this year" }]
      : []),
    ...(latest ? [{ value: relativeTime(latest), label: "last commit" }] : []),
    { value: <CountUp value={liveSystems} />, label: liveSystems === 1 ? "system live" : "systems live" },
    { value: <CountUp value={content.stats.hackathonsCompeted} />, label: "hackathons" },
  ];

  useReveal(ref, [stats.length]);

  return (
    <section ref={ref} aria-label="Live status" className="relative border-y border-text-secondary/15">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-4 px-6 py-5 md:px-12">
        <li data-reveal className="flex items-center gap-2 text-xs uppercase tracking-[var(--tracking-label)] text-accent opacity-0">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Live from GitHub
        </li>
        {stats.map((s) => (
          <li key={s.label} data-reveal className="flex items-baseline gap-2 opacity-0">
            <span className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-text-primary">
              {s.value}
            </span>
            <span className="text-sm text-text-secondary">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
