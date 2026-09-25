import { content } from "@/lib/content";

const SOCIALS = [
  ["GitHub", "github"],
  ["LinkedIn", "linkedin"],
  ["Twitter", "twitter"],
  ["Instagram", "instagram"],
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 border-t border-text-secondary/15 bg-bg-primary/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-[family-name:var(--font-display)] font-bold text-text-primary">
            {content.name}
          </span>{" "}
          · {content.role} · © {year}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {SOCIALS.map(([label, key]) => (
            <li key={key}>
              <a
                href={content.social[key]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center transition-colors hover:text-accent"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="#hero" className="inline-flex min-h-11 items-center transition-colors hover:text-accent">
              Back to top ↑
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
