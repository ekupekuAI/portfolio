"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { content } from "@/lib/content";

const SESSION_KEY = "preloader-shown";
const DURATION_MS = 1100;
const FADE_MS = 400;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * A brief branded loading sequence before the page reveals — pure text/CSS, no canvas
 * or WebGL. Driven by a raw requestAnimationFrame loop, not GSAP's object-tweening,
 * after that pattern reliably stalled at 0 in this project's dev environment (see
 * CountUp.tsx for the diagnostic that confirmed it). Shows once per browser session
 * (sessionStorage), not on every anchor scroll within the page. The real content is
 * in the DOM the whole time; this is a visual overlay only, aria-hidden, and never
 * blocks interaction once it's done.
 */
export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const percentRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      // sessionStorage can throw in some privacy modes — just skip the preloader
      alreadyShown = true;
    }

    if (alreadyShown) return;
    setMounted(true);
    setVisible(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore — worst case the preloader shows again next load
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const percentEl = percentRef.current;
    const overlayEl = overlayRef.current;
    if (!percentEl || !overlayEl) return;

    function finish() {
      setVisible(false);
      setTimeout(() => setMounted(false), FADE_MS + 100);
    }

    if (reducedMotion) {
      finish();
      return;
    }

    const start = performance.now();
    let rafId = 0;

    function frame(now: number) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const percent = Math.round(easeInOutQuad(progress) * 100);
      percentEl!.textContent = `${percent}%`;

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        overlayEl!.style.transition = `opacity ${FADE_MS}ms ease`;
        overlayEl!.style.opacity = "0";
        setTimeout(finish, FADE_MS);
      }
    }
    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
  }, [visible, reducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-4 bg-bg-primary"
    >
      <p className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase tracking-[0.3em] text-text-primary">
        {content.name}
      </p>
      <span ref={percentRef} className="text-sm tracking-[0.2em] text-accent">
        0%
      </span>
    </div>
  );
}
