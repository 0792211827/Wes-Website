import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes are not content. `/ask` is deliberately NOT disallowed:
      // it is linked site-wide, and a disallowed URL can still be indexed
      // URL-only. Letting crawlers fetch it lets them see its `noindex`
      // (set in src/app/ask/page.tsx), which actually keeps it out.
      disallow: ["/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
