import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentHeader } from "@/components/sections";
import { Container } from "@/components/ui/container";
import { MdxContent } from "@/components/ui/mdx-content";
import { getBlogPost, getContentSlugs } from "@/lib/content";
import { buildContentMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getContentSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getBlogPost(slug);
  if (!item) return {};
  return buildContentMetadata(item);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getBlogPost(slug);
  if (!item) notFound();

  return (
    <article>
      <Container width="prose" className="py-16 sm:py-24">
        <ContentHeader item={item} />
        {item.body ? (
          <div className="mt-12 border-t border-border pt-12">
            <MdxContent source={item.body} />
          </div>
        ) : null}
      </Container>
    </article>
  );
}
