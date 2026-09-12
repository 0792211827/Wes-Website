import Link from "next/link";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { expertise } from "@/config/home";

/**
 * What Wesley works on. Each area links to its evidence where there is some —
 * an area with no backing content is a claim without a source (CLAUDE.md §2).
 */
export function Expertise() {
  return (
    <Section
      id="expertise"
      eyebrow="Expertise"
      title="What I work on"
      bordered
    >
      {expertise.length === 0 ? (
        <EmptyState
          title="Not written yet"
          description="Areas of expertise are defined in src/config/home.ts. Each one should point at a case study or Lab experiment that demonstrates it."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((area) => (
            <li key={area.title} className="flex">
              <Card className="flex w-full flex-col">
                <h3 className="text-base text-foreground">{area.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{area.body}</p>
                {area.href ? (
                  <Link
                    href={area.href}
                    className="mt-4 text-sm text-accent underline decoration-from-font"
                  >
                    See the work
                  </Link>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
