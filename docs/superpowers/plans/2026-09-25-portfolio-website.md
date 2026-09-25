# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, 3D, scroll-driven personal portfolio site (Next.js) with a
hero 3D model, GSAP scroll choreography, a horizontal-scrolljacking projects gallery with
a mandatory mobile fallback, a functional contact form, and content wired to a single
typed data file for easy real-content swap-in later.

**Architecture:** Next.js App Router + TypeScript. React Three Fiber renders a placeholder
3D hero object (swappable later for the real Spline export) inside a client-only dynamic
import. GSAP + ScrollTrigger drives section-level scroll choreography (pinning, horizontal
scrolljack, reveal-on-scroll); Framer Motion (`motion` package) handles small UI
micro-interactions (custom cursor, hover states). Tailwind CSS provides styling on a fixed
dark-cinematic token set. A Next.js Route Handler + Resend sends contact-form messages by
email with no server-side storage. All personal content lives in one typed file,
`lib/content.ts`.

**Tech Stack:** Next.js (App Router, TypeScript), React Three Fiber + three.js, GSAP +
ScrollTrigger, `motion` (Framer Motion), Tailwind CSS, Resend, Vitest for pure-logic unit
tests.

**Spec:** `docs/superpowers/specs/2026-09-25-portfolio-website-design.md`

## Global Constraints

- Theme is dark-cinematic ONLY — no light mode/toggle.
- Design tokens (exact values, used everywhere, no ad-hoc colors):
  - `--bg-primary: #0A0A0F` (near-black charcoal)
  - `--bg-secondary: #121218`
  - `--text-primary: #F5F5F7`
  - `--text-secondary: #9A9AA5`
  - `--accent: #00E5FF` (electric cyan — buttons, glows, 3D lighting tint, cursor)
- Fonts: `Space Grotesk` (display/headings) + `Inter` (body), both via `next/font/google`.
- Horizontal scrolljacking in Projects MUST be disabled below the `768px` breakpoint and
  replaced with a native swipeable stack — this is a correctness requirement, not polish.
- Custom cursor MUST be fully absent (not just hidden via CSS) on touch/coarse-pointer
  devices.
- `prefers-reduced-motion` MUST reduce GSAP entrance/parallax/scrub intensity to simple
  opacity fades app-wide.
- The R3F `<Canvas>` MUST be loaded via `next/dynamic` with `ssr: false`.
- No server-side persistence of contact-form messages — pass-through to email only.
- Package manager: `npm`. Repo stays local-only (no GitHub remote, no push) for this plan.
- Every non-trivial pure-logic unit (validation, coordinate math, breakpoint/touch
  detection) is a small standalone function in `lib/`, unit-tested with Vitest — per the
  spec's testing approach, visual/animation behavior is verified by actually running the
  dev server and checking it in the browser, not by unit-testing animation timelines.

---

### Task 1: Project scaffold, dependencies, and design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`,
  `tailwind.config.ts`, `app/globals.css`, `.gitignore`, `.env.example`
- Create: `vitest.config.ts`

**Interfaces:**
- Produces: Tailwind theme tokens (`bg-primary`, `bg-secondary`, `text-primary`,
  `text-secondary`, `accent`) usable as `bg-bg-primary`, `text-accent`, etc. in every later
  task. `npm run dev`, `npm run build`, `npm test` scripts.

- [ ] **Step 1: Scaffold the Next.js app**

Run (non-interactive flags so it doesn't prompt):

```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --import-alias "@/*" --use-npm --no-src-dir --yes
```

If the directory-not-empty check complains about the existing `docs/` and `.git/`
folders, re-run with `--skip-install` cleared and confirm overwrite is not needed (it
only writes new files; it won't touch `docs/`).

- [ ] **Step 2: Install animation/3D/email/testing dependencies**

```bash
npm install three @react-three/fiber @react-three/drei gsap motion resend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/three
```

- [ ] **Step 3: Add the test script and Vitest config**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 4: Set the dark-cinematic design tokens in Tailwind**

Edit `tailwind.config.ts` so `theme.extend.colors` contains:

```ts
colors: {
  "bg-primary": "#0A0A0F",
  "bg-secondary": "#121218",
  "text-primary": "#F5F5F7",
  "text-secondary": "#9A9AA5",
  accent: "#00E5FF",
},
```

- [ ] **Step 5: Set global dark background/text and remove default light styles**

Replace the contents of `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: #0A0A0F;
  color: #F5F5F7;
}
```

- [ ] **Step 6: Add `.env.example` for the contact form**

Create `.env.example`:

```
RESEND_API_KEY=
CONTACT_TO_EMAIL=
```

- [ ] **Step 7: Verify the scaffold builds and tests run**

Run: `npm run build`
Expected: build completes with no errors (default starter page).

Run: `npm test`
Expected: "No test files found" is fine at this stage — command exits 0.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with dark-cinematic Tailwind tokens

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Content data model

**Files:**
- Create: `lib/content.ts`
- Test: `lib/content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Project {
    id: string; title: string; description: string;
    image: string; liveUrl?: string; repoUrl?: string;
  }
  export interface SocialLinks { github: string; linkedin: string; instagram: string; }
  export interface SiteContent {
    name: string; role: string; bio: string; techStack: string[];
    projects: Project[]; social: SocialLinks; resumeUrl: string;
  }
  export const content: SiteContent;
  ```
  Every later component that needs personal content imports `content` from this file.

- [ ] **Step 1: Write the failing test**

Create `lib/content.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { content } from "./content";

describe("content", () => {
  it("has required top-level fields populated", () => {
    expect(content.name.length).toBeGreaterThan(0);
    expect(content.role.length).toBeGreaterThan(0);
    expect(content.bio.length).toBeGreaterThan(0);
    expect(content.resumeUrl.length).toBeGreaterThan(0);
  });

  it("has a non-empty tech stack", () => {
    expect(content.techStack.length).toBeGreaterThan(0);
  });

  it("has at least one project with required fields", () => {
    expect(content.projects.length).toBeGreaterThan(0);
    const p = content.projects[0];
    expect(p.id).toBeTruthy();
    expect(p.title).toBeTruthy();
    expect(p.description).toBeTruthy();
  });

  it("has all three social links present (even as placeholders)", () => {
    expect(content.social.github).toBeTruthy();
    expect(content.social.linkedin).toBeTruthy();
    expect(content.social.instagram).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/content.test.ts`
Expected: FAIL — `./content` has no exported member `content` (file doesn't exist yet).

- [ ] **Step 3: Implement the content data model with placeholders**

Create `lib/content.ts`:

```ts
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
}

export interface SiteContent {
  name: string;
  role: string;
  bio: string;
  techStack: string[];
  projects: Project[];
  social: SocialLinks;
  resumeUrl: string;
}

// NOTE: placeholder content. Replace with real data (LinkedIn bio, GitHub/Instagram
// links, real projects, real resume) — this file is the single place that needs editing.
export const content: SiteContent = {
  name: "Your Name",
  role: "AI/ML Developer",
  bio: "B.Tech CSE student building AI/ML systems, competitive-coding projects, and hackathon builds. Replace this bio with your real background.",
  techStack: ["Python", "TypeScript", "React", "PyTorch", "Next.js", "Node.js"],
  projects: [
    {
      id: "placeholder-project-1",
      title: "Placeholder Project",
      description: "Replace with a real project description once you send it over.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/",
    },
  ],
  social: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/",
  },
  resumeUrl: "/resume-placeholder.txt",
};
```

- [ ] **Step 4: Add a placeholder project image and resume file**

Create `public/projects/placeholder.svg` (a minimal placeholder graphic):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#121218"/>
  <text x="300" y="200" fill="#00E5FF" font-family="sans-serif" font-size="24" text-anchor="middle">Project image placeholder</text>
</svg>
```

Create `public/resume-placeholder.txt`:

```
Replace this file with your real resume PDF, then update `resumeUrl` in lib/content.ts
to point to the new file (e.g. "/cv.pdf").
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- lib/content.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/content.test.ts public/projects/placeholder.svg public/resume-placeholder.txt
git commit -m "feat: add typed content data model with placeholders

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Reduced-motion support

**Files:**
- Create: `lib/useReducedMotion.ts`
- Test: `lib/useReducedMotion.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export function useReducedMotion(): boolean; // React hook, client-only
  ```
  Later animation code (Task 6 HeroScene, Task 7 Hero entrance, Task 8 About, Task 9
  Projects, Task 11 Contact) calls `useReducedMotion()` and branches its GSAP/R3F
  animation logic directly on the returned boolean (`if (reducedMotion) { ... }`).

- [ ] **Step 1: Write the failing test**

Create `lib/useReducedMotion.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReducedMotion } from "./useReducedMotion";

describe("useReducedMotion", () => {
  afterEach(() => {
    // @ts-expect-error resetting jsdom matchMedia mock between tests
    delete window.matchMedia;
  });

  it("returns true when the OS-level reduce-motion media query matches", () => {
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("returns false when the media query does not match", () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/useReducedMotion.test.ts`
Expected: FAIL — module doesn't exist yet.

- [ ] **Step 3: Implement the hook**

Create `lib/useReducedMotion.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/useReducedMotion.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/useReducedMotion.ts lib/useReducedMotion.test.ts
git commit -m "feat: add reduced-motion hook and intensity helper

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Root layout, fonts, and metadata

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `content` from `lib/content.ts` (Task 2) for metadata title/description.
- Produces: global `<html>`/`<body>` shell with fonts applied via CSS variables
  `--font-display` and `--font-body`, used by later Tailwind classes
  `font-[family-name:var(--font-display)]` etc.

- [ ] **Step 1: Implement layout with fonts and SEO metadata**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { content } from "@/lib/content";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: `${content.name} — ${content.role}`,
  description: content.bio,
  openGraph: {
    title: `${content.name} — ${content.role}`,
    description: content.bio,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)] bg-bg-primary text-text-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: set up root layout with fonts and SEO metadata

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Touch detection and custom cursor

**Files:**
- Create: `lib/isTouchDevice.ts`
- Create: `components/layout/CustomCursor.tsx`
- Test: `lib/isTouchDevice.test.ts`

**Interfaces:**
- Produces: `export function isTouchDevice(): boolean;` and `<CustomCursor />` (no props,
  self-contained, mounted once in `app/layout.tsx` by Task 13).

- [ ] **Step 1: Write the failing test**

Create `lib/isTouchDevice.test.ts`:

```ts
import { describe, it, expect, afterEach } from "vitest";
import { isTouchDevice } from "./isTouchDevice";

describe("isTouchDevice", () => {
  afterEach(() => {
    // @ts-expect-error resetting jsdom matchMedia mock between tests
    delete window.matchMedia;
  });

  it("returns true when the (pointer: coarse) media query matches", () => {
    window.matchMedia = ((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
    })) as unknown as typeof window.matchMedia;

    expect(isTouchDevice()).toBe(true);
  });

  it("returns false when the (pointer: coarse) media query does not match", () => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
    })) as unknown as typeof window.matchMedia;

    expect(isTouchDevice()).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/isTouchDevice.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement the pure helper**

Create `lib/isTouchDevice.ts`:

```ts
export function isTouchDevice(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/isTouchDevice.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Implement the CustomCursor component**

Create `components/layout/CustomCursor.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { isTouchDevice } from "@/lib/isTouchDevice";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (isTouchDevice()) return; // stays disabled entirely on touch devices
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [data-cursor-hover]"));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-accent mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: hovering ? 48 : 16,
        height: hovering ? 48 : 16,
        backgroundColor: hovering ? "rgba(0,229,255,0.3)" : "transparent",
      }}
      transition={{ duration: 0.2 }}
    />
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/isTouchDevice.ts lib/isTouchDevice.test.ts components/layout/CustomCursor.tsx
git commit -m "feat: add touch-aware custom cursor

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: 3D hero scene (placeholder model + mouse tracking)

**Files:**
- Create: `lib/pointerToRotation.ts`
- Create: `components/three/HeroScene.tsx`
- Create: `components/three/HeroSceneLoader.tsx`
- Test: `lib/pointerToRotation.test.ts`

**Interfaces:**
- Produces: `export function pointerToRotation(x: number, y: number, width: number, height: number): { x: number; y: number };`
  and a default-exported `HeroSceneLoader` client component (dynamic-imports `HeroScene`
  with `ssr: false`) — this is what Task 7's Hero section renders.
- Consumes: `useReducedMotion` from Task 3.

- [ ] **Step 1: Write the failing test**

Create `lib/pointerToRotation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { pointerToRotation } from "./pointerToRotation";

describe("pointerToRotation", () => {
  it("returns zero rotation when pointer is at the exact center", () => {
    const r = pointerToRotation(400, 300, 800, 600);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(0);
  });

  it("returns positive y-rotation when pointer is at the right edge", () => {
    const r = pointerToRotation(800, 300, 800, 600);
    expect(r.y).toBeGreaterThan(0);
  });

  it("returns negative x-rotation when pointer is at the top edge", () => {
    const r = pointerToRotation(400, 0, 800, 600);
    expect(r.x).toBeLessThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/pointerToRotation.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement the pure helper**

Create `lib/pointerToRotation.ts`:

```ts
const MAX_ROTATION = 0.4; // radians, subtle tilt not a full spin

export function pointerToRotation(
  pointerX: number,
  pointerY: number,
  width: number,
  height: number
): { x: number; y: number } {
  const normX = (pointerX / width) * 2 - 1; // -1..1
  const normY = (pointerY / height) * 2 - 1; // -1..1
  return {
    x: normY * MAX_ROTATION,
    y: normX * MAX_ROTATION,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/pointerToRotation.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Implement the R3F scene**

Create `components/three/HeroScene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { pointerToRotation } from "@/lib/pointerToRotation";

function HeroModel({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      const { x, y } = pointerToRotation(
        state.pointer.x * state.size.width * 0.5 + state.size.width * 0.5,
        -state.pointer.y * state.size.height * 0.5 + state.size.height * 0.5,
        state.size.width,
        state.size.height
      );
      target.current = { x, y };
    }

    // ease toward target rotation, plus a slow idle spin
    meshRef.current.rotation.x += (target.current.x - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y +=
      (target.current.y - meshRef.current.rotation.y) * 0.05 + (reducedMotion ? 0 : 0.002);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        color="#0A0A0F"
        emissive="#00E5FF"
        emissiveIntensity={0.4}
        metalness={0.6}
        roughness={0.2}
        wireframe={false}
      />
    </mesh>
  );
}

export default function HeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00E5FF" />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color="#00E5FF" />
      <HeroModel reducedMotion={reducedMotion} />
    </Canvas>
  );
}
```

- [ ] **Step 6: Implement the client-only dynamic loader**

Create `components/three/HeroSceneLoader.tsx`:

```tsx
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
```

> Note: this icosahedron is the placeholder 3D centerpiece. Once you export your Spline
> model as React Three Fiber code, replace the `<mesh>` contents of `HeroModel` with the
> generated geometry/material — the mouse-tracking and reduced-motion wiring stay as-is.

- [ ] **Step 7: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors (HeroSceneLoader isn't wired into a page yet,
but must type-check and build cleanly on its own).

- [ ] **Step 8: Commit**

```bash
git add lib/pointerToRotation.ts lib/pointerToRotation.test.ts components/three/HeroScene.tsx components/three/HeroSceneLoader.tsx
git commit -m "feat: add placeholder 3D hero scene with mouse-tracking rotation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: GSAP setup + Hero section

**Files:**
- Create: `lib/animations/gsap.ts`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `content` (Task 2), `HeroSceneLoader` (Task 6), `useReducedMotion` (Task 3).
- Produces: `export function registerGsap(): void;` (idempotent ScrollTrigger
  registration) called by every later section that uses ScrollTrigger (Tasks 8, 9, 11).
  Default-exported `<Hero />` section component, rendered first in `app/page.tsx`
  (Task 13).

- [ ] **Step 1: Implement the GSAP registration helper**

Create `lib/animations/gsap.ts`:

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
```

- [ ] **Step 2: Implement the Hero section with entrance animation**

Create `components/sections/Hero.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import HeroSceneLoader from "@/components/three/HeroSceneLoader";

export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (reducedMotion) {
      tl.set([nameRef.current, roleRef.current], { opacity: 1, y: 0 });
      return;
    }

    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    ).fromTo(
      roleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="absolute inset-0 -z-10 opacity-80">
        <HeroSceneLoader />
      </div>
      <h1
        ref={nameRef}
        className="font-[family-name:var(--font-display)] text-6xl font-bold tracking-tight text-text-primary opacity-0 md:text-8xl"
      >
        {content.name}
      </h1>
      <p
        ref={roleRef}
        className="mt-4 text-xl text-accent opacity-0 md:text-2xl"
      >
        {content.role}
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/animations/gsap.ts components/sections/Hero.tsx
git commit -m "feat: add GSAP setup helper and Hero section with entrance animation

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: About section (pinned scroll reveal)

**Files:**
- Create: `components/sections/About.tsx`

**Interfaces:**
- Consumes: `content`, `useReducedMotion`, `registerGsap`/`gsap`/`ScrollTrigger` from
  Task 7.

- [ ] **Step 1: Implement the About section**

Create `components/sections/About.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const stackRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const items = stackRef.current?.querySelectorAll("li") ?? [];

    if (reducedMotion) {
      gsap.set([bioRef.current, ...Array.from(items)], { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: { trigger: stackRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="mx-auto max-w-3xl px-6 py-32"
    >
      <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold text-text-primary md:text-5xl">
        About
      </h2>
      <p ref={bioRef} className="mt-6 text-lg text-text-secondary opacity-0 md:text-xl">
        {content.bio}
      </p>
      <ul ref={stackRef} className="mt-8 flex flex-wrap gap-3">
        {content.techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-accent/30 px-4 py-1.5 text-sm text-accent opacity-0"
          >
            {tech}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/About.tsx
git commit -m "feat: add About section with pinned scroll reveal

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 9: Projects section (desktop scrolljack + mandatory mobile fallback)

**Files:**
- Create: `lib/useIsMobile.ts`
- Create: `components/sections/Projects.tsx`
- Test: `lib/useIsMobile.test.ts`

**Interfaces:**
- Consumes: `content.projects`, `useReducedMotion`, `gsap`/`registerGsap`/`ScrollTrigger`.
- Produces: `export function parseIsMobile(width: number): boolean;` (pure, breakpoint
  `< 768`) and `export function useIsMobile(): boolean` (React hook wrapping it with a
  resize listener).

- [ ] **Step 1: Write the failing test for the pure breakpoint function**

Create `lib/useIsMobile.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseIsMobile } from "./useIsMobile";

describe("parseIsMobile", () => {
  it("returns true below the 768px breakpoint", () => {
    expect(parseIsMobile(767)).toBe(true);
  });

  it("returns false at or above the 768px breakpoint", () => {
    expect(parseIsMobile(768)).toBe(false);
    expect(parseIsMobile(1024)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/useIsMobile.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement the pure function and hook**

Create `lib/useIsMobile.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/useIsMobile.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Implement the Projects section**

Create `components/sections/Projects.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { useIsMobile } from "@/lib/useIsMobile";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

function ProjectCard({ project }: { project: (typeof content.projects)[number] }) {
  return (
    <div className="w-[80vw] flex-shrink-0 rounded-lg border border-accent/20 bg-bg-secondary p-6 md:w-[480px]">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
        <Image src={project.image} alt={project.title} fill className="object-cover" />
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-text-primary">
        {project.title}
      </h3>
      <p className="mt-2 text-text-secondary">{project.description}</p>
      <div className="mt-4 flex gap-4 text-accent">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" data-cursor-hover>
            Live
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noreferrer" data-cursor-hover>
            Repo
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isMobile || reducedMotion) return; // no scrolljacking on mobile or reduced motion
    registerGsap();

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const scrollDistance = track.scrollWidth - section.clientWidth;
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden py-32"
    >
      <h2 className="mb-12 px-6 font-[family-name:var(--font-display)] text-4xl font-bold text-text-primary md:text-5xl">
        Projects
      </h2>
      <div
        ref={trackRef}
        className={
          isMobile || reducedMotion
            ? "flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4"
            : "flex gap-6 px-6"
        }
      >
        {content.projects.map((project) => (
          <div key={project.id} className={isMobile ? "snap-start" : ""}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/useIsMobile.ts lib/useIsMobile.test.ts components/sections/Projects.tsx
git commit -m "feat: add Projects section with desktop scrolljack and mobile swipe fallback

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 10: Contact form validation + API route

**Files:**
- Create: `lib/validateContactForm.ts`
- Create: `lib/email.ts`
- Create: `app/api/contact/route.ts`
- Test: `lib/validateContactForm.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ContactFormInput { name: string; email: string; message: string; honeypot: string; }
  export function validateContactForm(input: ContactFormInput): { valid: true } | { valid: false; error: string };
  ```
  `POST /api/contact` accepts `{ name, email, message, honeypot }` JSON, returns
  `{ ok: true }` or `{ ok: false, error: string }`. Task 11's Contact section calls this
  endpoint.

- [ ] **Step 1: Write the failing test**

Create `lib/validateContactForm.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateContactForm } from "./validateContactForm";

const valid = { name: "Ada", email: "ada@example.com", message: "Hello!", honeypot: "" };

describe("validateContactForm", () => {
  it("accepts a valid submission", () => {
    expect(validateContactForm(valid)).toEqual({ valid: true });
  });

  it("rejects when the honeypot field is filled (bot)", () => {
    const result = validateContactForm({ ...valid, honeypot: "spam" });
    expect(result.valid).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = validateContactForm({ ...valid, name: "" });
    expect(result.valid).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = validateContactForm({ ...valid, email: "not-an-email" });
    expect(result.valid).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = validateContactForm({ ...valid, message: "  " });
    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/validateContactForm.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement the pure validator**

Create `lib/validateContactForm.ts`:

```ts
export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  input: ContactFormInput
): { valid: true } | { valid: false; error: string } {
  if (input.honeypot.trim() !== "") {
    return { valid: false, error: "Spam detected." };
  }
  if (input.name.trim().length === 0) {
    return { valid: false, error: "Name is required." };
  }
  if (!EMAIL_RE.test(input.email.trim())) {
    return { valid: false, error: "A valid email is required." };
  }
  if (input.message.trim().length === 0) {
    return { valid: false, error: "Message is required." };
  }
  return { valid: true };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/validateContactForm.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Implement the Resend email wrapper**

Create `lib/email.ts`:

```ts
import { Resend } from "resend";
import type { ContactFormInput } from "./validateContactForm";

export async function sendContactEmail(input: ContactFormInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    throw new Error("Email service is not configured (missing env vars).");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to,
    replyTo: input.email,
    subject: `New message from ${input.name}`,
    text: input.message,
  });
}
```

- [ ] **Step 6: Implement the API route**

Create `app/api/contact/route.ts`:

```ts
import { NextResponse } from "next/server";
import { validateContactForm, type ContactFormInput } from "@/lib/validateContactForm";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: ContactFormInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContactForm(body);
  if (!result.valid) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  try {
    await sendContactEmail(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send message.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
```

- [ ] **Step 7: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 8: Commit**

```bash
git add lib/validateContactForm.ts lib/validateContactForm.test.ts lib/email.ts app/api/contact/route.ts
git commit -m "feat: add contact form validation and Resend-backed API route

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 11: Contact section UI

**Files:**
- Create: `components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `content.social`, `/api/contact` (Task 10), `useReducedMotion`,
  `gsap`/`registerGsap`/`ScrollTrigger`.

- [ ] **Step 1: Implement the Contact section with form + pinned reveal**

Create `components/sections/Contact.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/animations/gsap";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
      honeypot: String(form.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error — please try again or email directly.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="mx-auto max-w-2xl px-6 py-32"
    >
      <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold text-text-primary md:text-5xl">
        Let&apos;s Get In Touch
      </h2>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {/* Honeypot field — hidden from real users, catches simple bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="rounded-md border border-accent/20 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="rounded-md border border-accent/20 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
        />
        <textarea
          name="message"
          placeholder="Your message"
          required
          rows={5}
          className="rounded-md border border-accent/20 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          data-cursor-hover
          className="rounded-md bg-accent px-6 py-3 font-semibold text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "success" && (
          <p className="text-accent">Thanks — your message is on its way.</p>
        )}
        {status === "error" && (
          <p className="text-red-400">
            {errorMessage} You can also reach me directly at{" "}
            <a href={`mailto:${content.social.github ? "" : ""}`} className="underline">
              email
            </a>
            .
          </p>
        )}
      </form>

      <div className="mt-10 flex gap-6 text-accent">
        <a href={content.social.github} target="_blank" rel="noreferrer" data-cursor-hover>
          GitHub
        </a>
        <a href={content.social.linkedin} target="_blank" rel="noreferrer" data-cursor-hover>
          LinkedIn
        </a>
        <a href={content.social.instagram} target="_blank" rel="noreferrer" data-cursor-hover>
          Instagram
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Contact.tsx
git commit -m "feat: add Contact section with functional form and social links

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 12: Nav bar with CV download

**Files:**
- Create: `components/layout/Nav.tsx`

**Interfaces:**
- Consumes: `content.name`, `content.resumeUrl`.

- [ ] **Step 1: Implement the Nav component**

Create `components/layout/Nav.tsx`:

```tsx
import { content } from "@/lib/content";

export default function Nav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm">
      <a href="#hero" data-cursor-hover className="font-[family-name:var(--font-display)] font-bold text-text-primary">
        {content.name}
      </a>
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <a href="#about" data-cursor-hover className="hover:text-accent">About</a>
        <a href="#projects" data-cursor-hover className="hover:text-accent">Projects</a>
        <a href="#contact" data-cursor-hover className="hover:text-accent">Contact</a>
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
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Nav.tsx
git commit -m "feat: add nav bar with section links and resume download

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 13: Page assembly

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `Nav` (Task 12), `CustomCursor` (Task 5), `Hero` (Task 7), `About` (Task 8),
  `Projects` (Task 9), `Contact` (Task 11).

- [ ] **Step 1: Mount CustomCursor in the layout**

Edit `app/layout.tsx` — add the import and mount it inside `<body>`, before `{children}`:

```tsx
import CustomCursor from "@/components/layout/CustomCursor";
```

```tsx
      <body className={`${display.variable} ${body.variable} font-[family-name:var(--font-body)] bg-bg-primary text-text-primary antialiased`}>
        <CustomCursor />
        {children}
      </body>
```

- [ ] **Step 2: Assemble the page**

Replace `app/page.tsx`:

```tsx
import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all tests across every `lib/*.test.ts` file PASS.

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: assemble full page from Nav, Hero, About, Projects, Contact

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 14: Browser verification, mobile/reduced-motion hardening, README

**Files:**
- Modify: any file where verification below finds a real bug
- Create: `README.md`

**Interfaces:** None new — this task verifies Tasks 1–13 actually work together and fixes
whatever the browser check finds.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background/detached)
Expected: server starts on `http://localhost:3000` with no compile errors.

- [ ] **Step 2: Verify desktop behavior in the browser**

Open `http://localhost:3000` in the browser tool at desktop width. Confirm:
- Hero renders name/role text and the 3D icosahedron is visible and rotates toward the
  mouse when moved.
- Scrolling into About reveals the bio and tech-stack pills.
- Scrolling into Projects pins the section and scrolls the gallery horizontally.
- Scrolling to Contact reveals the form; submitting with empty `RESEND_API_KEY` shows the
  inline error state (expected, since no real API key is configured yet) with the
  "try emailing directly" fallback text — confirms the error path works end-to-end, not
  just the happy path.
- Custom cursor (ring) follows the mouse and enlarges over links/buttons.

If any of the above doesn't happen, fix the underlying file (most likely a
`useEffect` dependency, a missing `"use client"`, or a CSS class typo) and re-verify.

- [ ] **Step 3: Verify mobile behavior in the browser**

Resize the browser tool viewport to the `mobile` preset and reload. Confirm:
- No custom cursor ring appears anywhere on the page.
- Projects section is a swipeable horizontal stack (no pinning/scrolljacking) — scrolling
  the page vertically does NOT hijack scroll into horizontal movement.
- Layout doesn't overflow or clip on narrow width.

Fix any regressions found, then reset the viewport to `desktop` preset when done.

- [ ] **Step 4: Verify reduced-motion behavior**

Emulate `prefers-reduced-motion: reduce` (browser tool's `resize_window` supports a
`colorScheme` param but not motion preference directly — instead, temporarily hardcode
`useReducedMotion` to return `true` in a throwaway edit, reload, and confirm Hero/About/
Contact render immediately without animating, then revert the throwaway edit). Confirm no
console errors appear.

- [ ] **Step 5: Check SEO basics**

Use the browser tool's page-text/page-source read to confirm the `<title>` and hero/about
text are present as real crawlable text (not only inside the canvas). Confirm
`<meta name="description">` is populated from `content.bio`.

- [ ] **Step 6: Write the README**

Create `README.md`:

```markdown
# Portfolio

Personal portfolio site — Next.js, React Three Fiber, GSAP ScrollTrigger, Framer Motion
(`motion`), Tailwind CSS, Resend.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `RESEND_API_KEY` — from https://resend.com
- `CONTACT_TO_EMAIL` — where contact-form messages get delivered

## Replacing placeholder content

Edit `lib/content.ts` — name, role, bio, tech stack, projects, social links, resume path
all live there. Drop your real resume PDF in `public/`, then update `resumeUrl`.

## Replacing the placeholder 3D model

`components/three/HeroScene.tsx` currently renders a placeholder icosahedron. Export your
Spline scene as React Three Fiber code and swap it into `HeroModel`, keeping the existing
mouse-tracking and reduced-motion wiring.

## Testing

\`\`\`bash
npm test
\`\`\`

## Deployment

Not yet connected to GitHub/Vercel (local-only by design for now). To deploy: push to a
GitHub repo, import it in Vercel, and set the environment variables above in the Vercel
project settings.
```

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "docs: add README; final verification pass for portfolio v1

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```
