import type { MetadataRoute } from "next";
import { primaryNav, utilityNav } from "@/config/site";
import { getAllContent } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/**
 * Static routes come from the nav config and content routes from the loader,
 * so adding a page or a `.mdx` file never means editing this file.
 *
 * `/ask` is excluded: it is an interactive tool, not indexable content.
 */
const EXCLUDED_ROUTES = new Set(["/ask"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [...primaryNav, ...utilityNav]
    .filter((item) => !item.external && !EXCLUDED_ROUTES.has(item.href))
    .map((item) => ({
      // No `lastModified`: it would be the build time, which changes on every
      // deploy whether the page did or not, and crawlers learn to ignore it.
      url: absoluteUrl(item.href),
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.7,
    }));

  const contentRoutes = (await getAllContent()).map((item) => ({
    url: absoluteUrl(item.route),
    lastModified: new Date(item.frontmatter.date),
    changeFrequency: "yearly" as const,
    priority: item.frontmatter.featured ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...contentRoutes];
}
