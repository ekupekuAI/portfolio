"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { BOOT_COMPLETE_EVENT } from "@/components/layout/Boot";
import SystemCore from "@/components/hero/SystemCore";
import Magnetic from "@/components/ui/Magnetic";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const letters = Array.from(content.name.toUpperCase());

  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const letterEls = root.querySelectorAll<HTMLElement>("[data-letter]");
    const rest = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const nameEl = root.querySelector<HTMLElement>("[data-name]");
    const textBlock = root.querySelector<HTMLElement>("[data-text]");
    const visual = root.querySelector<HTMLElement>("[data-visual]");

    if (reducedMotion) {
      gsap.set(letterEls, { y: 0, yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      gsap.set(visual, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      // Inline translateY(110%) hides the letters before hydration; GSAP parses that
      // into a pixel `y`, so the from-state zeroes it and re-expresses it as yPercent.
      entrance
        .fromTo(letterEls, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.045 }, 0)
        .fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.35)
        .fromTo(visual, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.2 }, 0.2);

      const start = () => entrance.play();
      if (document.documentElement.dataset.booting) {
        window.addEventListener(BOOT_COMPLETE_EVENT, start, { once: true });
      } else {
        start();
      }

      // Scroll-out: the name recedes and the block drifts up slower than the page,
      // so leaving the hero feels like moving past it rather than cutting away.
      gsap.to(nameEl, {
        scale: 0.86,
        opacity: 0.15,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(textBlock, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(visual, {
        yPercent: -12,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scene-bg="#0a0a0f"
      className="relative flex min-h-svh items-center overflow-hidden px-6 pt-24 pb-16 md:px-12 md:pt-20 md:pb-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-8">
        <div data-text className="relative z-10">
          <p
            data-reveal
            className="font-[family-name:var(--font-display)] text-xs font-medium tracking-[0.3em] text-accent opacity-0 md:text-sm"
          >
            {content.tagline}
          </p>

          <h1
            data-name
            aria-label={content.name}
            className="mt-5 flex overflow-hidden font-[family-name:var(--font-display)] text-[clamp(4rem,10.5vw,10rem)] font-bold leading-[0.92] tracking-[-0.04em] text-text-primary"
          >
            {letters.map((ch, i) => (
              <span
                key={i}
                data-letter
                aria-hidden
                className="inline-block will-change-transform"
                style={{ transform: "translateY(110%)" }}
              >
                {ch}
              </span>
            ))}
          </h1>

          <p
            data-reveal
            className="mt-7 max-w-md text-lg leading-relaxed text-text-primary/85 opacity-0 md:text-2xl"
          >
            {content.claim}
          </p>

          <div data-reveal className="mt-9 flex flex-wrap items-center gap-4 opacity-0">
            <Magnetic>
              <a
                href="#work"
                data-cursor="view"
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-accent px-6 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.12em] text-bg-primary transition-opacity hover:opacity-90"
              >
                View my work
              </a>
            </Magnetic>
            <a
              href={content.social.github}
              target="_blank"
              rel="noreferrer"
              data-cursor="github"
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-text-secondary/35 px-6 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.12em] text-text-primary transition-colors hover:border-accent hover:text-accent"
            >
              GitHub ↗
            </a>
          </div>

          <p data-reveal className="mt-8 flex items-center gap-2 text-sm text-text-secondary opacity-0">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {content.availability}
          </p>
        </div>

        <div
          data-visual
          className="relative mx-auto aspect-square w-full max-w-[340px] opacity-0 md:max-w-[560px]"
        >
          <SystemCore />
        </div>
      </div>

      <p
        data-reveal
        aria-hidden
        className="absolute bottom-6 left-6 hidden items-center gap-3 text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0 md:left-12 md:flex"
      >
        <span className="h-px w-8 bg-text-secondary/40" />
        Scroll
      </p>
    </section>
  );
}
