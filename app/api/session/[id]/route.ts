import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { CommentRecord, Variant } from "@/lib/types";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface SessionRow {
  id: string;
  slug: string;
  password_hash: string | null;
  expires_at: string;
  is_expired: boolean;
}

interface VoteRow {
  variant_id: string;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = getSupabaseAdminClient();
  const url = new URL(request.url);
  const password = url.searchParams.get("password");

  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, slug, password_hash, expires_at, is_expired")
    .eq("slug", id)
    .maybeSingle<SessionRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  if (session.is_expired || new Date(session.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  if (session.password_hash) {
    if (!password) return NextResponse.json({ error: "Password required" }, { status: 401 });
    const ok = await bcrypt.compare(password, session.password_hash);
    if (!ok) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const [{ data: variants, error: variantError }, { data: votes, error: voteError }, { data: comments, error: commentError }] =
    await Promise.all([
      supabase
        .from("variants")
        .select("id, session_id, type, storage_key, public_url, original_name, file_size_bytes, position, created_at")
        .eq("session_id", session.id)
        .order("position", { ascending: true })
        .returns<Variant[]>(),
      supabase.from("votes").select("variant_id").eq("session_id", session.id).returns<VoteRow[]>(),
      supabase
        .from("comments")
        .select("id, session_id, variant_id, x_percent, y_percent, content, created_at")
        .eq("session_id", session.id)
        .order("created_at", { ascending: true })
        .returns<CommentRecord[]>(),
    ]);

  if (variantError || voteError || commentError) {
    return NextResponse.json(
      { error: variantError?.message ?? voteError?.message ?? commentError?.message ?? "Could not fetch session" },
      { status: 500 },
    );
  }

  const voteCounts = (votes ?? []).reduce<Record<string, number>>((counts, vote) => {
    counts[vote.variant_id] = (counts[vote.variant_id] ?? 0) + 1;
    return counts;
  }, {});

  return NextResponse.json({
    session: {
      id: session.id,
      slug: session.slug,
      expires_at: session.expires_at,
      has_password: Boolean(session.password_hash),
    },
    variants: variants ?? [],
    votes: voteCounts,
    comments: comments ?? [],
  });
}
