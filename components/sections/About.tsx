"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import CountUp from "@/components/ui/CountUp";
import GitHubActivity from "@/components/sections/GitHubActivity";

function HighlightValue({ value }: { value: string }) {
  // Only pure numbers count up; tokens like "3rd" render as-is.
  const match = value.match(/^(\d+)(\+?)$/);
  if (!match) return <>{value}</>;
  return <CountUp value={Number(match[1])} suffix={match[2]} />;
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reducedMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%" },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="mx-auto max-w-6xl px-6 py-[var(--spacing-section)]"
    >
      <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:gap-20">
        <div>
          <p data-reveal className="text-xs uppercase tracking-[var(--tracking-label)] text-accent2 opacity-0">
            About
          </p>
          <h2
            data-reveal
            className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold leading-[1.1] text-text-primary opacity-0 md:text-5xl"
          >
            {content.bioLead}
          </h2>
          <p data-reveal className="mt-6 max-w-prose text-lg text-text-secondary opacity-0 md:text-xl">
            {content.bio}
          </p>
        </div>

        <div className="md:pt-10">
          <ul className="divide-y divide-text-secondary/15 border-y border-text-secondary/15">
            {content.highlights.map((h) => (
              <li key={h.label} data-reveal className="grid grid-cols-[auto_1fr] items-baseline gap-4 py-5 opacity-0">
                <span className="font-[family-name:var(--font-display)] text-4xl font-bold tabular-nums text-text-primary md:text-5xl">
                  <HighlightValue value={h.value} />
                </span>
                <span className="text-base text-text-secondary">
                  {h.href ? (
                    <a
                      href={h.href}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-hover
                      className="underline decoration-text-secondary/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      {h.label} ↗
                    </a>
                  ) : (
                    h.label
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p data-reveal className="mt-8 text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0">
            Working with
          </p>
          <ul data-reveal className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-base text-text-primary opacity-0">
            {content.techStack.map((tech, i) => (
              <li key={tech} className="flex items-center gap-4">
                {tech}
                {i < content.techStack.length - 1 && (
                  <span aria-hidden className="h-1 w-1 rounded-full bg-text-secondary/50" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-reveal className="opacity-0">
        <GitHubActivity />
      </div>
    </section>
  );
}
