"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/lib/content";
import { useActiveSection } from "@/lib/useActiveSection";
import { hasRealResume } from "@/lib/hasRealResume";
import Magnetic from "@/components/ui/Magnetic";

const LINKS = [
  { id: "thinking", label: "About" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

const SECTIONS = LINKS.map((l) => l.id);

export default function Nav() {
  const activeId = useActiveSection(SECTIONS);
  const [menuOpen, setMenuOpen] = useState(false);
  const showResume = hasRealResume(content.resumeUrl);

  // Lock body scroll while the mobile menu is open and close it on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header>
      <a
        href="#thinking"
        className="sr-only left-4 top-4 z-[100] rounded-md bg-accent px-4 py-2 font-semibold text-bg-primary focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-3 backdrop-blur-sm md:px-6"
      >
        <a
          href="#hero"
          data-cursor-hover
          className="inline-flex min-h-11 items-center px-2 font-[family-name:var(--font-display)] text-lg font-bold text-text-primary"
        >
          {content.name}
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 text-sm text-text-secondary md:flex">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              data-cursor-hover
              aria-current={activeId === link.id ? "true" : undefined}
              className={`inline-flex min-h-11 items-center px-3 transition-colors hover:text-accent ${
                activeId === link.id ? "text-accent" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
          {showResume && (
            <Magnetic className="ml-2">
              <a
                href={content.resumeUrl}
                download
                data-cursor-hover
                className="inline-flex min-h-11 items-center rounded-full border border-accent px-5 text-accent transition-colors hover:bg-accent hover:text-bg-primary"
              >
                Resume
              </a>
            </Magnetic>
          )}
          <button
            type="button"
            data-cursor-hover
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-md border border-accent/20 px-3 text-xs text-text-secondary transition-colors hover:border-accent hover:text-accent"
            aria-label="Open command palette"
          >
            <span>⌘</span>
            <span>K</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 text-sm text-text-primary md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-bg-primary/95 px-6 pb-12 pt-24 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: "easeOut" }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 font-[family-name:var(--font-display)] text-5xl font-bold ${
                      activeId === link.id ? "text-accent" : "text-text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-text-secondary">
              {showResume && (
                <a href={content.resumeUrl} download className="inline-flex min-h-11 items-center text-accent">
                  Resume
                </a>
              )}
              <a href={content.social.github} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center">
                GitHub
              </a>
              <a href={content.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center">
                LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
