"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { isTouchDevice } from "@/lib/isTouchDevice";

const LABELS: Record<string, string> = {
  view: "VIEW →",
  open: "OPEN →",
  explore: "EXPLORE →",
  github: "GITHUB →",
};

type Mode = { kind: "default" } | { kind: "hover" } | { kind: "label"; text: string };

const BASE = 16; // px; every state is a scale of this, so nothing animates layout

/**
 * A cursor that says what a click will do. `data-cursor="view|open|explore|github"`
 * on any element turns it into a labelled badge; other interactive elements
 * enlarge it; everywhere else it is a small ring.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: "default" });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (isTouchDevice()) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const key = labelled?.dataset.cursor;
      if (key && LABELS[key]) setMode({ kind: "label", text: LABELS[key] });
      else if (target.closest("a, button, [data-cursor-hover]")) setMode({ kind: "hover" });
      else setMode({ kind: "default" });
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const isLabel = mode.kind === "label";
  const scale = isLabel ? 5 : mode.kind === "hover" ? 2.5 : 1;

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-accent ${
        isLabel ? "" : "mix-blend-difference"
      }`}
      style={{ width: BASE, height: BASE, x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      animate={{
        scale,
        backgroundColor: isLabel
          ? "rgba(0,229,255,1)"
          : mode.kind === "hover"
            ? "rgba(0,229,255,0.25)"
            : "rgba(0,229,255,0)",
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className="whitespace-nowrap font-[family-name:var(--font-display)] text-[2.6px] font-bold tracking-[0.06em] text-bg-primary"
        animate={{ opacity: isLabel ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        {isLabel ? mode.text : ""}
      </motion.span>
    </motion.div>
  );
}
