import { NextRequest, NextResponse } from "next/server";

const WP_API = process.env.WP_API_URL!;
const WP_ADMIN_USERNAME = process.env.WP_ADMIN_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

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
