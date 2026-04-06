import { NextRequest, NextResponse } from "next/server";

const WP_URL = process.env.WP_API_URL!.replace("/wp-json", "");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Trigger WordPress's native password reset email
    const body = new URLSearchParams({
      user_login: email,
      "wp-submit": "Get New Password",
      action: "lostpassword",
    });

    await fetch(`${WP_URL}/wp-login.php?action=lostpassword`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      redirect: "manual", // WordPress redirects on success — we just want to fire the request
    });

    // Always return success — never reveal whether the email exists (security best practice)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
