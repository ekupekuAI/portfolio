"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const DURATION_MS = 1400;

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

/**
 * Animates a number counting up from 0 to `value` once it scrolls into view.
 * Driven by a raw requestAnimationFrame loop rather than GSAP's object-tweening —
 * gsap.to() on a plain {val} object reliably stalled at 0 in this project's dev
 * environment (confirmed via a direct rAF frame-counter check: raw rAF fired at a
 * clean 60fps in the same tab while the GSAP tween never advanced), so this sidesteps
 * whatever that was rather than fight it.
 */
export default function CountUp({ value, suffix = "", className = "" }: CountUpProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const hasRun = useRef(false);

  useEffect(() => {
    const span = spanRef.current;
    const trigger = triggerRef.current;
    if (!span || !trigger) return;

    if (reducedMotion) {
      span.textContent = `${value}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const start = performance.now();
        function frame(now: number) {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const current = Math.round(easeOutQuad(progress) * value);
          span!.textContent = `${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [value, suffix, reducedMotion]);

  return (
    <span ref={triggerRef}>
      <span ref={spanRef} className={className}>
        0{suffix}
      </span>
    </span>
  );
}
