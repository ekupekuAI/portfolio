"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content, type Project } from "@/lib/content";
import { useGithubRepos } from "@/lib/useGithubRepos";
import { repoNameFromUrl } from "@/lib/repoStatus";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div data-reveal className="opacity-0">
      <p className="text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary">{label}</p>
      <div className="mt-2 text-base leading-relaxed text-text-primary/90">{children}</div>
    </div>
  );
}

function Pipeline({ steps }: { steps: NonNullable<Project["pipeline"]> }) {
  return (
    <ol
      data-pipeline
      className="relative mt-14 grid gap-6 md:mt-20 md:gap-4"
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {/* Progress rail: scales with scroll, lighting each step as it passes. */}
      <span
        aria-hidden
        data-rail
        className="absolute left-0 top-[7px] hidden h-px w-full origin-left bg-accent md:block"
        style={{ transform: "scaleX(0)" }}
      />
      <span aria-hidden className="absolute left-0 top-[7px] hidden h-px w-full bg-text-secondary/20 md:block" />
      {steps.map((step, i) => (
        <li key={step.label} data-step className="relative pl-5 md:pl-0 md:pt-6" style={{ opacity: 0.3 }}>
          <span
            aria-hidden
            data-dot
            className="absolute left-0 top-[6px] h-2.5 w-2.5 rounded-full border border-accent bg-bg-primary md:left-0 md:top-[2px]"
          />
          <p className="font-[family-name:var(--font-display)] text-xs tabular-nums text-text-secondary">
            0{i + 1}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-[0.04em] text-text-primary md:text-2xl">
            {step.label}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function CaseStudy({
  project,
  index,
  languages,
}: {
  project: Project;
  index: number;
  languages: string[] | null;
}) {
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const tech = languages && languages.length > 0 ? languages : project.stack ?? null;

  return (
    <article id={`work-${project.id}`} className="border-t border-text-secondary/15 pt-12 md:pt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <p data-reveal className="text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0">
          Project <span className="text-accent">{number}</span>
        </p>
        <p data-reveal className="text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0">
          {project.category}
        </p>
      </div>
      <h3
        data-reveal
        className="mt-4 font-[family-name:var(--font-display)] text-5xl font-bold uppercase leading-[0.95] tracking-[-0.03em] text-text-primary opacity-0 md:text-8xl"
      >
        {project.title}
      </h3>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-12">
        <div className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
          <a
            href={project.liveUrl ?? project.repoUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor={project.liveUrl ? "open" : "github"}
            aria-label={`Open ${project.title}`}
            data-mask
            className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-text-secondary/15 bg-bg-secondary"
            style={{ clipPath: "inset(0 0 0 0)" }}
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              data-parallax
              className="object-cover"
            />
          </a>
        </div>
        <div className={`flex flex-col gap-7 md:col-span-5 ${flip ? "md:order-1" : ""}`}>
          <Field label="Problem">{project.problem ?? project.description}</Field>
          {project.solution && <Field label="Solution">{project.solution}</Field>}
          {tech && (
            <Field label={languages ? "Key technologies · from GitHub" : "Key technologies"}>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-display)] text-sm uppercase tracking-[0.08em]">
                {tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Field>
          )}
          {project.outcome && <Field label="Outcome">{project.outcome}</Field>}
          <div data-reveal className="flex flex-wrap gap-x-6 opacity-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
              >
                Live demo ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="github"
                className="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
              >
                Source ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {project.pipeline && <Pipeline steps={project.pipeline} />}
    </article>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const github = useGithubRepos();
  const featured = content.projects.filter((p) => p.featured);
  useReveal(sectionRef, [github.status]);

  // Scroll-linked moves: covers unmask and drift; pipelines light up step by step.
  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const masks = root.querySelectorAll<HTMLElement>("[data-mask]");
    const images = root.querySelectorAll<HTMLElement>("[data-parallax]");
    const pipelines = root.querySelectorAll<HTMLElement>("[data-pipeline]");

    if (reducedMotion) {
      pipelines.forEach((p) => {
        gsap.set(p.querySelectorAll("[data-step]"), { opacity: 1 });
        gsap.set(p.querySelector("[data-rail]"), { scaleX: 1 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      masks.forEach((mask) => {
        gsap.fromTo(
          mask,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: { trigger: mask, start: "top 92%", end: "top 45%", scrub: 0.4 },
          }
        );
      });
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.15 },
          {
            yPercent: 8,
            scale: 1.15,
            ease: "none",
            scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
      pipelines.forEach((pipeline) => {
        const steps = pipeline.querySelectorAll<HTMLElement>("[data-step]");
        const dots = pipeline.querySelectorAll<HTMLElement>("[data-dot]");
        const rail = pipeline.querySelector<HTMLElement>("[data-rail]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: pipeline, start: "top 85%", end: "bottom 55%", scrub: 0.5 },
        });
        if (rail) tl.to(rail, { scaleX: 1, ease: "none", duration: steps.length }, 0);
        steps.forEach((step, i) => {
          tl.to(step, { opacity: 1, duration: 0.6, ease: "power1.out" }, i);
          tl.to(dots[i], { backgroundColor: "var(--color-accent)", duration: 0.2 }, i);
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="work"
      data-scene-bg="#0c0c14"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <SectionHeader
        index="03"
        kicker="Work"
        title="Case studies, from problem to pipeline."
        lede="Each system, as it actually runs: the problem it exists for, what it does about it, and the stages the data moves through."
      />
      <div className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-40">
        {featured.map((project, i) => {
          const name = project.repoUrl ? repoNameFromUrl(project.repoUrl) : null;
          const languages =
            github.status === "ready" && name ? (github.data.languages[name] ?? null) : null;
          return <CaseStudy key={project.id} project={project} index={i} languages={languages} />;
        })}
      </div>
    </section>
  );
}
