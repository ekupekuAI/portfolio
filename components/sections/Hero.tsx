"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import ParticleField from "@/components/hero/ParticleField";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const letters = Array.from(content.name);

  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const letterEls = root.querySelectorAll<HTMLElement>("[data-letter]");
    const rest = root.querySelectorAll<HTMLElement>("[data-reveal]");

    if (reducedMotion) {
      // gsap.set() applies synchronously, unlike tl.set() on a fresh timeline (which
      // only takes effect on GSAP's next ticker tick) — this path must never leave
      // content sitting at its opacity-0 default even briefly, since it exists
      // specifically for users who asked for no motion.
      gsap.set(letterEls, { y: 0, yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      return;
    }

    // gsap.context() + ctx.revert(): React Strict Mode double-invokes effects, and two
    // timelines fighting over the same elements visibly stalls the entrance.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      // The letters ship with an inline translateY(110%) so the name is hidden before
      // hydration. GSAP parses that into a pixel `y`, which would survive a yPercent
      // tween and leave the name stuck off-screen — so the from-state explicitly zeroes
      // `y` and re-expresses the offset as yPercent (same visual position, no jump).
      tl.fromTo(
        letterEls,
        { y: 0, yPercent: 110 },
        { yPercent: 0, duration: 1, stagger: 0.05 },
        0.1
      ).fromTo(
        rest,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
        "-=0.6"
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0 opacity-70">
        <ParticleField />
      </div>
      {/* Darkens the centre so the name reads over the field without a glow or halo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(10,10,15,0.85),rgba(10,10,15,0)_100%)]"
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <p data-reveal className="text-sm font-medium text-accent opacity-0 md:text-base">
          {content.role}
        </p>

        <h1
          aria-label={content.name}
          className="mt-4 overflow-hidden whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(3.75rem,15vw,11rem)] font-bold leading-[0.95] tracking-[-0.03em] text-text-primary"
        >
          {letters.map((ch, i) => (
            <span
              key={i}
              data-letter
              aria-hidden
              className="inline-block will-change-transform"
              style={{ transform: "translateY(110%)" }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>

        <p
          data-reveal
          className="mt-8 max-w-2xl text-lg leading-relaxed text-text-primary/85 opacity-0 md:text-2xl"
        >
          {content.claim}
        </p>

        <div
          data-reveal
          className="mt-10 flex flex-col items-center gap-4 opacity-0 sm:flex-row sm:gap-5"
        >
          <Magnetic>
            <a
              href="#projects"
              data-cursor-hover
              className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-bg-primary transition-opacity hover:opacity-90"
            >
              See the work ↓
            </a>
          </Magnetic>
          <a
            href="#contact"
            data-cursor-hover
            className="inline-flex min-h-12 items-center rounded-md border border-text-secondary/40 px-6 font-semibold text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>

        <p data-reveal className="mt-8 text-sm text-text-secondary opacity-0">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-hidden />
          {content.availability}
        </p>
      </div>
    </section>
  );
}
