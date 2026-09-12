import { Container } from "@/components/ui/container";
import { philosophy } from "@/config/home";
import { isPlaceholder } from "@/config/site";

/**
 * The site's position, stated once. Uses a `<blockquote>` because the statement
 * is a quotation of the north star, not a section heading.
 */
export function Philosophy() {
  const body = isPlaceholder(philosophy.body) ? null : philosophy.body;
  const headingId = "philosophy-title";

  return (
    <section
      id="philosophy"
      aria-labelledby={headingId}
      className="border-b border-border"
    >
      <Container className="py-16 sm:py-24">
        <h2 id={headingId} className="sr-only">
          Philosophy
        </h2>

        <blockquote className="max-w-3xl">
          <p className="text-2xl leading-snug font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            {philosophy.statement}
          </p>
        </blockquote>

        {body ? (
          <p className="mt-6 max-w-2xl text-base text-muted">{body}</p>
        ) : (
          <p className="mt-6 max-w-2xl rounded border border-dashed border-border px-3 py-2 text-sm text-subtle">
            {philosophy.body}
          </p>
        )}

        {philosophy.principles.length > 0 ? (
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {philosophy.principles.map((principle) => (
              <div key={principle.title}>
                <dt className="text-sm font-semibold text-foreground">
                  {principle.title}
                </dt>
                <dd className="mt-2 text-sm text-muted">{principle.body}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}
