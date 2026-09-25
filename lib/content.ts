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

// NOTE: real social links are set below. Bio, tech stack, and projects are still
// placeholders — LinkedIn requires login to view profile content for automated access,
// so the bio wasn't pulled from it. Replace bio/techStack/projects/resumeUrl and the
// github link below when ready — this file is the single place that needs editing.
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
    github: "https://github.com/", // TODO: replace with your real GitHub profile URL
    linkedin: "https://www.linkedin.com/in/gingamekansh/",
    instagram: "https://instagram.com/whyalways.ekansh",
    twitter: "https://twitter.com/Ekanshxd",
  },
  resumeUrl: "/resume-placeholder.txt",
};
