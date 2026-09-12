/**
 * Builds the embedding index from `src/content`.
 *
 * Only content explicitly approved for the assistant may be ingested — public
 * published content, nothing draft or private (CLAUDE.md §6 Phase 3). Run via
 * `scripts/generate-embeddings.ts` at build/deploy time, not at request time.
 *
 * TODO(Phase 3): implement.
 */

import type { EmbeddingIndex } from "@/lib/rag/embeddings";

export type IngestOptions = {
  /** Write the index here, relative to the repo root. */
  outputPath?: string;
};

export async function buildIndex(_options?: IngestOptions): Promise<EmbeddingIndex> {
  throw new Error("RAG ingest not implemented yet (Phase 3).");
}
