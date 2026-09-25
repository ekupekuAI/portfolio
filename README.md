# Portfolio

Personal portfolio site — Next.js, Canvas 2D particle-network hero, GSAP ScrollTrigger,
Framer Motion (`motion`), Tailwind CSS, Resend.

## Development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `RESEND_API_KEY` — from https://resend.com
- `CONTACT_TO_EMAIL` — where contact-form messages get delivered

Without these set, the contact form correctly shows an inline error with a LinkedIn
fallback link (verified) rather than failing silently.

## Replacing placeholder content

Edit `lib/content.ts` — name, role, bio, tech stack, projects, social links, resume path
all live there. Drop your real resume PDF in `public/`, then update `resumeUrl`.

## Hero visual: Canvas 2D particle network

`components/hero/ParticleField.tsx` draws a mouse-reactive particle network using the
plain 2D Canvas API. This replaces an earlier React Three Fiber / three.js hero scene
that had a real, never-fully-explained rendering bug: content that read as correct via
direct WebGL framebuffer readback in an actual browser still never became visible on
screen, across several fix attempts. Canvas 2D has a much smaller surface for that class
of bug — no WebGL context creation, driver quirks, z-fighting, or tone-mapping — so what
you draw is what appears.

Tune it by editing the constants at the top of `ParticleField.tsx`:
`PARTICLE_COUNT`, `CONNECT_DISTANCE`, `MOUSE_CONNECT_DISTANCE`, `ACCENT_RGB`.

If you'd rather go back to a 3D/WebGL hero (e.g. a real exported Spline scene), reinstall
`three` + `@react-three/fiber`, and thoroughly verify it actually renders in every target
browser before shipping it — that verification is exactly where the previous attempt fell
short.

## Testing

```bash
npm test
```

## Deployment

Not yet connected to GitHub/Vercel (local-only by design for now). To deploy: push to a
GitHub repo, import it in Vercel, and set the environment variables above in the Vercel
project settings.
