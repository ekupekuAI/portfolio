import ParticleField from "@/components/hero/ParticleField";

/**
 * A dimmer, sparser version of the hero's particle network, fixed behind the entire
 * page. Content sections use a constrained reading width (e.g. max-w-3xl) centered on
 * a much wider viewport — without this, the side margins go dead as soon as you scroll
 * past the hero. This keeps the whole page visually alive, at low enough opacity that
 * it never competes with foreground text for attention.
 */
export default function AmbientBackground() {
  return (
    // No negative z-index here — that exact pattern (negative z-index + an ancestor
    // with overflow-hidden) was the root cause of a real, hard-to-diagnose invisible-
    // content bug in the hero earlier. This element is mounted before {children} in
    // layout.tsx, so normal DOM stacking order alone keeps it behind all page content.
    <div className="pointer-events-none fixed inset-0 opacity-25">
      <ParticleField particleCount={45} particleRadius={2.5} />
    </div>
  );
}
