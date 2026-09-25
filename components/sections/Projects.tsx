"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content, type Project } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

const LINK_CLASS =
  "inline-flex min-h-11 items-center gap-1 text-accent underline-offset-4 transition-colors hover:underline";

function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.liveUrl && !project.repoUrl) return null;
  return (
    <div className={`flex flex-wrap gap-x-6 ${className}`}>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor-hover className={LINK_CLASS}>
          Live demo ↗
        </a>
      )}
      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noreferrer" data-cursor-hover className={LINK_CLASS}>
          Source ↗
        </a>
      )}
    </div>
  );
}

function FeaturedProject({ project, flip }: { project: Project; flip: boolean }) {
  const primaryHref = project.liveUrl ?? project.repoUrl;
  const image = (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-text-secondary/15 bg-bg-secondary">
      <Image
        src={project.image}
        alt=""
        fill
        sizes="(min-width: 768px) 55vw, 100vw"
        data-parallax
        className="object-cover"
      />
    </div>
  );

  return (
    <article
      data-reveal
      className="grid items-center gap-8 opacity-0 md:grid-cols-12 md:gap-12"
    >
      <div className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
        {primaryHref ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            aria-label={`Open ${project.title}`}
            className="group block"
          >
            {image}
          </a>
        ) : (
          image
        )}
      </div>
      <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
        <p className="flex flex-wrap items-center gap-x-3 text-xs uppercase tracking-[var(--tracking-label)] text-accent2">
          <span>{project.category}</span>
          {project.outcome && (
            <>
              <span aria-hidden className="text-text-secondary/50">·</span>
              <span className="text-text-secondary">{project.outcome}</span>
            </>
          )}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-text-primary md:text-5xl">
          {project.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
          {project.description}
        </p>
        <ProjectLinks project={project} className="mt-4" />
      </div>
    </article>
  );
}

function ListProject({ project }: { project: Project }) {
  return (
    <li
      data-reveal
      className="grid gap-3 py-7 opacity-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] md:items-baseline md:gap-8"
    >
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
          {project.title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[var(--tracking-label)] text-accent2">
          {project.category}
          {project.outcome && <span className="text-text-secondary"> · {project.outcome}</span>}
        </p>
      </div>
      <div>
        <p className="text-text-secondary">{project.description}</p>
        {project.stack && (
          <p className="mt-2 text-sm text-text-secondary/80">{project.stack.join(" · ")}</p>
        )}
      </div>
      <ProjectLinks project={project} />
    </li>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const featured = content.projects.filter((p) => p.featured);
  const rest = content.projects.filter((p) => !p.featured);

  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const images = root.querySelectorAll<HTMLElement>("[data-parallax]");

    if (reducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      items.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
      // The one scroll-linked move on the page: featured covers drift slower than the
      // page, which reads as depth without hijacking the scroll.
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="projects" className="mx-auto max-w-6xl px-6 py-[var(--spacing-section)]">
      <div className="max-w-3xl">
        <p data-reveal className="text-xs uppercase tracking-[var(--tracking-label)] text-accent2 opacity-0">
          Selected work
        </p>
        <h2
          data-reveal
          className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] text-text-primary opacity-0 md:text-6xl"
        >
          Built end to end, from first sketch to deployed product.
        </h2>
      </div>

      <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
        {featured.map((project, i) => (
          <FeaturedProject key={project.id} project={project} flip={i % 2 === 1} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-24 md:mt-32">
          <p data-reveal className="text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0">
            More builds
          </p>
          <ul className="mt-4 divide-y divide-text-secondary/15 border-y border-text-secondary/15">
            {rest.map((project) => (
              <ListProject key={project.id} project={project} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
