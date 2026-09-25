"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import ParticleField from "@/components/hero/ParticleField";

const DIM_BELOW_HERO = 0.3;

/**
 * The neural network as the page's floor: one fixed canvas behind every scene.
 * Full strength in the hero, dimmed to a third below it (scrubbed, so it comes
 * back the moment the user scrolls up), still reacting to the pointer anywhere.
 * Fewer particles on narrow screens.
 */
export default function NetworkBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setCount(mq.matches ? 130 : 60);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    registerGsap();
    const wrap = wrapRef.current;
    const hero = document.getElementById("hero");
    if (!wrap || !hero) return;
    if (reducedMotion) {
      gsap.set(wrap, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrap,
        { opacity: 1 },
        {
          opacity: DIM_BELOW_HERO,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        }
      );
    });
    return () => ctx.revert();
  }, [reducedMotion, count]);

  if (count === null) return null;

  return (
    <div ref={wrapRef} aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <ParticleField particleCount={count} particleRadius={count > 100 ? 4 : 3} />
    </div>
  );
}
