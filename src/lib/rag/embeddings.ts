/**
 * Embedding generation and vector math for the assistant's index.
 *
 * Model calls go through `@/lib/rag/provider` only (CLAUDE.md §3).
 *
 * TODO(Phase 3): implement chunking, embedding and the index format.
 */

export type EmbeddedChunk = {
  /** Stable id: `${collection}:${slug}:${chunkIndex}`. */
  id: string;
  /** Site-relative route the chunk came from, for citations. */
  route: string;
  text: string;
  vector: number[];
};

export type EmbeddingIndex = {
  /** Provider + model the vectors were produced with; invalidates on change. */
  model: string;
  dimensions: number;
  createdAt: string;
  chunks: EmbeddedChunk[];
};

// TODO(Phase 3): chunkContent(), embedChunks(), cosineSimilarity().
