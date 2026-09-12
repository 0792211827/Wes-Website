import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContentIndex } from "@/components/sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Case studies on machine learning systems Wesley Nyamosi has built — the "
    + "problem, the architecture, the tradeoffs and what the evaluation showed.",
  pathname: "/work",
});

export default function WorkPage() {
  return (
    <PageShell
      title="Work"
      intro="Case studies: the problem, the architecture, the tradeoffs, and what the evaluation actually showed."
    >
      {/* Authoring: add .mdx to src/content/case-studies via /new-case-study. */}
      <ContentIndex
        collection="case-studies"
        emptyTitle="No case studies published yet"
        emptyDescription="Write-ups are in progress. In the meantime, the fastest way to hear about the work is to ask."
      />
    </PageShell>
  );
}
