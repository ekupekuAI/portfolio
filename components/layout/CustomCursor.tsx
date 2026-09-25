"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { isTouchDevice } from "@/lib/isTouchDevice";

type Mode = "default" | "hover" | "view";

const BASE = 16; // px; every other state is a scale of this, so nothing animates layout

/**
 * A cursor that does a job: it grows over interactive elements, and over featured
 * project covers (`data-cursor="view"`) it becomes a "View" badge, so the cover
 * reads as clickable without a hover overlay in the layout.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (isTouchDevice()) return; // stays disabled entirely on touch devices
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) setMode("view");
      else if (target.closest("a, button, [data-cursor-hover]")) setMode("hover");
      else setMode("default");
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const scale = mode === "view" ? 4.5 : mode === "hover" ? 3 : 1;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-accent ${
        mode === "view" ? "" : "mix-blend-difference"
      }`}
      style={{
        width: BASE,
        height: BASE,
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale,
        backgroundColor:
          mode === "view"
            ? "rgba(0,229,255,1)"
            : mode === "hover"
              ? "rgba(0,229,255,0.3)"
              : "rgba(0,229,255,0)",
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Counter-scaled so the label stays legible at any cursor scale. */}
      <motion.span
        className="font-[family-name:var(--font-display)] text-[3.5px] font-bold text-bg-primary"
        animate={{ opacity: mode === "view" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        View
      </motion.span>
    </motion.div>
  );
}
