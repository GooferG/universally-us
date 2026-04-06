import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllSlugs,
  getComments,
  getRelatedPosts,
  getFeaturedImage,
  getCategories2,
  getAuthor,
  getAuthorAvatar,
  getAuthorBio,
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

  const imageUrl = getFeaturedImage(post);
  const categories = getCategories2(post);
  const author = getAuthor(post);
  const authorAvatar = getAuthorAvatar(post);
  const authorBio = getAuthorBio(post);
  const firstCategoryId = categories[0]?.id ?? post.categories?.[0];

  const [initialComments, relatedPosts] = await Promise.all([
    getComments(post.id),
    firstCategoryId ? getRelatedPosts(firstCategoryId, post.slug) : Promise.resolve([]),
  ]);

  const authorInitials = author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="min-h-screen bg-[#FAF5EE]">
      {/* Featured image — full width */}
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

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">

          {/* ── Main article column ── */}
          <div>
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

            {/* Body */}
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

            {/* Comments */}
            <Comments postId={post.id} initialComments={initialComments} />

            {/* Back to articles */}
            <div className="mt-12">
              <Link href="/articles" className="btn-outline">
                ← Back to Articles
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-28 space-y-8">

            {/* Author card */}
            <div className="bg-white rounded-sm border border-[#EEE0CC] shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#EDD5CB] flex items-center justify-center flex-shrink-0 font-playfair text-[#C4775A] font-medium">
                    {authorInitials}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[#2D2A27] text-sm">{author}</p>
                  <p className="text-[#B8B0A8] text-xs">Author</p>
                </div>
              </div>
              {authorBio && (
                <p className="text-[#7A7470] text-sm leading-relaxed">{authorBio}</p>
              )}
              {!authorBio && (
                <p className="text-[#7A7470] text-sm leading-relaxed">
                  Writing to support women on their journey of healing from narcissistic
                  relationships.
                </p>
              )}
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-sm border border-[#EEE0CC] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-[#C4775A]" />
                  <h2 className="font-playfair text-[#2D2A27] text-base">Related Articles</h2>
                </div>
                <div className="space-y-5">
                  {relatedPosts.map((related) => {
                    const relatedImage = getFeaturedImage(related);
                    const relatedTitle = stripHtml(related.title.rendered);
                    return (
                      <Link
                        key={related.id}
                        href={`/articles/${related.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 flex-shrink-0 bg-[#F0E8DC] rounded-sm overflow-hidden">
                          {relatedImage ? (
                            <Image
                              src={relatedImage}
                              alt={relatedTitle}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="64px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-px bg-[#C4775A]/40" />
                            </div>
                          )}
                        </div>
                        {/* Title + date */}
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair text-[#2D2A27] text-sm leading-snug group-hover:text-[#C4775A] transition-colors line-clamp-2">
                            {relatedTitle}
                          </p>
                          <p className="text-[#B8B0A8] text-xs mt-1">
                            {formatDate(related.date)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-5 pt-5 border-t border-[#EEE0CC]">
                  <Link
                    href="/articles"
                    className="text-[#C4775A] text-sm font-medium hover:text-[#A85E45] transition-colors"
                  >
                    View all articles →
                  </Link>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-[#F5EDE0] rounded-sm border border-[#EDD5CB] p-6 text-center">
              <div className="w-8 h-px bg-[#C4775A] mx-auto mb-4" />
              <p className="font-playfair text-[#2D2A27] text-base mb-2">
                You are not alone.
              </p>
              <p className="text-[#7A7470] text-sm leading-relaxed mb-5">
                Support and guidance for women healing from narcissistic relationships.
              </p>
              <Link href="/get-help" className="btn-primary text-sm w-full block text-center">
                Get Help
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </article>
  );
}
