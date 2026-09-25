"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const reducedMotion = useReducedMotion();
  useReveal(sectionRef);

  // The rail draws itself as the user moves down the timeline.
  useEffect(() => {
    registerGsap();
    if (!railRef.current || !listRef.current) return;
    if (reducedMotion) {
      gsap.set(railRef.current, { scaleY: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: listRef.current, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        }
      );
    }, listRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      data-scene-bg="#0a0a0f"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-20">
        <SectionHeader index="06" kicker="Journey" title="How it got here, and where it is going." />

        <ol ref={listRef} className="relative mt-2 md:mt-14">
          <span aria-hidden className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-text-secondary/20" />
          <span
            ref={railRef}
            aria-hidden
            className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-accent"
            style={{ transform: "scaleY(0)" }}
          />
          {content.journey.map((step, i) => (
            <li key={step.label} data-reveal className="relative pb-12 pl-10 opacity-0 last:pb-0">
              <span
                aria-hidden
                className={`absolute left-0 top-2 h-[11px] w-[11px] rounded-full border border-accent ${
                  i === content.journey.length - 1 ? "bg-bg-primary" : "bg-accent"
                }`}
              />
              <p className="text-xs uppercase tracking-[var(--tracking-label)] text-accent">{step.label}</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary md:text-3xl">
                {step.title}
              </p>
              <p className="mt-2 max-w-lg text-base text-text-secondary">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
