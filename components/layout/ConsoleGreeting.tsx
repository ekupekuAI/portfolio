"use client";

import { useEffect } from "react";
import { content } from "@/lib/content";

/** A note for the engineers who open DevTools. Runs once, prints nothing else. */
export default function ConsoleGreeting() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    console.log(
      `%c${content.name.toUpperCase()}  %c${content.tagline}\n%cNext.js · GSAP ScrollTrigger · Canvas 2D (no WebGL) · live GitHub data\nSource: ${content.social.github}/portfolio\nPress ⌘K / Ctrl+K anywhere.`,
      "font-weight:700;font-size:16px;color:#f5f5f7",
      "font-size:12px;letter-spacing:0.2em;color:#00e5ff",
      "font-size:12px;color:#9a9aa5"
    );
  }, []);
  return null;
}
