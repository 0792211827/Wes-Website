package com.WesPortfolio.config;

import java.util.List;

import com.WesPortfolio.dto.ContentDtos.Decision;
import com.WesPortfolio.dto.ContentDtos.KnowledgeDto;
import com.WesPortfolio.dto.ContentDtos.LabDto;
import com.WesPortfolio.dto.ContentDtos.LabRow;
import com.WesPortfolio.dto.ContentDtos.Pair;
import com.WesPortfolio.dto.ContentDtos.PostDto;
import com.WesPortfolio.dto.ContentDtos.ProjectDto;
import com.WesPortfolio.dto.ContentDtos.SourceLink;

/**
 * GENERATED starter content, inserted by {@link DataSeeder} the first time the API starts on an empty database.
 * It is the same content the Angular app ships as an offline fallback.
 * SAMPLE CONTENT: replace with Wesley's real work (or edit it later through the admin API).
 */
public final class SeedData {

    private SeedData() {
    }

    private static Pair p(String label, String value) {
        return new Pair(label, value);
    }

    private static SourceLink s(String label, String url) {
        return new SourceLink(label, url);
    }

    public static List<ProjectDto> projects() {
        return List.of(
            new ProjectDto(
                "enterprise-knowledge-assistant",
                "Enterprise Knowledge Assistant",
                "RAG & Knowledge Systems",
                "rag",
                "rag",
                "2026",
                "Staff spent hours searching policies, contracts and wikis spread across five systems, and answers were inconsistent.",
                "Grounded answers with citations in under two seconds, scoped to each user's document permissions.",
                p("time to answer", "-68%"),
                List.of(
                "Python",
                "FastAPI",
                "pgvector",
                "BM25",
                "Cross-encoder",
                "vLLM",
                "Langfuse"),
                "An internal assistant that answers questions from approved company knowledge, always cites its sources, and refuses when the evidence is not there.",
                "Knowledge lived in SharePoint, a legacy wiki, shared drives and two line-of-business systems. New staff took weeks to become productive and policy answers varied by who you asked. Leadership wanted AI, but compliance would not accept answers without provenance or that leaked documents across departments.",
                List.of(
                "Every answer cites the documents it used",
                "Respect existing document-level permissions",
                "p95 latency under 3 seconds",
                "Data stays inside the organization's cloud tenancy",
                "Measurable quality before rollout"),
                List.of(
                "Connectors",
                "Chunk + embed",
                "Hybrid index",
                "Re-ranker",
                "LLM",
                "Guardrails",
                "Cited answer"),
                "Connectors sync documents nightly and on change events. Documents are chunked by structure (headings, tables, clauses) rather than fixed size, embedded, and stored in PostgreSQL with pgvector next to a BM25 index. Queries run hybrid retrieval, a cross-encoder re-ranks the top 40 to 8, and permission filters are applied before anything reaches the model. Responses stream with inline citations that open the source passage.",
                List.of(
                "Tables in PDFs lost meaning when chunked naively; a layout-aware parser fixed most failures",
                "Permission filtering after retrieval returned empty context too often; filters moved into the query itself",
                "Users asked follow-ups that only made sense with history; a query-rewriting step resolved them"),
                List.of(
                new Decision("pgvector instead of a dedicated vector database", "The team already ran PostgreSQL. One datastore for metadata, permissions and vectors kept operations simple.", "Slightly lower recall at very large scale; acceptable below ~10M chunks."),
                new Decision("Open-weight model served with vLLM", "Data residency ruled out sending documents to an external API.", "GPU cost and on-call ownership in exchange for control."),
                new Decision("Refuse instead of guess", "When retrieval confidence was low the assistant says so and links the closest documents.", "Lower answer rate, much higher trust.")),
                "A 420-question test set was written with subject-matter experts and covered lookups, multi-hop questions, permission edge cases and questions that should be refused. Faithfulness, answer relevance and citation precision were tracked per release, and a regression gate in CI blocked any change that lowered faithfulness.",
                List.of(
                p("faithfulness", "0.93"),
                p("p95 latency", "1.8s"),
                p("time to answer", "-68%"),
                p("permission leaks in tests", "0")),
                List.of(
                "Retrieval quality decides answer quality; most gains came from parsing and re-ranking, not the model",
                "An evaluation set agreed with the business is the fastest way to end opinion-driven debates",
                "Refusals build trust when they still point people somewhere useful"),
                List.of(
                "Architecture notes",
                "Evaluation dataset schema",
                "Related article"),
                true,
                1),
            new ProjectDto(
                "contract-intelligence-pipeline",
                "Contract Intelligence Pipeline",
                "Enterprise AI \u00b7 Document AI",
                "enterprise",
                "doc",
                "2025",
                "Legal reviewed every supplier contract by hand to find renewal dates, liability caps and non-standard clauses.",
                "Structured extraction with confidence scores and a reviewer queue for anything uncertain.",
                p("review throughput", "4\u00d7"),
                List.of(
                "Python",
                "Layout parsing",
                "Structured outputs",
                "Celery",
                "PostgreSQL",
                "React"),
                "A pipeline that turns contracts into structured, reviewable data and flags clauses that deviate from the standard playbook.",
                "Hundreds of contracts a month, inconsistent templates and scanned documents. Missed renewal dates were costing money and the legal team had no time for proactive work.",
                List.of(
                "Field-level confidence on every extraction",
                "Human review for low-confidence fields",
                "Clause comparison against the company playbook",
                "Full audit trail"),
                List.of(
                "Upload",
                "OCR + layout",
                "Classifier",
                "Extractor",
                "Validator",
                "Review queue",
                "Contract DB"),
                "Documents go through OCR and layout analysis, are classified by contract type, then extracted with schema-constrained outputs. Deterministic validators check dates, currencies and cross-field consistency. Anything below the confidence threshold goes to a review queue where a lawyer confirms or corrects the value, and each correction is stored as evaluation data.",
                List.of(
                "Scanned contracts with stamps and signatures over text",
                "Clauses split across pages",
                "Calibrating confidence so the review queue stayed small but safe"),
                List.of(
                new Decision("Schema-constrained extraction", "Strict JSON schemas made outputs predictable and easy to validate.", "Less flexibility for unusual contract types."),
                new Decision("Human review as a feature", "Reviewers handle uncertainty and their corrections feed evaluation.", "Not fully automated, by design.")),
                "Field-level precision and recall on 300 labelled contracts, measured per contract type, plus review-queue rate and time-to-review.",
                List.of(
                p("field precision", "0.96"),
                p("throughput", "4\u00d7"),
                p("sent to review", "14%"),
                p("audit coverage", "100%")),
                List.of(
                "Confidence calibration matters more than raw accuracy",
                "Reviewer corrections are the best evaluation data you will get"),
                List.of(
                "Pipeline diagram",
                "Extraction schema example"),
                true,
                2),
            new ProjectDto(
                "voice-agent-customer-support",
                "Voice Agent for Customer Support",
                "Voice AI",
                "voice",
                "voice",
                "2025",
                "Call queues peaked at 20+ minutes for routine requests such as balance checks and appointment changes.",
                "A phone agent that resolves routine calls end to end and hands off to a human with full context.",
                p("median response", "780ms"),
                List.of(
                "Streaming ASR",
                "TTS",
                "WebRTC",
                "SIP",
                "Function calling",
                "Redis"),
                "A real-time voice agent that handles routine support calls, supports interruption, and escalates cleanly.",
                "Most calls were repetitive, but customers hated rigid IVR menus. The business needed natural conversation without risking wrong actions on accounts.",
                List.of(
                "Median response under one second",
                "Barge-in (customer can interrupt)",
                "Verified identity before any account action",
                "Warm transfer with a summary"),
                List.of(
                "Telephony",
                "Streaming ASR",
                "Turn detection",
                "LLM + tools",
                "Policy check",
                "Streaming TTS",
                "Caller"),
                "Audio streams through ASR with partial transcripts. A turn detector decides when the caller has finished. The model plans a reply and calls tools such as account lookup or rescheduling, which pass through a policy layer. TTS streams the first sentence while the rest is generated, and if the caller speaks, playback stops immediately.",
                List.of(
                "Latency stacked up across five services",
                "Turn detection on noisy lines",
                "Numbers and names misheard by ASR"),
                List.of(
                new Decision("Stream everything", "Every stage streams, so the first audio plays before the full response exists.", "More complex orchestration and error handling."),
                new Decision("Tool calls behind a policy layer", "The model proposes, deterministic code decides.", "Some flexibility lost for safety.")),
                "Latency budget per stage, task completion on scripted test calls, and blind human ratings of naturalness.",
                List.of(
                p("median response", "780ms"),
                p("calls fully resolved", "61%"),
                p("caller rating", "4.4/5"),
                p("wrong-action rate", "<2%")),
                List.of(
                "Latency is a product feature in voice",
                "Design the handoff first; it builds trust"),
                List.of(
                "Latency budget sheet",
                "Call flow diagram"),
                true,
                3),
            new ProjectDto(
                "private-llm-inference-platform",
                "Private LLM Inference Platform",
                "Open-Weight LLMs \u00b7 Infrastructure",
                "infra",
                "infra",
                "2026",
                "Several teams were calling external LLM APIs with sensitive data and unpredictable monthly costs.",
                "A shared, OpenAI-compatible inference platform for open-weight models on the organization's own GPUs.",
                p("cost per 1M tokens", "-57%"),
                List.of(
                "vLLM",
                "Kubernetes",
                "AWQ",
                "Prometheus",
                "Grafana",
                "LiteLLM"),
                "Self-hosted serving for open-weight models with routing, quotas, observability and cost reporting per team.",
                "Usage was growing fast, API spend was unpredictable, and data governance needed models that ran inside the organization's boundary.",
                List.of(
                "OpenAI-compatible API for easy migration",
                "Per-team keys, quotas and cost reports",
                "Autoscaling on GPU nodes",
                "Model rollouts without downtime"),
                List.of(
                "Clients",
                "API gateway",
                "Router",
                "vLLM pool",
                "GPU nodes",
                "Metrics",
                "Cost reports"),
                "Models are served with vLLM on Kubernetes GPU node pools. A gateway handles auth, quotas and routing between model sizes. Quantized variants serve high-volume, low-complexity traffic. Prometheus collects tokens, latency and GPU utilisation, and Grafana dashboards show cost per team.",
                List.of(
                "Cold starts when scaling large models",
                "Balancing throughput against latency with batching",
                "Choosing quantization without hurting quality"),
                List.of(
                new Decision("AWQ INT4 for the high-volume tier", "Benchmarks showed minimal quality loss for classification and extraction tasks.", "Kept FP16 for complex reasoning traffic."),
                new Decision("OpenAI-compatible API", "Teams migrated by changing a base URL.", "Tied to that API shape.")),
                "Throughput and latency under load tests, task-level quality comparisons against the previous API, and monthly cost per million tokens.",
                List.of(
                p("cost / 1M tokens", "-57%"),
                p("throughput", "2.6\u00d7"),
                p("availability", "99.9%"),
                p("teams migrated", "6")),
                List.of(
                "Measure quality per task before choosing quantization",
                "Cost visibility changes behaviour more than quotas"),
                List.of(
                "Helm chart notes",
                "Benchmark results (AI Lab)"),
                true,
                4),
            new ProjectDto(
                "agentic-operations-copilot",
                "Agentic Operations Copilot",
                "Agentic Systems",
                "agents",
                "agent",
                "2026",
                "Operations staff copied data between four internal systems to complete routine requests.",
                "An agent that drafts and executes multi-step workflows, with approval before any irreversible action.",
                p("handling time", "-41%"),
                List.of(
                "Tool calling",
                "State machine",
                "Temporal",
                "Python",
                "Audit log"),
                "A copilot that plans multi-step tasks across internal systems and asks a human before anything is changed.",
                "Routine but multi-system tasks took most of the team's day. Full automation was not acceptable to the business.",
                List.of(
                "Every write action approved by a person",
                "Full audit trail of plans and tool calls",
                "Recoverable on failure",
                "Scoped permissions per tool"),
                List.of(
                "Request",
                "Planner",
                "Tool registry",
                "Approval step",
                "Executor",
                "Audit log",
                "Result"),
                "The planner produces an explicit plan as structured steps. Read-only tools run directly, while write tools pause for approval. Execution runs as a durable workflow so failures can resume, and every step is logged.",
                List.of(
                "Plans that looped or over-reached",
                "Tool errors mid-workflow",
                "Keeping approval friction low"),
                List.of(
                new Decision("Explicit plans, not free-running loops", "Plans are visible, reviewable and testable.", "Less autonomy, more predictability."),
                new Decision("Durable workflows", "Long tasks survive restarts and failures.", "An extra moving part to operate.")),
                "Scenario test suite of 150 tasks scored for plan correctness, tool-call accuracy and safe failure.",
                List.of(
                p("handling time", "-41%"),
                p("plan correctness", "92%"),
                p("unapproved writes", "0"),
                p("test scenarios", "150")),
                List.of(
                "Agents need boundaries more than intelligence",
                "Approval UX decides adoption"),
                List.of(
                "Agent design notes"),
                false,
                5));
    }

    public static List<LabDto> lab() {
        return List.of(
            new LabDto(
                "vllm-vs-tgi-throughput",
                "Benchmark",
                "c-teal",
                "2026-08-14",
                "complete",
                "vLLM vs TGI: throughput under concurrent load",
                "Which serving engine gives more tokens per second for a 8B model at 64 concurrent requests on one GPU?",
                "Same model weights, same GPU, synthetic traffic with realistic prompt lengths (p50 900 tokens) and 256-token outputs. Five runs per configuration.",
                List.of(
                p("GPU", "1\u00d7 H100 80GB"),
                p("Model", "8B instruct, FP16"),
                p("Concurrency", "64"),
                p("Prompt p50", "900 tokens"),
                p("Output", "256 tokens"),
                p("Runs", "5 per engine")),
                "Load generated with a custom async client that records time-to-first-token, inter-token latency and total throughput. Engines were warmed up before each run.",
                "tokens/s",
                List.of(
                new LabRow("vLLM", 2840.0, 100),
                new LabRow("TGI", 2310.0, 81),
                new LabRow("Baseline (HF)", 610.0, 21)),
                "vLLM led on throughput thanks to continuous batching and paged attention. TGI had a slightly better time-to-first-token at low concurrency, but the gap closed above 32 concurrent requests.",
                "For high-concurrency internal platforms, vLLM is the default choice. Re-test when traffic is mostly short prompts.",
                "# load test (simplified)\nimport asyncio, time\nfrom client import stream_completion\n\nasync def run(n=64):\n    start = time.perf_counter()\n    results = await asyncio.gather(*[stream_completion(p) for p in prompts[:n]])\n    tokens = sum(r.output_tokens for r in results)\n    return tokens / (time.perf_counter() - start)",
                1),
            new LabDto(
                "awq-int4-vs-fp16",
                "Experiment",
                "c-amber",
                "2026-07-02",
                "complete",
                "AWQ INT4 vs FP16: what quality do you lose?",
                "Does 4-bit AWQ quantization hurt quality on real enterprise tasks, or only on leaderboards?",
                "Three internal-style task sets (extraction, classification, grounded Q&A) scored against references, comparing FP16 and AWQ INT4 versions of the same model.",
                List.of(
                p("GPU", "1\u00d7 L40S 48GB"),
                p("Model", "14B instruct"),
                p("Variants", "FP16 / AWQ INT4"),
                p("Tasks", "3 sets, 900 items"),
                p("Scoring", "Exact match + judge"),
                p("Seed", "Fixed")),
                "Each item was run once per variant with temperature 0. Grounded Q&A was scored for faithfulness by an LLM judge calibrated against 100 human labels.",
                "score",
                List.of(
                new LabRow("FP16 extraction", 0.94, 94),
                new LabRow("INT4 extraction", 0.93, 93),
                new LabRow("FP16 grounded QA", 0.89, 89),
                new LabRow("INT4 grounded QA", 0.85, 85)),
                "Extraction and classification were almost unaffected. Grounded Q&A dropped four points, mostly on multi-hop questions.",
                "Use INT4 for high-volume structured tasks; keep FP16 for complex reasoning.",
                "variants = {\"fp16\": load(\"model-14b\"), \"int4\": load(\"model-14b-awq\")}\nfor name, model in variants.items():\n    score = evaluate(model, tasks, temperature=0)\n    print(name, score)",
                2),
            new LabDto(
                "hybrid-retrieval",
                "Research",
                "c-sky",
                "2026-06-10",
                "complete",
                "Hybrid retrieval: when does BM25 still win?",
                "How much does adding BM25 and a re-ranker improve recall over dense-only retrieval on enterprise documents?",
                "Recall@10 on 500 labelled queries across policies, contracts and technical docs.",
                List.of(
                p("Corpus", "48k chunks"),
                p("Embeddings", "3 models"),
                p("Sparse", "BM25"),
                p("Re-ranker", "Cross-encoder"),
                p("Queries", "500 labelled"),
                p("Metric", "Recall@10")),
                "Dense-only, BM25-only, reciprocal rank fusion, and fusion plus re-ranking, each run against the same query set.",
                "recall@10",
                List.of(
                new LabRow("Dense only", 0.71, 71),
                new LabRow("BM25 only", 0.64, 64),
                new LabRow("Hybrid (RRF)", 0.82, 82),
                new LabRow("Hybrid + re-rank", 0.9, 90)),
                "BM25 won on queries with product codes, clause numbers and exact names. Fusion captured both, and re-ranking added the final lift.",
                "Hybrid plus re-ranking should be the default for enterprise RAG.",
                "def hybrid(query, k=40):\n    dense = vector_search(query, k)\n    sparse = bm25_search(query, k)\n    fused = reciprocal_rank_fusion([dense, sparse])\n    return rerank(query, fused)[:10]",
                3),
            new LabDto(
                "kv-cache-prefix-reuse",
                "Infrastructure",
                "c-violet",
                "2026-05-21",
                "in progress",
                "Prefix caching for long system prompts",
                "How much latency does automatic prefix caching save when every request shares a 3k-token system prompt?",
                "Same traffic with prefix caching on and off; measure time-to-first-token.",
                List.of(
                p("GPU", "1\u00d7 H100 80GB"),
                p("Engine", "vLLM"),
                p("Shared prefix", "3,000 tokens"),
                p("Requests", "2,000"),
                p("Concurrency", "32"),
                p("Metric", "TTFT p50")),
                "Replay of production-shaped traffic with and without automatic prefix caching enabled.",
                "ms TTFT",
                List.of(
                new LabRow("Caching off", 420.0, 100),
                new LabRow("Caching on", 140.0, 33)),
                "Time-to-first-token dropped by two thirds. Memory pressure increased slightly at peak concurrency.",
                "Turn it on for assistants with long, stable system prompts. Further tests on multi-tenant traffic are in progress.",
                "llm = LLM(model=MODEL, enable_prefix_caching=True)\n# measure time-to-first-token over replayed traffic",
                4),
            new LabDto(
                "voice-latency-budget",
                "Prototype",
                "c-rose",
                "2026-04-08",
                "complete",
                "Where do the milliseconds go in a voice agent?",
                "Which stage of a streaming voice pipeline dominates response latency?",
                "Instrumented every stage of a prototype pipeline over 300 test calls.",
                List.of(
                p("Transport", "WebRTC"),
                p("ASR", "Streaming"),
                p("LLM", "8B, vLLM"),
                p("TTS", "Streaming"),
                p("Calls", "300"),
                p("Metric", "Median ms")),
                "Timestamps recorded at end of speech, final transcript, first LLM token, first audio byte and playback start.",
                "ms",
                List.of(
                new LabRow("Turn detection", 220.0, 100),
                new LabRow("ASR final", 110.0, 50),
                new LabRow("LLM first token", 190.0, 86),
                new LabRow("TTS first audio", 160.0, 73),
                new LabRow("Network", 100.0, 45)),
                "Turn detection was the largest single cost. Tuning silence thresholds saved more than switching models.",
                "Optimize turn-taking before optimizing the model.",
                "stages = [\"eos\", \"asr_final\", \"llm_first\", \"tts_first\", \"playback\"]\nlatency = {s: median(t[s] - t[prev]) for prev, s in zip(stages, stages[1:])}",
                5),
            new LabDto(
                "embedding-model-comparison",
                "Benchmark",
                "c-teal",
                "2026-03-15",
                "complete",
                "Embedding models on multilingual business documents",
                "Which embedding model retrieves best on English and Swahili business documents?",
                "Recall@10 on 300 bilingual queries over the same corpus.",
                List.of(
                p("Corpus", "20k chunks"),
                p("Languages", "EN + SW"),
                p("Models", "3 open, 1 hosted"),
                p("Queries", "300"),
                p("Metric", "Recall@10"),
                p("Hardware", "1\u00d7 L4")),
                "Each model indexed the same corpus; queries evaluated in both languages.",
                "recall@10",
                List.of(
                new LabRow("Open model A", 0.81, 81),
                new LabRow("Hosted model", 0.79, 79),
                new LabRow("Open model B", 0.74, 74),
                new LabRow("Open model C", 0.66, 66)),
                "The best open multilingual model matched the hosted option and was cheaper to run at volume.",
                "Benchmark on your own languages and documents before choosing.",
                "for model in models:\n    index = build_index(corpus, model)\n    print(model, recall_at_k(index, queries, k=10))",
                6));
    }

    public static List<PostDto> posts() {
        return List.of(
            new PostDto(
                "why-most-ai-projects-fail-in-production",
                "executive",
                "2026-09-02",
                8,
                "Why most AI projects fail in production",
                List.of(
                "strategy",
                "production"),
                "The model is rarely the problem. Here are the gaps between a good demo and a system people can depend on.",
                "## The short version\nMost AI projects do not fail because the model is weak. They fail in the gap between a convincing demo and a system people can depend on every day.\n\n## Five gaps between a demo and production\n- **The problem was never measured.** Nobody agreed what \"better\" means, so nobody can prove the system helps.\n- **The demo used clean data.** Real documents are scanned, outdated, contradictory and permission-restricted.\n- **Nobody owns it after launch.** The project team moves on and quality slowly drifts.\n- **Cost was a surprise.** Usage grows and the monthly bill grows faster than the value.\n- **Failure was not designed.** When the AI is wrong, there is no fallback, no review step and no audit trail.\n\n## What successful teams do differently\nThey start from a business problem with a number attached, build an evaluation set with the people who will use the system, and fund operations from day one.\n\n> If you cannot say how you will measure it, you are not ready to build it.\n\n## A checklist for your next AI initiative\n- What decision or task will this improve, and by how much?\n- Who owns the system after launch?\n- How will quality be measured every week?\n- What happens when the AI is wrong?\n- What does one request cost, and who pays for it?"),
            new PostDto(
                "building-rag-that-works",
                "engineering",
                "2026-08-11",
                12,
                "Building RAG systems that actually work",
                List.of(
                "rag",
                "retrieval"),
                "Parsing, chunking, hybrid retrieval, re-ranking and evaluation: the unglamorous work behind reliable answers.",
                "## Context\nRetrieval-augmented generation looks simple: embed documents, search, send the results to a model. In practice, almost every quality problem comes from the retrieval half.\n\n## Parse before you chunk\nTables, headings and clause numbers carry meaning. Layout-aware parsing and structure-based chunking beat fixed-size windows on real enterprise documents.\n\n## Use hybrid retrieval\nDense embeddings handle paraphrases; BM25 handles product codes, names and clause numbers. Fuse both, then re-rank.\n\n```\ndef retrieve(query, k=40):\n    dense = vector_search(query, k)\n    sparse = bm25_search(query, k)\n    fused = reciprocal_rank_fusion([dense, sparse])\n    return rerank(query, fused)[:8]\n```\n\n## Apply permissions inside the query\nFiltering after retrieval often leaves the model with nothing. Push access filters into the search itself.\n\n## Measure it\n- Recall@k on labelled questions for retrieval\n- Faithfulness and citation precision for answers\n- A regression gate in CI so quality never silently drops\n\n> Retrieval quality decides answer quality."),
            new PostDto(
                "evaluating-llm-applications",
                "engineering",
                "2026-07-20",
                10,
                "Evaluating LLM applications properly",
                List.of(
                "evaluation",
                "testing"),
                "A practical guide to test sets, metrics and regression gates for AI systems.",
                "## Why evaluation comes first\nWithout an evaluation set, every prompt change is an opinion. With one, it is an experiment.\n\n## Build the test set with experts\nCollect real questions, write reference answers with the people who know the domain, and include cases the system should refuse.\n\n## Pick metrics that match the job\n- **Grounded Q&A:** faithfulness, answer relevance, citation precision\n- **Extraction:** field-level precision and recall\n- **Agents:** plan correctness, tool-call accuracy, safe failure\n- **Everything:** latency, cost per request\n\n## Calibrate your judge\nLLM-as-judge is useful only after you check it against human labels. Measure agreement on a sample before trusting it.\n\n```\nscore = evaluate(system, test_set)\nif score < baseline:\n    raise RegressionError(score)\n```\n\n## Make it continuous\nRun the suite on every change, track results per release, and add every production failure as a new test case."),
            new PostDto(
                "deploying-open-weight-llms",
                "engineering",
                "2026-06-28",
                14,
                "Deploying open-weight LLMs in production",
                List.of(
                "infrastructure",
                "vllm"),
                "Model choice, serving, quantization, scaling and cost: what it really takes to run your own models.",
                "## Why run your own models\nData residency, predictable cost, and control over versions and latency are the usual reasons. The price is operational ownership.\n\n## Choose the model by task, not leaderboard\nBenchmark candidate models on your own tasks. A smaller model that is good enough often beats a larger one on cost and latency.\n\n## Serving\n- **vLLM** for high throughput with continuous batching and paged attention\n- **Quantization** (AWQ, GPTQ) for high-volume structured tasks after measuring quality loss\n- **Prefix caching** when requests share long system prompts\n\n## Platform essentials\n- An OpenAI-compatible gateway so teams migrate by changing a URL\n- Per-team keys, quotas and cost reports\n- Metrics for tokens, latency and GPU utilisation\n- Zero-downtime model rollouts\n\n> Measure quality per task before choosing quantization."),
            new PostDto(
                "designing-voice-ai-agents",
                "engineering",
                "2026-05-30",
                9,
                "Designing voice AI agents",
                List.of(
                "voice",
                "latency"),
                "Turn-taking, barge-in and latency budgets: why voice is a different product from chat.",
                "## Voice is a different product\nIn chat, two seconds feels fine. On a phone call, it feels broken. Voice agents live or die on latency and turn-taking.\n\n## Budget every millisecond\nInstrument each stage: end of speech, final transcript, first model token, first audio byte. Turn detection is often the largest single cost.\n\n## Stream everything\nStream speech recognition, stream the model, and start speaking the first sentence while the rest is generated.\n\n## Design for interruption\nCallers interrupt. Stop playback immediately when they speak, and keep enough context to continue naturally.\n\n## Keep actions safe\n- Verify identity before account actions\n- Put tool calls behind a deterministic policy layer\n- Hand off to a human with a summary when confidence is low\n\n> Optimize turn-taking before optimizing the model."),
            new PostDto(
                "building-an-enterprise-ai-strategy",
                "executive",
                "2026-04-18",
                7,
                "Building an enterprise AI strategy",
                List.of(
                "strategy",
                "leadership"),
                "How to choose AI use cases, set expectations and measure value without chasing hype.",
                "## Start from problems, not technology\nList the decisions and tasks that cost the most time or money today. AI is one possible tool for some of them.\n\n## Score the candidates\n- **Value:** how much better would the outcome be?\n- **Feasibility:** does the data exist and can it be used?\n- **Risk:** what happens when the system is wrong?\n- **Ownership:** who will run it after launch?\n\n## Choose two or three, and measure\nPick a small portfolio with clear success metrics. Fund evaluation and operations, not just the build.\n\n## Build capability, not dependency\nPair external expertise with internal teams so knowledge stays in the organization.\n\n> The goal is not to use AI. The goal is to solve the problem, and keep it solved."));
    }

    public static List<KnowledgeDto> knowledge() {
        return List.of(
            new KnowledgeDto(
                "what-build",
                "What I Build",
                "build builds systems kind what does do areas expertise capabilities specialise specialize",
                "Wesley designs and builds production AI systems in six areas:\n\n- AI strategy & architecture\n- Enterprise AI applications (assistants, copilots, document AI)\n- RAG and agentic systems\n- AI evaluation & benchmarking\n- Voice AI agents\n- Open-weight LLM deployment and AI infrastructure\n\nThe common thread is taking AI from prototype to something people can depend on.",
                List.of(
                s("What I Build", "/"))),
            new KnowledgeDto(
                "rag",
                "Enterprise Knowledge Assistant",
                "work rag retrieval augmented generation knowledge search documents vector embeddings chunk rerank re-rank hybrid bm25",
                "RAG is one of Wesley's core areas. The Enterprise Knowledge Assistant case study shows a permission-aware assistant with hybrid retrieval, re-ranking and cited answers.",
                List.of(
                s("Enterprise Knowledge Assistant", "/work/enterprise-knowledge-assistant"),
                s("Building RAG that works", "/blogs/building-rag-that-works"))),
            new KnowledgeDto(
                "evaluate",
                "AI Evaluation service",
                "work evaluate evaluation eval benchmark test testing quality measure metrics audit assess our system help hallucination",
                "Yes. AI evaluation is one of the services Wesley offers. A typical evaluation sprint covers:\n\n- A test set agreed with your domain experts\n- Quality metrics such as faithfulness and answer relevance\n- Latency, cost and safety checks\n- A prioritized list of fixes and a regression gate for CI\n\nIt usually takes two to three weeks. A short email describing the problem is the best place to start.",
                List.of(
                s("Contact", "/contact"),
                s("Evaluating LLM applications", "/blogs/evaluating-llm-applications"))),
            new KnowledgeDto(
                "philosophy",
                "Philosophy",
                "believe philosophy production demo demos approach think view principle opinion matters",
                "Wesley's philosophy is \"Production matters more than demos.\"\n\nA model or prototype is only one part of a working system. Success needs the whole path: problem, strategy, architecture, data, models, application, evaluation, infrastructure and production.",
                List.of(
                s("Philosophy", "/"),
                s("Why AI projects fail", "/blogs/why-most-ai-projects-fail-in-production"))),
            new KnowledgeDto(
                "infra",
                "Private LLM Inference Platform",
                "work open weight open-weight llm deploy deployment self host self-host hosting vllm gpu infrastructure quantization private on-prem premise kubernetes inference serving",
                "Wesley deploys open-weight models on infrastructure the client controls, using tools such as vLLM, Kubernetes and quantization.\n\nThe Private LLM Inference Platform case study covers routing, quotas, observability and cost reporting.",
                List.of(
                s("Private LLM Inference Platform", "/work/private-llm-inference-platform"))),
            new KnowledgeDto(
                "voice",
                "Voice Agent case study",
                "work voice speech phone call calls telephony asr tts audio conversational agent latency",
                "Wesley builds real-time voice agents with streaming speech recognition, natural turn-taking, interruption support and clean human handoff.\n\nSee the Voice Agent case study.",
                List.of(
                s("Voice Agent case study", "/work/voice-agent-customer-support"))),
            new KnowledgeDto(
                "agents",
                "Agentic Operations Copilot",
                "work agent agents agentic autonomous workflow workflows tools tool calling automation copilot",
                "Wesley designs agentic systems with explicit plans, scoped tools and human approval before irreversible actions.\n\nThe Agentic Operations Copilot case study shows the approach: plans that are visible and testable, durable workflows and a full audit trail.",
                List.of(
                s("Agentic Operations Copilot", "/work/agentic-operations-copilot"))),
            new KnowledgeDto(
                "engage",
                "Working together",
                "hire engage engagement work with consult consulting price pricing cost rate process start how long project proposal",
                "Engagements follow seven steps: Discover, Assess, Design, Build, Evaluate, Deploy and Optimize.\n\nFormats range from 2\u20134 week advisory work and evaluation sprints to 6\u201316 week builds and workshops. Pricing is fixed-scope for advisory work and milestone-based for builds, confirmed in a written proposal.",
                List.of(
                s("Contact", "/contact"))),
            new KnowledgeDto(
                "portfolio",
                "Selected work",
                "work projects project case studies study portfolio examples shipped built delivered past previous",
                "Wesley's case studies cover:\n\n- Enterprise Knowledge Assistant (RAG)\n- Contract Intelligence Pipeline (document AI)\n- Voice Agent for Customer Support\n- Private LLM Inference Platform (open-weight models)\n- Agentic Operations Copilot\n\nEach one covers the problem, architecture, decisions and tradeoffs, evaluation and results.",
                List.of(
                s("Selected work", "/work"))),
            new KnowledgeDto(
                "contact",
                "Contact",
                "contact email reach talk call meeting available availability book touch",
                "The best way to reach Wesley is email: write to nyamosiwesley02@gmail.com describing the problem you're trying to solve, and he usually replies within two working days.\n\nYou can also connect on LinkedIn.",
                List.of(
                s("Contact", "/contact"))),
            new KnowledgeDto(
                "stack",
                "Selected work",
                "stack technologies tools languages python framework frameworks tech use",
                "Common tools in Wesley's work include Python, FastAPI, PostgreSQL with pgvector, vLLM, Kubernetes, Prometheus/Grafana, and observability tools for LLM tracing.\n\nEach case study lists the exact technologies used.",
                List.of(
                s("Selected work", "/work"))),
            new KnowledgeDto(
                "training",
                "Workshops & Training",
                "workshop workshops training teach team course session executive leadership",
                "Yes. Wesley runs practical workshops for engineering teams (RAG, evaluation, deployment) and briefings for leadership on AI strategy, risk and value.",
                List.of(
                s("Contact", "/contact"))),
            new KnowledgeDto(
                "writing",
                "Blogs",
                "blogs blog writing articles posts read publish",
                "Wesley writes in two tracks: engineering (RAG, evaluation, deployment, voice) and executive (AI strategy, why projects fail). Browse them on the Blogs page.",
                List.of(
                s("Blogs", "/blogs"))),
            new KnowledgeDto(
                "about",
                "About",
                "who is wesley about background experience career bio himself",
                "Wesley Nyamosi is an AI engineer and consultant who designs and builds production-ready AI systems and applications that solve real business problems.\n\nThe Work page shows the kinds of systems he builds.",
                List.of(
                s("Work", "/work"))));
    }
}
