// GENERATED from the shared content source (same data the API seeds into Postgres).
// SAMPLE CONTENT: replace with Wesley's real projects, experiments and articles.
import { KnowledgeEntry, LabEntry, Post, Project } from '../models';

export const PROJECTS: Project[] = [
  {
    "slug": "enterprise-knowledge-assistant",
    "title": "Enterprise Knowledge Assistant",
    "category": "RAG & Knowledge Systems",
    "cat": "rag",
    "art": "rag",
    "year": "2026",
    "problem": "Staff spent hours searching policies, contracts and wikis spread across five systems, and answers were inconsistent.",
    "outcome": "Grounded answers with citations in under two seconds, scoped to each user's document permissions.",
    "metric": {
      "label": "time to answer",
      "value": "-68%"
    },
    "tech": [
      "Python",
      "FastAPI",
      "pgvector",
      "BM25",
      "Cross-encoder",
      "vLLM",
      "Langfuse"
    ],
    "overview": "An internal assistant that answers questions from approved company knowledge, always cites its sources, and refuses when the evidence is not there.",
    "context": "Knowledge lived in SharePoint, a legacy wiki, shared drives and two line-of-business systems. New staff took weeks to become productive and policy answers varied by who you asked. Leadership wanted AI, but compliance would not accept answers without provenance or that leaked documents across departments.",
    "requirements": [
      "Every answer cites the documents it used",
      "Respect existing document-level permissions",
      "p95 latency under 3 seconds",
      "Data stays inside the organization's cloud tenancy",
      "Measurable quality before rollout"
    ],
    "arch": [
      "Connectors",
      "Chunk + embed",
      "Hybrid index",
      "Re-ranker",
      "LLM",
      "Guardrails",
      "Cited answer"
    ],
    "implementation": "Connectors sync documents nightly and on change events. Documents are chunked by structure (headings, tables, clauses) rather than fixed size, embedded, and stored in PostgreSQL with pgvector next to a BM25 index. Queries run hybrid retrieval, a cross-encoder re-ranks the top 40 to 8, and permission filters are applied before anything reaches the model. Responses stream with inline citations that open the source passage.",
    "challenges": [
      "Tables in PDFs lost meaning when chunked naively; a layout-aware parser fixed most failures",
      "Permission filtering after retrieval returned empty context too often; filters moved into the query itself",
      "Users asked follow-ups that only made sense with history; a query-rewriting step resolved them"
    ],
    "decisions": [
      {
        "title": "pgvector instead of a dedicated vector database",
        "body": "The team already ran PostgreSQL. One datastore for metadata, permissions and vectors kept operations simple.",
        "tradeoff": "Slightly lower recall at very large scale; acceptable below ~10M chunks."
      },
      {
        "title": "Open-weight model served with vLLM",
        "body": "Data residency ruled out sending documents to an external API.",
        "tradeoff": "GPU cost and on-call ownership in exchange for control."
      },
      {
        "title": "Refuse instead of guess",
        "body": "When retrieval confidence was low the assistant says so and links the closest documents.",
        "tradeoff": "Lower answer rate, much higher trust."
      }
    ],
    "evaluation": "A 420-question test set was written with subject-matter experts and covered lookups, multi-hop questions, permission edge cases and questions that should be refused. Faithfulness, answer relevance and citation precision were tracked per release, and a regression gate in CI blocked any change that lowered faithfulness.",
    "results": [
      {
        "label": "faithfulness",
        "value": "0.93"
      },
      {
        "label": "p95 latency",
        "value": "1.8s"
      },
      {
        "label": "time to answer",
        "value": "-68%"
      },
      {
        "label": "permission leaks in tests",
        "value": "0"
      }
    ],
    "lessons": [
      "Retrieval quality decides answer quality; most gains came from parsing and re-ranking, not the model",
      "An evaluation set agreed with the business is the fastest way to end opinion-driven debates",
      "Refusals build trust when they still point people somewhere useful"
    ],
    "resources": [
      "Architecture notes",
      "Evaluation dataset schema",
      "Related article"
    ],
    "featured": true,
    "sortOrder": 1
  },
  {
    "slug": "contract-intelligence-pipeline",
    "title": "Contract Intelligence Pipeline",
    "category": "Enterprise AI · Document AI",
    "cat": "enterprise",
    "art": "doc",
    "year": "2025",
    "problem": "Legal reviewed every supplier contract by hand to find renewal dates, liability caps and non-standard clauses.",
    "outcome": "Structured extraction with confidence scores and a reviewer queue for anything uncertain.",
    "metric": {
      "label": "review throughput",
      "value": "4×"
    },
    "tech": [
      "Python",
      "Layout parsing",
      "Structured outputs",
      "Celery",
      "PostgreSQL",
      "React"
    ],
    "overview": "A pipeline that turns contracts into structured, reviewable data and flags clauses that deviate from the standard playbook.",
    "context": "Hundreds of contracts a month, inconsistent templates and scanned documents. Missed renewal dates were costing money and the legal team had no time for proactive work.",
    "requirements": [
      "Field-level confidence on every extraction",
      "Human review for low-confidence fields",
      "Clause comparison against the company playbook",
      "Full audit trail"
    ],
    "arch": [
      "Upload",
      "OCR + layout",
      "Classifier",
      "Extractor",
      "Validator",
      "Review queue",
      "Contract DB"
    ],
    "implementation": "Documents go through OCR and layout analysis, are classified by contract type, then extracted with schema-constrained outputs. Deterministic validators check dates, currencies and cross-field consistency. Anything below the confidence threshold goes to a review queue where a lawyer confirms or corrects the value, and each correction is stored as evaluation data.",
    "challenges": [
      "Scanned contracts with stamps and signatures over text",
      "Clauses split across pages",
      "Calibrating confidence so the review queue stayed small but safe"
    ],
    "decisions": [
      {
        "title": "Schema-constrained extraction",
        "body": "Strict JSON schemas made outputs predictable and easy to validate.",
        "tradeoff": "Less flexibility for unusual contract types."
      },
      {
        "title": "Human review as a feature",
        "body": "Reviewers handle uncertainty and their corrections feed evaluation.",
        "tradeoff": "Not fully automated, by design."
      }
    ],
    "evaluation": "Field-level precision and recall on 300 labelled contracts, measured per contract type, plus review-queue rate and time-to-review.",
    "results": [
      {
        "label": "field precision",
        "value": "0.96"
      },
      {
        "label": "throughput",
        "value": "4×"
      },
      {
        "label": "sent to review",
        "value": "14%"
      },
      {
        "label": "audit coverage",
        "value": "100%"
      }
    ],
    "lessons": [
      "Confidence calibration matters more than raw accuracy",
      "Reviewer corrections are the best evaluation data you will get"
    ],
    "resources": [
      "Pipeline diagram",
      "Extraction schema example"
    ],
    "featured": true,
    "sortOrder": 2
  },
  {
    "slug": "voice-agent-customer-support",
    "title": "Voice Agent for Customer Support",
    "category": "Voice AI",
    "cat": "voice",
    "art": "voice",
    "year": "2025",
    "problem": "Call queues peaked at 20+ minutes for routine requests such as balance checks and appointment changes.",
    "outcome": "A phone agent that resolves routine calls end to end and hands off to a human with full context.",
    "metric": {
      "label": "median response",
      "value": "780ms"
    },
    "tech": [
      "Streaming ASR",
      "TTS",
      "WebRTC",
      "SIP",
      "Function calling",
      "Redis"
    ],
    "overview": "A real-time voice agent that handles routine support calls, supports interruption, and escalates cleanly.",
    "context": "Most calls were repetitive, but customers hated rigid IVR menus. The business needed natural conversation without risking wrong actions on accounts.",
    "requirements": [
      "Median response under one second",
      "Barge-in (customer can interrupt)",
      "Verified identity before any account action",
      "Warm transfer with a summary"
    ],
    "arch": [
      "Telephony",
      "Streaming ASR",
      "Turn detection",
      "LLM + tools",
      "Policy check",
      "Streaming TTS",
      "Caller"
    ],
    "implementation": "Audio streams through ASR with partial transcripts. A turn detector decides when the caller has finished. The model plans a reply and calls tools such as account lookup or rescheduling, which pass through a policy layer. TTS streams the first sentence while the rest is generated, and if the caller speaks, playback stops immediately.",
    "challenges": [
      "Latency stacked up across five services",
      "Turn detection on noisy lines",
      "Numbers and names misheard by ASR"
    ],
    "decisions": [
      {
        "title": "Stream everything",
        "body": "Every stage streams, so the first audio plays before the full response exists.",
        "tradeoff": "More complex orchestration and error handling."
      },
      {
        "title": "Tool calls behind a policy layer",
        "body": "The model proposes, deterministic code decides.",
        "tradeoff": "Some flexibility lost for safety."
      }
    ],
    "evaluation": "Latency budget per stage, task completion on scripted test calls, and blind human ratings of naturalness.",
    "results": [
      {
        "label": "median response",
        "value": "780ms"
      },
      {
        "label": "calls fully resolved",
        "value": "61%"
      },
      {
        "label": "caller rating",
        "value": "4.4/5"
      },
      {
        "label": "wrong-action rate",
        "value": "<2%"
      }
    ],
    "lessons": [
      "Latency is a product feature in voice",
      "Design the handoff first; it builds trust"
    ],
    "resources": [
      "Latency budget sheet",
      "Call flow diagram"
    ],
    "featured": true,
    "sortOrder": 3
  },
  {
    "slug": "private-llm-inference-platform",
    "title": "Private LLM Inference Platform",
    "category": "Open-Weight LLMs · Infrastructure",
    "cat": "infra",
    "art": "infra",
    "year": "2026",
    "problem": "Several teams were calling external LLM APIs with sensitive data and unpredictable monthly costs.",
    "outcome": "A shared, OpenAI-compatible inference platform for open-weight models on the organization's own GPUs.",
    "metric": {
      "label": "cost per 1M tokens",
      "value": "-57%"
    },
    "tech": [
      "vLLM",
      "Kubernetes",
      "AWQ",
      "Prometheus",
      "Grafana",
      "LiteLLM"
    ],
    "overview": "Self-hosted serving for open-weight models with routing, quotas, observability and cost reporting per team.",
    "context": "Usage was growing fast, API spend was unpredictable, and data governance needed models that ran inside the organization's boundary.",
    "requirements": [
      "OpenAI-compatible API for easy migration",
      "Per-team keys, quotas and cost reports",
      "Autoscaling on GPU nodes",
      "Model rollouts without downtime"
    ],
    "arch": [
      "Clients",
      "API gateway",
      "Router",
      "vLLM pool",
      "GPU nodes",
      "Metrics",
      "Cost reports"
    ],
    "implementation": "Models are served with vLLM on Kubernetes GPU node pools. A gateway handles auth, quotas and routing between model sizes. Quantized variants serve high-volume, low-complexity traffic. Prometheus collects tokens, latency and GPU utilisation, and Grafana dashboards show cost per team.",
    "challenges": [
      "Cold starts when scaling large models",
      "Balancing throughput against latency with batching",
      "Choosing quantization without hurting quality"
    ],
    "decisions": [
      {
        "title": "AWQ INT4 for the high-volume tier",
        "body": "Benchmarks showed minimal quality loss for classification and extraction tasks.",
        "tradeoff": "Kept FP16 for complex reasoning traffic."
      },
      {
        "title": "OpenAI-compatible API",
        "body": "Teams migrated by changing a base URL.",
        "tradeoff": "Tied to that API shape."
      }
    ],
    "evaluation": "Throughput and latency under load tests, task-level quality comparisons against the previous API, and monthly cost per million tokens.",
    "results": [
      {
        "label": "cost / 1M tokens",
        "value": "-57%"
      },
      {
        "label": "throughput",
        "value": "2.6×"
      },
      {
        "label": "availability",
        "value": "99.9%"
      },
      {
        "label": "teams migrated",
        "value": "6"
      }
    ],
    "lessons": [
      "Measure quality per task before choosing quantization",
      "Cost visibility changes behaviour more than quotas"
    ],
    "resources": [
      "Helm chart notes",
      "Benchmark results (AI Lab)"
    ],
    "featured": true,
    "sortOrder": 4
  },
  {
    "slug": "agentic-operations-copilot",
    "title": "Agentic Operations Copilot",
    "category": "Agentic Systems",
    "cat": "agents",
    "art": "agent",
    "year": "2026",
    "problem": "Operations staff copied data between four internal systems to complete routine requests.",
    "outcome": "An agent that drafts and executes multi-step workflows, with approval before any irreversible action.",
    "metric": {
      "label": "handling time",
      "value": "-41%"
    },
    "tech": [
      "Tool calling",
      "State machine",
      "Temporal",
      "Python",
      "Audit log"
    ],
    "overview": "A copilot that plans multi-step tasks across internal systems and asks a human before anything is changed.",
    "context": "Routine but multi-system tasks took most of the team's day. Full automation was not acceptable to the business.",
    "requirements": [
      "Every write action approved by a person",
      "Full audit trail of plans and tool calls",
      "Recoverable on failure",
      "Scoped permissions per tool"
    ],
    "arch": [
      "Request",
      "Planner",
      "Tool registry",
      "Approval step",
      "Executor",
      "Audit log",
      "Result"
    ],
    "implementation": "The planner produces an explicit plan as structured steps. Read-only tools run directly, while write tools pause for approval. Execution runs as a durable workflow so failures can resume, and every step is logged.",
    "challenges": [
      "Plans that looped or over-reached",
      "Tool errors mid-workflow",
      "Keeping approval friction low"
    ],
    "decisions": [
      {
        "title": "Explicit plans, not free-running loops",
        "body": "Plans are visible, reviewable and testable.",
        "tradeoff": "Less autonomy, more predictability."
      },
      {
        "title": "Durable workflows",
        "body": "Long tasks survive restarts and failures.",
        "tradeoff": "An extra moving part to operate."
      }
    ],
    "evaluation": "Scenario test suite of 150 tasks scored for plan correctness, tool-call accuracy and safe failure.",
    "results": [
      {
        "label": "handling time",
        "value": "-41%"
      },
      {
        "label": "plan correctness",
        "value": "92%"
      },
      {
        "label": "unapproved writes",
        "value": "0"
      },
      {
        "label": "test scenarios",
        "value": "150"
      }
    ],
    "lessons": [
      "Agents need boundaries more than intelligence",
      "Approval UX decides adoption"
    ],
    "resources": [
      "Agent design notes"
    ],
    "featured": false,
    "sortOrder": 5
  }
];

export const LAB: LabEntry[] = [
  {
    "slug": "vllm-vs-tgi-throughput",
    "type": "Benchmark",
    "color": "c-teal",
    "date": "2026-08-14",
    "status": "complete",
    "title": "vLLM vs TGI: throughput under concurrent load",
    "question": "Which serving engine gives more tokens per second for a 8B model at 64 concurrent requests on one GPU?",
    "method": "Same model weights, same GPU, synthetic traffic with realistic prompt lengths (p50 900 tokens) and 256-token outputs. Five runs per configuration.",
    "env": [
      {
        "label": "GPU",
        "value": "1× H100 80GB"
      },
      {
        "label": "Model",
        "value": "8B instruct, FP16"
      },
      {
        "label": "Concurrency",
        "value": "64"
      },
      {
        "label": "Prompt p50",
        "value": "900 tokens"
      },
      {
        "label": "Output",
        "value": "256 tokens"
      },
      {
        "label": "Runs",
        "value": "5 per engine"
      }
    ],
    "experiment": "Load generated with a custom async client that records time-to-first-token, inter-token latency and total throughput. Engines were warmed up before each run.",
    "unit": "tokens/s",
    "rows": [
      {
        "label": "vLLM",
        "value": 2840,
        "pct": 100
      },
      {
        "label": "TGI",
        "value": 2310,
        "pct": 81
      },
      {
        "label": "Baseline (HF)",
        "value": 610,
        "pct": 21
      }
    ],
    "analysis": "vLLM led on throughput thanks to continuous batching and paged attention. TGI had a slightly better time-to-first-token at low concurrency, but the gap closed above 32 concurrent requests.",
    "conclusion": "For high-concurrency internal platforms, vLLM is the default choice. Re-test when traffic is mostly short prompts.",
    "code": "# load test (simplified)\nimport asyncio, time\nfrom client import stream_completion\n\nasync def run(n=64):\n    start = time.perf_counter()\n    results = await asyncio.gather(*[stream_completion(p) for p in prompts[:n]])\n    tokens = sum(r.output_tokens for r in results)\n    return tokens / (time.perf_counter() - start)",
    "sortOrder": 1
  },
  {
    "slug": "awq-int4-vs-fp16",
    "type": "Experiment",
    "color": "c-amber",
    "date": "2026-07-02",
    "status": "complete",
    "title": "AWQ INT4 vs FP16: what quality do you lose?",
    "question": "Does 4-bit AWQ quantization hurt quality on real enterprise tasks, or only on leaderboards?",
    "method": "Three internal-style task sets (extraction, classification, grounded Q&A) scored against references, comparing FP16 and AWQ INT4 versions of the same model.",
    "env": [
      {
        "label": "GPU",
        "value": "1× L40S 48GB"
      },
      {
        "label": "Model",
        "value": "14B instruct"
      },
      {
        "label": "Variants",
        "value": "FP16 / AWQ INT4"
      },
      {
        "label": "Tasks",
        "value": "3 sets, 900 items"
      },
      {
        "label": "Scoring",
        "value": "Exact match + judge"
      },
      {
        "label": "Seed",
        "value": "Fixed"
      }
    ],
    "experiment": "Each item was run once per variant with temperature 0. Grounded Q&A was scored for faithfulness by an LLM judge calibrated against 100 human labels.",
    "unit": "score",
    "rows": [
      {
        "label": "FP16 extraction",
        "value": 0.94,
        "pct": 94
      },
      {
        "label": "INT4 extraction",
        "value": 0.93,
        "pct": 93
      },
      {
        "label": "FP16 grounded QA",
        "value": 0.89,
        "pct": 89
      },
      {
        "label": "INT4 grounded QA",
        "value": 0.85,
        "pct": 85
      }
    ],
    "analysis": "Extraction and classification were almost unaffected. Grounded Q&A dropped four points, mostly on multi-hop questions.",
    "conclusion": "Use INT4 for high-volume structured tasks; keep FP16 for complex reasoning.",
    "code": "variants = {\"fp16\": load(\"model-14b\"), \"int4\": load(\"model-14b-awq\")}\nfor name, model in variants.items():\n    score = evaluate(model, tasks, temperature=0)\n    print(name, score)",
    "sortOrder": 2
  },
  {
    "slug": "hybrid-retrieval",
    "type": "Research",
    "color": "c-sky",
    "date": "2026-06-10",
    "status": "complete",
    "title": "Hybrid retrieval: when does BM25 still win?",
    "question": "How much does adding BM25 and a re-ranker improve recall over dense-only retrieval on enterprise documents?",
    "method": "Recall@10 on 500 labelled queries across policies, contracts and technical docs.",
    "env": [
      {
        "label": "Corpus",
        "value": "48k chunks"
      },
      {
        "label": "Embeddings",
        "value": "3 models"
      },
      {
        "label": "Sparse",
        "value": "BM25"
      },
      {
        "label": "Re-ranker",
        "value": "Cross-encoder"
      },
      {
        "label": "Queries",
        "value": "500 labelled"
      },
      {
        "label": "Metric",
        "value": "Recall@10"
      }
    ],
    "experiment": "Dense-only, BM25-only, reciprocal rank fusion, and fusion plus re-ranking, each run against the same query set.",
    "unit": "recall@10",
    "rows": [
      {
        "label": "Dense only",
        "value": 0.71,
        "pct": 71
      },
      {
        "label": "BM25 only",
        "value": 0.64,
        "pct": 64
      },
      {
        "label": "Hybrid (RRF)",
        "value": 0.82,
        "pct": 82
      },
      {
        "label": "Hybrid + re-rank",
        "value": 0.9,
        "pct": 90
      }
    ],
    "analysis": "BM25 won on queries with product codes, clause numbers and exact names. Fusion captured both, and re-ranking added the final lift.",
    "conclusion": "Hybrid plus re-ranking should be the default for enterprise RAG.",
    "code": "def hybrid(query, k=40):\n    dense = vector_search(query, k)\n    sparse = bm25_search(query, k)\n    fused = reciprocal_rank_fusion([dense, sparse])\n    return rerank(query, fused)[:10]",
    "sortOrder": 3
  },
  {
    "slug": "kv-cache-prefix-reuse",
    "type": "Infrastructure",
    "color": "c-violet",
    "date": "2026-05-21",
    "status": "in progress",
    "title": "Prefix caching for long system prompts",
    "question": "How much latency does automatic prefix caching save when every request shares a 3k-token system prompt?",
    "method": "Same traffic with prefix caching on and off; measure time-to-first-token.",
    "env": [
      {
        "label": "GPU",
        "value": "1× H100 80GB"
      },
      {
        "label": "Engine",
        "value": "vLLM"
      },
      {
        "label": "Shared prefix",
        "value": "3,000 tokens"
      },
      {
        "label": "Requests",
        "value": "2,000"
      },
      {
        "label": "Concurrency",
        "value": "32"
      },
      {
        "label": "Metric",
        "value": "TTFT p50"
      }
    ],
    "experiment": "Replay of production-shaped traffic with and without automatic prefix caching enabled.",
    "unit": "ms TTFT",
    "rows": [
      {
        "label": "Caching off",
        "value": 420,
        "pct": 100
      },
      {
        "label": "Caching on",
        "value": 140,
        "pct": 33
      }
    ],
    "analysis": "Time-to-first-token dropped by two thirds. Memory pressure increased slightly at peak concurrency.",
    "conclusion": "Turn it on for assistants with long, stable system prompts. Further tests on multi-tenant traffic are in progress.",
    "code": "llm = LLM(model=MODEL, enable_prefix_caching=True)\n# measure time-to-first-token over replayed traffic",
    "sortOrder": 4
  },
  {
    "slug": "voice-latency-budget",
    "type": "Prototype",
    "color": "c-rose",
    "date": "2026-04-08",
    "status": "complete",
    "title": "Where do the milliseconds go in a voice agent?",
    "question": "Which stage of a streaming voice pipeline dominates response latency?",
    "method": "Instrumented every stage of a prototype pipeline over 300 test calls.",
    "env": [
      {
        "label": "Transport",
        "value": "WebRTC"
      },
      {
        "label": "ASR",
        "value": "Streaming"
      },
      {
        "label": "LLM",
        "value": "8B, vLLM"
      },
      {
        "label": "TTS",
        "value": "Streaming"
      },
      {
        "label": "Calls",
        "value": "300"
      },
      {
        "label": "Metric",
        "value": "Median ms"
      }
    ],
    "experiment": "Timestamps recorded at end of speech, final transcript, first LLM token, first audio byte and playback start.",
    "unit": "ms",
    "rows": [
      {
        "label": "Turn detection",
        "value": 220,
        "pct": 100
      },
      {
        "label": "ASR final",
        "value": 110,
        "pct": 50
      },
      {
        "label": "LLM first token",
        "value": 190,
        "pct": 86
      },
      {
        "label": "TTS first audio",
        "value": 160,
        "pct": 73
      },
      {
        "label": "Network",
        "value": 100,
        "pct": 45
      }
    ],
    "analysis": "Turn detection was the largest single cost. Tuning silence thresholds saved more than switching models.",
    "conclusion": "Optimize turn-taking before optimizing the model.",
    "code": "stages = [\"eos\", \"asr_final\", \"llm_first\", \"tts_first\", \"playback\"]\nlatency = {s: median(t[s] - t[prev]) for prev, s in zip(stages, stages[1:])}",
    "sortOrder": 5
  },
  {
    "slug": "embedding-model-comparison",
    "type": "Benchmark",
    "color": "c-teal",
    "date": "2026-03-15",
    "status": "complete",
    "title": "Embedding models on multilingual business documents",
    "question": "Which embedding model retrieves best on English and Swahili business documents?",
    "method": "Recall@10 on 300 bilingual queries over the same corpus.",
    "env": [
      {
        "label": "Corpus",
        "value": "20k chunks"
      },
      {
        "label": "Languages",
        "value": "EN + SW"
      },
      {
        "label": "Models",
        "value": "3 open, 1 hosted"
      },
      {
        "label": "Queries",
        "value": "300"
      },
      {
        "label": "Metric",
        "value": "Recall@10"
      },
      {
        "label": "Hardware",
        "value": "1× L4"
      }
    ],
    "experiment": "Each model indexed the same corpus; queries evaluated in both languages.",
    "unit": "recall@10",
    "rows": [
      {
        "label": "Open model A",
        "value": 0.81,
        "pct": 81
      },
      {
        "label": "Hosted model",
        "value": 0.79,
        "pct": 79
      },
      {
        "label": "Open model B",
        "value": 0.74,
        "pct": 74
      },
      {
        "label": "Open model C",
        "value": 0.66,
        "pct": 66
      }
    ],
    "analysis": "The best open multilingual model matched the hosted option and was cheaper to run at volume.",
    "conclusion": "Benchmark on your own languages and documents before choosing.",
    "code": "for model in models:\n    index = build_index(corpus, model)\n    print(model, recall_at_k(index, queries, k=10))",
    "sortOrder": 6
  }
];

export const POSTS: Post[] = [
  {
    "slug": "why-most-ai-projects-fail-in-production",
    "track": "executive",
    "date": "2026-09-02",
    "readMinutes": 8,
    "title": "Why most AI projects fail in production",
    "tags": [
      "strategy",
      "production"
    ],
    "excerpt": "The model is rarely the problem. Here are the gaps between a good demo and a system people can depend on.",
    "body": "## The short version\nMost AI projects do not fail because the model is weak. They fail in the gap between a convincing demo and a system people can depend on every day.\n\n## Five gaps between a demo and production\n- **The problem was never measured.** Nobody agreed what \"better\" means, so nobody can prove the system helps.\n- **The demo used clean data.** Real documents are scanned, outdated, contradictory and permission-restricted.\n- **Nobody owns it after launch.** The project team moves on and quality slowly drifts.\n- **Cost was a surprise.** Usage grows and the monthly bill grows faster than the value.\n- **Failure was not designed.** When the AI is wrong, there is no fallback, no review step and no audit trail.\n\n## What successful teams do differently\nThey start from a business problem with a number attached, build an evaluation set with the people who will use the system, and fund operations from day one.\n\n> If you cannot say how you will measure it, you are not ready to build it.\n\n## A checklist for your next AI initiative\n- What decision or task will this improve, and by how much?\n- Who owns the system after launch?\n- How will quality be measured every week?\n- What happens when the AI is wrong?\n- What does one request cost, and who pays for it?"
  },
  {
    "slug": "building-rag-that-works",
    "track": "engineering",
    "date": "2026-08-11",
    "readMinutes": 12,
    "title": "Building RAG systems that actually work",
    "tags": [
      "rag",
      "retrieval"
    ],
    "excerpt": "Parsing, chunking, hybrid retrieval, re-ranking and evaluation: the unglamorous work behind reliable answers.",
    "body": "## Context\nRetrieval-augmented generation looks simple: embed documents, search, send the results to a model. In practice, almost every quality problem comes from the retrieval half.\n\n## Parse before you chunk\nTables, headings and clause numbers carry meaning. Layout-aware parsing and structure-based chunking beat fixed-size windows on real enterprise documents.\n\n## Use hybrid retrieval\nDense embeddings handle paraphrases; BM25 handles product codes, names and clause numbers. Fuse both, then re-rank.\n\n```\ndef retrieve(query, k=40):\n    dense = vector_search(query, k)\n    sparse = bm25_search(query, k)\n    fused = reciprocal_rank_fusion([dense, sparse])\n    return rerank(query, fused)[:8]\n```\n\n## Apply permissions inside the query\nFiltering after retrieval often leaves the model with nothing. Push access filters into the search itself.\n\n## Measure it\n- Recall@k on labelled questions for retrieval\n- Faithfulness and citation precision for answers\n- A regression gate in CI so quality never silently drops\n\n> Retrieval quality decides answer quality."
  },
  {
    "slug": "evaluating-llm-applications",
    "track": "engineering",
    "date": "2026-07-20",
    "readMinutes": 10,
    "title": "Evaluating LLM applications properly",
    "tags": [
      "evaluation",
      "testing"
    ],
    "excerpt": "A practical guide to test sets, metrics and regression gates for AI systems.",
    "body": "## Why evaluation comes first\nWithout an evaluation set, every prompt change is an opinion. With one, it is an experiment.\n\n## Build the test set with experts\nCollect real questions, write reference answers with the people who know the domain, and include cases the system should refuse.\n\n## Pick metrics that match the job\n- **Grounded Q&A:** faithfulness, answer relevance, citation precision\n- **Extraction:** field-level precision and recall\n- **Agents:** plan correctness, tool-call accuracy, safe failure\n- **Everything:** latency, cost per request\n\n## Calibrate your judge\nLLM-as-judge is useful only after you check it against human labels. Measure agreement on a sample before trusting it.\n\n```\nscore = evaluate(system, test_set)\nif score < baseline:\n    raise RegressionError(score)\n```\n\n## Make it continuous\nRun the suite on every change, track results per release, and add every production failure as a new test case."
  },
  {
    "slug": "deploying-open-weight-llms",
    "track": "engineering",
    "date": "2026-06-28",
    "readMinutes": 14,
    "title": "Deploying open-weight LLMs in production",
    "tags": [
      "infrastructure",
      "vllm"
    ],
    "excerpt": "Model choice, serving, quantization, scaling and cost: what it really takes to run your own models.",
    "body": "## Why run your own models\nData residency, predictable cost, and control over versions and latency are the usual reasons. The price is operational ownership.\n\n## Choose the model by task, not leaderboard\nBenchmark candidate models on your own tasks. A smaller model that is good enough often beats a larger one on cost and latency.\n\n## Serving\n- **vLLM** for high throughput with continuous batching and paged attention\n- **Quantization** (AWQ, GPTQ) for high-volume structured tasks after measuring quality loss\n- **Prefix caching** when requests share long system prompts\n\n## Platform essentials\n- An OpenAI-compatible gateway so teams migrate by changing a URL\n- Per-team keys, quotas and cost reports\n- Metrics for tokens, latency and GPU utilisation\n- Zero-downtime model rollouts\n\n> Measure quality per task before choosing quantization."
  },
  {
    "slug": "designing-voice-ai-agents",
    "track": "engineering",
    "date": "2026-05-30",
    "readMinutes": 9,
    "title": "Designing voice AI agents",
    "tags": [
      "voice",
      "latency"
    ],
    "excerpt": "Turn-taking, barge-in and latency budgets: why voice is a different product from chat.",
    "body": "## Voice is a different product\nIn chat, two seconds feels fine. On a phone call, it feels broken. Voice agents live or die on latency and turn-taking.\n\n## Budget every millisecond\nInstrument each stage: end of speech, final transcript, first model token, first audio byte. Turn detection is often the largest single cost.\n\n## Stream everything\nStream speech recognition, stream the model, and start speaking the first sentence while the rest is generated.\n\n## Design for interruption\nCallers interrupt. Stop playback immediately when they speak, and keep enough context to continue naturally.\n\n## Keep actions safe\n- Verify identity before account actions\n- Put tool calls behind a deterministic policy layer\n- Hand off to a human with a summary when confidence is low\n\n> Optimize turn-taking before optimizing the model."
  },
  {
    "slug": "building-an-enterprise-ai-strategy",
    "track": "executive",
    "date": "2026-04-18",
    "readMinutes": 7,
    "title": "Building an enterprise AI strategy",
    "tags": [
      "strategy",
      "leadership"
    ],
    "excerpt": "How to choose AI use cases, set expectations and measure value without chasing hype.",
    "body": "## Start from problems, not technology\nList the decisions and tasks that cost the most time or money today. AI is one possible tool for some of them.\n\n## Score the candidates\n- **Value:** how much better would the outcome be?\n- **Feasibility:** does the data exist and can it be used?\n- **Risk:** what happens when the system is wrong?\n- **Ownership:** who will run it after launch?\n\n## Choose two or three, and measure\nPick a small portfolio with clear success metrics. Fund evaluation and operations, not just the build.\n\n## Build capability, not dependency\nPair external expertise with internal teams so knowledge stays in the organization.\n\n> The goal is not to use AI. The goal is to solve the problem, and keep it solved."
  }
];

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    "key": "what-build",
    "title": "What I Build",
    "keywords": "build builds systems kind what does do areas expertise capabilities specialise specialize",
    "answer": "Wesley designs and builds production AI systems in six areas:\n\n- AI strategy & architecture\n- Enterprise AI applications (assistants, copilots, document AI)\n- RAG and agentic systems\n- AI evaluation & benchmarking\n- Voice AI agents\n- Open-weight LLM deployment and AI infrastructure\n\nThe common thread is taking AI from prototype to something people can depend on.",
    "sources": [
      {
        "label": "What I Build",
        "url": "/"
      },
      {
        "label": "Consulting",
        "url": "/consulting"
      }
    ]
  },
  {
    "key": "rag",
    "title": "Enterprise Knowledge Assistant",
    "keywords": "work rag retrieval augmented generation knowledge search documents vector embeddings chunk rerank re-rank hybrid bm25",
    "answer": "RAG is one of Wesley's core areas. The Enterprise Knowledge Assistant case study shows a permission-aware assistant with hybrid retrieval, re-ranking and cited answers.\n\nHis AI Lab also benchmarks hybrid retrieval: in that experiment, hybrid search plus re-ranking reached 0.90 recall@10 against 0.71 for dense-only (sample figures).",
    "sources": [
      {
        "label": "Enterprise Knowledge Assistant",
        "url": "/work/enterprise-knowledge-assistant"
      },
      {
        "label": "Hybrid retrieval (AI Lab)",
        "url": "/lab/hybrid-retrieval"
      },
      {
        "label": "Building RAG that works",
        "url": "/writing/building-rag-that-works"
      }
    ]
  },
  {
    "key": "evaluate",
    "title": "AI Evaluation service",
    "keywords": "work evaluate evaluation eval benchmark test testing quality measure metrics audit assess our system help hallucination",
    "answer": "Yes. AI evaluation is one of the services Wesley offers. A typical evaluation sprint covers:\n\n- A test set agreed with your domain experts\n- Quality metrics such as faithfulness and answer relevance\n- Latency, cost and safety checks\n- A prioritized list of fixes and a regression gate for CI\n\nIt usually takes two to three weeks. The contact page is the best place to start.",
    "sources": [
      {
        "label": "AI Evaluation service",
        "url": "/consulting"
      },
      {
        "label": "Evaluating LLM applications",
        "url": "/writing/evaluating-llm-applications"
      }
    ]
  },
  {
    "key": "philosophy",
    "title": "Philosophy",
    "keywords": "believe philosophy production demo demos approach think view principle opinion matters",
    "answer": "Wesley's philosophy is \"Production matters more than demos.\"\n\nA model or prototype is only one part of a working system. Success needs the whole path: problem, strategy, architecture, data, models, application, evaluation, infrastructure and production.",
    "sources": [
      {
        "label": "Philosophy",
        "url": "/"
      },
      {
        "label": "Why AI projects fail",
        "url": "/writing/why-most-ai-projects-fail-in-production"
      }
    ]
  },
  {
    "key": "infra",
    "title": "Private LLM Inference Platform",
    "keywords": "work open weight open-weight llm deploy deployment self host self-host hosting vllm gpu infrastructure quantization private on-prem premise kubernetes inference serving",
    "answer": "Wesley deploys open-weight models on infrastructure the client controls, using tools such as vLLM, Kubernetes and quantization.\n\nThe Private LLM Inference Platform case study covers routing, quotas, observability and cost reporting, and the AI Lab has serving benchmarks.",
    "sources": [
      {
        "label": "Private LLM Inference Platform",
        "url": "/work/private-llm-inference-platform"
      },
      {
        "label": "vLLM vs TGI (AI Lab)",
        "url": "/lab/vllm-vs-tgi-throughput"
      }
    ]
  },
  {
    "key": "voice",
    "title": "Voice Agent case study",
    "keywords": "work voice speech phone call calls telephony asr tts audio conversational agent latency",
    "answer": "Wesley builds real-time voice agents with streaming speech recognition, natural turn-taking, interruption support and clean human handoff.\n\nSee the Voice Agent case study and the voice latency experiment in the AI Lab.",
    "sources": [
      {
        "label": "Voice Agent case study",
        "url": "/work/voice-agent-customer-support"
      },
      {
        "label": "Voice latency budget",
        "url": "/lab/voice-latency-budget"
      }
    ]
  },
  {
    "key": "agents",
    "title": "Agentic Operations Copilot",
    "keywords": "work agent agents agentic autonomous workflow workflows tools tool calling automation copilot",
    "answer": "Wesley designs agentic systems with explicit plans, scoped tools and human approval before irreversible actions.\n\nThe Agentic Operations Copilot case study shows the approach: plans that are visible and testable, durable workflows and a full audit trail.",
    "sources": [
      {
        "label": "Agentic Operations Copilot",
        "url": "/work/agentic-operations-copilot"
      }
    ]
  },
  {
    "key": "engage",
    "title": "Consulting",
    "keywords": "hire engage engagement work with consult consulting price pricing cost rate process start how long project proposal",
    "answer": "Engagements follow seven steps: Discover, Assess, Design, Build, Evaluate, Deploy and Optimize.\n\nFormats range from 2–4 week advisory work and evaluation sprints to 6–16 week builds and workshops. Pricing is fixed-scope for advisory work and milestone-based for builds, confirmed in a written proposal.",
    "sources": [
      {
        "label": "Consulting",
        "url": "/consulting"
      },
      {
        "label": "Contact",
        "url": "/contact"
      }
    ]
  },
  {
    "key": "portfolio",
    "title": "Selected work",
    "keywords": "work projects project case studies study portfolio examples shipped built delivered past previous",
    "answer": "Wesley's case studies cover:\n\n- Enterprise Knowledge Assistant (RAG)\n- Contract Intelligence Pipeline (document AI)\n- Voice Agent for Customer Support\n- Private LLM Inference Platform (open-weight models)\n- Agentic Operations Copilot\n\nEach one covers the problem, architecture, decisions and tradeoffs, evaluation and results.",
    "sources": [
      {
        "label": "Selected work",
        "url": "/work"
      },
      {
        "label": "AI Lab",
        "url": "/lab"
      }
    ]
  },
  {
    "key": "contact",
    "title": "Contact",
    "keywords": "contact email reach talk call meeting available availability book touch",
    "answer": "The best way to reach Wesley is the contact form: describe the problem you're trying to solve, and he usually replies within two working days.\n\nYou can also email hello@wesleynyamosi.com or connect on LinkedIn.",
    "sources": [
      {
        "label": "Contact",
        "url": "/contact"
      }
    ]
  },
  {
    "key": "stack",
    "title": "Selected work",
    "keywords": "stack technologies tools languages python framework frameworks tech use",
    "answer": "Common tools in Wesley's work include Python, FastAPI, PostgreSQL with pgvector, vLLM, Kubernetes, Prometheus/Grafana, and observability tools for LLM tracing.\n\nEach case study lists the exact technologies used.",
    "sources": [
      {
        "label": "Selected work",
        "url": "/work"
      }
    ]
  },
  {
    "key": "training",
    "title": "Workshops & Training",
    "keywords": "workshop workshops training teach team course session executive leadership",
    "answer": "Yes. Wesley runs practical workshops for engineering teams (RAG, evaluation, deployment) and briefings for leadership on AI strategy, risk and value.",
    "sources": [
      {
        "label": "Workshops & Training",
        "url": "/consulting"
      }
    ]
  },
  {
    "key": "lab",
    "title": "AI Lab",
    "keywords": "lab experiments experiment research benchmarks prototypes",
    "answer": "The AI Lab is where Wesley publishes experiments, benchmarks, research notes, infrastructure tests and prototypes, each with the question, method, environment, results and conclusion.",
    "sources": [
      {
        "label": "AI Lab",
        "url": "/lab"
      }
    ]
  },
  {
    "key": "writing",
    "title": "Writing",
    "keywords": "writing articles blog posts read publish",
    "answer": "Wesley writes in two tracks: engineering (RAG, evaluation, deployment, voice) and executive (AI strategy, why projects fail). Browse them on the Writing page.",
    "sources": [
      {
        "label": "Writing",
        "url": "/writing"
      }
    ]
  },
  {
    "key": "about",
    "title": "About",
    "keywords": "who is wesley about background experience career bio himself",
    "answer": "Wesley Nyamosi is an AI engineer and consultant who designs and builds production-ready AI systems and applications that solve real business problems.\n\nThe About page covers his background and what he focuses on.",
    "sources": [
      {
        "label": "About",
        "url": "/about"
      }
    ]
  }
];
