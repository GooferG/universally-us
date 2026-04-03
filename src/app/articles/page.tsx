"use client";

import { useState, useEffect, useCallback } from "react";
import { getPosts, getCategories, WPPost, WPCategory } from "@/lib/api";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import LoadingSpinner from "@/components/LoadingSpinner";

const PER_PAGE = 9;

export default function ArticlesPage() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts: fetched, totalPages: tp } = await getPosts(
        page,
        PER_PAGE,
        activeCategoryId ?? undefined
      );
      setPosts(fetched);
      setTotalPages(tp);
    } catch {
      setError("Unable to load articles right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, activeCategoryId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset page when category changes
  const handleCategoryChange = (id: number | null) => {
    setActiveCategoryId(id);
    setPage(1);
  };

  // Client-side search filter
  const filteredPosts = search.trim()
    ? posts.filter((p) =>
        p.title.rendered.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-[#FAF5EE]">
      {/* Page header */}
      <div className="bg-[#F5EDE0] py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-px bg-[#C4775A] mb-4" />
          <h1
            className="font-playfair text-[#2D2A27]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Articles
          </h1>
          <p className="text-[#7A7470] mt-2">
            Insights, guidance, and stories for your healing journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Search + filters */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          {categories.length > 0 && (
            <CategoryFilter
              categories={categories}
              activeId={activeCategoryId}
              onChange={handleCategoryChange}
            />
          )}
        </div>

        {/* Posts grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-[#C4775A] font-playfair italic">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#B8B0A8] font-playfair italic text-lg">
              {search ? `No articles match "${search}"` : "No articles found in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!search && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 border border-[#D4C4B0] text-sm font-medium text-[#4A4540] hover:border-[#C4775A] hover:text-[#C4775A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-10 h-10 text-sm font-medium transition-colors border ${
                  n === page
                    ? "bg-[#C4775A] border-[#C4775A] text-white"
                    : "border-[#D4C4B0] text-[#4A4540] hover:border-[#C4775A] hover:text-[#C4775A]"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2.5 border border-[#D4C4B0] text-sm font-medium text-[#4A4540] hover:border-[#C4775A] hover:text-[#C4775A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
