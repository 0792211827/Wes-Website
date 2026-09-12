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
  /** Default social share image, relative to /public. Kept `TODO:`-prefixed
   * so `isPlaceholder` suppresses the `og:image` tag until the asset exists. */
  ogImage: "TODO: /images/og-default.png",
  author: {
    name: "Wesley Nyamosi",
    email: "nyamosiwesley02@gmail.com",
  },
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
