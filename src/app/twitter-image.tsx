/**
 * Twitter/X share card.
 *
 * Re-exports the Open Graph card rather than defining a second design — the
 * dimensions X wants for `summary_large_image` are the same 1200x630.
 */
export { default, alt, size, contentType } from "./opengraph-image";
