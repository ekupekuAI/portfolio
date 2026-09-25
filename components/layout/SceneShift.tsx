"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

/**
 * Shifts the page background a few steps of graphite as each scene enters, so
 * moving through the page feels like moving through rooms. Reads
 * `data-scene-bg` from every section; no-op under reduced motion.
 */
export default function SceneShift() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const scenes = document.querySelectorAll<HTMLElement>("[data-scene-bg]");
    const triggers = Array.from(scenes).map((scene) =>
      ScrollTrigger.create({
        trigger: scene,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) {
            gsap.to(document.body, { backgroundColor: scene.dataset.sceneBg, duration: 0.9, ease: "power2.out" });
          }
        },
      })
    );
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(document.body, { clearProps: "backgroundColor" });
    };
  }, [reducedMotion]);

  return null;
}
