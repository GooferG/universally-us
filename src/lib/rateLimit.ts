/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Resets on server restart. For production at scale, swap the
 * Map for a Redis store (e.g. Upstash) — but this is sufficient
 * for a low-traffic community site.
 */

const store = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export function rateLimit(ip: string, options: RateLimitOptions): { allowed: boolean; retryAfterSecs: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSecs: 0 };
  }

  if (entry.count >= options.limit) {
    const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSecs };
  }

  entry.count++;
  return { allowed: true, retryAfterSecs: 0 };
}

export function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}
