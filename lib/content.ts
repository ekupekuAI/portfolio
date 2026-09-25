export interface PipelineStep {
  label: string;
  detail: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Case-study projects get the full WORK treatment; the rest live in the Lab. */
  featured?: boolean;
  /** One short, verifiable result line (prize, live demo, where it was built). */
  outcome?: string;
  /** Only listed where the description already states the stack; never guessed. */
  stack?: string[];
  /** The problem, in one or two sentences, restated from the project's own description. */
  problem?: string;
  /** What the project does about it. */
  solution?: string;
  /** The system's stages, restated from the description. Revealed progressively on scroll. */
  pipeline?: PipelineStep[];
}

export interface Highlight {
  value: string;
  label: string;
  href?: string;
}

export interface CapabilityGroup {
  name: "AI" | "Software" | "Systems";
  items: { label: string; evidence: string }[];
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface JourneyStep {
  label: string;
  title: string;
  detail: string;
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
  /** The three-word identity line used in the hero and outro. */
  tagline: string;
  /** One specific sentence for the hero. */
  claim: string;
  availability: string;
  /** THINKING headline, two lines. */
  thinkingHeadline: [string, string];
  bioLead: string;
  bio: string;
  capabilities: CapabilityGroup[];
  highlights: Highlight[];
  techStack: string[];
  stackTree: StackGroup[];
  /** Pairs of technologies that are used together in his projects; drives hover highlighting. */
  stackRelations: [string, string][];
  /** Boot-sequence lines. */
  bootLines: string[];
  projects: Project[];
  journey: JourneyStep[];
  social: SocialLinks;
  resumeUrl: string;
  stats: Stats;
}

// NOTE: every fact here is either Ekansh's own written background, cross-checked against
// his public repos, or derived at runtime from GitHub (project status, key technologies,
// Lab entries). Nothing is a marketing claim. "AI Dropout Prediction" has no findable
// public repo among his GitHub repos — description is his own, no repoUrl to link.
// Project images are custom SVG stand-ins (public/projects/*.svg); swap for real
// screenshots whenever available. resumeUrl is a placeholder and the Resume button stays
// hidden until it points at a real file.
export const content: SiteContent = {
  name: "Ekansh",
  role: "Full-Stack Developer & AI Engineer",
  tagline: "AI × SOFTWARE × SYSTEMS",
  claim: "I build intelligent software, from the model to the interface.",
  availability: "Open to 2026 internships",
  thinkingHeadline: ["I don't just build interfaces.", "I build systems."],
  bioLead:
    "I'm a Computer Science Engineering student who builds software end-to-end — from idea and architecture to a working, deployed product.",
  bio: "Strongest across the full loop: understanding a problem, designing the system, integrating frontend, backend, database, and AI models, debugging, shipping, and presenting it. Most effective in ambiguous problem spaces where the solution isn't handed to me.",
  capabilities: [
    {
      name: "AI",
      items: [
        { label: "Machine learning", evidence: "AI Dropout Prediction" },
        { label: "LLM applications", evidence: "LangChain · Ollama · RAG" },
        { label: "Agentic workflows", evidence: "HireFlow recruiting agent" },
      ],
    },
    {
      name: "Software",
      items: [
        { label: "Full stack", evidence: "React · Next.js · TypeScript" },
        { label: "Backend", evidence: "FastAPI · Node.js · Java" },
        { label: "APIs & data", evidence: "PostgreSQL · Supabase · SQL" },
      ],
    },
    {
      name: "Systems",
      items: [
        { label: "Integrity & security", evidence: "TrustVision · SentinelID" },
        { label: "Auth & hardening", evidence: "JWT, data isolation, rate limiting" },
        { label: "Deployment", evidence: "Docker · Vercel" },
      ],
    },
  ],
  highlights: [
    { value: "3rd", label: "prize at NexVerse Hackathon 2026, Aurora University" },
    { value: "200+", label: "teams in a 24-hour Blockchain + Cybersecurity hackathon" },
    { value: "SIH", label: "Smart India Hackathon build: TrustVision", href: "https://github.com/ekupekuAI/AISecurity26228" },
  ],
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
  stackTree: [
    { name: "AI", items: ["Python", "LangChain", "Ollama", "RAG"] },
    { name: "Frontend", items: ["React", "Next.js", "TypeScript"] },
    { name: "Backend", items: ["FastAPI", "Node.js", "Java"] },
    { name: "Data", items: ["PostgreSQL", "SQL", "Supabase"] },
    // Practices evidenced by TrustVision, SentinelID and Student Command Center, not tools.
    { name: "Security", items: ["Model & data integrity", "Supply-chain verification", "Auth & rate limiting"] },
  ],
  stackRelations: [
    ["Python", "LangChain"],
    ["Python", "Ollama"],
    ["Python", "FastAPI"],
    ["LangChain", "RAG"],
    ["Ollama", "RAG"],
    ["React", "Next.js"],
    ["React", "TypeScript"],
    ["Next.js", "TypeScript"],
    ["Node.js", "TypeScript"],
    ["FastAPI", "PostgreSQL"],
    ["PostgreSQL", "SQL"],
    ["PostgreSQL", "Supabase"],
    ["Python", "Model & data integrity"],
    ["TypeScript", "Supply-chain verification"],
    ["FastAPI", "Auth & rate limiting"],
  ],
  bootLines: ["AI SYSTEM", "WEB ENGINE", "BACKEND", "CREATIVE LAYER"],
  projects: [
    {
      id: "trustvision",
      title: "TrustVision",
      category: "AI Security & Model Trust",
      description:
        "An offline, air-gapped integrity-assurance system for defense computer-vision pipelines — verifies datasets, models, and inference outputs (duplicate/backdoor/out-of-distribution detection) and issues a signed, evidence-backed trust verdict with a tamper-proof audit log. Built for Smart India Hackathon (SIH).",
      image: "/projects/trustvision.svg",
      repoUrl: "https://github.com/ekupekuAI/AISecurity26228",
      featured: true,
      outcome: "Built for Smart India Hackathon",
      problem:
        "Defense computer-vision pipelines run air-gapped. There is no online service to tell an operator whether a dataset, a model, or an inference output has been duplicated, backdoored, or fed data it was never trained on.",
      solution:
        "An offline integrity-assurance system that inspects all three, issues a signed, evidence-backed trust verdict, and writes every decision to a tamper-proof audit log.",
      pipeline: [
        { label: "Ingest", detail: "Datasets, models, inference outputs" },
        { label: "Inspect", detail: "Duplicate, backdoor, out-of-distribution detection" },
        { label: "Verify", detail: "Integrity checks, fully offline" },
        { label: "Decide", detail: "Signed, evidence-backed trust verdict" },
        { label: "Audit", detail: "Tamper-proof log of every decision" },
      ],
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
      outcome: "Live demo on synthetic data",
      problem:
        "Court case updates are written for the system, not for the citizen the case is about. People cannot tell what just happened or what comes next.",
      solution:
        "Turns each update into a timeline, a plain-language explanation, and the next known step. Independent, synthetic demo data, and explicitly not legal advice.",
      pipeline: [
        { label: "Updates", detail: "Synthetic court case updates" },
        { label: "Timeline", detail: "Ordered, readable case history" },
        { label: "Explain", detail: "Plain-language meaning of each step" },
        { label: "Next", detail: "The next known step, stated" },
      ],
    },
    {
      id: "hireflow",
      title: "HireFlow",
      category: "AI Recruiting Agent",
      description:
        "A glass-box, bias-aware AI recruiting agent: upload a job description and resumes to get an evidence-cited ranked shortlist, auto-generated interview kits, natural-language Q&A over the candidate pool, and a Blind Mode that surfaces hiring bias. Built for the AI Agent Hackathon 2026.",
      image: "/projects/hireflow.svg",
      repoUrl: "https://github.com/ekupekuAI/Hireflow",
      featured: true,
      outcome: "Built for the AI Agent Hackathon 2026",
      problem:
        "Resume screening tools rank candidates without showing their evidence, and quietly carry the bias of whoever wrote the job description.",
      solution:
        "A glass-box agent: every ranking cites its evidence, interview kits are generated from it, the pool can be questioned in plain language, and a Blind Mode shows where bias is entering.",
      pipeline: [
        { label: "Input", detail: "Job description + resumes" },
        { label: "Rank", detail: "Evidence-cited shortlist" },
        { label: "Kit", detail: "Auto-generated interview kits" },
        { label: "Ask", detail: "Natural-language Q&A over the pool" },
        { label: "Blind", detail: "Bias surfaced, not hidden" },
      ],
    },
    {
      id: "sentinel-id",
      title: "SentinelID",
      category: "Cybersecurity Intelligence",
      description:
        "A trust & verification system for AI/software supply chains — integrity checking, tamper-evidence, and traceability for the components a project depends on.",
      image: "/projects/sentinel-id.svg",
      repoUrl: "https://github.com/ekupekuAI/Sentinel-ID",
      featured: true,
      problem:
        "Software and AI projects trust their dependencies by default. When a component is altered upstream, nothing downstream notices.",
      solution:
        "Integrity checking, tamper-evidence, and traceability for every component a project depends on.",
      pipeline: [
        { label: "Depend", detail: "The components a project pulls in" },
        { label: "Check", detail: "Integrity of each component" },
        { label: "Trace", detail: "Where it came from, what changed" },
        { label: "Evidence", detail: "Tamper-evidence a reviewer can verify" },
      ],
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
  journey: [
    {
      label: "Education",
      title: "Computer Science Engineering",
      detail: "Undergraduate, in progress. Learned by shipping alongside coursework.",
    },
    {
      label: "Projects",
      title: "First complete systems",
      detail: "Health Record System, then Student Command Center: frontend, backend, database, auth, and an AI assistant, end to end.",
    },
    {
      label: "Hackathons",
      title: "3rd prize, NexVerse 2026",
      detail: "Also a 200+ team, 24-hour Blockchain + Cybersecurity hackathon.",
    },
    {
      label: "AI · Software · Security",
      title: "TrustVision, HireFlow, SentinelID, NyayaPath",
      detail: "Model integrity for defense pipelines, a glass-box recruiting agent, supply-chain trust, citizen-facing legal AI.",
    },
    {
      label: "Current",
      title: "Sharpening the fundamentals",
      detail: "DSA, system design, and production backend engineering.",
    },
    {
      label: "Next",
      title: "Software, Full-Stack, Backend, or AI Engineering internship",
      detail: "2026. Open to teams with hard, ambiguous problems.",
    },
  ],
  social: {
    github: "https://github.com/ekupekuAI",
    linkedin: "https://www.linkedin.com/in/gingamekansh/",
    instagram: "https://instagram.com/whyalways.ekansh",
    twitter: "https://twitter.com/Ekanshxd",
  },
  resumeUrl: "/resume-placeholder.txt",
  stats: {
    githubRepoCount: 17,
    hackathonsCompeted: 2,
  },
};
