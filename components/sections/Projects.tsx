"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { useIsMobile } from "@/lib/useIsMobile";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, registerGsap } from "@/lib/animations/gsap";

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
    <section ref={sectionRef} id="projects" className="relative overflow-hidden py-32">
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
