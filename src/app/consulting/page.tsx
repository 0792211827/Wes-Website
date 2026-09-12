import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { services } from "@/config/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Consulting",
  description: "Independent AI and machine learning consulting with Wesley Nyamosi — "
    + "modelling, evaluation and deployment work.",
  pathname: "/consulting",
});

export default function ConsultingPage() {
  return (
    <PageShell title="Consulting">
      {services.length === 0 ? (
        <EmptyState
          title="Services not written yet"
          description="Engagements are arranged case by case for now. Tell me what you are working on and I will say whether I can help."
          action={
            <ButtonLink href="/contact" variant="secondary">
              Get in touch
            </ButtonLink>
          }
        />
      ) : (
        <>
          <ul className="grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug} className="flex">
                <Card className="flex w-full flex-col">
                  <h2 className="text-base text-foreground">{service.title}</h2>
                  <p className="mt-2 text-sm text-muted">{service.summary}</p>

                  {service.deliverables.length > 0 ? (
                    <>
                      <h3 className="mt-6 text-xs font-medium tracking-widest text-subtle uppercase">
                        Deliverables
                      </h3>
                      <ul className="mt-3 flex-1 space-y-1.5">
                        {service.deliverables.map((deliverable) => (
                          <li key={deliverable} className="text-sm text-muted">
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {service.engagement ? (
                    <p className="mt-6 text-xs text-subtle">
                      Typical engagement: {service.engagement}
                    </p>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </div>
        </>
      )}
    </PageShell>
  );
}
