import { ButtonLink } from "@/components/ui/button";
import { ContentGrid } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { selectedWork } from "@/config/home";
import { getCaseStudies, getFeatured } from "@/lib/content";

/**
 * Featured case studies, read from `src/content/case-studies`. Server component
 * so the content loader stays on the server.
 *
 * Falls back to the most recent case studies when nothing is flagged
 * `featured`, so the homepage is never empty just because a flag was missed.
 */
export async function SelectedWork() {
  const flagged = await getFeatured("case-studies", selectedWork.limit);
  // Missing a `featured` flag should not blank out the homepage.
  const items =
    flagged.length > 0
      ? flagged
      : (await getCaseStudies()).slice(0, selectedWork.limit);

  return (
    <Section
      id="selected-work"
      eyebrow="Work"
      title={selectedWork.title}
      description={selectedWork.description}
      bordered
    >
      {items.length === 0 ? (
        <EmptyState
          title="No case studies published yet"
          description="Case studies are being written up."
        />
      ) : (
        <>
          <ContentGrid items={items} />
          <div className="mt-10">
            <ButtonLink href="/work" variant="secondary">
              All work
            </ButtonLink>
          </div>
        </>
      )}
    </Section>
  );
}
