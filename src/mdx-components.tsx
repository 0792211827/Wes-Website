import type { MDXComponents } from "mdx/types";

/**
 * Required by `@next/mdx` — maps MDX elements onto site components.
 *
 * Base typography is handled globally in `src/styles/globals.css`, so only
 * genuine overrides belong here.
 *
 * TODO(Phase 2): map `pre`/`code` to a syntax-highlighted block, `img` to
 * next/image, and add the callout / diagram components used by case studies.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
