import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/cleanup";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expected = process.env.CLEANUP_SECRET;
  if (expected) {
    const actual = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (actual !== expected) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await cleanupExpiredSessions();
  return NextResponse.json(result);
}
