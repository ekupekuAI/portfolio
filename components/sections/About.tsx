"use client";

import { useEffect, useRef } from "react";
import { content } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

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
    <section ref={sectionRef} id="about" className="mx-auto max-w-3xl px-6 py-32">
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
