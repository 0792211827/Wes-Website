import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Content loader for `src/content/**`.
 *
 * Adding a case study / experiment / article must never require a code change
 * (PROJECT_STRUCTURE.md, "Content vs code"): drop a `.mdx` file with valid
 * frontmatter into the right directory and it shows up.
 *
 * Server-only — these functions touch the filesystem and must not be imported
 * into a client component.
 */

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

const CONTENT_EXTENSIONS = [".mdx", ".md"] as const;

/** Directory name under `src/content` for each collection. */
export const CONTENT_COLLECTIONS = {
  "case-studies": "case-studies",
  lab: "lab",
  blog: "blog",
} as const;

export type ContentCollection = keyof typeof CONTENT_COLLECTIONS;

/** Public route prefix for each collection, used by SEO helpers and sitemap. */
export const COLLECTION_ROUTES: Record<ContentCollection, string> = {
  "case-studies": "/work",
  lab: "/lab",
  blog: "/writing",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Frontmatter contract from CLAUDE.md §4. Optional fields must be omitted
 * rather than filled with placeholder values — never invent metadata.
 */
export const frontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .regex(SLUG_PATTERN, "must be lowercase kebab-case (a-z, 0-9, hyphens)"),
  description: z.string().min(1),
  /**
   * `2026-01-31`, quoted or as an unquoted YAML date. Normalised to a
   * `YYYY-MM-DD` string.
   *
   * Strings are required to be exactly `YYYY-MM-DD` and are returned verbatim
   * rather than round-tripped through `new Date(...)`: loose formats like
   * `January 31, 2026` parse in local time, and converting that back to UTC
   * shifts the day in any non-UTC timezone — so the same repo would produce
   * different dates on different machines. YAML dates already arrive as UTC
   * midnight and are safe to format.
   */
  date: z
    .union([z.string(), z.date()])
    .transform((value, ctx) => {
      if (value instanceof Date) return value.toISOString().slice(0, 10);

      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
      if (!match) {
        ctx.addIssue({
          code: "custom",
          message: `must be YYYY-MM-DD, got ${JSON.stringify(value)}`,
        });
        return z.NEVER;
      }

      const [, year, month, day] = match;
      const asUtc = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day)),
      );
      // Rejects 2026-02-30 and friends, which Date.UTC would roll over.
      if (asUtc.toISOString().slice(0, 10) !== value.trim()) {
        ctx.addIssue({
          code: "custom",
          message: `not a real calendar date: ${JSON.stringify(value)}`,
        });
        return z.NEVER;
      }
      return value.trim();
    }),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  /** Path under `/public` or an absolute URL. */
  image: z.string().min(1).optional(),
  github: z.url().optional(),
  demo: z.url().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type ContentItem = {
  collection: ContentCollection;
  frontmatter: Frontmatter;
  /** Raw MDX body, frontmatter stripped. Compiled at render time. */
  body: string;
  /** Path relative to the repo root, for error messages and debugging. */
  sourcePath: string;
  /** Canonical site-relative route, e.g. `/work/some-slug`. */
  route: string;
};

function collectionDir(collection: ContentCollection): string {
  return path.join(CONTENT_ROOT, CONTENT_COLLECTIONS[collection]);
}

function isContentFile(filename: string): boolean {
  return (
    !filename.startsWith("_") &&
    !filename.startsWith(".") &&
    CONTENT_EXTENSIONS.some((extension) =>
      filename.toLowerCase().endsWith(extension),
    )
  );
}

function fileSlug(filename: string): string {
  return filename.replace(/\.mdx?$/i, "");
}

async function listContentFiles(
  collection: ContentCollection,
): Promise<string[]> {
  try {
    const entries = await readdir(collectionDir(collection), {
      withFileTypes: true,
    });
    return entries
      .filter((entry) => entry.isFile() && isContentFile(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    // An empty collection is a valid Phase 1 state; anything else is a bug.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function parseContentFile(
  collection: ContentCollection,
  filename: string,
): Promise<ContentItem> {
  const absolutePath = path.join(collectionDir(collection), filename);
  const sourcePath = path.relative(process.cwd(), absolutePath);
  const raw = await readFile(absolutePath, "utf8");
  const { data, content } = matter(raw);

  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${sourcePath}:\n${z.prettifyError(result.error)}`,
    );
  }

  const frontmatter = result.data;
  const expectedSlug = fileSlug(filename);
  if (frontmatter.slug !== expectedSlug) {
    throw new Error(
      `Slug mismatch in ${sourcePath}: frontmatter slug is "${frontmatter.slug}" ` +
        `but the filename implies "${expectedSlug}". Rename the file or fix the slug.`,
    );
  }

  return {
    collection,
    frontmatter,
    body: content.trim(),
    sourcePath,
    route: `${COLLECTION_ROUTES[collection]}/${frontmatter.slug}`,
  };
}

/**
 * Newest first; ties broken by title so ordering is deterministic.
 *
 * Dates are `YYYY-MM-DD`, so plain string comparison is already chronological
 * and — unlike `localeCompare` — gives the same answer under every locale.
 */
function byDateDescending(a: ContentItem, b: ContentItem): number {
  if (a.frontmatter.date !== b.frontmatter.date) {
    return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
  }
  return a.frontmatter.title.localeCompare(b.frontmatter.title, "en");
}

/**
 * Parses and caches a collection. Memoized per request, so the array it
 * resolves to is shared — callers go through `getCollection`, which copies it.
 */
const loadCollection = cache(
  async (collection: ContentCollection): Promise<ContentItem[]> => {
    const filenames = await listContentFiles(collection);
    const results = await Promise.allSettled(
      filenames.map((filename) => parseContentFile(collection, filename)),
    );

    // Report every bad file at once — fixing content one build-error at a time
    // is needlessly slow.
    const failures = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );
    if (failures.length > 0) {
      throw new Error(
        `${failures.length} invalid file(s) in src/content/${CONTENT_COLLECTIONS[collection]}:\n\n` +
          failures
            .map((failure) =>
              failure.reason instanceof Error
                ? failure.reason.message
                : String(failure.reason),
            )
            .join("\n\n"),
      );
    }

    return results
      .map((result) => (result as PromiseFulfilledResult<ContentItem>).value)
      .sort(byDateDescending);
  },
);

/**
 * Every item in a collection, newest first. Throws on invalid frontmatter so
 * bad content fails the build instead of shipping a broken page.
 *
 * Returns a copy: the underlying array is memoized and shared across every
 * caller in the request, so an in-place `sort`/`reverse` by one page would
 * silently reorder the sitemap and every other consumer.
 */
export async function getCollection(
  collection: ContentCollection,
): Promise<ContentItem[]> {
  return [...(await loadCollection(collection))];
}

/** A single item, or `null` if no file matches the slug. */
export const getContentItem = cache(
  async (
    collection: ContentCollection,
    slug: string,
  ): Promise<ContentItem | null> => {
    const items = await loadCollection(collection);
    return items.find((item) => item.frontmatter.slug === slug) ?? null;
  },
);

/** Slugs for `generateStaticParams`. */
export async function getContentSlugs(
  collection: ContentCollection,
): Promise<string[]> {
  const items = await loadCollection(collection);
  return items.map((item) => item.frontmatter.slug);
}

/** Items flagged `featured: true`, newest first. */
export async function getFeatured(
  collection: ContentCollection,
  limit?: number,
): Promise<ContentItem[]> {
  const items = await loadCollection(collection);
  const featured = items.filter((item) => item.frontmatter.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export async function getByCategory(
  collection: ContentCollection,
  category: string,
): Promise<ContentItem[]> {
  const items = await loadCollection(collection);
  return items.filter(
    (item) =>
      item.frontmatter.category.toLowerCase() === category.toLowerCase(),
  );
}

export async function getByTag(
  collection: ContentCollection,
  tag: string,
): Promise<ContentItem[]> {
  const items = await loadCollection(collection);
  return items.filter((item) =>
    item.frontmatter.tags.some(
      (candidate) => candidate.toLowerCase() === tag.toLowerCase(),
    ),
  );
}

/** Distinct categories present in a collection, alphabetical. */
export async function getCategories(
  collection: ContentCollection,
): Promise<string[]> {
  const items = await loadCollection(collection);
  return [...new Set(items.map((item) => item.frontmatter.category))].sort();
}

/** Distinct tags present in a collection, alphabetical. */
export async function getTags(
  collection: ContentCollection,
): Promise<string[]> {
  const items = await loadCollection(collection);
  return [...new Set(items.flatMap((item) => item.frontmatter.tags))].sort();
}

/** Every item across every collection — used by the sitemap and RAG ingest. */
export const getAllContent = cache(async (): Promise<ContentItem[]> => {
  const collections = Object.keys(CONTENT_COLLECTIONS) as ContentCollection[];
  const results = await Promise.all(collections.map(loadCollection));
  // `.flat()` already produces a fresh array, so sorting it is safe.
  return results.flat().sort(byDateDescending);
});

// Collection-specific wrappers. Pages should prefer these — they read better
// and keep the collection key in one place.

export const getCaseStudies = () => getCollection("case-studies");
export const getCaseStudy = (slug: string) =>
  getContentItem("case-studies", slug);

export const getLabExperiments = () => getCollection("lab");
export const getLabExperiment = (slug: string) => getContentItem("lab", slug);

export const getBlogPosts = () => getCollection("blog");
export const getBlogPost = (slug: string) => getContentItem("blog", slug);

/**
 * Prose fragments under `src/content/about` (bio, background, etc.). These are
 * page copy rather than dated entries, so they use a looser contract than the
 * collections above.
 */
export const getAboutDocument = cache(
  async (slug: string): Promise<{ title?: string; body: string } | null> => {
    // Unlike the collection loaders, this builds a path straight from the
    // argument, so the slug has to be validated before it is interpolated.
    if (!SLUG_PATTERN.test(slug)) return null;

    for (const extension of CONTENT_EXTENSIONS) {
      try {
        const raw = await readFile(
          path.join(CONTENT_ROOT, "about", `${slug}${extension}`),
          "utf8",
        );
        const { data, content } = matter(raw);
        const title = typeof data.title === "string" ? data.title : undefined;
        return { title, body: content.trim() };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
        throw error;
      }
    }
    return null;
  },
);
