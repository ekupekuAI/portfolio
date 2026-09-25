# System-narrative redesign (2026-09-26)

Brief: turn the portfolio into an experience that reads as a system Ekansh built.
Flow: ENTER → IDENTITY → THINKING → WORK → LAB → STACK → JOURNEY → CONTACT.
Content rule: nothing fabricated. Every fact comes from `lib/content.ts` (his own words) or
live GitHub data (repo activity, languages). Placeholders are flagged, never dressed up.

## Kept from the current build (strong)
Next 16 + Tailwind v4 tokens, GSAP ScrollTrigger with `gsap.context` cleanup, reduced-motion
handling everywhere, Canvas-2D approach (no three.js: 600 KB and a past WebGL saga for a
visual that Canvas can carry), contact pipeline, GitHub contributions route, focus/labels/
hit-area/mobile-menu work from the design review, custom SVG covers as stand-ins.

## Scenes
| Scene | Section id | What it does |
|---|---|---|
| ENTER | `Boot` overlay | 4 lines check in (AI SYSTEM, WEB ENGINE, BACKEND, CREATIVE LAYER) over ~1.2 s, Skip button, Esc, once per session, skipped under reduced motion. Hero is rendered underneath; overlay dissolves and dispatches `boot-complete`. |
| IDENTITY | `#hero` | EKANSH · AI × SOFTWARE × SYSTEMS · "I build intelligent software, from the model to the interface." · VIEW MY WORK / GITHUB. `SystemCore`: Canvas-2D projected 3D ring of five nodes (AI, API, DATA, SECURITY, SYSTEM) with orbiting satellites; tilts toward the mouse, spins slowly, paused off-screen. Name scales down and fades on scroll-out (scrub). |
| THINKING | `#thinking` | "I don't just build interfaces. I build systems." Three capability columns (AI / SOFTWARE / SYSTEMS) with project-evidenced items; concise bio. Columns assemble on scroll (staggered, scrubbed). |
| CURRENTLY BUILDING | `#building` | Projects ordered by GitHub `pushed_at`; status derived, not typed: LIVE (has demo), BUILDING (pushed ≤ 30 d), ACTIVE (≤ 120 d), STABLE. Without GitHub data: no badges. |
| WORK | `#work` | Four case studies (TrustVision, NyayaPath, HireFlow, SentinelID): PROJECT 0N, large masked cover with parallax, problem / solution / pipeline / key technologies (GitHub languages, top 3 by bytes) / outcome (only where known) / links. Pipeline steps light up progressively with scroll (scrubbed progress line). |
| LAB | `#lab` | Student Command Center, Health Record System, AI Dropout Prediction + remaining public GitHub repos (non-fork, not already shown). Tiles tilt toward the cursor and reveal language / last push. Live contribution graph heads the section. |
| STACK | `#stack` | Tree of real technologies grouped AI / FRONTEND / BACKEND / DATA / SECURITY. Hover highlights related nodes and draws SVG connectors between them; others dim. SECURITY lists project-evidenced practices, not unconfirmed tools (SIEM flagged for the user). |
| JOURNEY | `#journey` | Vertical timeline, line drawn by scroll: Education → Projects → Hackathons → AI/Software/Security → Current → Next. Real entries only; institution withheld by the user's choice. |
| CONTACT | `#contact` | "What are we building?" + labelled form; outro block EKANSH / AI × SOFTWARE × SYSTEMS; minimal footer. |

## Motion budget
Scroll-linked: hero name scale/fade, cover clip-path reveals, cover parallax, pipeline progress,
capability assembly, journey line, section background shift (`--scene-bg` on body).
Entrances: boot, hero stagger, per-section reveal. Hover: cursor labels (VIEW / OPEN / EXPLORE /
GITHUB), magnetic CTAs, lab tilt, stack relations. Nothing else animates. Every scrubbed effect
uses transform/opacity/clip-path only. `prefers-reduced-motion`: all scrubs and the boot are off.

## Performance
No new dependencies. SystemCore and the lab tiles pause off-screen. Images lazy, sized.
GitHub calls are one route (`/api/github-repos`, revalidate 1 h) fetched once client-side.
