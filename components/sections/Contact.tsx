"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useReveal } from "@/lib/animations/useReveal";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "sending" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-md border border-text-secondary/25 bg-bg-secondary px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-accent";
const LABEL_CLASS = "text-sm text-text-secondary";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reducedMotion = useReducedMotion();
  useReveal(sectionRef);

  // The final scene: the identity line grows in as the page reaches its end.
  useEffect(() => {
    registerGsap();
    const outro = outroRef.current;
    if (!outro) return;
    if (reducedMotion) {
      gsap.set(outro, { opacity: 1, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        outro,
        { opacity: 0.15, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: outro, start: "top 95%", end: "bottom 85%", scrub: 0.5 },
        }
      );
    }, outro);
    return () => ctx.revert();
  }, [reducedMotion]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form element synchronously, before any `await` — e.currentTarget
    // is stale after an async gap, and a stale reset() once produced a false
    // "network error" on a successful send.
    const formEl = e.currentTarget;
    setStatus("sending");
    setErrorMessage("");
    const form = new FormData(formEl);
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
        formEl.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error — please try again or email directly.");
      if (process.env.NODE_ENV !== "production") {
        console.error("Contact form submit failed:", err);
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-scene-bg="#08080c"
      className="mx-auto max-w-7xl px-6 pt-[var(--spacing-section)] md:px-12"
    >
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <p
            data-reveal
            className="flex items-center gap-3 text-xs uppercase tracking-[var(--tracking-label)] text-text-secondary opacity-0"
          >
            <span className="font-[family-name:var(--font-display)] tabular-nums text-accent">06</span>
            <span aria-hidden className="h-px w-8 bg-text-secondary/30" />
            <span>Contact</span>
          </p>
          <h2
            data-reveal
            className="mt-5 font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.0] tracking-[-0.02em] text-text-primary opacity-0 md:text-7xl"
          >
            What are we building?
          </h2>
          <p data-reveal className="mt-6 max-w-md text-lg text-text-secondary opacity-0 md:text-xl">
            Have a project, idea, or interesting problem? {content.availability}. Messages land in
            my inbox directly.
          </p>
          <ul data-reveal className="mt-8 flex flex-wrap gap-x-6 gap-y-2 opacity-0">
            {(
              [
                ["GitHub", content.social.github, "github"],
                ["LinkedIn", content.social.linkedin, "open"],
                ["Twitter", content.social.twitter, "open"],
                ["Instagram", content.social.instagram, "open"],
              ] as const
            ).map(([label, href, cursor]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor={cursor}
                  className="inline-flex min-h-11 items-center text-accent underline-offset-4 transition-colors hover:underline"
                >
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form data-reveal onSubmit={handleSubmit} className="flex flex-col gap-5 opacity-0">
          {/* Honeypot field — hidden from real users, catches simple bots */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-name" className={LABEL_CLASS}>
                Name
              </label>
              <input id="contact-name" type="text" name="name" autoComplete="name" placeholder="Ada Lovelace" required className={FIELD_CLASS} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className={LABEL_CLASS}>
                Email
              </label>
              <input id="contact-email" type="email" name="email" autoComplete="email" placeholder="you@company.com" required className={FIELD_CLASS} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className={LABEL_CLASS}>
              Message
            </label>
            <textarea id="contact-message" name="message" placeholder="What are you building, and where could I help?" required rows={6} className={FIELD_CLASS} />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-hover
                className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.12em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </Magnetic>
            <div aria-live="polite" className="text-sm">
              {status === "success" && <p className="text-accent">Thanks — your message is on its way.</p>}
              {status === "error" && (
                <p className="text-danger">
                  {errorMessage} You can also reach me via{" "}
                  <a href={content.social.linkedin} target="_blank" rel="noreferrer" className="underline">
                    LinkedIn
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Outro: the identity line, as the last thing on the page. */}
      <div ref={outroRef} className="mt-28 pb-16 text-center md:mt-40 md:pb-24" style={{ opacity: 0.15 }}>
        <p
          aria-hidden
          className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,16vw,13rem)] font-bold uppercase leading-none tracking-[-0.04em] text-text-primary"
        >
          {content.name}
        </p>
        <p className="mt-4 font-[family-name:var(--font-display)] text-xs tracking-[0.35em] text-accent md:text-sm">
          {content.tagline}
        </p>
      </div>
    </section>
  );
}
