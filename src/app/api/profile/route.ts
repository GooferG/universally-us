import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const WP_API = process.env.WP_API_URL!;

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.wpToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = { Authorization: `Bearer ${session.wpToken}` };

  try {
    const userRes = await fetch(`${WP_API}/wp/v2/users/me`, { headers });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to load profile." }, { status: 500 });
    }

    const user = await userRes.json();

    // `status=any` requires admin — fetch approved and pending separately instead
    const [approvedRes, pendingRes] = await Promise.all([
      fetch(`${WP_API}/wp/v2/comments?author=${user.id}&per_page=50&status=approved&_embed=1`, { headers }),
      fetch(`${WP_API}/wp/v2/comments?author=${user.id}&per_page=50&status=hold&_embed=1`, { headers }),
    ]);

    const approved = approvedRes.ok ? await approvedRes.json() : [];
    const pending  = pendingRes.ok  ? await pendingRes.json()  : [];
    const comments = [...approved, ...pending];

    return NextResponse.json({ user, comments });
  } catch (err) {
    console.error("[profile] error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
