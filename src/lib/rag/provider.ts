/**
 * Provider-agnostic LLM wrapper.
 *
 * CLAUDE.md §3: this is the ONLY place a model SDK may be imported. Nothing
 * outside `src/lib/rag/` may call an LLM directly, so the provider can change
 * without touching page or component code.
 *
 * TODO(Phase 3): implement a provider behind this interface.
 */

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type CompletionRequest = {
  messages: ChatMessage[];
  /** Retrieved context passages, already filtered to approved content. */
  context?: string[];
  maxOutputTokens?: number;
  temperature?: number;
};

export type CompletionChunk = { type: "text"; text: string };

export interface LlmProvider {
  readonly id: string;
  complete(request: CompletionRequest): Promise<string>;
  stream(request: CompletionRequest): AsyncIterable<CompletionChunk>;
  embed(inputs: string[]): Promise<number[][]>;
}

/** Resolves the configured provider. TODO(Phase 3): implement. */
export function getProvider(): LlmProvider {
  throw new Error("No LLM provider configured yet (Phase 3).");
}
