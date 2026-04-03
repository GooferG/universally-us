import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

const WP_API          = process.env.WP_API_URL!;
const WP_ADMIN        = process.env.WP_ADMIN_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;

const FORM_ID         = process.env.FORMIDABLE_NEWSLETTER_FORM_ID!;
const FIELD_NAME      = process.env.FORMIDABLE_NEWSLETTER_FIELD_NAME!;
const FIELD_EMAIL     = process.env.FORMIDABLE_NEWSLETTER_FIELD_EMAIL!;

export async function POST(req: NextRequest) {
  // ── Rate limiting: max 2 signups per IP per 10 minutes ──
  const ip = getIp(req);
  const { allowed, retryAfterSecs } = rateLimit(ip, { limit: 2, windowMs: 10 * 60 * 1000 });

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retryAfterSecs} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, _hp } = body;

    // ── Honeypot check ──
    if (_hp) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const credentials = Buffer.from(`${WP_ADMIN}:${WP_APP_PASSWORD}`).toString("base64");

    const res = await fetch(`${WP_API}/frm/v2/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        form_id: FORM_ID,
        item_meta: {
          [FIELD_NAME]:  name,
          [FIELD_EMAIL]: email,
        },
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Formidable newsletter error:", data);
      return NextResponse.json(
        { error: "Subscription failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
