import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContentIndex } from "@/components/sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description: "Articles by Wesley Nyamosi on machine learning, evaluation, and getting "
    + "models from a notebook into production.",
  pathname: "/writing",
});

export default function WritingPage() {
  return (
    <PageShell
      title="Writing"
      intro="Notes on building AI systems that have to keep working after the demo."
    >
      <ContentIndex
        collection="blog"
        emptyTitle="No articles published yet"
        emptyDescription="Nothing published here yet."
      />
    </PageShell>
  );
}
