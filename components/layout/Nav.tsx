import { content } from "@/lib/content";

export default function Nav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm">
      <a
        href="#hero"
        data-cursor-hover
        className="font-[family-name:var(--font-display)] font-bold text-text-primary"
      >
        {content.name}
      </a>
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <a href="#about" data-cursor-hover className="hover:text-accent">
          About
        </a>
        <a href="#projects" data-cursor-hover className="hover:text-accent">
          Projects
        </a>
        <a href="#contact" data-cursor-hover className="hover:text-accent">
          Contact
        </a>
        <a
          href={content.resumeUrl}
          download
          data-cursor-hover
          className="rounded-full border border-accent px-4 py-1.5 text-accent hover:bg-accent hover:text-bg-primary"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
