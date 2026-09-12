import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MdxContent } from "@/components/ui/mdx-content";
import { isPlaceholder, secondaryNav } from "@/config/site";
import { getAboutDocument } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Wesley Nyamosi — data scientist and AI engineer. Statistics background, "
    + "predictive modelling and NLP, and the pipelines that keep models running.",
  pathname: "/about",
});

/**
 * Prose fragments rendered in order. Adding a section means adding an
 * `.mdx` file — no code change (PROJECT_STRUCTURE.md, "Content vs code").
 */
const FRAGMENTS = [
  { slug: "bio", heading: null },
  { slug: "background", heading: "Background" },
  { slug: "approach", heading: "Approach" },
] as const;

export default async function AboutPage() {
  const fragments = await Promise.all(
    FRAGMENTS.map(async (fragment) => ({
      ...fragment,
      document: await getAboutDocument(fragment.slug),
    })),
  );

  const present = fragments.filter((fragment) => fragment.document !== null);
  const links = secondaryNav.filter((item) => !isPlaceholder(item.href));

  return (
    <PageShell title="About">
      {present.length === 0 ? (
        <EmptyState
          title="Bio not written yet"
          description="Nothing here yet."
        />
      ) : (
        <div className="max-w-2xl space-y-12">
          {present.map(({ slug, heading, document }) => (
            <section key={slug}>
              {heading ? (
                <h2 className="mb-4 text-xs font-medium tracking-widest text-subtle uppercase">
                  {document?.title ?? heading}
                </h2>
              ) : null}
              <MdxContent source={document!.body} />
            </section>
          ))}
        </div>
      )}

      {links.length > 0 ? (
        <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-8">
          {links.map((item) => (
            <ButtonLink
              key={item.label}
              href={item.href}
              variant="secondary"
              external
            >
              {item.label}
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </PageShell>
  );
}
