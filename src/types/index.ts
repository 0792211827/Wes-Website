/**
 * Shared types. Content-derived types are inferred from the zod schemas in
 * `@/lib/content` so the schema stays the single source of truth.
 */

export type {
  ContentCollection,
  ContentItem,
  Frontmatter,
} from "@/lib/content";

export type NavItem = {
  label: string;
  href: string;
  /** Set when the destination is off-site. */
  external?: boolean;
  /** Short description for menus / metadata. */
  description?: string;
};

// TODO(Phase 4): GitHub repo types once `@/lib/github` is implemented.
// TODO(Phase 3): assistant message / citation types once RAG lands.
