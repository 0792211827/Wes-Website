import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { hero } from "@/config/home";
import { isPlaceholder } from "@/config/site";

/**
 * Homepage hero. Supplies the page's single `<h1>`.
 *
 * No animation: nothing here represents a system or a data flow, so motion
 * would be decoration (CLAUDE.md §2).
 */
export function Hero() {
  const subhead = isPlaceholder(hero.subhead) ? null : hero.subhead;

  return (
    <section className="border-b border-border">
      <Container className="py-20 sm:py-32">
        <div className="max-w-3xl">
          <h1 className="text-balance">{hero.headline}</h1>

          {subhead ? (
            <p className="mt-6 max-w-2xl text-lg text-muted">{subhead}</p>
          ) : (
            <p className="mt-6 max-w-2xl rounded border border-dashed border-border px-3 py-2 text-sm text-subtle">
              {hero.subhead}
            </p>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
