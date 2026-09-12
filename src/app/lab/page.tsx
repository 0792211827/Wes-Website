import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContentIndex } from "@/components/sections";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Lab",
  description: "Experiments from Wesley Nyamosi's AI Lab — smaller investigations into "
    + "models, tooling and techniques, written up with their results.",
  pathname: "/lab",
});

export default function LabPage() {
  return (
    <PageShell
      title="AI Lab"
      intro="Experiments and what they actually showed — including the ones that did not work."
    >
      <ContentIndex
        collection="lab"
        emptyTitle="No experiments published yet"
        emptyDescription="No experiments written up yet."
      />
    </PageShell>
  );
}
