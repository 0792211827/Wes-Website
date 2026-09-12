import { ImageResponse } from "next/og";

/**
 * Home-screen icon for iOS. Same mark as `icon.tsx`, but at 180px there is
 * room for the full monogram and a border.
 *
 * Geist Regular is the only face @vercel/og ships, so weight cannot be set;
 * see the note in opengraph-image.tsx.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 72,
          letterSpacing: "-0.02em",
        }}
      >
        WN
      </div>
    ),
    { ...size },
  );
}
