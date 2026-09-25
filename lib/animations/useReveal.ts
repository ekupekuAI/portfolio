"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

/**
 * Animates every `[data-reveal]` descendant of `root` into view as it scrolls in
 * (opacity + y only). Under reduced motion everything is simply shown. Uses
 * gsap.context() so React Strict Mode's double effect never leaves two tweens
 * fighting over the same element.
 */
export function useReveal(root: RefObject<HTMLElement | null>, deps: unknown[] = []): void {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (items.length === 0) return;

    if (reducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          }
        );
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, root, ...deps]);
}
