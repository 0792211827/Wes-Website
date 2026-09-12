import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { primaryNav, siteConfig } from "@/config/site";
import { buildRootMetadata } from "@/lib/seo";
import "@/styles/globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = buildRootMetadata();

/** Dark-first: the browser UI should match before any CSS loads. */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:border focus:border-border focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-sm focus:text-foreground"
        >
          Skip to content
        </a>
        <SiteHeader siteName={siteConfig.name} items={primaryNav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/*
          TODO(Phase 3): mount the assistant widget here via next/dynamic so it
          loads independently and never blocks first paint (CLAUDE.md §4).
        */}
      </body>
    </html>
  );
}
