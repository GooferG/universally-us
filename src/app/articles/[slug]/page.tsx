import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllSlugs,
  getComments,
  getFeaturedImage,
  getCategories2,
  getAuthor,
  formatDate,
  stripHtml,
} from "@/lib/api";
import Comments from "@/components/Comments";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  const imageUrl = getFeaturedImage(post);
  return {
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
    openGraph: imageUrl ? { images: [{ url: imageUrl }] } : undefined,
  };
}

export default async function SinglePostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const [imageUrl, categories, author, initialComments] = await Promise.all([
    Promise.resolve(getFeaturedImage(post)),
    Promise.resolve(getCategories2(post)),
    Promise.resolve(getAuthor(post)),
    getComments(post.id),
  ]);

  return (
    <article className="min-h-screen bg-[#FAF5EE]">
      {/* Featured image */}
      {imageUrl && (
        <div className="relative w-full bg-[#F0E8DC]" style={{ aspectRatio: "21/9" }}>
          <Image
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF5EE]/60 to-transparent" />
        </div>
      )}

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-[#C4775A] text-sm font-medium hover:text-[#A85E45] transition-colors mb-10"
        >
          <span aria-hidden="true">←</span> Back to Articles
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="text-[#C4775A] text-xs font-medium tracking-[0.15em] uppercase"
            >
              {cat.name}
            </span>
          ))}
          {categories.length > 0 && <span className="text-[#D4C4B0]">·</span>}
          <time className="text-[#B8B0A8] text-sm">{formatDate(post.date)}</time>
          <span className="text-[#D4C4B0]">·</span>
          <span className="text-[#B8B0A8] text-sm">By {author}</span>
        </div>

        {/* Title */}
        <h1
          className="font-playfair text-[#2D2A27] mb-10 leading-tight"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Divider */}
        <div className="w-16 h-px bg-[#C4775A] mb-10" />

        {/* Body content */}
        <div
          className="prose prose-lg max-w-none wp-content
            prose-headings:font-playfair prose-headings:text-[#2D2A27]
            prose-p:text-[#4A4540] prose-p:leading-relaxed
            prose-a:text-[#C4775A] prose-a:no-underline hover:prose-a:text-[#A85E45]
            prose-strong:text-[#2D2A27]
            prose-blockquote:border-l-[#C4775A] prose-blockquote:text-[#7A7470]
            prose-img:rounded-sm prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Bottom divider */}
        <div className="w-16 h-px bg-[#EEE0CC] mt-16" />

        {/* WordPress Comments */}
        <Comments postId={post.id} initialComments={initialComments} />

        {/* Back to articles */}
        <div className="mt-12">
          <Link href="/articles" className="btn-outline">
            ← Back to Articles
          </Link>
        </div>
      </div>
    </article>
  );
}
