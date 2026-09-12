import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Prose } from "@/components/ui/prose";

/**
 * Renders an MDX body from `src/content`.
 *
 * Plugins are duplicated from `next.config.ts` on purpose: that config governs
 * MDX *routes*, while this compiles MDX loaded from disk at render time. The
 * two paths are separate and each needs its own plugin list. Here they can be
 * imported directly — nothing serialises these options.
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <Prose>
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ],
          },
        }}
      />
    </Prose>
  );
}
