import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/** Static surface. For a clickable card, use `LinkCard`. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A card that is entirely one link.
 *
 * The whole card is the anchor rather than a "read more" link inside a div, so
 * there is exactly one tab stop per card and the accessible name is the card's
 * heading — no redundant links for screen-reader users to wade through.
 */
export function LinkCard({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg border border-border bg-surface p-6 transition-colors hover:border-subtle hover:bg-surface-raised",
        className,
      )}
    >
      {children}
    </Link>
  );
}
