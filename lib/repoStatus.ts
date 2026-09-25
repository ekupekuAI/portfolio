export type RepoStatus = "LIVE" | "BUILDING" | "ACTIVE" | "STABLE";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Derives a project status from facts, never from a hand-typed label:
 * - LIVE: a public demo exists.
 * - BUILDING: last push within 30 days.
 * - ACTIVE: last push within 120 days.
 * - STABLE: older than that.
 * Returns null when nothing is known (no push date and no demo), so the UI shows
 * no badge rather than a guess.
 */
export function repoStatus(opts: {
  pushedAt?: string | null;
  hasLiveUrl?: boolean;
  now?: Date;
}): RepoStatus | null {
  if (opts.hasLiveUrl) return "LIVE";
  if (!opts.pushedAt) return null;
  const pushed = new Date(opts.pushedAt).getTime();
  if (Number.isNaN(pushed)) return null;
  const now = (opts.now ?? new Date()).getTime();
  const days = (now - pushed) / DAY_MS;
  if (days <= 30) return "BUILDING";
  if (days <= 120) return "ACTIVE";
  return "STABLE";
}

/** "3 days ago", "2 months ago" — for the Lab tiles. */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const days = Math.max(0, Math.floor(diff / DAY_MS));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/** Repo name from a GitHub URL: "https://github.com/a/b" -> "b". */
export function repoNameFromUrl(url: string): string | null {
  const m = url.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  return m ? m[1] : null;
}
