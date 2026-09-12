/**
 * Retrieval over approved public content only.
 *
 * The assistant must never answer from anything outside this index, and every
 * answer must be traceable to a real source (CLAUDE.md §2, §6 Phase 3).
 *
 * TODO(Phase 3): implement.
 */

export type RetrievedPassage = {
  text: string;
  /** Site-relative route, used to render a citation link. */
  route: string;
  title: string;
  score: number;
};

export type RetrieveOptions = {
  query: string;
  topK?: number;
  /** Passages scoring below this are dropped rather than padded in. */
  minScore?: number;
};

export async function retrieve(
  _options: RetrieveOptions,
): Promise<RetrievedPassage[]> {
  throw new Error("RAG retrieval not implemented yet (Phase 3).");
}
