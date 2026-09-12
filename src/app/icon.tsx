import { ImageResponse } from "next/og";

/**
 * Browser tab icon, generated at build time.
 *
 * A generated `icon` rather than a committed `favicon.ico`: Next cannot
 * generate .ico (see the app-icons docs), and one letterform in the brand
 * accent is all that survives 32px legibly.
 *
 * Geist Regular is the only face @vercel/og ships, so weight cannot be set;
 * see the note in opengraph-image.tsx.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Mirrors --background / --accent in src/styles/globals.css.
          backgroundColor: "#0a0a0b",
          color: "#7dd3fc",
          fontSize: 22,
          borderRadius: 6,
        }}
      >
        W
      </div>
    ),
    { ...size },
  );
}
