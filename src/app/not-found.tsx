import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Not found",
  description:
    "That page does not exist. Browse the work, writing and experiments instead.",
  // Not a real route; `noIndex` suppresses the canonical (see buildMetadata).
  pathname: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <PageShell title="Not found" intro="That page does not exist.">
      <Link href="/" className="text-sm text-accent underline">
        Back to home
      </Link>
    </PageShell>
  );
}
