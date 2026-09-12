import { NextResponse } from "next/server";

/**
 * RAG chat endpoint for "Ask My AI".
 *
 * TODO(Phase 3): implement. Requirements:
 *  - retrieval restricted to approved public content (@/lib/rag/retrieve)
 *  - all model calls via @/lib/rag/provider — no SDK imports here
 *  - streamed response; rate limiting; no logging of message bodies
 *  - answers cite their source, and say "I don't know" rather than guessing
 */
export async function POST() {
  return NextResponse.json(
    { error: "The assistant is not available yet." },
    { status: 501 },
  );
}
