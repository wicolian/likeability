import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

const limits = [
  { pattern: /^\/api\/session\/create/, count: 10, windowMs: 24 * 60 * 60 * 1000 },
  { pattern: /^\/api\/vote/, count: 50, windowMs: 24 * 60 * 60 * 1000 },
  { pattern: /^\/api\/comment/, count: 100, windowMs: 24 * 60 * 60 * 1000 },
  { pattern: /^\/api\//, count: 200, windowMs: 60 * 1000 },
];

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hash = await sha256(clientIp(request));
  const now = Date.now();

  for (const limit of limits) {
    if (!limit.pattern.test(pathname)) continue;
    const key = `${hash}:${limit.pattern.source}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
      continue;
    }

    if (current.count >= limit.count) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    current.count += 1;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
