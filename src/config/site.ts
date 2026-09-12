import type { NavItem } from "@/types";

/**
 * Single source of truth for site metadata, navigation and external links.
 *
 * URL values below are PLACEHOLDERS — replace every `TODO:` string before
 * deploying. They are deliberately left obviously wrong rather than guessed,
 * so a missed one is visible instead of silently pointing somewhere real.
 */

export const siteConfig = {
  name: "Wesley Nyamosi",
  /** Used for `<title>` templates and OG metadata. */
  title: "Wesley Nyamosi — AI Engineer & Consultant",
  tagline: "Production matters more than demos.",
  description:
    "Wesley Nyamosi builds predictive models, NLP systems and the data " +
    "pipelines behind them.",
  /** Canonical origin, no trailing slash. Required for canonical URLs + sitemap. */
  url: "TODO: https://example.com",
  locale: "en_US",
  /**
   * Optional override for the default share card. Leave empty: the card is
   * generated from these very tokens at build time by
   * src/app/opengraph-image.tsx. Only set this to ship a hand-designed asset
   * instead, as a path under /public or an absolute URL.
   */
  ogImage: "",
  author: {
    name: "Wesley Nyamosi",
    email: "nyamosiwesley02@gmail.com",
  },
} as const;

/**
 * The generated default share card.
 *
 * Single source of truth for both producer and consumer:
 * src/app/opengraph-image.tsx renders at these dimensions, and src/lib/seo.ts
 * points `og:image` at this route. Next serves it with a cache-busting query,
 * but the bare path is stable and is what the metadata references.
 */
export const ogCard = {
  route: "/opengraph-image",
  width: 1200,
  height: 630,
} as const;

/** Primary navigation, in header order. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Consulting", href: "/consulting" },
  { label: "AI Lab", href: "/lab" },
  { label: "Writing", href: "/writing" },
  { label: "Ask My AI", href: "/ask" },
  { label: "Contact", href: "/contact" },
];

/** Secondary / external links, surfaced in the footer and About page. */
export const secondaryNav: NavItem[] = [
  { label: "GitHub", href: "TODO: https://github.com/USERNAME", external: true },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/wesley-nyamosi-809409251",
    external: true,
  },
  { label: "CV", href: "TODO: /cv.pdf", external: true },
  {
    label: "Email",
    href: "mailto:nyamosiwesley02@gmail.com",
    external: true,
  },
];

/** Footer-only internal links. */
export const utilityNav: NavItem[] = [{ label: "Privacy", href: "/privacy" }];

/**
 * True while a link still holds its placeholder value. Layout components use
 * this to avoid rendering a link that goes nowhere.
 */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO:");
}
