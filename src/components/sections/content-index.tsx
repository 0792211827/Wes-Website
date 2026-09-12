import { ContentGrid } from "@/components/ui/content-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { ContentCollection } from "@/lib/content";
import { getCollection } from "@/lib/content";

const ALL_ITEMS_HEADING_ID = "all-items";

/** Plural noun for the screen-reader-only heading on an ungrouped listing. */
const COLLECTION_NOUNS: Record<ContentCollection, string> = {
  "case-studies": "case studies",
  lab: "experiments",
  blog: "articles",
};

/**
 * Index listing for a content collection.
 *
 * Server component. Groups by category when there is more than one, so the
 * listing stays scannable without a client-side filter — filtering is only
 * worth the interactivity cost once there is enough content to need it.
 */
export async function ContentIndex({
  collection,
  emptyTitle,
  emptyDescription,
}: {
  collection: ContentCollection;
  emptyTitle: string;
  emptyDescription: string;
}) {
  const items = await getCollection(collection);

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const categories = [...new Set(items.map((item) => item.frontmatter.category))];
  if (categories.length < 2) {
    // ContentCard titles are `h3`, so an ungrouped grid would jump the page
    // from the PageShell `h1` straight to `h3`. The grouped branch below gets
    // its `h2` from the category headings; this branch needs one too, even
    // though there is no category worth showing (CLAUDE.md §4).
    return (
      <section aria-labelledby={ALL_ITEMS_HEADING_ID}>
        <h2 id={ALL_ITEMS_HEADING_ID} className="sr-only">
          All {COLLECTION_NOUNS[collection]}
        </h2>
        <ContentGrid items={items} />
      </section>
    );
  }

  return (
    <div className="space-y-16">
      {categories.map((category) => {
        const inCategory = items.filter(
          (item) => item.frontmatter.category === category,
        );
        const headingId = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <section key={category} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="mb-6 text-xs font-medium tracking-widest text-subtle uppercase"
            >
              {category}
            </h2>
            <ContentGrid items={inCategory} />
          </section>
        );
      })}
    </div>
  );
}
