import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionSchema } from "@/lib/validators";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";

function slug() {
  return randomBytes(4).toString("base64url").slice(0, 5).toLowerCase();
}

export async function POST(request: Request) {
  try {
    const parsed = createSessionSchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const expiresAt = new Date(Date.now() + parsed.data.expires_in_hours * 60 * 60 * 1000).toISOString();
    const passwordHash = parsed.data.password ? await bcrypt.hash(parsed.data.password, 12) : null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = slug();
      const { data, error } = await supabase
        .from("sessions")
        .insert({ slug: candidate, password_hash: passwordHash, expires_at: expiresAt })
        .select("id, slug, expires_at")
        .single();

      if (!error && data) {
        const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
        return NextResponse.json({
          session_id: data.id,
          slug: data.slug,
          share_url: `${origin.replace(/\/$/, "")}/s/${data.slug}`,
          expires_at: data.expires_at,
        });
      }

      if (error?.code !== "23505") {
        return NextResponse.json({ error: error?.message ?? "Could not create session" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Could not generate unique session slug" }, { status: 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
