import type { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Long-form MDX wrapper.
 *
 * `prose-invert` matches the dark-first default; the token overrides keep body
 * copy on the same palette as the rest of the site rather than Tailwind
 * Typography's own greys.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:text-muted prose-li:text-muted",
        "prose-a:text-accent prose-a:underline prose-a:decoration-from-font",
        "prose-code:rounded prose-code:bg-surface-raised prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:border prose-pre:border-border prose-pre:bg-surface",
        "prose-blockquote:border-l-border prose-blockquote:text-muted prose-blockquote:not-italic",
        "prose-hr:border-border prose-strong:text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
