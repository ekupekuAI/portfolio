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

// NOTE: placeholder content. Replace with real data (LinkedIn bio, GitHub/Instagram
// links, real projects, real resume) — this file is the single place that needs editing.
export const content: SiteContent = {
  name: "Your Name",
  role: "AI/ML Developer",
  bio: "B.Tech CSE student building AI/ML systems, competitive-coding projects, and hackathon builds. Replace this bio with your real background.",
  techStack: ["Python", "TypeScript", "React", "PyTorch", "Next.js", "Node.js"],
  projects: [
    {
      id: "placeholder-project-1",
      title: "Placeholder Project",
      description: "Replace with a real project description once you send it over.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/",
    },
  ],
  social: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/",
  },
  resumeUrl: "/resume-placeholder.txt",
};
