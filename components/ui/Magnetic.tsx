"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const PULL_RADIUS = 80; // px — how close the cursor needs to be before it starts pulling
const PULL_STRENGTH = 0.35; // 0..1 — how much of the offset the element actually moves

interface MagneticProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps its child in a subtle "magnetic" pull toward the cursor as it approaches,
 * springing back to rest when the cursor leaves. A common polish detail on top design
 * agency sites, applied here to primary CTAs only — overusing it on every link would
 * be distracting rather than premium-feeling.
 */
export default function Magnetic({ children, className = "" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.5 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance < PULL_RADIUS) {
      x.set(dx * PULL_STRENGTH);
      y.set(dy * PULL_STRENGTH);
    } else {
      x.set(0);
      y.set(0);
    }
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
