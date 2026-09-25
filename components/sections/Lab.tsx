"use client";

import { useMemo, useRef } from "react";
import { content } from "@/lib/content";
import { useGithubRepos } from "@/lib/useGithubRepos";
import { relativeTime, repoNameFromUrl } from "@/lib/repoStatus";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { isTouchDevice } from "@/lib/isTouchDevice";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";
import GitHubActivity from "@/components/sections/GitHubActivity";

interface LabItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  meta: string | null;
  href: string | null;
}

// Repos that are the site itself or empty scaffolding, not experiments.
const EXCLUDED_REPOS = new Set(["portfolio", "ekupekuAI.github.io", "new"]);

function Tile({ item }: { item: LabItem }) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Tilt toward the pointer: a small perspective rotation, transform only.
  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || reducedMotion || isTouchDevice()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-2px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  const body = (
    <>
      <p className="flex items-center justify-between text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary">
        <span className="text-accent">{item.category}</span>
        {item.href && <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>}
      </p>
      <p className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
        {item.title}
      </p>
      <p className={`mt-2 text-sm leading-relaxed ${item.description ? "text-text-secondary" : "text-text-secondary/50 italic"}`}>
        {item.description ?? "No description on GitHub yet."}
      </p>
      {item.meta && <p className="mt-6 text-xs text-text-secondary/70">{item.meta}</p>}
    </>
  );

  const className =
    "group surface-glass flex h-full flex-col rounded-lg p-6 transition-[transform,border-color] duration-300 ease-out hover:border-accent/50";

  return (
    <article ref={ref} data-reveal className="opacity-0" onPointerMove={onMove} onPointerLeave={onLeave}>
      {item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" data-cursor="explore" className={className}>
          {body}
        </a>
      ) : (
        <div className={className}>{body}</div>
      )}
    </article>
  );
}

/**
 * Smaller builds and experiments: the non-featured portfolio projects plus every
 * other public, non-fork repo on GitHub. Real repos only; where GitHub has no
 * description, the tile says so instead of inventing one.
 */
export default function Lab() {
  const sectionRef = useRef<HTMLElement>(null);
  const github = useGithubRepos();

  const items = useMemo<LabItem[]>(() => {
    const shownRepoNames = new Set(
      content.projects.map((p) => (p.repoUrl ? repoNameFromUrl(p.repoUrl) : null)).filter(Boolean)
    );
    const repoByName = new Map(
      github.status === "ready" ? github.data.repos.map((r) => [r.name, r] as const) : []
    );

    const fromContent: LabItem[] = content.projects
      .filter((p) => !p.featured)
      .map((p) => {
        const repo = p.repoUrl ? repoByName.get(repoNameFromUrl(p.repoUrl) ?? "") : undefined;
        const metaParts = [
          p.stack ? p.stack.join(" · ") : repo?.language ?? null,
          repo ? `last commit ${relativeTime(repo.pushedAt)}` : null,
        ].filter(Boolean);
        return {
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          meta: metaParts.length ? metaParts.join(" · ") : null,
          href: p.liveUrl ?? p.repoUrl ?? null,
        };
      });

    const fromGithub: LabItem[] =
      github.status === "ready"
        ? github.data.repos
            .filter((r) => !shownRepoNames.has(r.name) && !EXCLUDED_REPOS.has(r.name))
            .map((r) => ({
              id: `gh-${r.name}`,
              title: r.name,
              category: r.language ?? "Repo",
              description: r.description,
              meta: `last commit ${relativeTime(r.pushedAt)}${r.stars ? ` · ${r.stars} ★` : ""}`,
              href: r.url,
            }))
        : [];

    return [...fromContent, ...fromGithub];
  }, [github]);

  useReveal(sectionRef, [items.map((i) => i.id).join(",")]);

  return (
    <section
      ref={sectionRef}
      id="lab"
      data-scene-bg="#0a0a0f"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <SectionHeader
        index="04"
        kicker="The Lab"
        title="Smaller builds, prototypes, and things still being figured out."
        lede={
          github.status === "ready"
            ? "Every public repository not already shown above, pulled live from GitHub."
            : "Prototypes and side builds from the portfolio."
        }
      />

      <div data-reveal className="opacity-0">
        <GitHubActivity />
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Tile key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
