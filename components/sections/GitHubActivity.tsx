"use client";

import { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}
interface ContributionWeek {
  contributionDays: ContributionDay[];
}
interface Calendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

type FetchState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; calendar: Calendar };

export function levelForCount(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_OPACITY = [0.08, 0.3, 0.5, 0.75, 1];

export default function GitHubActivity() {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-contributions")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok) {
          setState({ status: "ready", calendar: data.calendar });
        } else {
          setState({ status: "unavailable" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") return null;

  if (state.status === "unavailable") {
    return (
      <p className="mt-10 text-sm text-text-secondary">
        Live GitHub activity isn&apos;t connected yet — set a{" "}
        <code className="rounded bg-bg-secondary px-1.5 py-0.5 text-accent">GITHUB_TOKEN</code>{" "}
        to show it here.
      </p>
    );
  }

  const { calendar } = state;

  return (
    <div className="mt-16 border-t border-text-secondary/15 pt-8">
      <p className="text-sm text-text-secondary">
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-text-primary">
          {calendar.totalContributions}
        </span>{" "}
        contributions on GitHub in the last year
      </p>
      <div
        role="img"
        aria-label={`${calendar.totalContributions} GitHub contributions in the last year`}
        className="mt-4 flex gap-[3px] overflow-x-auto pb-2"
      >
        {calendar.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                aria-hidden
                title={`${day.contributionCount} contributions on ${day.date}`}
                className="h-[10px] w-[10px] rounded-sm bg-accent"
                style={{ opacity: LEVEL_OPACITY[levelForCount(day.contributionCount)] }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
