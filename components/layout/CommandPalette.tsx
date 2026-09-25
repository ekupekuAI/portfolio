"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { content } from "@/lib/content";

interface Command {
  id: string;
  label: string;
  group: string;
  action: () => void;
}

function buildCommands(): Command[] {
  const navigate = (hash: string) => () => {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  };
  const openInNewTab = (url: string) => () => window.open(url, "_blank", "noreferrer");

  const commands: Command[] = [
    { id: "nav-hero", label: "Go to top", group: "Navigate", action: navigate("hero") },
    { id: "nav-about", label: "Go to About", group: "Navigate", action: navigate("about") },
    {
      id: "nav-projects",
      label: "Go to Projects",
      group: "Navigate",
      action: navigate("projects"),
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      group: "Navigate",
      action: navigate("contact"),
    },
    {
      id: "resume",
      label: "Download resume",
      group: "Actions",
      action: () => {
        const a = document.createElement("a");
        a.href = content.resumeUrl;
        a.download = "";
        a.click();
      },
    },
    {
      id: "social-github",
      label: "Open GitHub",
      group: "Links",
      action: openInNewTab(content.social.github),
    },
    {
      id: "social-linkedin",
      label: "Open LinkedIn",
      group: "Links",
      action: openInNewTab(content.social.linkedin),
    },
    {
      id: "social-twitter",
      label: "Open Twitter",
      group: "Links",
      action: openInNewTab(content.social.twitter),
    },
    {
      id: "social-instagram",
      label: "Open Instagram",
      group: "Links",
      action: openInNewTab(content.social.instagram),
    },
  ];

  for (const project of content.projects) {
    if (project.liveUrl) {
      commands.push({
        id: `${project.id}-live`,
        label: `Open ${project.title} (Live)`,
        group: "Projects",
        action: openInNewTab(project.liveUrl),
      });
    }
    if (project.repoUrl) {
      commands.push({
        id: `${project.id}-repo`,
        label: `Open ${project.title} (Repo)`,
        group: "Projects",
        action: openInNewTab(project.repoUrl),
      });
    }
  }

  return commands;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = useMemo(buildCommands, []);

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  );

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function handleExternalOpen() {
      setOpen(true);
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("open-command-palette", handleExternalOpen);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("open-command-palette", handleExternalOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      // By the time this effect runs, React has already committed the DOM for this
      // render — the input exists. AnimatePresence's entrance transition is a visual
      // animation, not a mount delay, so no need to wait a frame for it.
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => setSelected(0), [query]);

  function runSelected() {
    const cmd = filtered[selected];
    if (!cmd) return;
    cmd.action();
    setOpen(false);
  }

  function handleInputKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runSelected();
    }
  }

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-bg-primary/70 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-lg border border-accent/30 bg-bg-secondary shadow-[0_0_40px_rgba(0,229,255,0.15)]"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeydown}
              placeholder="Type a command or search…"
              aria-label="Search commands"
              className="w-full border-b border-accent/20 bg-transparent px-4 py-3 text-text-primary outline-none placeholder:text-text-secondary focus:border-accent"
            />
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-text-secondary">No matches.</p>
              )}
              {filtered.map((cmd, i) => {
                const showGroupLabel = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroupLabel && (
                      <p className="px-4 pb-1 pt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">
                        {cmd.group}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        cmd.action();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelected(i)}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        i === selected
                          ? "bg-accent/15 text-accent"
                          : "text-text-primary"
                      }`}
                    >
                      {cmd.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
