// GENERATED from the shared content source (same data the API seeds into Postgres).
// SAMPLE CONTENT: replace with Wesley's real projects, experiments and articles.
import { Capability, SiteInfo, TitledText } from '../models';

export const SITE: SiteInfo = {
  "name": "Wesley Nyamosi",
  "role": "AI Engineering",
  "email": "nyamosiwesley02@gmail.com",
  "github": "https://github.com/0792211827",
  "githubUser": "0792211827",
  "linkedin": "https://www.linkedin.com/in/wesley-nyamosi-809409251",
  "x": "https://x.com/nyamosiW",
  "cv": "/assets/wesley-nyamosi-cv.pdf",
  "photo": "/assets/hero-placeholder.jpg",
  "url": "https://wesleynyamosi.com"
};

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

/** Home page: the areas Wesley works in (confirmed 2026-10-24 and 2026-10-25, see docs/source-material.md). */
export const PILLARS: Capability[] = [
  {
    "id": "agents",
    "title": "AI Agents & RAG",
    "color": "c-sky",
    "icon": "network",
    "desc": "Agents that use tools and retrieval pipelines that ground answers in your own data, with evaluation harnesses that show whether they actually work.",
    "tags": ["Agents", "RAG", "Retrieval", "Evaluation", "Agent harnesses", "OpenClaw"]
  },
  {
    "id": "local",
    "title": "LLMs & Local Deployment",
    "color": "c-teal",
    "icon": "layers",
    "desc": "Running open-weight language models on hardware you control, so data stays private and costs stay predictable.",
    "tags": ["Open-weight LLMs", "Local deployment", "Hugging Face", "Docker"]
  },
  {
    "id": "inference",
    "title": "Inference Engines",
    "color": "c-orange",
    "icon": "server",
    "desc": "Serving models fast and efficiently with engines like vLLM and Ollama, tuned for latency, throughput and the hardware available.",
    "tags": ["vLLM", "Ollama", "Latency", "Throughput"]
  },
  {
    "id": "strategy",
    "title": "AI Strategy, Cost & Consulting",
    "color": "c-amber",
    "icon": "compass",
    "desc": "Helping teams decide where AI is worth it, choose between hosted APIs and self-hosted models, and keep inference costs predictable.",
    "tags": ["AI strategy", "Cost optimization", "Build vs buy", "Consulting"]
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

export const SUGGESTED: string[] = [
  "What kind of AI systems does Wesley build?",
  "Show me his work with RAG.",
  "Can Wesley help us evaluate our AI system?",
  "What does Wesley believe about production AI?"
];

