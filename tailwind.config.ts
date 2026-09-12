import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

/**
 * Tailwind v4 is CSS-first: the design tokens live in `src/styles/globals.css`
 * under `@theme`. This file is loaded from there via `@config` and exists for
 * the things that still belong in JS — plugins and explicit content globs.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,md,mdx}",
    "./src/components/**/*.{ts,tsx,md,mdx}",
    "./src/content/**/*.{md,mdx}",
  ],
  plugins: [typography],
};

export default config;
