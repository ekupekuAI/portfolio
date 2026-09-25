"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 768;

export function parseIsMobile(width: number): boolean {
  return width < BREAKPOINT;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(parseIsMobile(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}
