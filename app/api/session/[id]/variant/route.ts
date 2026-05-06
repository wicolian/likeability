import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { MAX_VARIANTS_PER_SESSION, variantSchema } from "@/lib/validators";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const parsed = variantSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  if (id !== parsed.data.session_id) {
    return NextResponse.json({ error: "Session mismatch" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { count, error: countError } = await supabase
    .from("variants")
    .select("id", { count: "exact", head: true })
    .eq("session_id", parsed.data.session_id);

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });
  if ((count ?? 0) >= MAX_VARIANTS_PER_SESSION) {
    return NextResponse.json({ error: "Max 5 variants per session." }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("variants")
    .insert({
      session_id: parsed.data.session_id,
      type: parsed.data.type,
      storage_key: parsed.data.storage_key ?? null,
      public_url: parsed.data.public_url,
      original_name: parsed.data.original_name ?? null,
      file_size_bytes: parsed.data.file_size_bytes ?? null,
      position: count ?? 0,
    })
    .select("id, session_id, type, storage_key, public_url, original_name, file_size_bytes, position, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ variant: data });
}
