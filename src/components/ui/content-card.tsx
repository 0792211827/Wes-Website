import { Badge } from "@/components/ui/badge";
import { LinkCard } from "@/components/ui/card";
import type { ContentItem } from "@/types";

/** Formats an ISO date as a stable, locale-independent label. */
function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Index card for any content item. One component for all three collections —
 * they share a frontmatter contract, so they share a card.
 */
export function ContentCard({ item }: { item: ContentItem }) {
  const { title, description, date, category, tags } = item.frontmatter;

  return (
    <LinkCard href={item.route} className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{category}</Badge>
        <time dateTime={date} className="text-xs text-subtle">
          {formatDate(date)}
        </time>
      </div>

      <h3 className="mt-4 text-base text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{description}</p>

      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <li key={tag} className="text-xs text-subtle">
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </LinkCard>
  );
}

/** Responsive grid for `ContentCard`s. */
export function ContentGrid({ items }: { items: ContentItem[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.route} className="flex">
          <ContentCard item={item} />
        </li>
      ))}
    </ul>
  );
}
