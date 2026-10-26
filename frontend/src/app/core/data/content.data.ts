// GENERATED from the shared content source (same data the API seeds into Postgres).
// Projects are Wesley's real work (docs/source-material.md). LAB and POSTS are SAMPLE CONTENT: replace them.
import { KnowledgeEntry, LabEntry, Post, Project } from '../models';

export const PROJECTS: Project[] = [
  {
    "slug": "voice-agent-customer-service",
    "title": "Voice Agent for Customer Service",
    "category": "Voice AI · Agents",
    "cat": "voice",
    "art": "voice",
    "year": "2026",
    "problem": "Routine customer-service calls such as status checks, account changes and bookings wait in queues for human agents, while menu-driven phone systems cannot hold a natural conversation or act on an account safely.",
    "outcome": "A voice agent that holds a natural phone conversation, resolves routine requests through tool calls after verifying the caller's identity, and hands off to a human with a summary when it cannot help.",
    "metric": {
      "label": "voice-to-voice latency target",
      "value": "< 1 s"
    },
    "tech": [
      "Python",
      "ElevenLabs",
      "Voice cloning",
      "Streaming STT",
      "LLM function calling",
      "Turn detection",
      "WebSocket audio",
      "Per-turn tracing"
    ],
    "overview": "A real-time voice agent for customer service: it listens with streaming speech recognition, reasons and acts through tool calls, and speaks with ElevenLabs streaming text-to-speech in a cloned brand voice, all inside an explicit latency budget.",
    "context": "Built for a customer-service setting where callers expect to be understood the first time and to hear a reply without awkward silence. In voice, latency is part of correctness: a reply that takes noticeably longer than a second feels broken, and an agent that ignores an interruption feels worse. The agent is designed to act on customer accounts, which requires identity checks and hard limits on what the model is allowed to do.",
    "requirements": [
      "Voice-to-voice response inside a sub-second latency budget",
      "Account actions only after the caller's identity is verified",
      "Callers can interrupt the agent at any point (barge-in)",
      "A consistent brand voice, cloned only with the speaker's consent and usage rights",
      "Handoff to a human agent with a written call summary",
      "Every turn, tool call and policy decision logged for review"
    ],
    "arch": [
      "Audio stream",
      "Streaming ASR",
      "Turn detection",
      "LLM agent",
      "Tool layer",
      "ElevenLabs TTS",
      "Human handoff"
    ],
    "implementation": "Call audio is streamed in small frames to a streaming speech-to-text model, which returns partial transcripts while the caller is still speaking. A turn detector combines silence timing with the partial transcript to decide when the caller has finished, instead of waiting on a fixed silence timeout. The completed turn, the conversation history and a set of JSON function schemas (for example: verify identity, look up account, check order status, reschedule, open ticket, transfer to human) go to the LLM. The model proposes tool calls; a policy layer in code validates the arguments, confirms identity has been verified before any account action, and then executes or rejects the call. The reply is streamed sentence by sentence to ElevenLabs streaming text-to-speech in a cloned brand voice, so playback starts before the full response is written. If the caller speaks during playback, audio stops, the unspoken text is dropped from the history and the agent listens again. When a request is out of scope or the caller asks for a person, the call is transferred with a structured summary.",
    "challenges": [
      "Latency compounds across stages, so each one gets its own budget (about 200 ms endpointing, 100 ms ASR finalisation, 300 ms LLM first token, 200 ms TTS first audio, 100 ms transport) and the total has to stay under a second",
      "Callers pause mid-sentence: a short silence threshold cuts them off and a long one adds dead air, so end-of-turn detection uses the transcript as well as silence",
      "Tool calls add round trips mid-turn; a short spoken acknowledgement covers slow lookups so the line does not go silent",
      "Barge-in has to cancel TTS playback and pending LLM output together, and keep the history consistent with what the caller actually heard"
    ],
    "decisions": [
      {
        "title": "The model proposes, code decides",
        "body": "The LLM chooses tools and fills their arguments, but a deterministic policy layer enforces identity verification, argument validation and action limits before anything runs.",
        "tradeoff": "More code per tool, in exchange for account actions that no prompt can talk the agent into."
      },
      {
        "title": "Stream every stage",
        "body": "Speech recognition, the LLM and ElevenLabs text-to-speech all stream, so each stage starts on partial input from the previous one instead of waiting for it to finish.",
        "tradeoff": "More complex state handling (partial transcripts, cancellation) for a much shorter time to first audio."
      },
      {
        "title": "Cloned brand voice with documented consent",
        "body": "ElevenLabs voice cloning gives callers the same voice on every call. The voice is cloned only from a speaker who has given consent and agreed the usage rights.",
        "tradeoff": "A consent and rights process before launch, and a dependency on one TTS provider for the voice."
      }
    ],
    "evaluation": "Quality is measured in three layers. Components: word error rate for speech recognition on recorded test calls that include accents and background noise, and per-stage latency (p50 and p95) logged on every turn against the budget. Agent behaviour: a scripted scenario set covering routine requests, failed identity checks, ambiguous requests, interruptions and out-of-scope asks is replayed against the agent, checking that the right tool is called with valid arguments, that no account action runs without verification, and that handoff triggers when it should. Conversation quality: sampled calls are scored by reviewers for task completion, naturalness and the usefulness of handoff summaries.",
    "results": [
      {
        "label": "voice-to-voice latency target",
        "value": "< 1 s"
      },
      {
        "label": "unverified account actions (target)",
        "value": "0"
      },
      {
        "label": "barge-in stop target",
        "value": "< 200 ms"
      },
      {
        "label": "handoffs with a call summary (target)",
        "value": "100%"
      }
    ],
    "lessons": [
      "In voice, latency is a product requirement; it has to be budgeted per stage from the start, not optimised at the end",
      "Turn detection shapes how a conversation feels as much as the choice of model does",
      "Keeping authority in code rather than in the prompt is what makes a tool-calling agent testable"
    ],
    "resources": [],
    "body": "## Architecture\n\n[[diagram:voice-architecture]]",
    "featured": true,
    "sortOrder": 1
  },
  {
    "slug": "document-intelligence-retrieval",
    "title": "Document Intelligence & Retrieval",
    "category": "RAG · Document AI",
    "cat": "rag",
    "art": "doc",
    "year": "2026",
    "problem": "Organisations keep critical knowledge in PDFs, scans, tables and long reports. Keyword search misses questions phrased differently from the source, and generic chatbots answer confidently without showing where an answer came from.",
    "outcome": "Turns mixed-format documents into structured, searchable passages and answers questions with citations to the exact source, declining when the evidence is weak.",
    "metric": {
      "label": "recall@10 target",
      "value": "≥ 0.9"
    },
    "tech": [
      "Python",
      "OCR + layout parsing",
      "Structure-aware chunking",
      "Dense embeddings",
      "BM25",
      "Reciprocal rank fusion",
      "Cross-encoder re-ranking",
      "Citation checks",
      "Retrieval evaluation"
    ],
    "overview": "A document intelligence and retrieval system: it turns unstructured documents into clean passages with metadata, retrieves them with hybrid search and re-ranking, and generates answers that cite their sources.",
    "context": "Built for an organisation whose documents arrive in mixed quality: native PDFs, scanned pages, tables and multi-column layouts. Answers drawn from those documents have to be checkable, because a wrong figure or clause quoted with confidence costs more than no answer. The quality of the final answer depends on what reaches the model, so the work centres on parsing and retrieval.",
    "requirements": [
      "Handle native PDFs, scanned pages, tables and multi-column layouts",
      "Preserve document structure (sections, tables, page numbers) through chunking",
      "Every answer cites the passages and pages it used",
      "Match both paraphrased questions and exact terms such as codes, names and clause numbers",
      "Decline to answer when retrieved evidence is weak",
      "Retrieval and answer quality measured on a fixed test set"
    ],
    "arch": [
      "Ingestion",
      "OCR + layout",
      "Chunk + metadata",
      "Embed + index",
      "Hybrid retrieval",
      "Re-ranker",
      "Cited answer"
    ],
    "implementation": "Documents enter through an ingestion step that records source, version and a content hash, so unchanged files are not reprocessed. Native PDFs are parsed directly; scanned pages go through OCR, and a layout parser reconstructs reading order, headings, tables and multi-column text. Chunking follows that structure: sections and tables stay intact, long sections are split at paragraph boundaries with a small overlap, and each chunk carries its heading path, page numbers and extracted metadata such as document type, title and date. Chunks are embedded with an embedding model and stored in a vector store alongside a keyword (BM25) index. At query time both indexes are searched, the result lists are merged with reciprocal rank fusion, and a cross-encoder re-ranker scores the top candidates against the question. The highest-scoring passages go to the LLM with instructions to answer only from them and cite each claim. If the re-ranker scores fall below a threshold, the system returns the closest passages and states that it found no supported answer.",
    "challenges": [
      "Tables and multi-column pages lose their meaning when text is extracted in raw order; layout parsing restores reading order before chunking",
      "OCR errors on low-quality scans hurt keyword matching; dense retrieval compensates, and low-confidence pages are flagged",
      "Fixed-size chunks split clauses and tables mid-way; structure-aware chunking keeps units of meaning together",
      "The refusal threshold trades answer rate against unsupported answers and has to be tuned on the evaluation set"
    ],
    "decisions": [
      {
        "title": "Hybrid retrieval instead of dense-only",
        "body": "Dense embeddings handle paraphrase; keyword search catches exact identifiers that embeddings tend to blur. Fusing both covers each method's blind spots.",
        "tradeoff": "Two indexes to build and keep in sync."
      },
      {
        "title": "Re-rank a wide candidate set",
        "body": "First-stage retrieval casts a wide net; a cross-encoder reads each candidate together with the question and keeps only the best few for the prompt.",
        "tradeoff": "Re-ranking latency on every query, in exchange for more relevant context and shorter prompts."
      },
      {
        "title": "Refuse instead of guess",
        "body": "When evidence is weak, the system says so and links the closest passages instead of generating an answer.",
        "tradeoff": "A lower answer rate, in exchange for answers users can verify."
      }
    ],
    "evaluation": "Evaluation separates retrieval from generation. A test set of questions is written from the documents themselves, each labelled with the passages that answer it, and includes paraphrased questions, exact-term lookups, table questions, multi-part questions and questions with no answer in the corpus. Retrieval is scored with recall@k and mean reciprocal rank; generation with faithfulness (every claim supported by a cited passage), citation precision and correct refusal on unanswerable questions. Parsing quality is spot-checked against source pages, with a focus on tables and scans. The same set is rerun after any change to parsing, chunking, retrieval or prompts.",
    "results": [
      {
        "label": "recall@10 target",
        "value": "≥ 0.9"
      },
      {
        "label": "faithfulness target",
        "value": "≥ 0.9"
      },
      {
        "label": "answers with citations (target)",
        "value": "100%"
      },
      {
        "label": "p95 answer latency target",
        "value": "< 3 s"
      }
    ],
    "lessons": [
      "Most retrieval failures start in parsing; fixing extraction does more than changing the model",
      "Keyword search stays essential next to embeddings for identifiers and exact terms",
      "Scoring retrieval separately from generation shows which stage to fix"
    ],
    "resources": [],
    "body": "## Architecture\n\n[[diagram:doc-ingestion]]\n\n[[diagram:doc-query]]",
    "featured": true,
    "sortOrder": 2
  },
  {
    "slug": "local-rag-private-llm",
    "title": "Local RAG on Private Infrastructure",
    "category": "Private LLM · RAG",
    "cat": "infra",
    "art": "infra",
    "year": "2026",
    "problem": "Organisations with regulatory restrictions or strict data-handling rules cannot send documents or prompts to external AI APIs, yet still need assistants that answer from their own data.",
    "outcome": "A self-hosted RAG stack (an open-weight LLM served with vLLM, local embeddings and retrieval, guardrails and an evaluation pipeline) that runs entirely inside a controlled environment.",
    "metric": {
      "label": "data leaving the environment (target)",
      "value": "0"
    },
    "tech": [
      "Python",
      "vLLM",
      "Open-weight LLM",
      "GPU VM",
      "Local embeddings",
      "Vector store",
      "Guardrails",
      "RAG evaluation"
    ],
    "overview": "A retrieval-augmented generation system built end to end on private infrastructure: from provisioning a GPU virtual machine, through serving an open-weight model with vLLM, to retrieval, guardrails and an evaluation pipeline. Prompts, documents and outputs stay inside the environment.",
    "context": "Built for an enterprise setting with data concerns and regulatory restrictions, where data-residency and confidentiality requirements rule out hosted model APIs. The goal was an LLM assistant over internal documents with full control over where data is stored, processed and logged. That moves the work from calling an API to owning the whole stack: hardware, model serving, retrieval, safety and quality measurement.",
    "requirements": [
      "All inference, embedding and retrieval run inside the controlled environment",
      "An OpenAI-compatible API so applications are not tied to one model",
      "Model sized to fit the available GPU memory with room for long contexts",
      "Input and output guardrails, including PII detection and grounding checks",
      "Answers grounded in retrieved internal documents, with citations",
      "Repeatable evaluation before any model, prompt or retrieval change ships"
    ],
    "arch": [
      "GPU VM",
      "vLLM server",
      "Open-weight LLM",
      "Embeddings + retrieval",
      "Guardrails",
      "Evaluation"
    ],
    "implementation": "The work started with infrastructure: a GPU virtual machine provisioned inside the controlled environment, with GPU drivers installed and outbound network access restricted. vLLM was then deployed on it as an OpenAI-compatible server, which provides continuous batching and efficient KV-cache memory management while letting applications use a standard client. Next, an open-weight model was loaded, chosen against the GPU memory available: model size, quantization level and maximum context length all compete for the same VRAM, so they were sized together. The retrieval pipeline came after that: internal documents are parsed and chunked, embedded with a locally hosted embedding model and stored in a vector store on the same network; each query retrieves the most relevant chunks, which are passed to the model with instructions to answer only from them and cite them. Guardrails wrap the model on both sides: input checks for personal data and prompt injection, output checks for leaked personal data and for grounding against the retrieved passages. Finally, an evaluation pipeline runs a fixed question set through the full system and scores retrieval and answer quality, so changes are measured rather than judged by impression.",
    "challenges": [
      "GPU memory is the binding constraint: weights, KV cache and concurrent requests share it, so a larger model or longer context means fewer simultaneous requests",
      "Quantization reduces memory and cost but can degrade answers, so its effect has to be checked on the evaluation set rather than assumed",
      "With no external services, every component (embeddings, safety checks, evaluation) also has to run locally within the same hardware budget",
      "Guardrails add latency to every request and must be tuned to block real issues without rejecting legitimate questions"
    ],
    "decisions": [
      {
        "title": "vLLM as the inference engine",
        "body": "vLLM serves open-weight models behind an OpenAI-compatible API with continuous batching and paged KV-cache management, which keeps throughput per GPU high and lets applications switch models by configuration.",
        "tradeoff": "Ownership of GPU operations, upgrades and monitoring that a hosted API would otherwise cover."
      },
      {
        "title": "Size the model to the hardware",
        "body": "Model size, quantization and context length were chosen together against the available VRAM, leaving headroom for the KV cache under concurrent load.",
        "tradeoff": "A smaller or quantized model rather than the largest available, in exchange for stable latency and concurrency."
      },
      {
        "title": "Evaluation as a release gate",
        "body": "The evaluation pipeline runs on every change to the model, prompts or retrieval, and results are compared with the previous run before a change is promoted.",
        "tradeoff": "Building and maintaining a test set up front, before user-facing features."
      }
    ],
    "evaluation": "The evaluation pipeline runs inside the same environment, so test data never leaves it either. A question set built from internal documents covers direct lookups, multi-document questions, questions with no answer in the corpus, and adversarial inputs such as prompt-injection attempts and requests for personal data. Retrieval is scored with recall@k against labelled source passages; answers are scored for faithfulness to the retrieved context, answer relevance and correct refusal; guardrails are scored on how often they block what they should and how often they wrongly block legitimate questions. Serving is measured separately: time to first token, tokens per second and p95 latency under concurrent load on the provisioned GPU.",
    "results": [
      {
        "label": "data leaving the environment (target)",
        "value": "0"
      },
      {
        "label": "faithfulness target",
        "value": "≥ 0.9"
      },
      {
        "label": "p95 time-to-first-token target",
        "value": "< 1 s"
      },
      {
        "label": "PII in outputs (target)",
        "value": "0"
      }
    ],
    "lessons": [
      "Most local-LLM constraints trace back to GPU memory, so sizing belongs at the start, not after the model is chosen",
      "An OpenAI-compatible serving layer keeps the rest of the stack independent of any one model",
      "In a regulated setting, the evaluation pipeline doubles as evidence that the system behaves as intended"
    ],
    "resources": [],
    "body": "## Architecture\n\n[[diagram:local-request-flow]]",
    "featured": true,
    "sortOrder": 3
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
    "title": "AI Engineering",
    "keywords": "build builds systems kind what does do areas expertise capabilities specialise specialize focus",
    "answer": "Wesley is an early-career AI engineer. He works hands-on in four areas:\n\n- AI agents and RAG, including evaluation harnesses\n- Open-weight LLMs deployed locally\n- Inference engines such as vLLM and Ollama\n- AI strategy, cost and consulting: where AI is worth it, hosted APIs or self-hosted models, and predictable inference costs\n\nThe Work page shows three systems he built.",
    "sources": [
      {
        "label": "AI Engineering",
        "url": "/"
      },
      {
        "label": "Work",
        "url": "/work"
      }
    ]
  },
  {
    "key": "rag",
    "title": "Document Intelligence & Retrieval",
    "keywords": "work rag retrieval augmented generation knowledge search documents document intelligence ocr parsing vector embeddings chunk rerank re-rank hybrid citations",
    "answer": "RAG is one of Wesley's core areas. The Document Intelligence & Retrieval case study walks through parsing and OCR, structure-aware chunking, hybrid retrieval, re-ranking and answers that cite their sources.",
    "sources": [
      {
        "label": "Document Intelligence & Retrieval",
        "url": "/work/document-intelligence-retrieval"
      },
      {
        "label": "Building RAG that works",
        "url": "/blogs/building-rag-that-works"
      }
    ]
  },
  {
    "key": "evaluate",
    "title": "Evaluation",
    "keywords": "evaluate evaluation eval evals benchmark test testing quality measure metrics assess harness harnesses hallucination",
    "answer": "Evaluation is part of Wesley's agents and RAG work: he builds evaluation harnesses that check whether a system actually answers well, rather than trusting a demo. The Local RAG on Private Infrastructure case study includes an evaluation pipeline.\n\nIf you want to talk about evaluating your own system, email Wesley.",
    "sources": [
      {
        "label": "Local RAG on Private Infrastructure",
        "url": "/work/local-rag-private-llm"
      },
      {
        "label": "Contact",
        "url": "/#contact"
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
        "url": "/blogs/why-most-ai-projects-fail-in-production"
      }
    ]
  },
  {
    "key": "infra",
    "title": "Local RAG on Private Infrastructure",
    "keywords": "work open weight open-weight llm local deploy deployment self host self-host hosting vllm gpu vm infrastructure quantization private on-prem premise inference serving regulated regulation data residency guardrails",
    "answer": "Wesley has built a local RAG stack on infrastructure the organisation controls. The Local RAG on Private Infrastructure case study goes from provisioning a GPU VM and serving a model with vLLM to the retrieval pipeline, guardrails and an evaluation pipeline, for organisations whose data cannot leave their environment.",
    "sources": [
      {
        "label": "Local RAG on Private Infrastructure",
        "url": "/work/local-rag-private-llm"
      }
    ]
  },
  {
    "key": "voice",
    "title": "Voice Agent for Customer Service",
    "keywords": "work voice speech phone call calls telephony asr tts audio conversational agent latency elevenlabs cloning clone",
    "answer": "Wesley has built a real-time voice agent for customer service. The case study covers speech recognition, turn-taking and interruptions, tool calling, ElevenLabs speech and voice cloning, and the latency budget behind a natural conversation.",
    "sources": [
      {
        "label": "Voice Agent for Customer Service",
        "url": "/work/voice-agent-customer-service"
      }
    ]
  },
  {
    "key": "agents",
    "title": "Agents and tool calling",
    "keywords": "work agent agents agentic autonomous workflow workflows tools tool calling function calling automation harness openclaw safe safety",
    "answer": "Wesley builds agents that call tools with the model proposing and code deciding: typed tool schemas, checks before any account action, and a clean handoff to a person. The Voice Agent for Customer Service case study shows how this works in a voice conversation.",
    "sources": [
      {
        "label": "Voice Agent for Customer Service",
        "url": "/work/voice-agent-customer-service"
      }
    ]
  },
  {
    "key": "engage",
    "title": "Strategy, cost & consulting",
    "keywords": "hire engage engagement work with consult consulting consultant advice advisory strategy cost costs price pricing rate start project help",
    "answer": "Yes. Besides building systems, Wesley helps teams decide where AI is worth it, choose between hosted APIs and self-hosted models, and keep inference costs predictable.\n\nScope depends on the problem, so the best start is a short email describing what you're trying to solve.",
    "sources": [
      {
        "label": "Contact",
        "url": "/#contact"
      }
    ]
  },
  {
    "key": "portfolio",
    "title": "Selected work",
    "keywords": "work projects project case studies portfolio examples built past previous",
    "answer": "Wesley's case studies cover:\n\n- Voice Agent for Customer Service (tool calling, ElevenLabs)\n- Document Intelligence & Retrieval (RAG)\n- Local RAG on Private Infrastructure (vLLM, guardrails, evaluation)\n\nEach one covers the problem, its context, the architecture and the lessons learned.",
    "sources": [
      {
        "label": "Selected work",
        "url": "/work"
      }
    ]
  },
  {
    "key": "contact",
    "title": "Contact",
    "keywords": "contact email reach talk call meeting available availability book touch linkedin",
    "answer": "Email is the best way to reach Wesley: write to nyamosiwesley02@gmail.com describing the problem you're trying to solve.\n\nYou can also connect with him on LinkedIn.",
    "sources": [
      {
        "label": "Contact",
        "url": "/#contact"
      }
    ]
  },
  {
    "key": "stack",
    "title": "Tools and stack",
    "keywords": "stack technologies tools languages python framework frameworks tech use skills",
    "answer": "Wesley works mainly in Python, with SQL and R. His AI work uses vLLM and Ollama for inference, open-weight models from Hugging Face, Docker, FastAPI, PyTorch and scikit-learn, and ElevenLabs for voice.\n\nEach case study describes the parts of the system it uses.",
    "sources": [
      {
        "label": "Selected work",
        "url": "/work"
      }
    ]
  },
  {
    "key": "writing",
    "title": "Blogs",
    "keywords": "blogs blog writing articles posts read publish",
    "answer": "Wesley writes in two tracks: engineering (RAG, evaluation, deployment, voice) and executive (AI strategy, why projects fail). Browse them on the Blogs page.",
    "sources": [
      {
        "label": "Blogs",
        "url": "/blogs"
      }
    ]
  },
  {
    "key": "about",
    "title": "About",
    "keywords": "who is wesley about background experience career bio himself education degree university study statistics internship internships intern nita forage kenya",
    "answer": "Wesley Nyamosi is an early-career AI engineer based in Kenya. He has a BSc in Statistics from Jomo Kenyatta University of Agriculture and Technology (2023).\n\nHe completed two internships: Data Analyst Intern at NITA (2023) and Data Science Intern with Forage (2024). He now builds AI agents, RAG and local LLM systems; the Work page shows three of them.",
    "sources": [
      {
        "label": "Work",
        "url": "/work"
      }
    ]
  }
];
