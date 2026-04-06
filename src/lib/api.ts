/**
 * WordPress REST API utilities for Universally Us
 *
 * Base URL: https://w4n.08a.mytemp.website/wp-json/wp/v2
 *
 * NOTE: If you encounter CORS issues in development, either:
 *   1. Add `Access-Control-Allow-Origin: *` headers on the WordPress server, or
 *   2. Proxy through Next.js API routes (src/app/api/...)
 *
 * Cache tags used for on-demand revalidation:
 *   "posts"      — all post listings (home, articles page)
 *   "post-{slug}" — individual post page
 *   "categories" — category filter list
 */

const BASE_URL = process.env.WP_API_URL
  ? `${process.env.WP_API_URL}/wp/v2`
  : "https://w4n.08a.mytemp.website/wp-json/wp/v2";

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  categories?: number[];
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
      media_details?: { sizes?: { medium?: { source_url: string } } };
    }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{
      name: string;
      description?: string;
      avatar_urls?: Record<string, string>;
    }>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getPosts(
  page = 1,
  perPage = 10,
  categoryId?: number
): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const params = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    page: String(page),
  });
  if (categoryId) params.append("categories", String(categoryId));

  try {
    const res = await fetch(`${BASE_URL}/posts?${params}`, {
      next: { tags: ["posts"] },
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    const posts: WPPost[] = await res.json();
    const total = parseInt(res.headers.get("X-WP-Total") || "0", 10);
    const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
    return { posts, total, totalPages };
  } catch (error) {
    console.error("getPosts error:", error);
    return { posts: [], total: 0, totalPages: 0 };
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${BASE_URL}/posts?slug=${slug}&_embed`, {
      next: { tags: ["posts", `post-${slug}`] },
    });
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    const posts: WPPost[] = await res.json();
    return posts[0] ?? null;
  } catch (error) {
    console.error("getPostBySlug error:", error);
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/posts?per_page=100&_fields=slug`, {
      next: { tags: ["posts"] },
    });
    if (!res.ok) throw new Error(`Failed to fetch slugs: ${res.status}`);
    const posts: Array<{ slug: string }> = await res.json();
    return posts.map((p) => p.slug);
  } catch (error) {
    console.error("getAllSlugs error:", error);
    return [];
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories?per_page=50&hide_empty=true`, {
      next: { tags: ["categories"] },
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    const cats: WPCategory[] = await res.json();
    return cats.filter((c) => c.count > 0);
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  status: string;
}

export interface SubmitCommentPayload {
  postId: number;
  authorName: string;
  authorEmail: string;
  content: string;
}

export async function getComments(postId: number): Promise<WPComment[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/comments?post=${postId}&per_page=50&order=asc&status=approve`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("getComments error:", error);
    return [];
  }
}

export async function submitComment(
  payload: SubmitCommentPayload,
  wpToken?: string
): Promise<{ ok: boolean; comment?: WPComment; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (wpToken) headers["Authorization"] = `Bearer ${wpToken}`;

    const body: Record<string, unknown> = {
      post: payload.postId,
      content: payload.content,
    };

    // When authenticated, omit author fields — WordPress assigns them from
    // the JWT token so the comment is linked to the user account (author ID > 0).
    // For guest comments, pass the fields explicitly.
    if (!wpToken) {
      body.author_name = payload.authorName;
      body.author_email = payload.authorEmail;
    }

    const res = await fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      const comment: WPComment = await res.json();
      return { ok: true, comment };
    }

    if (res.status === 409) {
      return { ok: false, error: "You already submitted that comment." };
    }

    const errBody = await res.json().catch(() => ({}));
    return { ok: false, error: errBody?.message ?? "Failed to submit comment." };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}

// Helpers
export function getFeaturedImage(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export function getCategories2(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

export function getAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? "Universally Us";
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").trim();
}

export async function deleteComment(
  commentId: number,
  wpToken: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/comments/${commentId}?force=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${wpToken}` },
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body?.message ?? "Failed to delete comment." };
  } catch {
    return { ok: false, error: "Network error." };
  }
}

export function getAuthorAvatar(post: WPPost): string | null {
  const urls = post._embedded?.author?.[0]?.avatar_urls;
  if (!urls) return null;
  return urls["96"] ?? urls["48"] ?? Object.values(urls)[0] ?? null;
}

export function getAuthorBio(post: WPPost): string {
  return post._embedded?.author?.[0]?.description ?? "";
}

export async function getRelatedPosts(
  categoryId: number,
  excludeSlug: string,
  limit = 3
): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/posts?categories=${categoryId}&per_page=${limit + 1}&_embed=1`,
      { next: { tags: ["posts"] } }
    );
    if (!res.ok) return [];
    const posts: WPPost[] = await res.json();
    return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
  } catch {
    return [];
  }
}
