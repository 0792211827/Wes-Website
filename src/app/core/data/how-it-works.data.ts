/*
 * Step-by-step explanations for the animated "How it works" walkthroughs.
 * One entry per architecture step of each case study (same order as `arch` in content.data.ts).
 * Projects added later through the admin API without an entry here still animate,
 * using their architecture labels only.
 * SAMPLE CONTENT: adjust the wording and figures to Wesley's real projects.
 */
import { HowStep } from '../models';

export const HOW_IT_WORKS: Record<string, HowStep[]> = {
  'enterprise-knowledge-assistant': [
    { title: 'Connectors', text: 'Documents are pulled from SharePoint, the wiki, shared drives and two line-of-business systems, nightly and whenever a file changes. Each document keeps its owner and access list.', stat: '5 sources synced' },
    { title: 'Chunk + embed', text: 'A layout-aware parser keeps headings, tables and clauses intact, then splits documents by structure rather than fixed size. Every chunk is turned into a vector embedding.', stat: 'structure-aware chunks' },
    { title: 'Hybrid index', text: 'Chunks are stored in PostgreSQL with pgvector for meaning-based search, next to a BM25 keyword index that catches exact names, product codes and clause numbers.', stat: 'dense + keyword' },
    { title: 'Re-ranker', text: 'A question pulls the top 40 candidates from both indexes. A cross-encoder reads each one against the question and keeps the best 8. Permission filters run inside the search, so nobody sees documents they cannot open.', stat: '40 → 8 passages' },
    { title: 'LLM', text: 'An open-weight model served with vLLM inside the company\'s cloud writes the answer from those 8 passages only. No document ever leaves the tenancy.', stat: 'data stays in-house' },
    { title: 'Guardrails', text: 'Before anything is shown, the answer is checked: every claim must be backed by a cited passage. If the evidence is weak, the assistant says so and links the closest documents instead of guessing.', stat: 'refuse, don\'t guess' },
    { title: 'Cited answer', text: 'The answer streams to the user with numbered citations that open the exact source passage. Each release is scored against 420 expert-written questions before it ships.', stat: '1.8 s p95 · 0.93 faithfulness' }
  ],
  'contract-intelligence-pipeline': [
    { title: 'Upload', text: 'Legal drops in supplier contracts: clean PDFs, Word files or scans with stamps and signatures. Each file gets an ID and an audit trail from the first second.', stat: 'any format' },
    { title: 'OCR + layout', text: 'Optical character recognition reads scanned pages, and layout analysis rebuilds the structure: sections, tables, clauses that run across pages.', stat: 'scans included' },
    { title: 'Classifier', text: 'The contract type is identified first (NDA, master services, supply, lease) so the right extraction schema and playbook are used.', stat: 'type-specific rules' },
    { title: 'Extractor', text: 'A model fills a strict JSON schema: parties, renewal date, notice period, liability cap, governing law. Every field comes with a confidence score.', stat: 'field-level confidence' },
    { title: 'Validator', text: 'Plain code double-checks the model: dates must be real dates, currencies must match, end dates must come after start dates. Clauses are compared with the company playbook.', stat: 'deterministic checks' },
    { title: 'Review queue', text: 'Anything below the confidence threshold goes to a lawyer, with the source text highlighted. Their correction is saved and becomes new test data.', stat: '14% sent to review' },
    { title: 'Contract DB', text: 'Approved data lands in a searchable contract database with renewal alerts, so missed renewals become a thing of the past.', stat: '4× review throughput' }
  ],
  'voice-agent-customer-support': [
    { title: 'Telephony', text: 'A customer calls the normal support number. Audio is streamed in real time over SIP/WebRTC instead of waiting for the caller to finish.', stat: 'real-time audio' },
    { title: 'Streaming ASR', text: 'Speech recognition produces words while the caller is still talking, so the system is already understanding the request mid-sentence.', stat: 'partial transcripts' },
    { title: 'Turn detection', text: 'A turn detector decides when the caller has actually finished, not just paused. Tuning this was the biggest single latency win.', stat: 'largest latency cost' },
    { title: 'LLM + tools', text: 'The model understands the request and calls tools such as "check balance" or "move appointment" to get real answers from company systems.', stat: 'function calling' },
    { title: 'Policy check', text: 'Every tool call passes a rules layer first: identity must be verified before any account action, and risky actions are blocked. The model proposes, code decides.', stat: '<2% wrong actions' },
    { title: 'Streaming TTS', text: 'Text-to-speech starts speaking the first sentence while the rest is still being written. If the caller interrupts, playback stops instantly.', stat: 'barge-in supported' },
    { title: 'Caller', text: 'The caller hears a natural reply in under a second. If the agent cannot help, it transfers to a human with a written summary so nobody repeats themselves.', stat: '780 ms median response' }
  ],
  'private-llm-inference-platform': [
    { title: 'Clients', text: 'Internal apps and teams call one OpenAI-compatible API, so moving off an external provider is just a change of base URL.', stat: '6 teams migrated' },
    { title: 'API gateway', text: 'The gateway checks each team\'s key, applies quotas and logs usage, so costs can be reported per team.', stat: 'keys · quotas · logs' },
    { title: 'Router', text: 'Requests are routed by task: simple extraction goes to a fast quantized model, complex reasoning to a larger full-precision one.', stat: 'right model per task' },
    { title: 'vLLM pool', text: 'Models are served with vLLM, which batches many requests together and manages GPU memory efficiently, roughly 2.6× the previous throughput.', stat: '2.6× throughput' },
    { title: 'GPU nodes', text: 'Kubernetes runs the models on GPU node pools and scales them with demand. New model versions roll out without downtime.', stat: 'autoscaling' },
    { title: 'Metrics', text: 'Prometheus collects tokens per second, latency and GPU utilisation for every model and team, with alerts when something drifts.', stat: '99.9% availability' },
    { title: 'Cost reports', text: 'Grafana dashboards show the cost per million tokens for each team. Seeing their own cost changed behaviour faster than any quota.', stat: '-57% cost / 1M tokens' }
  ],
  'agentic-operations-copilot': [
    { title: 'Request', text: 'An operations colleague describes the task in plain language, for example "update the supplier address and re-issue the open purchase orders".', stat: 'plain language' },
    { title: 'Planner', text: 'The agent writes an explicit plan as numbered steps before doing anything. The plan is visible, can be reviewed and is tested against 150 scenarios.', stat: '92% plan correctness' },
    { title: 'Tool registry', text: 'Each step maps to a registered tool with scoped permissions. Read-only tools (look up, compare) run straight away.', stat: 'scoped permissions' },
    { title: 'Approval step', text: 'Any step that changes data pauses and asks a person to approve, showing exactly what will change.', stat: '0 unapproved writes' },
    { title: 'Executor', text: 'Approved steps run as a durable workflow: if a system times out, the task resumes from the last good step instead of starting over.', stat: 'survives failures' },
    { title: 'Audit log', text: 'Every plan, tool call, approval and result is logged, so anyone can see who approved what and when.', stat: 'full audit trail' },
    { title: 'Result', text: 'The colleague gets a summary of what was done, with links into each system. Routine multi-system tasks take far less time.', stat: '-41% handling time' }
  ]
};
