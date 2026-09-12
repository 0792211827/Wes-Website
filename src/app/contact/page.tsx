import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { ContactForm } from "@/components/sections";
import { isPlaceholder, secondaryNav, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Wesley Nyamosi about machine learning, data science or "
    + "consulting work.",
  pathname: "/contact",
});

export default function ContactPage() {
  const email = isPlaceholder(siteConfig.author.email)
    ? null
    : siteConfig.author.email;
  const elsewhere = secondaryNav.filter((item) => !isPlaceholder(item.href));

  return (
    <PageShell
      title="Contact"
      intro="Tell me what you are building and where it is getting stuck."
    >
      <ContactForm />

      {email || elsewhere.length > 0 ? (
        <div className="mt-16 border-t border-border pt-8">
          <h2 className="text-xs font-medium tracking-widest text-subtle uppercase">
            Or reach me directly
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {email ? (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-accent underline decoration-from-font"
                >
                  {email}
                </a>
              </li>
            ) : null}
            {elsewhere.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-accent underline decoration-from-font"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </PageShell>
  );
}
