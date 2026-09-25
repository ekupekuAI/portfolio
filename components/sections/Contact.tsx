"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "sending" | "success" | "error";

const FIELD_CLASS =
  "w-full rounded-md border border-text-secondary/25 bg-bg-secondary px-4 py-3 text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-accent";
const LABEL_CLASS = "text-sm text-text-secondary";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headingRef.current, formRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Capture the form element itself synchronously, before any `await` — reading
    // e.currentTarget again after an async gap is a known React footgun (it can be
    // null/stale by the time execution resumes), and that's exactly what was
    // happening here: the email was sending successfully every time, but
    // formEl.reset() (via the stale e.currentTarget) threw, landing in the catch
    // block and showing a false "network error" even on full success.
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
      // Surface the real cause in dev — a silently-swallowed catch is exactly what
      // hid this bug in the first place.
      if (process.env.NODE_ENV !== "production") {
        console.error("Contact form submit failed:", err);
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="mx-auto grid max-w-6xl gap-12 px-6 py-[var(--spacing-section)] md:grid-cols-[1fr_1.1fr] md:gap-20"
    >
      <div ref={headingRef}>
        <p className="text-xs uppercase tracking-[var(--tracking-label)] text-accent2">Contact</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] text-text-primary md:text-6xl">
          Have a role, a hackathon team, or a hard problem?
        </h2>
        <p className="mt-6 max-w-md text-lg text-text-secondary">
          Open to Software, Full-Stack, Backend, and AI Engineering internships. Messages land
          in my inbox directly; I reply to every real one.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {(
            [
              ["GitHub", content.social.github],
              ["LinkedIn", content.social.linkedin],
              ["Twitter", content.social.twitter],
              ["Instagram", content.social.instagram],
            ] as const
          ).map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                data-cursor-hover
                className="inline-flex min-h-11 items-center text-accent underline-offset-4 transition-colors hover:underline"
              >
                {label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Honeypot field — hidden from real users, catches simple bots */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-name" className={LABEL_CLASS}>
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              required
              className={FIELD_CLASS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              className={FIELD_CLASS}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-message" className={LABEL_CLASS}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="What are you building, and where could I help?"
            required
            rows={6}
            className={FIELD_CLASS}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              type="submit"
              disabled={status === "sending"}
              data-cursor-hover
              className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </Magnetic>
          <div aria-live="polite" className="text-sm">
            {status === "success" && (
              <p className="text-accent">Thanks — your message is on its way.</p>
            )}
            {status === "error" && (
              <p className="text-danger">
                {errorMessage} You can also reach me via{" "}
                <a
                  href={content.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  LinkedIn
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
