import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

const WP_API          = process.env.WP_API_URL!;
const WP_ADMIN        = process.env.WP_ADMIN_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;

const FORM_ID           = process.env.FORMIDABLE_CONTACT_FORM_ID!;
const FIELD_NAME        = process.env.FORMIDABLE_CONTACT_FIELD_NAME!;
const FIELD_EMAIL       = process.env.FORMIDABLE_CONTACT_FIELD_EMAIL!;
const FIELD_SUBJECT     = process.env.FORMIDABLE_CONTACT_FIELD_SUBJECT!;
const FIELD_MESSAGE     = process.env.FORMIDABLE_CONTACT_FIELD_MESSAGE!;
const HCAPTCHA_SECRET   = process.env.HCAPTCHA_SECRET_KEY!;

export async function POST(req: NextRequest) {
  // ── Rate limiting: max 3 submissions per IP per 10 minutes ──
  const ip = getIp(req);
  const { allowed, retryAfterSecs } = rateLimit(ip, { limit: 3, windowMs: 10 * 60 * 1000 });

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many submissions. Please try again in ${retryAfterSecs} seconds.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, subject, message, _hp, hcaptchaToken } = body;

    // ── Honeypot check: bots fill hidden fields, humans don't ──
    if (_hp) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

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

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
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
          [FIELD_NAME]:    name,
          [FIELD_EMAIL]:   email,
          [FIELD_SUBJECT]: subject,
          [FIELD_MESSAGE]: message,
        },
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Formidable contact error:", data);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
