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
  twitter: string;
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

// NOTE: real social links and real projects (pulled from your public GitHub repos) are
// set below. bio/techStack/resumeUrl are still placeholders — LinkedIn requires login to
// view profile content for automated access, so the bio wasn't pulled from it. Project
// images are still the placeholder SVG until you provide real screenshots. This file is
// the single place that needs editing.
export const content: SiteContent = {
  name: "Ekansh",
  role: "AI/ML Developer",
  bio: "B.Tech CSE student building AI/ML systems, competitive-coding projects, and hackathon builds. Replace this bio with your real background.",
  techStack: ["Python", "TypeScript", "React", "PyTorch", "Next.js", "Node.js"],
  projects: [
    {
      id: "trustvision",
      title: "TrustVision",
      description:
        "An offline, air-gapped integrity-assurance system for defense computer-vision pipelines — verifies datasets, models, and inference outputs (duplicate/backdoor/out-of-distribution detection) and issues a signed, evidence-backed trust verdict with a tamper-proof audit log. Built for Smart India Hackathon (SIH).",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/AISecurity26228",
    },
    {
      id: "hireflow",
      title: "HireFlow",
      description:
        "A glass-box, bias-aware AI recruiting agent: upload a job description and resumes to get an evidence-cited ranked shortlist, auto-generated interview kits, natural-language Q&A over the candidate pool, and a Blind Mode that surfaces hiring bias. Built for the AI Agent Hackathon 2026.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/Hireflow",
    },
    {
      id: "health-record-system",
      title: "Health Record System",
      description:
        "A full-stack health record management prototype (React + Flask + MongoDB) with role-based access for patients, doctors, and admins — appointment booking, medical records timeline, and prescription management.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/Health-Record-System",
    },
  ],
  social: {
    github: "https://github.com/ekupekuAI",
    linkedin: "https://www.linkedin.com/in/gingamekansh/",
    instagram: "https://instagram.com/whyalways.ekansh",
    twitter: "https://twitter.com/Ekanshxd",
  },
  resumeUrl: "/resume-placeholder.txt",
};
