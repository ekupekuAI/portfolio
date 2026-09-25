"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { BOOT_COMPLETE_EVENT } from "@/components/layout/Boot";
import ParticleField from "@/components/hero/ParticleField";
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
    const field = root.querySelector<HTMLElement>("[data-field]");

    if (reducedMotion) {
      gsap.set(letterEls, { y: 0, yPercent: 0 });
      gsap.set(rest, { opacity: 1, y: 0 });
      gsap.set(field, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const entrance = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });
      // Inline translateY(110%) hides the letters before hydration; GSAP parses that
      // into a pixel `y`, so the from-state zeroes it and re-expresses it as yPercent.
      entrance
        .fromTo(field, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
        .fromTo(letterEls, { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.045 }, 0.1)
        .fromTo(rest, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.45);

      const start = () => entrance.play();
      if (document.documentElement.dataset.booting) {
        window.addEventListener(BOOT_COMPLETE_EVENT, start, { once: true });
      } else {
        start();
      }

      // Scroll-out: the name recedes and the text drifts up slower than the page,
      // the network fades, so leaving the hero feels like moving past it.
      gsap.to(nameEl, {
        scale: 0.86,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(textBlock, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(field, {
        opacity: 0.25,
        yPercent: -8,
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
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center md:pt-20 md:pb-12"
    >
      {/* The interactive network: full-bleed, reacts to the pointer, paused off-screen. */}
      <div data-field className="absolute inset-0 opacity-0">
        <ParticleField particleCount={130} particleRadius={4} />
      </div>
      {/* Darkens the centre so the name reads over the field without a glow or halo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(10,10,15,0.78),rgba(10,10,15,0)_100%)]"
      />

      <div data-text className="relative z-10 flex max-w-4xl flex-col items-center">
        <p
          data-reveal
          className="font-[family-name:var(--font-display)] text-xs font-medium tracking-[0.3em] text-accent opacity-0 md:text-sm"
        >
          {content.tagline}
        </p>

        <h1
          data-name
          aria-label={content.name}
          className="mt-5 flex overflow-hidden font-[family-name:var(--font-display)] text-[clamp(4rem,16vw,13rem)] font-bold leading-[0.92] tracking-[-0.04em] text-text-primary"
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
          className="mt-8 max-w-xl text-lg leading-relaxed text-text-primary/85 opacity-0 md:text-2xl"
        >
          {content.claim}
        </p>

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4 opacity-0">
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
            className="inline-flex min-h-12 items-center gap-2 rounded-md border border-text-secondary/35 bg-bg-primary/40 px-6 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.12em] text-text-primary backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
          >
            GitHub ↗
          </a>
        </div>

        <p data-reveal className="mt-8 flex items-center gap-2 text-sm text-text-secondary opacity-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
          {content.availability}
        </p>
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
