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
 * Projects are Wesley's real work (docs/source-material.md). Lab entries and posts are SAMPLE CONTENT:
 * replace them with real work (or edit them later through the admin API).
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
                "voice-agent-customer-service",
                "Voice Agent for Customer Service",
                "Voice AI \u00b7 Agents",
                "voice",
                "voice",
                "2026",
                "Routine customer-service calls such as status checks, account changes and bookings wait in queues for human agents, while menu-driven phone systems cannot hold a natural conversation or act on an account safely.",
                "A voice agent that holds a natural phone conversation, resolves routine requests through tool calls after verifying the caller's identity, and hands off to a human with a summary when it cannot help.",
                p("voice-to-voice latency target", "< 1 s"),
                List.of(
                "Python",
                "ElevenLabs",
                "Voice cloning",
                "Streaming STT",
                "LLM function calling",
                "Turn detection",
                "WebSocket audio",
                "Per-turn tracing"),
                "A real-time voice agent for customer service: it listens with streaming speech recognition, reasons and acts through tool calls, and speaks with ElevenLabs streaming text-to-speech in a cloned brand voice, all inside an explicit latency budget.",
                "Built for a customer-service setting where callers expect to be understood the first time and to hear a reply without awkward silence. In voice, latency is part of correctness: a reply that takes noticeably longer than a second feels broken, and an agent that ignores an interruption feels worse. The agent is designed to act on customer accounts, which requires identity checks and hard limits on what the model is allowed to do.",
                List.of(
                "Voice-to-voice response inside a sub-second latency budget",
                "Account actions only after the caller's identity is verified",
                "Callers can interrupt the agent at any point (barge-in)",
                "A consistent brand voice, cloned only with the speaker's consent and usage rights",
                "Handoff to a human agent with a written call summary",
                "Every turn, tool call and policy decision logged for review"),
                List.of(
                "Audio stream",
                "Streaming ASR",
                "Turn detection",
                "LLM agent",
                "Tool layer",
                "ElevenLabs TTS",
                "Human handoff"),
                "Call audio is streamed in small frames to a streaming speech-to-text model, which returns partial transcripts while the caller is still speaking. A turn detector combines silence timing with the partial transcript to decide when the caller has finished, instead of waiting on a fixed silence timeout. The completed turn, the conversation history and a set of JSON function schemas (for example: verify identity, look up account, check order status, reschedule, open ticket, transfer to human) go to the LLM. The model proposes tool calls; a policy layer in code validates the arguments, confirms identity has been verified before any account action, and then executes or rejects the call. The reply is streamed sentence by sentence to ElevenLabs streaming text-to-speech in a cloned brand voice, so playback starts before the full response is written. If the caller speaks during playback, audio stops, the unspoken text is dropped from the history and the agent listens again. When a request is out of scope or the caller asks for a person, the call is transferred with a structured summary.",
                List.of(
                "Latency compounds across stages, so each one gets its own budget (about 200 ms endpointing, 100 ms ASR finalisation, 300 ms LLM first token, 200 ms TTS first audio, 100 ms transport) and the total has to stay under a second",
                "Callers pause mid-sentence: a short silence threshold cuts them off and a long one adds dead air, so end-of-turn detection uses the transcript as well as silence",
                "Tool calls add round trips mid-turn; a short spoken acknowledgement covers slow lookups so the line does not go silent",
                "Barge-in has to cancel TTS playback and pending LLM output together, and keep the history consistent with what the caller actually heard"),
                List.of(
                new Decision("The model proposes, code decides", "The LLM chooses tools and fills their arguments, but a deterministic policy layer enforces identity verification, argument validation and action limits before anything runs.", "More code per tool, in exchange for account actions that no prompt can talk the agent into."),
                new Decision("Stream every stage", "Speech recognition, the LLM and ElevenLabs text-to-speech all stream, so each stage starts on partial input from the previous one instead of waiting for it to finish.", "More complex state handling (partial transcripts, cancellation) for a much shorter time to first audio."),
                new Decision("Cloned brand voice with documented consent", "ElevenLabs voice cloning gives callers the same voice on every call. The voice is cloned only from a speaker who has given consent and agreed the usage rights.", "A consent and rights process before launch, and a dependency on one TTS provider for the voice.")),
                "Quality is measured in three layers. Components: word error rate for speech recognition on recorded test calls that include accents and background noise, and per-stage latency (p50 and p95) logged on every turn against the budget. Agent behaviour: a scripted scenario set covering routine requests, failed identity checks, ambiguous requests, interruptions and out-of-scope asks is replayed against the agent, checking that the right tool is called with valid arguments, that no account action runs without verification, and that handoff triggers when it should. Conversation quality: sampled calls are scored by reviewers for task completion, naturalness and the usefulness of handoff summaries.",
                List.of(
                p("voice-to-voice latency target", "< 1 s"),
                p("unverified account actions (target)", "0"),
                p("barge-in stop target", "< 200 ms"),
                p("handoffs with a call summary (target)", "100%")),
                List.of(
                "In voice, latency is a product requirement; it has to be budgeted per stage from the start, not optimised at the end",
                "Turn detection shapes how a conversation feels as much as the choice of model does",
                "Keeping authority in code rather than in the prompt is what makes a tool-calling agent testable"),
                List.of(),
                "## Architecture\n\n[[diagram:voice-architecture]]",
                true,
                1),
            new ProjectDto(
                "document-intelligence-retrieval",
                "Document Intelligence & Retrieval",
                "RAG \u00b7 Document AI",
                "rag",
                "doc",
                "2026",
                "Organisations keep critical knowledge in PDFs, scans, tables and long reports. Keyword search misses questions phrased differently from the source, and generic chatbots answer confidently without showing where an answer came from.",
                "Turns mixed-format documents into structured, searchable passages and answers questions with citations to the exact source, declining when the evidence is weak.",
                p("recall@10 target", "\u2265 0.9"),
                List.of(
                "Python",
                "OCR + layout parsing",
                "Structure-aware chunking",
                "Dense embeddings",
                "BM25",
                "Reciprocal rank fusion",
                "Cross-encoder re-ranking",
                "Citation checks",
                "Retrieval evaluation"),
                "A document intelligence and retrieval system: it turns unstructured documents into clean passages with metadata, retrieves them with hybrid search and re-ranking, and generates answers that cite their sources.",
                "Built for an organisation whose documents arrive in mixed quality: native PDFs, scanned pages, tables and multi-column layouts. Answers drawn from those documents have to be checkable, because a wrong figure or clause quoted with confidence costs more than no answer. The quality of the final answer depends on what reaches the model, so the work centres on parsing and retrieval.",
                List.of(
                "Handle native PDFs, scanned pages, tables and multi-column layouts",
                "Preserve document structure (sections, tables, page numbers) through chunking",
                "Every answer cites the passages and pages it used",
                "Match both paraphrased questions and exact terms such as codes, names and clause numbers",
                "Decline to answer when retrieved evidence is weak",
                "Retrieval and answer quality measured on a fixed test set"),
                List.of(
                "Ingestion",
                "OCR + layout",
                "Chunk + metadata",
                "Embed + index",
                "Hybrid retrieval",
                "Re-ranker",
                "Cited answer"),
                "Documents enter through an ingestion step that records source, version and a content hash, so unchanged files are not reprocessed. Native PDFs are parsed directly; scanned pages go through OCR, and a layout parser reconstructs reading order, headings, tables and multi-column text. Chunking follows that structure: sections and tables stay intact, long sections are split at paragraph boundaries with a small overlap, and each chunk carries its heading path, page numbers and extracted metadata such as document type, title and date. Chunks are embedded with an embedding model and stored in a vector store alongside a keyword (BM25) index. At query time both indexes are searched, the result lists are merged with reciprocal rank fusion, and a cross-encoder re-ranker scores the top candidates against the question. The highest-scoring passages go to the LLM with instructions to answer only from them and cite each claim. If the re-ranker scores fall below a threshold, the system returns the closest passages and states that it found no supported answer.",
                List.of(
                "Tables and multi-column pages lose their meaning when text is extracted in raw order; layout parsing restores reading order before chunking",
                "OCR errors on low-quality scans hurt keyword matching; dense retrieval compensates, and low-confidence pages are flagged",
                "Fixed-size chunks split clauses and tables mid-way; structure-aware chunking keeps units of meaning together",
                "The refusal threshold trades answer rate against unsupported answers and has to be tuned on the evaluation set"),
                List.of(
                new Decision("Hybrid retrieval instead of dense-only", "Dense embeddings handle paraphrase; keyword search catches exact identifiers that embeddings tend to blur. Fusing both covers each method's blind spots.", "Two indexes to build and keep in sync."),
                new Decision("Re-rank a wide candidate set", "First-stage retrieval casts a wide net; a cross-encoder reads each candidate together with the question and keeps only the best few for the prompt.", "Re-ranking latency on every query, in exchange for more relevant context and shorter prompts."),
                new Decision("Refuse instead of guess", "When evidence is weak, the system says so and links the closest passages instead of generating an answer.", "A lower answer rate, in exchange for answers users can verify.")),
                "Evaluation separates retrieval from generation. A test set of questions is written from the documents themselves, each labelled with the passages that answer it, and includes paraphrased questions, exact-term lookups, table questions, multi-part questions and questions with no answer in the corpus. Retrieval is scored with recall@k and mean reciprocal rank; generation with faithfulness (every claim supported by a cited passage), citation precision and correct refusal on unanswerable questions. Parsing quality is spot-checked against source pages, with a focus on tables and scans. The same set is rerun after any change to parsing, chunking, retrieval or prompts.",
                List.of(
                p("recall@10 target", "\u2265 0.9"),
                p("faithfulness target", "\u2265 0.9"),
                p("answers with citations (target)", "100%"),
                p("p95 answer latency target", "< 3 s")),
                List.of(
                "Most retrieval failures start in parsing; fixing extraction does more than changing the model",
                "Keyword search stays essential next to embeddings for identifiers and exact terms",
                "Scoring retrieval separately from generation shows which stage to fix"),
                List.of(),
                "## Architecture\n\n[[diagram:doc-ingestion]]\n\n[[diagram:doc-query]]",
                true,
                2),
            new ProjectDto(
                "local-rag-private-llm",
                "Local RAG on Private Infrastructure",
                "Private LLM \u00b7 RAG",
                "infra",
                "infra",
                "2026",
                "Organisations with regulatory restrictions or strict data-handling rules cannot send documents or prompts to external AI APIs, yet still need assistants that answer from their own data.",
                "A self-hosted RAG stack (an open-weight LLM served with vLLM, local embeddings and retrieval, guardrails and an evaluation pipeline) that runs entirely inside a controlled environment.",
                p("data leaving the environment (target)", "0"),
                List.of(
                "Python",
                "vLLM",
                "Open-weight LLM",
                "GPU VM",
                "Local embeddings",
                "Vector store",
                "Guardrails",
                "RAG evaluation"),
                "A retrieval-augmented generation system built end to end on private infrastructure: from provisioning a GPU virtual machine, through serving an open-weight model with vLLM, to retrieval, guardrails and an evaluation pipeline. Prompts, documents and outputs stay inside the environment.",
                "Built for an enterprise setting with data concerns and regulatory restrictions, where data-residency and confidentiality requirements rule out hosted model APIs. The goal was an LLM assistant over internal documents with full control over where data is stored, processed and logged. That moves the work from calling an API to owning the whole stack: hardware, model serving, retrieval, safety and quality measurement.",
                List.of(
                "All inference, embedding and retrieval run inside the controlled environment",
                "An OpenAI-compatible API so applications are not tied to one model",
                "Model sized to fit the available GPU memory with room for long contexts",
                "Input and output guardrails, including PII detection and grounding checks",
                "Answers grounded in retrieved internal documents, with citations",
                "Repeatable evaluation before any model, prompt or retrieval change ships"),
                List.of(
                "GPU VM",
                "vLLM server",
                "Open-weight LLM",
                "Embeddings + retrieval",
                "Guardrails",
                "Evaluation"),
                "The work started with infrastructure: a GPU virtual machine provisioned inside the controlled environment, with GPU drivers installed and outbound network access restricted. vLLM was then deployed on it as an OpenAI-compatible server, which provides continuous batching and efficient KV-cache memory management while letting applications use a standard client. Next, an open-weight model was loaded, chosen against the GPU memory available: model size, quantization level and maximum context length all compete for the same VRAM, so they were sized together. The retrieval pipeline came after that: internal documents are parsed and chunked, embedded with a locally hosted embedding model and stored in a vector store on the same network; each query retrieves the most relevant chunks, which are passed to the model with instructions to answer only from them and cite them. Guardrails wrap the model on both sides: input checks for personal data and prompt injection, output checks for leaked personal data and for grounding against the retrieved passages. Finally, an evaluation pipeline runs a fixed question set through the full system and scores retrieval and answer quality, so changes are measured rather than judged by impression.",
                List.of(
                "GPU memory is the binding constraint: weights, KV cache and concurrent requests share it, so a larger model or longer context means fewer simultaneous requests",
                "Quantization reduces memory and cost but can degrade answers, so its effect has to be checked on the evaluation set rather than assumed",
                "With no external services, every component (embeddings, safety checks, evaluation) also has to run locally within the same hardware budget",
                "Guardrails add latency to every request and must be tuned to block real issues without rejecting legitimate questions"),
                List.of(
                new Decision("vLLM as the inference engine", "vLLM serves open-weight models behind an OpenAI-compatible API with continuous batching and paged KV-cache management, which keeps throughput per GPU high and lets applications switch models by configuration.", "Ownership of GPU operations, upgrades and monitoring that a hosted API would otherwise cover."),
                new Decision("Size the model to the hardware", "Model size, quantization and context length were chosen together against the available VRAM, leaving headroom for the KV cache under concurrent load.", "A smaller or quantized model rather than the largest available, in exchange for stable latency and concurrency."),
                new Decision("Evaluation as a release gate", "The evaluation pipeline runs on every change to the model, prompts or retrieval, and results are compared with the previous run before a change is promoted.", "Building and maintaining a test set up front, before user-facing features.")),
                "The evaluation pipeline runs inside the same environment, so test data never leaves it either. A question set built from internal documents covers direct lookups, multi-document questions, questions with no answer in the corpus, and adversarial inputs such as prompt-injection attempts and requests for personal data. Retrieval is scored with recall@k against labelled source passages; answers are scored for faithfulness to the retrieved context, answer relevance and correct refusal; guardrails are scored on how often they block what they should and how often they wrongly block legitimate questions. Serving is measured separately: time to first token, tokens per second and p95 latency under concurrent load on the provisioned GPU.",
                List.of(
                p("data leaving the environment (target)", "0"),
                p("faithfulness target", "\u2265 0.9"),
                p("p95 time-to-first-token target", "< 1 s"),
                p("PII in outputs (target)", "0")),
                List.of(
                "Most local-LLM constraints trace back to GPU memory, so sizing belongs at the start, not after the model is chosen",
                "An OpenAI-compatible serving layer keeps the rest of the stack independent of any one model",
                "In a regulated setting, the evaluation pipeline doubles as evidence that the system behaves as intended"),
                List.of(),
                "## Architecture\n\n[[diagram:local-request-flow]]",
                true,
                3));
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
                "AI Engineering",
                "build builds systems kind what does do areas expertise capabilities specialise specialize focus",
                "Wesley is an early-career AI engineer. He works hands-on in four areas:\n\n- AI agents and RAG, including evaluation harnesses\n- Open-weight LLMs deployed locally\n- Inference engines such as vLLM and Ollama\n- AI strategy, cost and consulting: where AI is worth it, hosted APIs or self-hosted models, and predictable inference costs\n\nThe Work page shows three systems he built.",
                List.of(
                s("AI Engineering", "/"),
                s("Work", "/work"))),
            new KnowledgeDto(
                "rag",
                "Document Intelligence & Retrieval",
                "work rag retrieval augmented generation knowledge search documents document intelligence ocr parsing vector embeddings chunk rerank re-rank hybrid citations",
                "RAG is one of Wesley's core areas. The Document Intelligence & Retrieval case study walks through parsing and OCR, structure-aware chunking, hybrid retrieval, re-ranking and answers that cite their sources.",
                List.of(
                s("Document Intelligence & Retrieval", "/work/document-intelligence-retrieval"),
                s("Building RAG that works", "/blogs/building-rag-that-works"))),
            new KnowledgeDto(
                "evaluate",
                "Evaluation",
                "evaluate evaluation eval evals benchmark test testing quality measure metrics assess harness harnesses hallucination",
                "Evaluation is part of Wesley's agents and RAG work: he builds evaluation harnesses that check whether a system actually answers well, rather than trusting a demo. The Local RAG on Private Infrastructure case study includes an evaluation pipeline.\n\nIf you want to talk about evaluating your own system, email Wesley.",
                List.of(
                s("Local RAG on Private Infrastructure", "/work/local-rag-private-llm"),
                s("Contact", "/#contact"))),
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
                "Local RAG on Private Infrastructure",
                "work open weight open-weight llm local deploy deployment self host self-host hosting vllm gpu vm infrastructure quantization private on-prem premise inference serving regulated regulation data residency guardrails",
                "Wesley has built a local RAG stack on infrastructure the organisation controls. The Local RAG on Private Infrastructure case study goes from provisioning a GPU VM and serving a model with vLLM to the retrieval pipeline, guardrails and an evaluation pipeline, for organisations whose data cannot leave their environment.",
                List.of(
                s("Local RAG on Private Infrastructure", "/work/local-rag-private-llm"))),
            new KnowledgeDto(
                "voice",
                "Voice Agent for Customer Service",
                "work voice speech phone call calls telephony asr tts audio conversational agent latency elevenlabs cloning clone",
                "Wesley has built a real-time voice agent for customer service. The case study covers speech recognition, turn-taking and interruptions, tool calling, ElevenLabs speech and voice cloning, and the latency budget behind a natural conversation.",
                List.of(
                s("Voice Agent for Customer Service", "/work/voice-agent-customer-service"))),
            new KnowledgeDto(
                "agents",
                "Agents and tool calling",
                "work agent agents agentic autonomous workflow workflows tools tool calling function calling automation harness openclaw safe safety",
                "Wesley builds agents that call tools with the model proposing and code deciding: typed tool schemas, checks before any account action, and a clean handoff to a person. The Voice Agent for Customer Service case study shows how this works in a voice conversation.",
                List.of(
                s("Voice Agent for Customer Service", "/work/voice-agent-customer-service"))),
            new KnowledgeDto(
                "engage",
                "Strategy, cost & consulting",
                "hire engage engagement work with consult consulting consultant advice advisory strategy cost costs price pricing rate start project help",
                "Yes. Besides building systems, Wesley helps teams decide where AI is worth it, choose between hosted APIs and self-hosted models, and keep inference costs predictable.\n\nScope depends on the problem, so the best start is a short email describing what you're trying to solve.",
                List.of(
                s("Contact", "/#contact"))),
            new KnowledgeDto(
                "portfolio",
                "Selected work",
                "work projects project case studies portfolio examples built past previous",
                "Wesley's case studies cover:\n\n- Voice Agent for Customer Service (tool calling, ElevenLabs)\n- Document Intelligence & Retrieval (RAG)\n- Local RAG on Private Infrastructure (vLLM, guardrails, evaluation)\n\nEach one covers the problem, its context, the architecture and the lessons learned.",
                List.of(
                s("Selected work", "/work"))),
            new KnowledgeDto(
                "contact",
                "Contact",
                "contact email reach talk call meeting available availability book touch linkedin",
                "Email is the best way to reach Wesley: write to nyamosiwesley02@gmail.com describing the problem you're trying to solve.\n\nYou can also connect with him on LinkedIn.",
                List.of(
                s("Contact", "/#contact"))),
            new KnowledgeDto(
                "stack",
                "Tools and stack",
                "stack technologies tools languages python framework frameworks tech use skills",
                "Wesley works mainly in Python, with SQL and R. His AI work uses vLLM and Ollama for inference, open-weight models from Hugging Face, Docker, FastAPI, PyTorch and scikit-learn, and ElevenLabs for voice.\n\nEach case study describes the parts of the system it uses.",
                List.of(
                s("Selected work", "/work"))),
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
                "who is wesley about background experience career bio himself education degree university study statistics internship internships intern nita forage kenya",
                "Wesley Nyamosi is an early-career AI engineer based in Kenya. He has a BSc in Statistics from Jomo Kenyatta University of Agriculture and Technology (2023).\n\nHe completed two internships: Data Analyst Intern at NITA (2023) and Data Science Intern with Forage (2024). He now builds AI agents, RAG and local LLM systems; the Work page shows three of them.",
                List.of(
                s("Work", "/work")));
    }
}
