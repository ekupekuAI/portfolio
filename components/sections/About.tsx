"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import ScrambleText from "@/components/ui/ScrambleText";
import CountUp from "@/components/ui/CountUp";
import GitHubActivity from "@/components/sections/GitHubActivity";

const STATS = [
  { value: content.stats.githubRepoCount, suffix: "+", label: "Public Repositories" },
  { value: content.projects.length, suffix: "", label: "Featured Projects" },
  { value: content.techStack.length, suffix: "", label: "Core Technologies" },
  { value: content.stats.hackathonsCompeted, suffix: "", label: "Hackathons Competed" },
] as const;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const items = stackRef.current?.querySelectorAll("li") ?? [];

    if (reducedMotion) {
      gsap.set([leadRef.current, bioRef.current, ...Array.from(items)], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leadRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: bioRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: { trigger: stackRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} id="about" className="mx-auto max-w-3xl px-6 py-32">
      <p className="text-sm uppercase tracking-[0.3em] text-accent2">
        <ScrambleText text="01 — About" />
      </p>
      <p
        ref={leadRef}
        className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold leading-snug text-text-primary opacity-0 md:text-5xl"
      >
        {content.bioLead}
      </p>
      <p ref={bioRef} className="mt-6 text-lg text-text-secondary opacity-0 md:text-xl">
        {content.bio}
      </p>
      <ul ref={stackRef} className="mt-8 flex flex-wrap gap-3">
        {content.techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-accent/30 px-4 py-1.5 text-sm text-accent opacity-0"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-12 grid grid-cols-2 gap-6 border-t border-accent/10 pt-8 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-text-primary md:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-text-secondary">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
      <GitHubActivity />
    </section>
  );
}
