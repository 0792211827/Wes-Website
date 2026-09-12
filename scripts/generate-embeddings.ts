/**
 * Builds the RAG embedding index at build/deploy time.
 *
 * Run with `npm run generate-embeddings`. Kept out of the request path on
 * purpose — the site must build and serve without an LLM provider configured.
 *
 * TODO(Phase 3): call buildIndex() from src/lib/rag/ingest and write the result.
 * Import it by RELATIVE path — this runs under `node --experimental-strip-types`,
 * which does not apply the `paths` aliases from tsconfig.json, so `@/lib/...`
 * would fail to resolve here.
 */

async function main(): Promise<void> {
  throw new Error("Embedding generation is not implemented yet (Phase 3).");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
