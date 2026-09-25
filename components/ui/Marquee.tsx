"use client";

import { useReducedMotion } from "@/lib/useReducedMotion";

interface MarqueeProps {
  words: string[];
  className?: string;
}

/**
 * An infinite horizontally-scrolling text band. Pure CSS animation (see the
 * `marquee-scroll` keyframes in globals.css) — the content is duplicated once so the
 * loop is seamless, and animation is skipped entirely for prefers-reduced-motion.
 */
export default function Marquee({ words, className = "" }: MarqueeProps) {
  const reducedMotion = useReducedMotion();
  const content = words.join(" ✦ ") + " ✦ ";

  return (
    <div
      className={`overflow-hidden border-y border-accent/10 py-4 ${className}`}
      aria-hidden
    >
      <div
        className={`flex w-max whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-text-secondary ${
          reducedMotion ? "" : "animate-marquee-scroll"
        }`}
      >
        <span className="px-2">{content}</span>
        <span className="px-2">{content}</span>
      </div>
    </div>
  );
}
