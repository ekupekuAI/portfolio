"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
const FRAME_MS = 35;
const LOCK_STEP_FRAMES = 2; // how many frames between each character locking in

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

interface ScrambleTextProps {
  text: string;
  className?: string;
}

/**
 * Reveals text by rapidly cycling random characters before each letter locks into
 * place, left to right — a classic hacker/terminal decode effect. Triggers once, the
 * first time the element scrolls into view. Skips straight to the real text under
 * prefers-reduced-motion. Renders a plain `span` — wrap it in whatever semantic tag
 * (h2, p, ...) the context needs: `<h2><ScrambleText text="About" /></h2>`.
 */
export default function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const reducedMotion = useReducedMotion();
  const hasRun = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;

        let frame = 0;
        let lockedCount = 0;
        const interval = setInterval(() => {
          frame++;
          if (frame % LOCK_STEP_FRAMES === 0 && lockedCount < text.length) {
            lockedCount++;
          }

          setDisplay(
            text
              .split("")
              .map((char, i) => {
                if (char === " ") return " ";
                if (i < lockedCount) return char;
                return randomChar();
              })
              .join("")
          );

          if (lockedCount >= text.length) clearInterval(interval);
        }, FRAME_MS);

        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
