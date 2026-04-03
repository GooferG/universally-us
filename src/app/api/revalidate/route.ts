import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

const SECRET = process.env.REVALIDATION_SECRET;

/**
 * On-demand revalidation endpoint
 *
 * Called by the WordPress WP Webhooks plugin whenever a post is
 * published, updated, or deleted.
 *
 * Expected payload from WordPress:
 * {
 *   "secret": "...",
 *   "slug": "post-slug",       // optional — revalidates that specific post
 *   "action": "publish" | "update" | "delete"
 * }
 *
 * Tags purged:
 *   "posts"       — home page latest posts, articles listing
 *   "post-{slug}" — individual post page (if slug provided)
 *   "categories"  — category list (for new categories on first post)
 */
export async function POST(req: NextRequest) {
  try {
    // Accept secret from query param (WP Webhooks style) or request body
    const querySecret = req.nextUrl.searchParams.get("secret");

    const body = await req.json();

    // WP Webhooks sends post_name for the slug; fall back to custom slug field
    const secret = querySecret ?? body.secret;
    const slug   = body.post_name ?? body.slug;
    const action = body.action ?? body.post_status;

    // Validate secret
    if (!SECRET || secret !== SECRET) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
    }

    // Always revalidate post listings and home page
    revalidateTag("posts");
    revalidatePath("/");
    revalidatePath("/articles");

    // If a specific slug is provided, revalidate that post page too
    if (slug) {
      revalidateTag(`post-${slug}`);
      revalidatePath(`/articles/${slug}`);
    }

    // On delete/trash, also revalidate categories in case one became empty
    if (action === "delete" || action === "trash") {
      revalidateTag("categories");
    }

    console.log(`[revalidate] action=${action ?? "unknown"} slug=${slug ?? "none"}`);

    return NextResponse.json({
      revalidated: true,
      slug: slug ?? null,
      action: action ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[revalidate] error:", err);
    return NextResponse.json({ error: "Revalidation failed." }, { status: 500 });
  }
}

// Allow WordPress to confirm the endpoint exists via GET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!SECRET || secret !== SECRET) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, message: "Revalidation endpoint is active." });
}
