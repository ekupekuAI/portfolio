"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/useReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

export default function HeroSceneLoader() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="h-[400px] w-full md:h-[600px]">
      <HeroScene reducedMotion={reducedMotion} />
    </div>
  );
}
