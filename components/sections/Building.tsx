"use client";

import { useMemo, useRef } from "react";
import { content, type Project } from "@/lib/content";
import { useGithubRepos } from "@/lib/useGithubRepos";
import { repoStatus, relativeTime, repoNameFromUrl, type RepoStatus } from "@/lib/repoStatus";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const MAX_ROWS = 4;

function StatusBadge({ status }: { status: RepoStatus }) {
  const filled = status === "LIVE" || status === "BUILDING";
  return (
    <span className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-xs tracking-[var(--tracking-label)] text-accent">
      <span
        aria-hidden
        className={`inline-block h-2 w-2 rounded-full border border-accent ${filled ? "bg-accent" : ""}`}
      />
      {status}
    </span>
  );
}

/**
 * Projects as things that are moving, not cards. Order and status come from
 * GitHub push dates; when that data is unavailable the rows still render, just
 * without a badge.
 */
export default function Building() {
  const sectionRef = useRef<HTMLElement>(null);
  const github = useGithubRepos();

  const rows = useMemo(() => {
    const pushedFor = (p: Project): string | null => {
      if (github.status !== "ready" || !p.repoUrl) return null;
      const name = repoNameFromUrl(p.repoUrl);
      return github.data.repos.find((r) => r.name === name)?.pushedAt ?? null;
    };
    const withRepo = content.projects.filter((p) => p.repoUrl);
    const decorated = withRepo.map((p) => ({ project: p, pushedAt: pushedFor(p) }));
    if (github.status === "ready") {
      decorated.sort((a, b) => (b.pushedAt ?? "").localeCompare(a.pushedAt ?? ""));
    }
    return decorated.slice(0, MAX_ROWS);
  }, [github]);

  // Key on the row ids, not the count: when GitHub data arrives the set of rows
  // changes at the same length, and a new row must still get its reveal tween.
  useReveal(sectionRef, [rows.map((r) => r.project.id).join(",")]);

  return (
    <section
      ref={sectionRef}
      id="building"
      data-scene-bg="#0a0a0f"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <SectionHeader
        index="02"
        kicker="Currently building"
        title="What is moving right now."
        lede={
          github.status === "ready"
            ? "Ordered by last commit. Status is derived from GitHub activity, not hand-typed."
            : "The most recent work, ordered as shipped."
        }
      />

      <ol className="mt-14 divide-y divide-text-secondary/15 border-y border-text-secondary/15 md:mt-20">
        {rows.map(({ project, pushedAt }) => {
          const status = repoStatus({ pushedAt, hasLiveUrl: !!project.liveUrl });
          const href = project.liveUrl ?? project.repoUrl!;
          return (
            <li key={project.id} data-reveal className="opacity-0">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor={project.liveUrl ? "open" : "github"}
                className="group grid items-center gap-3 py-6 transition-colors md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:gap-8 md:py-8"
              >
                <div>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-[0.02em] text-text-primary transition-colors group-hover:text-accent md:text-5xl">
                    {project.title}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{project.category}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
                  {status && <StatusBadge status={status} />}
                  {pushedAt && <span>Last commit {relativeTime(pushedAt)}</span>}
                </div>
                <span
                  aria-hidden
                  className="hidden font-[family-name:var(--font-display)] text-2xl text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-accent md:block"
                >
                  →
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
