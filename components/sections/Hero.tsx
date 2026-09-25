"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import ParticleField from "@/components/hero/ParticleField";

export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) {
      // gsap.set() applies synchronously, unlike tl.set() on a fresh timeline (which
      // only takes effect on GSAP's next ticker tick) — this path must never leave
      // content sitting at its opacity-0 default even briefly, since it exists
      // specifically for users who asked for no motion.
      gsap.set([nameRef.current, roleRef.current], { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      roleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0">
        <ParticleField />
      </div>
      <h1
        ref={nameRef}
        className="relative z-10 font-[family-name:var(--font-display)] text-6xl font-bold tracking-tight text-text-primary opacity-0 md:text-8xl"
      >
        {content.name}
      </h1>
      <p ref={roleRef} className="relative z-10 mt-4 text-xl text-accent opacity-0 md:text-2xl">
        {content.role}
      </p>
    </section>
  );
}
