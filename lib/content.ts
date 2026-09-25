export interface Project {
  id: string;
  title: string;
  category: string;
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

export interface Stats {
  githubRepoCount: number;
  hackathonsCompeted: number;
}

export interface SiteContent {
  name: string;
  role: string;
  bioLead: string;
  bio: string;
  techStack: string[];
  projects: Project[];
  social: SocialLinks;
  resumeUrl: string;
  stats: Stats;
}

// NOTE: real bio (condensed from Ekansh's own written background), real tech stack
// (self-reported + cross-checked against actual repo READMEs), real social links, and
// real projects are set below. "AI Dropout Prediction" has no findable public repo among
// the 17 on his GitHub — description is his own, but there's no repoUrl to link. Project
// images are still the placeholder SVG until real screenshots are provided.
export const content: SiteContent = {
  name: "Ekansh",
  role: "Full-Stack Developer & AI Engineer",
  bioLead:
    "I'm a Computer Science Engineering student who builds software end-to-end — from idea and architecture to a working, deployed product.",
  bio: "Strongest across the full loop: understanding a problem, designing the system, integrating frontend, backend, database, and AI models, debugging, shipping, and presenting it. Most effective in ambiguous problem spaces where the solution isn't handed to him. 3rd Prize, NexVerse Hackathon 2026 (Aurora University); competed in a 200+ team, 24-hour Blockchain + Cybersecurity hackathon. Currently sharpening DSA, system design, and production backend engineering — open to Software, Full-Stack, Backend, and AI Engineering internships.",
  techStack: [
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Node.js",
    "LangChain",
    "Java",
  ],
  projects: [
    {
      id: "trustvision",
      title: "TrustVision",
      category: "SIH Hackathon",
      description:
        "An offline, air-gapped integrity-assurance system for defense computer-vision pipelines — verifies datasets, models, and inference outputs (duplicate/backdoor/out-of-distribution detection) and issues a signed, evidence-backed trust verdict with a tamper-proof audit log. Built for Smart India Hackathon (SIH).",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/AISecurity26228",
    },
    {
      id: "nyayapath",
      title: "NyayaPath",
      category: "Legal AI",
      description:
        "An independent, citizen-first case-understanding tool that turns synthetic court case updates into a timeline, a plain-language explanation, and the next known step. Uses synthetic demo data; not an official government service and doesn't provide legal advice.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/NyayaPath",
      liveUrl: "https://nyaya-path-coral.vercel.app",
    },
    {
      id: "hireflow",
      title: "HireFlow",
      category: "AI Agent Hackathon",
      description:
        "A glass-box, bias-aware AI recruiting agent: upload a job description and resumes to get an evidence-cited ranked shortlist, auto-generated interview kits, natural-language Q&A over the candidate pool, and a Blind Mode that surfaces hiring bias. Built for the AI Agent Hackathon 2026.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/Hireflow",
    },
    {
      id: "sentinel-id",
      title: "SentinelID",
      category: "Supply Chain Security",
      description:
        "A trust & verification system for AI/software supply chains — integrity checking, tamper-evidence, and traceability for the components a project depends on.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/Sentinel-ID",
    },
    {
      id: "student-command-center",
      title: "Student Command Center",
      category: "Full-Stack",
      description:
        "A full-stack personal study command center (React + FastAPI + PostgreSQL) with subjects, tasks, notes, study-session tracking, and a per-user AI study assistant — JWT auth, per-user data isolation, and production-hardened rate limiting.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/student-command-center",
    },
    {
      id: "health-record-system",
      title: "Health Record System",
      category: "Healthcare",
      description:
        "A full-stack health record management prototype (React + Flask + MongoDB) with role-based access for patients, doctors, and admins — appointment booking, medical records timeline, and prescription management.",
      image: "/projects/placeholder.svg",
      repoUrl: "https://github.com/ekupekuAI/Health-Record-System",
    },
    {
      id: "ai-dropout-prediction",
      title: "AI Dropout Prediction",
      category: "Applied ML",
      description:
        "Predicts at-risk students and recommends interventions, rather than just flagging risk.",
      image: "/projects/placeholder.svg",
      // No public repo found for this one — add repoUrl/liveUrl here once you have a link.
    },
  ],
  social: {
    github: "https://github.com/ekupekuAI",
    linkedin: "https://www.linkedin.com/in/gingamekansh/",
    instagram: "https://instagram.com/whyalways.ekansh",
    twitter: "https://twitter.com/Ekanshxd",
  },
  resumeUrl: "/resume-placeholder.txt",
  // Real, verifiable numbers only — repoCount from his actual GitHub profile,
  // hackathonsCompeted from his own bio (NexVerse 2026 + the 200+ team blockchain/
  // cybersecurity hackathon). projects/techStack counts are derived below, not
  // hardcoded, so they can't drift out of sync with the arrays above.
  stats: {
    githubRepoCount: 17,
    hackathonsCompeted: 2,
  },
};
