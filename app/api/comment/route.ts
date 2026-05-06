import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { commentSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = commentSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdminClient()
    .from("comments")
    .insert(parsed.data)
    .select("id, session_id, variant_id, x_percent, y_percent, content, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comment: data });
}
