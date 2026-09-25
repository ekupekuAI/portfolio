"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";

const STORAGE_KEY = "boot-shown";
const LINE_INTERVAL_MS = 220;
const HOLD_AFTER_LAST_MS = 350;

export const BOOT_COMPLETE_EVENT = "boot-complete";

function finish() {
  delete document.documentElement.dataset.booting;
  window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT));
}

/**
 * A ~1.2 s "system initialisation" over the already-rendered hero: four lines check
 * in, then the overlay dissolves. Skippable (button, Esc, or any key), once per
 * session, and never shown under prefers-reduced-motion. The hero waits for
 * `boot-complete` only while `<html data-booting>` is set, so a skipped boot
 * costs nothing.
 */
export default function Boot() {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(0);

  // Decide synchronously before paint so the hero can see the flag in its own effect.
  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let shown = false;
    try {
      shown = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      shown = false;
    }
    if (reduced || shown) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode: still show once */
    }
    document.documentElement.dataset.booting = "1";
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const total = content.bootLines.length;
    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(window.setTimeout(() => setChecked(i), i * LINE_INTERVAL_MS));
    }
    timers.push(
      window.setTimeout(() => setVisible(false), total * LINE_INTERVAL_MS + HOLD_AFTER_LAST_MS)
    );
    const onKey = () => setVisible(false);
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[300] flex items-end bg-bg-primary px-6 pb-10 md:px-12 md:pb-14"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
        >
          <div className="flex w-full items-end justify-between gap-6">
            <ul className="font-[family-name:var(--font-display)] text-sm tracking-[var(--tracking-label)] text-text-secondary md:text-base">
              {content.bootLines.map((line, i) => {
                const on = i < checked;
                return (
                  <li key={line} className="flex items-center gap-4 py-1">
                    <span
                      aria-hidden
                      className={`inline-flex h-4 w-4 items-center justify-center border text-[10px] transition-colors duration-150 ${
                        on ? "border-accent text-accent" : "border-text-secondary/40 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    <span className={`transition-colors duration-150 ${on ? "text-text-primary" : ""}`}>
                      {line}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="inline-flex min-h-11 items-center text-sm text-text-secondary transition-colors hover:text-accent"
            >
              Skip →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
