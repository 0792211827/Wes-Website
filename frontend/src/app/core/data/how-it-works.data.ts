/*
 * Step-by-step explanations for the animated "How it works" walkthroughs.
 * One entry per architecture step of each case study (same order as `arch` in content.data.ts).
 * Projects added later through the admin API without an entry here still animate,
 * using their architecture labels only.
 * Figures in `stat` are design targets or reference values, not measurements (docs/source-material.md).
 */
import { HowStep } from '../models';

export const HOW_IT_WORKS: Record<string, HowStep[]> = {
  'voice-agent-customer-service': [
    { title: 'Audio stream', text: 'The caller\'s audio is streamed to the agent in small frames over a real-time connection instead of being recorded and uploaded after each sentence. Everything downstream works on this live stream.', stat: '~100 ms transport budget' },
    { title: 'Streaming ASR', text: 'A speech-to-text model transcribes while the caller is still talking, producing partial transcripts that firm up as more audio arrives. By the time the caller stops, most of the sentence is already text.', stat: '~100 ms finalisation budget' },
    { title: 'Turn detection', text: 'The agent has to decide when the caller has actually finished rather than just paused. It combines silence timing with whether the partial transcript reads as a complete thought.', stat: '~200 ms endpointing budget' },
    { title: 'LLM agent', text: 'The finished turn, the conversation so far and the available tools, described as JSON schemas, go to the language model. The model either replies or proposes a tool call, such as looking up an order.', stat: '~300 ms first-token budget' },
    { title: 'Tool layer', text: 'Proposed tool calls pass through plain code before anything runs. Arguments are validated, identity must be verified before any account action, and anything outside policy is refused. The model proposes, code decides.', stat: 'verify before acting' },
    { title: 'ElevenLabs TTS', text: 'The reply is streamed sentence by sentence to ElevenLabs text-to-speech in a cloned brand voice, used with the speaker\'s consent. Speech starts before the full reply is written, and if the caller interrupts, playback stops and the agent listens again.', stat: '~200 ms first-audio budget' },
    { title: 'Human handoff', text: 'When a request is out of scope or the caller asks for a person, the call is transferred to a human agent with a short written summary, so the caller does not have to repeat themselves.', stat: 'transfer + summary' }
  ],
  'document-intelligence-retrieval': [
    { title: 'Ingestion', text: 'Documents are collected with their source, version and a content fingerprint, so unchanged files are skipped and every passage can be traced back to its file.', stat: 'versioned + traceable' },
    { title: 'OCR + layout', text: 'Scanned pages are read with optical character recognition. A layout parser then rebuilds reading order, headings, tables and columns, so text comes out in the order a person would read it.', stat: 'scans + tables' },
    { title: 'Chunk + metadata', text: 'Documents are split along their structure: sections and tables stay whole, and long sections break at paragraph boundaries. Each chunk keeps its heading path, page number and metadata such as document type and date.', stat: 'structure-aware chunks' },
    { title: 'Embed + index', text: 'Each chunk is converted into a vector by an embedding model and stored in a vector store, next to a keyword index of the same text.', stat: 'dense + keyword' },
    { title: 'Hybrid retrieval', text: 'A question searches both indexes: vectors find passages with the same meaning, keywords find exact terms such as codes and names. The two result lists are merged into one ranking.', stat: 'rank fusion' },
    { title: 'Re-ranker', text: 'A cross-encoder reads each candidate passage together with the question and scores how well it answers it. Only the best few passages go to the model.', stat: 'wide net → best few' },
    { title: 'Cited answer', text: 'The LLM writes an answer from those passages only, citing each claim with a link to the page it came from. If the best scores are too low, it says no supported answer was found and shows the closest passages.', stat: 'cite or decline' }
  ],
  'local-rag-private-llm': [
    { title: 'GPU VM', text: 'A virtual machine with a GPU is provisioned inside the organisation\'s controlled environment, with drivers installed and outbound network access restricted. This is the boundary data does not cross.', stat: 'data stays inside' },
    { title: 'vLLM server', text: 'vLLM is deployed on the VM as an OpenAI-compatible server. It batches concurrent requests and manages GPU memory efficiently, and applications talk to it with a standard client.', stat: 'OpenAI-compatible API' },
    { title: 'Open-weight LLM', text: 'An open-weight model is loaded into vLLM. Model size, quantization and maximum context length are chosen together so the weights and the working memory for requests fit on the GPU.', stat: 'sized to VRAM' },
    { title: 'Embeddings + retrieval', text: 'Internal documents are chunked and embedded by a locally hosted embedding model, then stored in a vector store on the same network. Each question retrieves the most relevant chunks, which the model must answer from and cite.', stat: 'local embeddings' },
    { title: 'Guardrails', text: 'Checks run before and after the model. Inputs are screened for personal data and prompt-injection attempts; outputs are checked for leaked personal data and for claims the retrieved passages do not support.', stat: 'input + output checks' },
    { title: 'Evaluation', text: 'A fixed question set runs through the whole system and scores retrieval, faithfulness, refusals and guardrail accuracy, plus latency on the GPU. A change ships only if these scores do not get worse.', stat: 'regression gate' }
  ]
};
