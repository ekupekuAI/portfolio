"use client";

import { useEffect, useRef, useState } from "react";
import { isTouchDevice } from "@/lib/isTouchDevice";

/**
 * A soft radial light that follows the cursor, subtly lifting the background where
 * the mouse is. Pure CSS (a radial-gradient positioned via custom properties updated
 * on pointermove) — no canvas, no WebGL. Disabled entirely on touch devices, same as
 * the custom cursor, since there's no persistent pointer position to follow there.
 */
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice()) return;
    setEnabled(true);

    function handleMove(e: PointerEvent) {
      ref.current?.style.setProperty("--spotlight-x", `${e.clientX}px`);
      ref.current?.style.setProperty("--spotlight-y", `${e.clientY}px`);
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        background:
          "radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(0,229,255,0.06), transparent 70%)",
      }}
    />
  );
}
