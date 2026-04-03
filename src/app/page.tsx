import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import BookCover from "@/components/BookCover";

export const metadata: Metadata = {
  title: "Universally Us — Support for Women Healing from Narcissistic Relationships",
  description:
    "You are not alone. Find support, community, and healing from narcissistic relationships at Universally Us.",
};

const HERO_IMAGE = "https://w4n.08a.mytemp.website/wp-content/uploads/2025/07/calm-woman-by-lake.webp";
const JOIN_IMAGE = "https://w4n.08a.mytemp.website/wp-content/uploads/2025/07/woman-blindfold-lifted.webp";

export default async function HomePage() {
  const { posts } = await getPosts(1, 3);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <Image
          src={HERO_IMAGE}
          alt="A woman sitting peacefully by a calm lake"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Warm overlay so text remains readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(237,213,203,0.88) 0%, rgba(212,181,160,0.80) 50%, rgba(180,140,115,0.65) 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <p className="section-eyebrow animate-fade-in-up">Support for You</p>
            <h1
              className="font-playfair text-[#2D2A27] text-balance animate-fade-in-up delay-100"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15 }}
            >
              Navigating and healing from narcissistic relationships doesn&apos;t have to be a solo
              mission. You are not alone.
            </h1>
            <p className="mt-6 text-[#4A4540] text-lg leading-relaxed max-w-2xl animate-fade-in-up delay-200">
              Suffering through a narcissistic relationship doesn&apos;t have to be your fate. You
              matter, and you&apos;re not alone. Find your support network here at Universally Us.
            </p>
            <div className="mt-10 animate-fade-in-up delay-300">
              <Link href="/articles" className="btn-primary">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade into page */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: "linear-gradient(to bottom, transparent, #FAF5EE)" }}
        />
      </section>

      {/* ── WELCOME ── */}
      <section className="py-24 bg-[#FAF5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-px bg-[#C4775A] mx-auto mb-8" />
            <h2
              className="font-playfair text-[#2D2A27] mb-8"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
            >
              Welcome to Universally Us: Together We Stand
            </h2>
            <p className="text-[#4A4540] text-lg leading-relaxed">
              If you are in a narcissistic relationship, you&apos;re not alone. Whether you&apos;re
              leaving, raising children, or starting over from the ashes of an abusive relationship,
              you&apos;ll find understanding and supportive friends here. Together we share our
              confusion and fear, our anguish, and our tears. But together we also discover our
              strength. This is our story. This is us. Universally us.
            </p>
            <div className="w-16 h-px bg-[#C4775A] mx-auto mt-8" />
          </div>
        </div>
      </section>

      {/* ── JOIN US ── */}
      <section className="py-24 bg-[#F5EDE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div
                className="w-full rounded-sm overflow-hidden shadow-xl relative"
                style={{ aspectRatio: "4/5" }}
              >
                <Image
                  src={JOIN_IMAGE}
                  alt="A woman removing a blindfold, stepping into clarity and light"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative offset border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C4775A]/20 rounded-sm -z-10" />
            </div>

            {/* Text */}
            <div>
              <p className="section-eyebrow">Join Our Community</p>
              <h2
                className="font-playfair text-[#2D2A27] mb-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
              >
                Universally Us Invites You to Join Us
              </h2>
              <p className="text-[#4A4540] leading-relaxed mb-5">
                Your voice matters. Share your story, connect with others who understand, and find
                the clarity you are seeking on your journey of healing.
              </p>
              <p className="text-[#4A4540] leading-relaxed mb-8">
                For your safety, your privacy is always completely protected here. Your information
                will <strong className="text-[#2D2A27]">NEVER</strong> be shared, sold, or otherwise
                given to any third parties. Because privacy is paramount, your information is also
                safe within the community. Names don&apos;t matter here. Only support and healing.
              </p>
              <Link href="/register" className="btn-primary">
                Join In <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOOKS PREVIEW ── */}
      <section className="py-24 bg-[#2D2A27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C4775A] text-xs font-medium tracking-[0.2em] uppercase mb-4">
                The Books
              </p>
              <h2
                className="font-playfair text-[#FAF5EE] mb-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                LEAVING YOU... <em>for me</em>
              </h2>
              <p className="text-[#B8B0A8] leading-relaxed mb-8">
                While there are any number of dating guides out there – few books speak honestly to
                the trials, tribulations, poignancy and humor of re-entering the dating pool after a
                long, monogamous relationship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/books" className="btn-outline-cream">
                  Read a Sample
                </Link>
                <a
                  href="https://www.amazon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Buy Now on Amazon
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <BookCover className="w-full max-w-xs" />
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST ARTICLES ── */}
      <section className="py-24 bg-[#FAF5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="w-12 h-px bg-[#C4775A] mb-4" />
              <h2
                className="font-playfair text-[#2D2A27]"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}
              >
                Latest Articles
              </h2>
            </div>
            <Link
              href="/articles"
              className="text-[#C4775A] text-sm font-medium hover:text-[#A85E45] transition-colors flex items-center gap-2 flex-shrink-0"
            >
              View All Articles <span aria-hidden="true">→</span>
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#B8B0A8] font-playfair italic text-lg">
                Articles coming soon — check back!
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/articles" className="btn-outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
