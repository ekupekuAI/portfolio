"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useReveal } from "@/lib/animations/useReveal";
import SectionHeader from "@/components/ui/SectionHeader";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * The stack as an architecture, not a logo grid. Hovering or focusing a
 * technology highlights everything it is used with in his projects and draws
 * the connections between them; everything else recedes.
 */
export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  useReveal(sectionRef);

  const related = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const [a, b] of content.stackRelations) {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    }
    return map;
  }, []);

  const activate = useCallback(
    (name: string | null) => {
      setActive(name);
      const tree = treeRef.current;
      if (!name || !tree) {
        setLines([]);
        return;
      }
      const origin = tree.getBoundingClientRect();
      const from = tree.querySelector<HTMLElement>(`[data-tech="${CSS.escape(name)}"]`);
      if (!from) return;
      const a = from.getBoundingClientRect();
      const next: Line[] = [];
      for (const other of related.get(name) ?? []) {
        const el = tree.querySelector<HTMLElement>(`[data-tech="${CSS.escape(other)}"]`);
        if (!el) continue;
        const b = el.getBoundingClientRect();
        next.push({
          x1: a.left + a.width / 2 - origin.left,
          y1: a.top + a.height / 2 - origin.top,
          x2: b.left + b.width / 2 - origin.left,
          y2: b.top + b.height / 2 - origin.top,
        });
      }
      setLines(next);
    },
    [related]
  );

  const isRelated = (name: string) => active === name || related.get(active ?? "")?.has(name);

  return (
    <section
      ref={sectionRef}
      id="stack"
      data-scene-bg="#0b0d12"
      className="mx-auto max-w-7xl px-6 py-[var(--spacing-section)] md:px-12"
    >
      <SectionHeader
        index="05"
        kicker="Stack"
        title={
          <>
            {content.name}&apos;s stack, as an architecture.
          </>
        }
        lede="Hover a technology to see what it is used with. Connections come from the projects above, not from a skills list."
      />

      <div ref={treeRef} data-reveal className="relative mt-14 opacity-0 md:mt-20" onPointerLeave={() => activate(null)}>
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((l, i) => (
            <path
              key={i}
              d={`M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2}, ${l.x2} ${(l.y1 + l.y2) / 2}, ${l.x2} ${l.y2}`}
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity="0.55"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {content.stackTree.map((group) => (
            <div key={group.name}>
              <p className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.14em] text-text-primary">
                {group.name}
              </p>
              <ul className="mt-3 border-l border-text-secondary/25 pl-0">
                {group.items.map((item) => {
                  const on = isRelated(item);
                  const dim = active !== null && !on;
                  return (
                    <li key={item} className="relative flex items-center">
                      <span aria-hidden className="h-px w-4 bg-text-secondary/25" />
                      <button
                        type="button"
                        data-tech={item}
                        onPointerEnter={() => activate(item)}
                        onFocus={() => activate(item)}
                        onBlur={() => activate(null)}
                        className={`relative z-10 -my-0.5 ml-2 inline-flex min-h-11 items-center rounded px-2 text-left text-base transition-[color,opacity] duration-200 ${
                          on ? "text-accent" : "text-text-primary"
                        } ${dim ? "opacity-35" : "opacity-100"}`}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
