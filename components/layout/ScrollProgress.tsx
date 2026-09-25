"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !barRef.current) return;
    registerGsap();

    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-bg-secondary">
      <div
        ref={barRef}
        className="h-full origin-left bg-accent shadow-[0_0_8px_rgba(0,229,255,0.8)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
