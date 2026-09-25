interface SectionHeaderProps {
  index: string;
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
}

/** Shared scene header: index + kicker on one technical rule, then the headline. */
export default function SectionHeader({ index, kicker, title, lede, className = "" }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p
        data-reveal
        className="flex items-center gap-3 text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0"
      >
        <span className="font-[family-name:var(--font-display)] tabular-nums text-accent">{index}</span>
        <span aria-hidden className="h-px w-8 bg-text-secondary/30" />
        <span>{kicker}</span>
      </p>
      <h2
        data-reveal
        className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.02] tracking-[-0.02em] text-text-primary opacity-0 md:text-6xl"
      >
        {title}
      </h2>
      {lede && (
        <p data-reveal className="mt-6 max-w-xl text-lg text-text-secondary opacity-0 md:text-xl">
          {lede}
        </p>
      )}
    </div>
  );
}
