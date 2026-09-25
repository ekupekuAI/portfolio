"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Thinking() {
  const sectionRef = useRef<HTMLElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useReveal(sectionRef);

  // The capability map assembles as the user scrolls through it: columns rise
  // in sequence, tied to scroll position rather than a timer.
  useEffect(() => {
    registerGsap();
    const cols = columnsRef.current?.querySelectorAll<HTMLElement>("[data-column]");
    if (!cols || cols.length === 0) return;
    if (reducedMotion) {
      gsap.set(cols, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cols,
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.18,
          ease: "power2.out",
          scrollTrigger: { trigger: columnsRef.current, start: "top 85%", end: "top 35%", scrub: 0.6 },
        }
      );
    }, columnsRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="thinking"
      data-scene-bg="#0b0c12"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
        <SectionHeader
          index="01"
          kicker="Thinking"
          title={
            <>
              {content.thinkingHeadline[0]}
              <br />
              <span className="text-accent">{content.thinkingHeadline[1]}</span>
            </>
          }
        />
        <div className="md:pt-14">
          <p data-reveal className="text-lg leading-relaxed text-text-primary/90 opacity-0 md:text-xl">
            {content.bioLead}
          </p>
          <p data-reveal className="mt-5 text-base leading-relaxed text-text-secondary opacity-0 md:text-lg">
            {content.bio}
          </p>
        </div>
      </div>

      <div ref={columnsRef} className="mt-20 grid gap-10 md:mt-28 md:grid-cols-3 md:gap-8">
        {content.capabilities.map((group, gi) => (
          <div
            key={group.name}
            data-column
            className="border-l border-text-secondary/20 pl-6 opacity-0 md:pl-8"
          >
            <p className="flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-display)] text-xs tabular-nums text-accent">
                0{gi + 1}
              </span>
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-[0.06em] text-text-primary md:text-4xl">
                {group.name}
              </span>
            </p>
            <ul className="mt-6 divide-y divide-text-secondary/15 border-y border-text-secondary/15">
              {group.items.map((item) => (
                <li key={item.label} className="py-4">
                  <p className="text-lg text-text-primary">{item.label}</p>
                  <p className="mt-1 text-sm text-text-secondary">{item.evidence}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
