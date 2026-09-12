import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { Prose } from "@/components/ui/prose";
import { isPlaceholder, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description: "What this site collects, what it stores, and what it sends to third "
    + "parties.",
  pathname: "/privacy",
});

/**
 * Describes actual behaviour, not intent.
 *
 * On CLAUDE.md §4 ("content lives in src/content"): this body is deliberately
 * kept in the component. It is not editorial content — it is a legal statement
 * that must track the code on the same commit, and it branches on config
 * (`isPlaceholder(email)`) rather than being static prose. Splitting it from
 * the behaviour it describes is how a privacy page goes stale.
 *
 * IMPORTANT: this page must be updated in the same change as any of these:
 *  - wiring an analytics provider (@/lib/analytics — `send()` is a no-op today)
 *  - wiring contact delivery (@/app/api/contact — returns 503, stores nothing)
 *  - shipping the assistant (@/app/api/assistant — returns 501)
 * A privacy page that describes the previous version of the site is worse than
 * no privacy page.
 */
const LAST_UPDATED = "12 September 2026";

export default function PrivacyPage() {
  const email = isPlaceholder(siteConfig.author.email)
    ? null
    : siteConfig.author.email;

  return (
    <PageShell
      title="Privacy"
      intro="This site is deliberately boring about data. Here is exactly what it does."
    >
      <Prose className="max-w-2xl">
        <h2>Analytics</h2>
        <p>
          No analytics provider is currently connected, and no analytics
          requests leave your browser. When one is added it will be a cookieless
          provider that records aggregate page views only — no cookies, no
          cross-site identifiers, and Do Not Track respected. This page will be
          updated before that happens.
        </p>

        <h2>The contact form</h2>
        <p>
          The contact form validates what you type in your browser. Message
          delivery is not connected yet, so submissions are not sent, stored, or
          written to a database — the form will tell you so and ask you to email
          instead. Once delivery is wired up, what you submit (your name, email
          address and message) will be sent to me by email and used only to
          reply to you.
        </p>

        <h2>The AI assistant</h2>
        <p>
          &ldquo;Ask My AI&rdquo; is not available yet. When it ships it will
          answer only from content published on this site, and the contents of
          your questions will not be stored.
        </p>

        <h2>Hosting and logs</h2>
        <p>
          Like any website, the server that hosts this one records standard
          request logs, which can include IP addresses. These are used to keep
          the site running and are not combined with anything else or used to
          build a profile of you.
        </p>

        <h2>Third parties</h2>
        <p>
          Fonts are served from this site&rsquo;s own domain rather than a
          third-party font CDN. External links — to GitHub, LinkedIn and similar
          — are plain links; those sites have their own privacy policies, and
          nothing about you is passed to them until you click.
        </p>

        <h2>Questions</h2>
        <p>
          {email ? (
            <>
              If you want to know what I hold about you, or want it deleted,
              email <a href={`mailto:${email}`}>{email}</a>.
            </>
          ) : (
            <>
              If you want to know what I hold about you, or want it deleted, get
              in touch via the contact page.
            </>
          )}
        </p>

        <p>
          <small>Last updated: {LAST_UPDATED}</small>
        </p>
      </Prose>
    </PageShell>
  );
}
