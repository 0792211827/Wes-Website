import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/cn";

/**
 * A titled page section.
 *
 * Renders its heading as `<h2>`, which is correct everywhere it is used: every
 * page supplies exactly one `<h1>` (the hero, or `PageShell`).
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  bordered = false,
}: {
  id?: string;
  /** Short label above the heading. Decorative — not a heading level. */
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  const headingId = id ? `${id}-title` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-24", bordered && "border-t border-border", className)}
    >
      <Container>
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-medium tracking-widest text-subtle uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 id={headingId} className={cn(eyebrow && "mt-3")}>
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base text-muted">{description}</p>
          ) : null}
        </div>
        {children ? <div className="mt-12">{children}</div> : null}
      </Container>
    </section>
  );
}
