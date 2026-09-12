import type { Metadata } from "next";
import { isPlaceholder, ogCard, siteConfig } from "@/config/site";
import type { ContentItem } from "@/lib/content";

/**
 * Metadata helpers. Pages must call these rather than hand-rolling `metadata`
 * objects (CLAUDE.md §4) so title, canonical, OG and Twitter tags stay
 * consistent across the site.
 */

const DEV_FALLBACK_URL = "http://localhost:3000";

/** `""` is as unset as `undefined` here — `.env.local` copied from
 * `.env.example` supplies empty strings, not missing keys. */
function firstRealValue(...candidates: (string | undefined)[]): string | null {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed && !isPlaceholder(trimmed)) return trimmed;
  }
  return null;
}

function normaliseOrigin(value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `Invalid site URL: ${JSON.stringify(value)}. Set NEXT_PUBLIC_SITE_URL ` +
        `(or siteConfig.url) to a full origin including the scheme, e.g. ` +
        `"https://example.com".`,
    );
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `Invalid site URL scheme: ${parsed.protocol}. Use http or https.`,
    );
  }
  return parsed.origin;
}

/**
 * Canonical origin, no trailing slash.
 *
 * Prefers `NEXT_PUBLIC_SITE_URL`, then `siteConfig.url`. In development it
 * falls back to localhost so the site runs before either is filled in; in a
 * production build it throws instead, because shipping localhost canonicals
 * and a localhost sitemap silently de-indexes the whole site.
 */
export function getSiteUrl(): string {
  const configured = firstRealValue(
    process.env.NEXT_PUBLIC_SITE_URL,
    siteConfig.url,
  );
  if (configured) return normaliseOrigin(configured);

  // Failing the build is the point: a production deploy with no origin
  // configured looks perfectly healthy while publishing localhost canonicals,
  // a localhost sitemap and localhost OG URLs — i.e. an unindexable site.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PLACEHOLDER_SITE_URL !== "1"
  ) {
    throw new Error(
      "No site URL configured, so canonical URLs, OG tags and the sitemap " +
        "would all point at localhost.\n" +
        "  Fix: set NEXT_PUBLIC_SITE_URL, or replace the placeholder `url` in " +
        "src/config/site.ts.\n" +
        "  To run a local production build before a domain is chosen, set " +
        "ALLOW_PLACEHOLDER_SITE_URL=1.",
    );
  }
  return DEV_FALLBACK_URL;
}

/** Resolves a site-relative path against the canonical origin. Absolute URLs
 * pass through unchanged. */
export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${getSiteUrl()}/`).toString();
}

/**
 * An explicit share image, or `null` to fall through to the generated one.
 *
 * `null` is not "no image": src/app/opengraph-image.tsx supplies a generated
 * card for every route, and Next only skips it when `openGraph.images` is set
 * explicitly. So returning `null` here is what *enables* the default card —
 * this function exists to let a content item override it with its own asset.
 */
function resolveOgImage(image?: string): string | null {
  const resolved = firstRealValue(image, siteConfig.ogImage);
  return resolved ? absoluteUrl(resolved) : null;
}

/** Root-layout metadata. Kept here so §4's "no hand-rolled metadata" holds for
 * the layout too. */
export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: siteConfig.title,
      template: `%s — ${siteConfig.name}`,
    },
    description: firstRealValue(siteConfig.description) ?? undefined,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
  };
}

/**
 * Brand suffix for share titles.
 *
 * `title.template` in the root layout only rewrites `metadata.title` — Next
 * never applies it to `openGraph.title` or `twitter.title`. Without this, a
 * shared link to /about renders a context-free "About" while the tab correctly
 * reads "About — Wesley Nyamosi".
 *
 * Titles that already contain the site name (the homepage uses
 * `siteConfig.title`) are returned unchanged so it is not doubled up.
 */
function withBrand(title: string): string {
  return title.includes(siteConfig.name)
    ? title
    : `${title} — ${siteConfig.name}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Site-relative path, e.g. `/work`. Used for the canonical URL. */
  pathname: string;
  /** Path under /public or an absolute URL. Falls back to the site OG image. */
  image?: string;
  /** `article` for content pages, `website` for everything else. */
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  /** Set for pages that should not be indexed. Suppresses the canonical too. */
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  pathname,
  image,
  type = "website",
  publishedTime,
  tags,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(pathname);
  // Next shallowly merges metadata, so the `openGraph` object set below
  // *replaces* the one the root segment's opengraph-image.tsx contributes —
  // which silently stripped og:image from every page except `/`. Setting the
  // images explicitly here is what keeps the generated card on all routes.
  const explicitImage = resolveOgImage(image);
  const images = explicitImage
    ? [{ url: explicitImage, alt: title }]
    : [
        {
          url: absoluteUrl(ogCard.route),
          alt: `${siteConfig.name} — ${siteConfig.tagline}`,
          width: ogCard.width,
          height: ogCard.height,
        },
      ];
  // A `TODO:` description is worse than none — it would ship as the search
  // snippet. Omit it until it is written.
  const copy = firstRealValue(description) ?? undefined;
  const shareTitle = withBrand(title);

  return {
    title,
    description: copy,
    // A page that must not be indexed should not advertise a canonical.
    alternates: noIndex ? undefined : { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      title: shareTitle,
      description: copy,
      // Same reasoning as the canonical above: /404 is not a real URL, so a
      // noIndex page should not advertise one.
      ...(noIndex ? {} : { url: canonical }),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && tags ? { tags } : {}),
    },
    twitter: {
      // Always large: whether or not an item overrides it, a 1200x630 card is
      // served (src/app/twitter-image.tsx). "summary" would crop it to a square.
      card: "summary_large_image",
      title: shareTitle,
      description: copy,
      images,
    },
  };
}

/** Metadata for a case study / experiment / article detail page. */
export function buildContentMetadata(item: ContentItem): Metadata {
  return buildMetadata({
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    pathname: item.route,
    image: item.frontmatter.image,
    type: "article",
    publishedTime: item.frontmatter.date,
    tags: item.frontmatter.tags,
  });
}

// TODO(Phase 2): JSON-LD builders (Person, Article, BreadcrumbList) once real
// content exists to describe. Keep structured data derived from frontmatter —
// never assert claims the content does not support (CLAUDE.md §2).
