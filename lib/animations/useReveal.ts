"use client";

import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

/**
 * Animates every `[data-reveal]` descendant of `root` into view as it scrolls in
 * (opacity + y only). Under reduced motion everything is simply shown. Uses
 * gsap.context() so React Strict Mode's double effect never leaves two tweens
 * fighting over the same element.
 *
 * Pass `deps` that change whenever the set of reveal targets changes (e.g. a
 * key of row ids once async data arrives): the hook re-runs, tweens the new
 * elements, and keeps already-revealed ones visible instead of replaying them.
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
        if (item.dataset.revealed) {
          // Already shown in a previous run; ctx.revert() from that run put it
          // back to its opacity-0 class, so pin it visible without a replay.
          gsap.set(item, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          item,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
            onComplete: () => {
              item.dataset.revealed = "1";
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, root, ...deps]);
}
