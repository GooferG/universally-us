import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

const WP_API            = process.env.WP_API_URL!;
const WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME!;
const WP_APP_PASSWORD   = process.env.WP_APP_PASSWORD!;
const HCAPTCHA_SECRET   = process.env.HCAPTCHA_SECRET_KEY!;

export async function POST(req: NextRequest) {
  // ── Rate limiting: max 3 registrations per IP per 10 minutes ──
  const ip = getIp(req);
  const { allowed, retryAfterSecs } = rateLimit(ip, { limit: 3, windowMs: 10 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please try again in ${retryAfterSecs} seconds.` },
      { status: 429 }
    );
  }

  try {
    const { username, email, password, hcaptchaToken } = await req.json();

    // ── hCaptcha verification ──
    if (!hcaptchaToken) {
      return NextResponse.json({ error: "CAPTCHA token missing." }, { status: 400 });
    }
    const captchaRes = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${HCAPTCHA_SECRET}&response=${hcaptchaToken}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
    }

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Use admin Application Password to create the user server-side
    // Credentials never exposed to the browser
    const credentials = Buffer.from(
      `${WP_ADMIN_USERNAME}:${WP_APP_PASSWORD}`
    ).toString("base64");

    const res = await fetch(`${WP_API}/wp/v2/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        roles: ["subscriber"],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Surface WordPress error messages (e.g. duplicate email/username)
      const message =
        data?.message?.replace(/<[^>]*>/g, "") ?? "Registration failed. Please try again.";
      return NextResponse.json({ error: message }, { status: res.status });
    }

    // Success — "New User Approve" plugin will set the user to pending
    // Nancy will see and approve them in WP Admin → Users
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
