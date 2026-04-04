"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WPUser {
  id: number;
  name: string;
  slug: string;
  registered_date: string;
  avatar_urls: Record<string, string>;
}

interface WPCommentEntry {
  id: number;
  post: number;
  date: string;
  status: string;
  content: { rendered: string };
  _embedded?: {
    up?: Array<{
      id: number;
      slug: string;
      title: { rendered: string };
      link: string;
    }>;
  };
}

interface ProfileData {
  user: WPUser;
  comments: WPCommentEntry[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-[#FAF5EE]">
        <div className="bg-[#F5EDE0] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-12 h-px bg-[#C4775A] mb-4" />
            <div className="h-8 w-48 bg-[#EEE0CC] rounded animate-pulse" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#EEE0CC] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] flex items-center justify-center">
        <p className="text-[#7A7470]">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { user, comments } = data;

  // Group comments by post, keeping only approved + hold (skip spam/trash)
  const visibleComments = comments.filter(
    (c) => c.status === "approved" || c.status === "hold"
  );

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF5EE]">
      {/* Header */}
      <div className="bg-[#F5EDE0] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-px bg-[#C4775A] mb-4" />
          <h1
            className="font-playfair text-[#2D2A27]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            My Profile
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* User card */}
        <div className="bg-white rounded-sm border border-[#EEE0CC] shadow-sm p-8 flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-[#EDD5CB] flex items-center justify-center flex-shrink-0 font-playfair text-[#C4775A] text-xl font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-playfair text-[#2D2A27] text-2xl">{user.name}</h2>
            <p className="text-[#7A7470] text-sm mt-1">
              Member since {formatDate(user.registered_date)}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="text-[#4A4540]">
                <span className="font-medium text-[#2D2A27]">{visibleComments.length}</span>{" "}
                {visibleComments.length === 1 ? "comment" : "comments"} posted
              </span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-[#7A7470] hover:text-[#C4775A] transition-colors flex-shrink-0"
          >
            Log Out
          </button>
        </div>

        {/* Comment history */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#C4775A]" />
            <h3 className="font-playfair text-[#2D2A27] text-xl">Your Comments</h3>
          </div>

          {visibleComments.length === 0 ? (
            <div className="bg-white rounded-sm border border-[#EEE0CC] p-8 text-center">
              <p className="text-[#B8B0A8] font-playfair italic mb-4">
                You haven&apos;t commented yet.
              </p>
              <Link href="/articles" className="btn-primary text-sm">
                Browse Articles
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleComments.map((comment) => {
                const post = comment._embedded?.up?.[0];
                const postTitle = post?.title?.rendered
                  ? stripHtml(post.title.rendered)
                  : "Article";
                const postSlug = post?.slug;

                return (
                  <div
                    key={comment.id}
                    className="bg-white rounded-sm border border-[#EEE0CC] shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        {postSlug ? (
                          <Link
                            href={`/articles/${postSlug}`}
                            className="font-playfair text-[#2D2A27] hover:text-[#C4775A] transition-colors font-medium"
                          >
                            {postTitle}
                          </Link>
                        ) : (
                          <span className="font-playfair text-[#2D2A27] font-medium">
                            {postTitle}
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <time className="text-[#B8B0A8] text-xs">
                            {formatDate(comment.date)}
                          </time>
                          {comment.status === "hold" && (
                            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Pending approval
                            </span>
                          )}
                        </div>
                      </div>
                      {postSlug && (
                        <Link
                          href={`/articles/${postSlug}#comments`}
                          className="text-xs text-[#C4775A] hover:text-[#A85E45] transition-colors flex-shrink-0"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                    <p className="text-[#4A4540] text-sm leading-relaxed line-clamp-3">
                      {stripHtml(comment.content.rendered)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
