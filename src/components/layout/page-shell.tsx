import type { ReactNode } from "react";

/**
 * Standard page wrapper: consistent max width, gutters and heading structure.
 *
 * Pages render exactly one `<h1>`, supplied here, so heading hierarchy stays
 * correct across the site (CLAUDE.md §4).
 */
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  /** Optional single-paragraph lede under the h1. */
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="max-w-2xl">
        <h1>{title}</h1>
        {intro ? <p className="mt-4 text-base text-muted">{intro}</p> : null}
      </header>
      {children ? <div className="mt-14">{children}</div> : null}
    </div>
  );
}
