import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { isPlaceholder } from "@/config/site";
import type { ContentItem } from "@/types";

/** Supplies the detail page's single `<h1>`, plus frontmatter metadata. */
export function ContentHeader({ item }: { item: ContentItem }) {
  const { title, description, date, category, tags, github, demo } =
    item.frontmatter;

  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <Badge>{category}</Badge>
        <time dateTime={date} className="text-xs text-subtle">
          {new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </time>
      </div>

      <h1 className="mt-5 text-balance">{title}</h1>
      <p className="mt-4 text-lg text-muted">{description}</p>

      {tags.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Rendered only when frontmatter supplies a real URL — never a dead link. */}
      {(github && !isPlaceholder(github)) || (demo && !isPlaceholder(demo)) ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {github && !isPlaceholder(github) ? (
            <ButtonLink href={github} variant="secondary" external>
              Repository
            </ButtonLink>
          ) : null}
          {demo && !isPlaceholder(demo) ? (
            <ButtonLink href={demo} variant="secondary" external>
              Live demo
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
