import Link from "next/link";
import Image from "next/image";
import { WPPost, getFeaturedImage, getCategories2, formatDate, stripHtml } from "@/lib/api";

interface PostCardProps {
  post: WPPost;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = getFeaturedImage(post);
  const categories = getCategories2(post);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 140) + "…";
  const title = stripHtml(post.title.rendered);

  return (
    <article className="group bg-white rounded-sm overflow-hidden card-hover border border-[#EEE0CC]/50">
      {/* Featured Image */}
      <Link href={`/articles/${post.slug}`} className="block overflow-hidden aspect-[16/9] relative bg-[#F0E8DC]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-px bg-[#C4775A]/30 mx-auto mb-3" />
              <p className="font-playfair text-[#B8B0A8] italic text-sm">Universally Us</p>
              <div className="w-12 h-px bg-[#C4775A]/30 mx-auto mt-3" />
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category + Date */}
        <div className="flex items-center gap-3 mb-3">
          {categories[0] && (
            <span className="text-[#C4775A] text-xs font-medium tracking-[0.15em] uppercase">
              {categories[0].name}
            </span>
          )}
          {categories[0] && <span className="text-[#B8B0A8] text-xs">·</span>}
          <span className="text-[#B8B0A8] text-xs">{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <Link href={`/articles/${post.slug}`}>
          <h3
            className="font-playfair text-[#2D2A27] text-xl leading-snug mb-3 group-hover:text-[#C4775A] transition-colors duration-200"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        {/* Excerpt */}
        <p className="text-[#7A7470] text-sm leading-relaxed mb-5">{excerpt}</p>

        {/* Read More */}
        <Link
          href={`/articles/${post.slug}`}
          className="inline-flex items-center gap-2 text-[#C4775A] text-sm font-medium hover:gap-3 transition-all duration-200"
        >
          Read Article
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
