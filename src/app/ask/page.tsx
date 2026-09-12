import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Ask My AI",
  description: "Ask questions about Wesley Nyamosi's work and get answers drawn from his "
    + "published case studies, experiments and articles.",
  pathname: "/ask",
  // An interactive tool, not indexable content. Kept consistent with the
  // sitemap exclusion in src/app/sitemap.ts.
  noIndex: true,
});

export default function AskPage() {
  return <PageShell title="Ask My AI" />;
  // TODO(Phase 3): full-page assistant. Renders src/components/assistant via
  // next/dynamic; answers come only from approved public content and must cite
  // their source (CLAUDE.md §2, §6).
}
