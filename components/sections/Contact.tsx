"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

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
    <section ref={sectionRef} id="contact" className="mx-auto max-w-2xl px-6 py-32">
      <p className="text-sm uppercase tracking-[0.3em] text-accent2">03 — Contact</p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-text-primary md:text-5xl">
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
            {errorMessage} You can also reach me directly via{" "}
            <a href={content.social.linkedin} target="_blank" rel="noreferrer" className="underline">
              LinkedIn
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
        <a href={content.social.twitter} target="_blank" rel="noreferrer" data-cursor-hover>
          Twitter
        </a>
      </div>
    </section>
  );
}
