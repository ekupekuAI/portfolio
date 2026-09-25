export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Featured projects get the large editorial row; the rest render as a compact list. */
  featured?: boolean;
  /** One short, verifiable result line shown next to the title (prize, live demo, scale). */
  outcome?: string;
  /** Only listed where the description already states the stack; never guessed. */
  stack?: string[];
}

export interface Highlight {
  /** The number or short token shown large ("3rd", "200+", "17"). */
  value: string;
  /** What the value proves, written as a sentence fragment a recruiter can verify. */
  label: string;
  href?: string;
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
  /** One specific sentence for the hero: what gets built, not a job title. */
  claim: string;
  /** Plain-text availability line for the hero, no chip. */
  availability: string;
  bioLead: string;
  bio: string;
  highlights: Highlight[];
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
// images are custom per-project SVG graphics (public/projects/*.svg) designed to look
// intentional rather than like missing screenshots — swap any of them for a real
// screenshot whenever one is available; the card layout handles either.
export const content: SiteContent = {
  name: "Ekansh",
  role: "Full-Stack Developer & AI Engineer",
  claim:
    "I design and ship complete systems: defense-grade ML integrity tooling, citizen-first legal AI, and the backends that hold them together.",
  availability: "Open to 2026 internships",
  highlights: [
    { value: "3rd", label: "prize at NexVerse Hackathon 2026, Aurora University" },
    { value: "200+", label: "teams in a 24-hour Blockchain + Cybersecurity hackathon" },
    { value: "17", label: "public repositories on GitHub", href: "https://github.com/ekupekuAI" },
  ],
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
    "SQL",
    "Supabase",
    "Ollama",
    "RAG",
  ],
  projects: [
    {
      id: "trustvision",
      title: "TrustVision",
      category: "SIH Hackathon",
      description:
        "An offline, air-gapped integrity-assurance system for defense computer-vision pipelines — verifies datasets, models, and inference outputs (duplicate/backdoor/out-of-distribution detection) and issues a signed, evidence-backed trust verdict with a tamper-proof audit log. Built for Smart India Hackathon (SIH).",
      image: "/projects/trustvision.svg",
      repoUrl: "https://github.com/ekupekuAI/AISecurity26228",
      featured: true,
      outcome: "Smart India Hackathon build",
    },
    {
      id: "nyayapath",
      title: "NyayaPath",
      category: "Legal AI",
      description:
        "An independent, citizen-first case-understanding tool that turns synthetic court case updates into a timeline, a plain-language explanation, and the next known step. Uses synthetic demo data; not an official government service and doesn't provide legal advice.",
      image: "/projects/nyayapath.svg",
      repoUrl: "https://github.com/ekupekuAI/NyayaPath",
      liveUrl: "https://nyaya-path-coral.vercel.app",
      featured: true,
      outcome: "Live demo",
    },
    {
      id: "hireflow",
      title: "HireFlow",
      category: "AI Agent Hackathon",
      description:
        "A glass-box, bias-aware AI recruiting agent: upload a job description and resumes to get an evidence-cited ranked shortlist, auto-generated interview kits, natural-language Q&A over the candidate pool, and a Blind Mode that surfaces hiring bias. Built for the AI Agent Hackathon 2026.",
      image: "/projects/hireflow.svg",
      repoUrl: "https://github.com/ekupekuAI/Hireflow",
      outcome: "AI Agent Hackathon 2026",
    },
    {
      id: "sentinel-id",
      title: "SentinelID",
      category: "Supply Chain Security",
      description:
        "A trust & verification system for AI/software supply chains — integrity checking, tamper-evidence, and traceability for the components a project depends on.",
      image: "/projects/sentinel-id.svg",
      repoUrl: "https://github.com/ekupekuAI/Sentinel-ID",
    },
    {
      id: "student-command-center",
      title: "Student Command Center",
      category: "Full-Stack",
      description:
        "A full-stack personal study command center (React + FastAPI + PostgreSQL) with subjects, tasks, notes, study-session tracking, and a per-user AI study assistant — JWT auth, per-user data isolation, and production-hardened rate limiting.",
      image: "/projects/student-command-center.svg",
      repoUrl: "https://github.com/ekupekuAI/student-command-center",
      stack: ["React", "FastAPI", "PostgreSQL"],
    },
    {
      id: "health-record-system",
      title: "Health Record System",
      category: "Healthcare",
      description:
        "A full-stack health record management prototype (React + Flask + MongoDB) with role-based access for patients, doctors, and admins — appointment booking, medical records timeline, and prescription management.",
      image: "/projects/health-record-system.svg",
      repoUrl: "https://github.com/ekupekuAI/Health-Record-System",
      stack: ["React", "Flask", "MongoDB"],
    },
    {
      id: "ai-dropout-prediction",
      title: "AI Dropout Prediction",
      category: "Applied ML",
      description:
        "Predicts at-risk students and recommends interventions, rather than just flagging risk.",
      image: "/projects/ai-dropout-prediction.svg",
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
