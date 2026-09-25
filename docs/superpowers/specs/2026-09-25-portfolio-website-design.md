# Portfolio Website — Design Spec

**Date:** 2026-09-25
**Owner:** soc.cyber01
**Status:** Approved design, pending implementation plan

## Purpose

A personal portfolio website for a B.Tech CSE / AI-ML developer, showcasing projects
(competitive coding + hackathon builds), GitHub, LinkedIn, and Instagram, aimed at
recruiters and collaborators. Visual goal: an "extreme," cinematic, awwwards-style
interactive site — not a generic template.

## Success criteria

- Loads fast and is discoverable (real SEO), despite heavy 3D/animation.
- Genuinely striking first impression (hero + scroll choreography), distinct from
  common portfolio templates.
- Fully usable on mobile — no broken scrolljacking or custom-cursor artifacts on touch.
- Visitors can reach the developer via a working contact form, and find GitHub/LinkedIn/
  Instagram links and project links easily.
- Content (bio, tech stack, projects, links, CV) is a data-only edit, not a rebuild.

## Tech stack (decided)

| Piece | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | Real SEO, fast initial load, image optimization, native Vercel deploy. Chosen over plain Vite/React SPA specifically for discoverability by recruiters. |
| 3D | **React Three Fiber (Three.js)** | Declarative, React-native way to drive the 3D hero scene. |
| 3D asset source | **Spline**, exported as **React Three Fiber code** (not the live iframe/runtime embed) | Fast to design visually, but exported-to-code means the model is real, controllable code — required for mouse-tracking rotation and scroll-linked behavior. |
| Scroll animation | **GSAP + ScrollTrigger** | Industry-standard for scroll-scrubbed timelines, pinning, and horizontal scrolljacking — Framer Motion cannot do scroll-scrubbed horizontal jacking cleanly. |
| Micro-interactions | **Framer Motion** (light use) | Button hovers, load transitions, custom cursor state — small, declarative UI motion. GSAP stays reserved for the big scroll choreography. |
| Styling | **Tailwind CSS** | Fast, standard, no notable downside for this project. |
| Contact backend | **Resend**, via a Next.js Route Handler | No separate backend server; a serverless API route sends the email. |
| Hosting | **Vercel** | Pairs natively with Next.js. |
| Repo | Local git only for now | Push to GitHub / connect Vercel once the site is further along — avoids a public half-built repo. |

## Architecture

```
app/
  layout.tsx              — fonts, global providers, custom cursor mount
  page.tsx                — assembles Hero → About → Projects → Contact
  api/contact/route.ts    — validates submission, calls Resend, returns status
components/
  layout/
    CustomCursor.tsx       — ring/dot cursor; no-ops entirely on touch devices
    Nav.tsx
  sections/
    Hero.tsx
    About.tsx
    Projects.tsx
    Contact.tsx
  three/
    HeroScene.tsx           — R3F <Canvas>, Spline-exported model, mouse-follow logic
  ui/                        — shared buttons, reveal-text wrapper, form inputs
lib/
  content.ts                 — typed placeholder data: bio, tech stack, projects[], social links, CV path
  animations/                 — GSAP ScrollTrigger registration + setup/cleanup helpers
  email.ts                    — Resend client wrapper
public/
  cv.pdf                      — placeholder until the real file is provided
```

**Content data model** (`lib/content.ts`): a single typed object/array structure holding
everything personal to the site owner (name, role, bio, tech stack list, `projects: []`
with title/description/image/links, `social: { github, linkedin, instagram }`, CV file
path). This is intentionally the *only* place project-specific content lives, so that
supplying real LinkedIn/GitHub/project data later is a data edit to one file, not a
structural change.

## Section-by-section behavior

### Hero
- Massive, bold typography for name + "AI/ML Developer" role.
- `HeroScene` renders the Spline-exported 3D model inside an R3F `<Canvas>`.
- Model subtly rotates toward the cursor position (`useFrame` + normalized pointer
  coordinates) — disabled/frozen on touch devices, where there's no cursor to track.
- GSAP-driven staggered entrance animation for text + model on load.

### About
- GSAP ScrollTrigger pins the section while bio text and tech-stack list unmask
  progressively as the user scrolls through it.

### Projects
- **Desktop:** GSAP ScrollTrigger horizontal scrolljacking — vertical scroll input drives
  horizontal movement through a pinned project gallery track.
- **Mobile (required, not optional polish):** below a defined breakpoint, scrolljacking is
  disabled entirely; the same gallery renders as a normal horizontally swipeable stack
  (native `overflow-x` + scroll-snap), because scroll-scrubbed horizontal jacking is
  broken/unusable on touch input.
- Each project card pulls from `content.ts` (`projects[]`); placeholder entries until real
  data is supplied.

### Contact
- Pinned "reveal from behind" effect as the user reaches the bottom of the page.
- Functional form (name, email, message) posts to `app/api/contact/route.ts`, which sends
  the message via Resend to the owner's email. Client shows success/error state. A
  honeypot field deters basic spam bots.
- Renders GitHub / LinkedIn / Instagram icon links from `content.ts`.

## Cross-cutting concerns

- **Reduced motion:** `prefers-reduced-motion` is checked at the top level; when set, GSAP
  entrance/parallax intensity is reduced to simple opacity fades, and scroll-scrub effects
  are minimized. This is a baseline accessibility requirement, not optional.
- **Custom cursor:** feature-detected off entirely on touch/coarse-pointer devices (it has
  no meaning there); default system cursor is used instead.
- **Performance:** the R3F `<Canvas>` is loaded client-side only via `next/dynamic`
  (`ssr: false`) so it never blocks first paint or the page's indexable text content.
  Spline output is the exported GLTF/code form, not the heavier live embed.
- **SEO:** page metadata (title, description, Open Graph tags) set via Next.js metadata
  API; hero/about text content is real DOM text (not canvas-only), so it's crawlable.

## Data flow — contact form

```
Client form (React state)
  → POST /api/contact  { name, email, message, honeypot }
  → route.ts validates (non-empty, honeypot empty, basic email shape)
  → Resend API sends email to owner's inbox
  → route returns { ok: true } or { ok: false, error }
  → client shows success or inline error state
```

No message content is persisted server-side — it's a pass-through to email, keeping the
architecture simple and avoiding unnecessary data storage/security surface for a portfolio
site.

## Error handling

- Contact form: network/Resend failures surface as an inline "couldn't send, try emailing
  directly" message with a mailto fallback — never a silent failure.
- 3D scene: if the model fails to load (slow network, blocked asset), the hero still shows
  the text content and a static fallback background rather than a blank canvas.
- Missing content data (e.g. empty `projects[]` before real data is supplied): sections
  render with clearly-labeled placeholder cards rather than breaking/collapsing.

## Testing / QA approach

This is a presentation-heavy site, not logic-heavy, so per project defaults there is no
unit-test suite for animation timelines. Instead, verification is done by actually running
the site in the browser at each milestone and checking:

- Each section renders and animates correctly at desktop width.
- Mobile viewport: scrolljacking correctly falls back to swipeable stack, custom cursor is
  absent, layout doesn't break.
- `prefers-reduced-motion` correctly reduces motion.
- Contact form round-trip (success and induced-failure paths).
- Basic Lighthouse-style check: initial paint isn't blocked by the 3D canvas.

## Out of scope for this spec

- Populating real content (LinkedIn-derived bio, GitHub/Instagram links, real project
  list, real CV file) — supplied later as a data-only edit to `lib/content.ts`.
- Custom domain configuration — decided at deploy time.
- Creating the GitHub remote repo / connecting Vercel — deferred until the site is further
  along (local git only for now, per explicit decision).
- Light mode / theme toggle — theme is dark-cinematic only, by explicit requirement.

## Open decisions deferred to implementation

None blocking — all decisions needed to start building are resolved above. Package
manager defaults to `npm` (standard, ships with Node) unless directed otherwise.
