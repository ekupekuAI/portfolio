"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import ParticleField from "@/components/hero/ParticleField";

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const targets = [badgeRef.current, nameRef.current, roleRef.current];

    if (reducedMotion) {
      // gsap.set() applies synchronously, unlike tl.set() on a fresh timeline (which
      // only takes effect on GSAP's next ticker tick) — this path must never leave
      // content sitting at its opacity-0 default even briefly, since it exists
      // specifically for users who asked for no motion.
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    // React Strict Mode (the default in `next dev`) double-invokes effects on mount.
    // Without a cleanup that kills the timeline, a second mount creates a second
    // timeline animating the same elements — two tweens fighting over the same
    // opacity property, which can visibly stall the animation partway through.
    // gsap.context() + ctx.revert() (the pattern used elsewhere in this codebase)
    // handles that cleanup correctly.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(
          nameRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.2"
        )
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center"
    >
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      <div
        ref={badgeRef}
        className="relative z-10 mb-6 flex items-center gap-2 rounded-full border border-accent/30 bg-bg-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent opacity-0 backdrop-blur-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Available for opportunities
      </div>

      <h1
        ref={nameRef}
        className="relative z-10 whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(4rem,20vw,14rem)] font-bold leading-none tracking-tight text-text-primary opacity-0"
      >
        {content.name}
      </h1>
      <p
        ref={roleRef}
        className="relative z-10 mt-6 text-lg uppercase tracking-[0.15em] text-accent opacity-0 md:text-2xl"
      >
        {content.role}
      </p>
    </section>
  );
}
