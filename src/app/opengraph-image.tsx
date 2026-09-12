import { ImageResponse } from "next/og";
import { ogCard, siteConfig } from "@/config/site";

/**
 * Default social share card, generated at build time.
 *
 * Generated rather than committed as a binary so the palette stays tied to the
 * design tokens in src/styles/globals.css — a theme change here is a code
 * change, not a trip through an image editor.
 *
 * Applies to every route: Next uses the root-segment image for any page that
 * does not set `openGraph.images` itself, so a case study with an `image` in
 * its frontmatter still wins (see buildContentMetadata in src/lib/seo.ts).
 *
 * See the font note below.
 */

/**
 * Font note: @vercel/og ships exactly one face, Geist Regular
 * (node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf) — the same
 * typeface the site uses. There is no bold weight available offline, so
 * `fontWeight` is inert here and is deliberately not set: hierarchy comes from
 * size and colour instead. Loading a bold face would mean either a hashed path
 * into .next (unstable) or a network fetch at build time (fragile).
 */

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: ogCard.width, height: ogCard.height };
export const contentType = "image/png";

// Mirrors src/styles/globals.css. Kept literal: ImageResponse renders outside
// the browser, so CSS custom properties are not available here.
const COLORS = {
  background: "#0a0a0b",
  foreground: "#ededf0",
  muted: "#a1a1aa",
  border: "#26262b",
  accent: "#7dd3fc",
} as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: COLORS.background,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              border: `2px solid ${COLORS.accent}`,
              borderRadius: 8,
              color: COLORS.accent,
              fontSize: 24,
              letterSpacing: "0.02em",
            }}
          >
            WN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: COLORS.foreground,
              fontSize: 76,
              letterSpacing: "-0.03em",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              color: COLORS.muted,
              fontSize: 34,
              letterSpacing: "-0.01em",
            }}
          >
            AI engineer, builder, and independent AI consultant.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 3,
              backgroundColor: COLORS.accent,
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 20,
              color: COLORS.accent,
              fontSize: 28,
              letterSpacing: "-0.01em",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
