// GENERATED from the shared content source (same data the API seeds into Postgres).
// SAMPLE CONTENT: replace with Wesley's real projects, experiments and articles.
import { Capability, ColoredTag, EngagementFormat, Faq, KeyLabel, Service, SiteInfo, TimelineItem, TitledText } from '../models';

export const SITE: SiteInfo = {
  "name": "Wesley Nyamosi",
  "role": "AI Engineering & Consulting",
  "email": "nyamosiwesley02@gmail.com",
  "github": "",
  "githubUser": "",
  "linkedin": "https://www.linkedin.com/in/wesley-nyamosi-809409251",
  "cv": "/assets/wesley-nyamosi-cv.pdf",
  "photo": "/assets/wesley.jpg",
  "url": "https://wesleynyamosi.com"
};

export const BUILDING: string[] = [
  "an evaluation harness for multi-turn RAG assistants",
  "a self-hosted inference stack for open-weight models",
  "a sub-second voice agent pipeline",
  "agent tool-use guardrails with human approval steps"
];

export const HERO_TAGS: ColoredTag[] = [
  {
    "label": "AI Architecture",
    "color": "c-green"
  },
  {
    "label": "Enterprise AI",
    "color": "c-amber"
  },
  {
    "label": "RAG & Agents",
    "color": "c-sky"
  },
  {
    "label": "LLM Evaluation",
    "color": "c-rose"
  },
  {
    "label": "Voice AI",
    "color": "c-violet"
  },
  {
    "label": "Open-Weight LLMs",
    "color": "c-teal"
  },
  {
    "label": "vLLM",
    "color": "c-orange"
  },
  {
    "label": "Python",
    "color": "c-cream"
  },
  {
    "label": "Kubernetes",
    "color": "c-sky"
  },
  {
    "label": "PostgreSQL",
    "color": "c-green"
  }
];

export const PHILOSOPHY: TitledText[] = [
  {
    "title": "Problem",
    "text": "What is actually broken, for whom, and what does it cost today? No model is chosen yet."
  },
  {
    "title": "Strategy",
    "text": "Where AI helps, where it does not, and how success will be measured before any code is written."
  },
  {
    "title": "Architecture",
    "text": "Components, data flows, failure modes, security boundaries and the cost envelope."
  },
  {
    "title": "Data",
    "text": "Sources, ownership, quality, freshness, access control and the pipeline that keeps it current."
  },
  {
    "title": "Models",
    "text": "Hosted or open-weight, size versus latency versus cost, fine-tuning only when evidence says so."
  },
  {
    "title": "Application",
    "text": "The product people use: UX, tool use, citations, fallbacks and human-in-the-loop steps."
  },
  {
    "title": "Evaluation",
    "text": "Test sets, automated metrics, human review and regression gates in CI."
  },
  {
    "title": "Infrastructure",
    "text": "Serving, scaling, observability, cost controls and rollbacks."
  },
  {
    "title": "Production",
    "text": "Running, monitored, improving, and trusted by the people who depend on it."
  }
];

export const CAPS: Capability[] = [
  {
    "id": "strategy",
    "title": "AI Strategy & Architecture",
    "color": "c-green",
    "icon": "compass",
    "desc": "Helping organizations identify AI opportunities and translate them into practical technical architectures.",
    "tags": [
      "Use-case discovery",
      "Reference architecture",
      "Build vs buy",
      "Roadmaps"
    ]
  },
  {
    "id": "enterprise",
    "title": "Enterprise AI Applications",
    "color": "c-amber",
    "icon": "layers",
    "desc": "Building production AI assistants, copilots, and intelligent applications that fit real workflows.",
    "tags": [
      "Copilots",
      "Assistants",
      "Document AI",
      "Integrations"
    ]
  },
  {
    "id": "rag",
    "title": "RAG & Agentic Systems",
    "color": "c-sky",
    "icon": "network",
    "desc": "Designing knowledge retrieval and autonomous AI workflows that stay grounded, auditable and safe.",
    "tags": [
      "Hybrid retrieval",
      "Re-ranking",
      "Tool use",
      "Multi-agent"
    ]
  },
  {
    "id": "evaluation",
    "title": "AI Evaluation & Benchmarking",
    "color": "c-rose",
    "icon": "gauge",
    "desc": "Measuring quality, reliability, latency, cost and safety, so decisions are made on evidence.",
    "tags": [
      "Eval harnesses",
      "LLM-as-judge",
      "Red teaming",
      "Regression gates"
    ]
  },
  {
    "id": "voice",
    "title": "Voice AI",
    "color": "c-violet",
    "icon": "wave",
    "desc": "Real-time conversational voice agents with natural turn-taking and a strict latency budget.",
    "tags": [
      "ASR",
      "TTS",
      "Barge-in",
      "Telephony"
    ]
  },
  {
    "id": "infra",
    "title": "Open-Weight LLM & AI Infrastructure",
    "color": "c-teal",
    "icon": "server",
    "desc": "Deploying, serving and optimizing open-weight models on infrastructure you control.",
    "tags": [
      "vLLM",
      "Quantization",
      "GPU serving",
      "Kubernetes"
    ]
  }
];

export const WORK_CATS: KeyLabel[] = [
  {
    "key": "all",
    "label": "All"
  },
  {
    "key": "rag",
    "label": "RAG"
  },
  {
    "key": "enterprise",
    "label": "Enterprise AI"
  },
  {
    "key": "agents",
    "label": "Agents"
  },
  {
    "key": "voice",
    "label": "Voice AI"
  },
  {
    "key": "infra",
    "label": "Infrastructure"
  }
];

export const SERVICES: Service[] = [
  {
    "title": "AI Strategy & Architecture",
    "icon": "compass",
    "desc": "Find the AI opportunities worth pursuing and design architectures that can actually ship.",
    "items": [
      "Opportunity assessment",
      "Reference architecture",
      "Build vs buy",
      "Roadmap"
    ],
    "outcome": "A prioritized roadmap and an architecture your team can build."
  },
  {
    "title": "Enterprise AI Applications",
    "icon": "layers",
    "desc": "Design and build assistants, copilots, RAG and agentic systems that fit real workflows.",
    "items": [
      "Assistants",
      "Copilots",
      "RAG",
      "Agents",
      "Integrations"
    ],
    "outcome": "A production AI application, not a prototype."
  },
  {
    "title": "AI Evaluation & Benchmarking",
    "icon": "gauge",
    "desc": "Measure what your AI system does today and build the harness to keep it honest.",
    "items": [
      "Test sets",
      "Quality metrics",
      "Latency & cost",
      "Safety review"
    ],
    "outcome": "An evidence-based view of quality, cost and risk."
  },
  {
    "title": "Voice AI Agents",
    "icon": "wave",
    "desc": "Real-time voice agents for support, scheduling and internal workflows.",
    "items": [
      "ASR / TTS",
      "Turn-taking",
      "Telephony",
      "Handoff"
    ],
    "outcome": "A voice agent that is fast, natural and safe."
  },
  {
    "title": "Open-Weight LLM Deployment",
    "icon": "server",
    "desc": "Run open-weight models on infrastructure you control, efficiently.",
    "items": [
      "Model selection",
      "vLLM serving",
      "Quantization",
      "Observability"
    ],
    "outcome": "Private, cost-controlled inference you own."
  },
  {
    "title": "Workshops & Training",
    "icon": "book",
    "desc": "Practical AI sessions for engineering teams and leadership.",
    "items": [
      "Engineering workshops",
      "Executive briefings",
      "Hands-on labs"
    ],
    "outcome": "A team that can make better AI decisions on its own."
  }
];

export const ENGAGE: TitledText[] = [
  {
    "title": "Discover",
    "text": "Understand the problem, users, constraints and what success means."
  },
  {
    "title": "Assess",
    "text": "Review data, systems, risks and feasibility."
  },
  {
    "title": "Design",
    "text": "Architecture, evaluation plan, cost and timeline."
  },
  {
    "title": "Build",
    "text": "Iterative delivery with working software every week."
  },
  {
    "title": "Evaluate",
    "text": "Measure quality, safety, latency and cost against the plan."
  },
  {
    "title": "Deploy",
    "text": "Production rollout, monitoring and handover."
  },
  {
    "title": "Optimize",
    "text": "Improve quality and reduce cost using real usage."
  }
];

export const FORMATS: EngagementFormat[] = [
  {
    "title": "Advisory",
    "duration": "2–4 weeks",
    "text": "Architecture review, AI strategy or a second opinion before a big decision.",
    "cta": "Book a call"
  },
  {
    "title": "Evaluation sprint",
    "duration": "2–3 weeks",
    "text": "A full evaluation of an existing AI system with a prioritized fix list.",
    "cta": "Request an audit"
  },
  {
    "title": "Build engagement",
    "duration": "6–16 weeks",
    "text": "Design and delivery of a production AI system with your team.",
    "cta": "Discuss a build"
  },
  {
    "title": "Workshop",
    "duration": "1–3 days",
    "text": "Hands-on training for engineers or a strategy session for leadership.",
    "cta": "Plan a workshop"
  }
];

export const FAQ: Faq[] = [
  {
    "q": "What kinds of organizations do you work with?",
    "a": "Companies and teams that have a real problem AI might solve: enterprises, scale-ups and public-sector teams. The common thread is wanting something that works in production, not a demo."
  },
  {
    "q": "Do you only build, or also advise?",
    "a": "Both. Some engagements are pure advisory (architecture reviews, strategy, evaluation), and others are end-to-end builds with your engineers."
  },
  {
    "q": "Can you work with our existing team and stack?",
    "a": "Yes. Most work is done alongside an internal team, using your cloud, your repositories and your standards, and ends with a proper handover."
  },
  {
    "q": "Can models run on our own infrastructure?",
    "a": "Yes. Deploying open-weight models on infrastructure you control is a core service, which matters when data cannot leave your environment."
  },
  {
    "q": "How do you price engagements?",
    "a": "Fixed scope for advisory and evaluation sprints; time-and-materials or milestone pricing for builds. You get a written proposal after the discovery call."
  },
  {
    "q": "How quickly can we start?",
    "a": "Usually within two to three weeks. Send a short description of the problem through the contact form and you will get a reply within two working days."
  }
];

export const LAB_TYPES: string[] = [
  "All",
  "Experiment",
  "Benchmark",
  "Research",
  "Infrastructure",
  "Prototype"
];

export const TIMELINE: TimelineItem[] = [
  {
    "when": "Now",
    "title": "Independent AI engineer & consultant",
    "text": "Helping organizations design, build, evaluate and deploy production AI systems: RAG, agents, voice and open-weight model infrastructure.",
    "now": true
  },
  {
    "when": "Earlier",
    "title": "AI engineering in industry",
    "text": "Built and operated AI applications and LLM infrastructure used daily by real teams. Replace with real roles, dates and outcomes.",
    "now": false
  },
  {
    "when": "Earlier",
    "title": "Software & data engineering",
    "text": "Backend systems, data pipelines and cloud infrastructure: the foundation production AI depends on.",
    "now": false
  },
  {
    "when": "Start",
    "title": "Education",
    "text": "Add degree, institution and relevant research here.",
    "now": false
  }
];

export const SUGGESTED: string[] = [
  "What kind of AI systems does Wesley build?",
  "Show me his work with RAG.",
  "Can Wesley help us evaluate our AI system?",
  "What does Wesley believe about production AI?"
];

