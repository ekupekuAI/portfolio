# Portfolio

Personal portfolio site — Next.js, React Three Fiber, GSAP ScrollTrigger, Framer Motion
(`motion`), Tailwind CSS, Resend.

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

## Replacing the placeholder 3D model

`components/three/HeroScene.tsx` currently renders a placeholder wireframe icosahedron
using `meshBasicMaterial` — confirmed via direct WebGL framebuffer readback to render
correctly. If you export your Spline scene as React Three Fiber code and it uses a lit
material (`meshStandardMaterial`, `meshPhongMaterial`, etc.), verify it actually renders
in your target browsers before relying on it — lit materials could not be confirmed
rendering in this project's dev/test environment (no errors were thrown; it's an
unresolved environment-specific gap, not a known code issue). Keep the existing
mouse-tracking and reduced-motion wiring in `HeroModel` regardless of which material you
use.

## Testing

```bash
npm test
```

## Deployment

Not yet connected to GitHub/Vercel (local-only by design for now). To deploy: push to a
GitHub repo, import it in Vercel, and set the environment variables above in the Vercel
project settings.
