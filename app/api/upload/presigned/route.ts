import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createPresignedPutUrl, getR2PublicUrl } from "@/lib/r2";
import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  MAX_VARIANTS_PER_SESSION,
  presignedUploadSchema,
  sanitizeFileName,
  validateMagicBytes,
  validateUploadSize,
} from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = presignedUploadSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const sizeError = validateUploadSize(parsed.data.file_type, parsed.data.file_size);
  if (sizeError) return NextResponse.json({ error: sizeError }, { status: 413 });

  const magicError = validateMagicBytes(parsed.data.file_type, parsed.data.magic_bytes);
  if (magicError) return NextResponse.json({ error: magicError }, { status: 415 });

  const supabase = getSupabaseAdminClient();
  const { count, error } = await supabase
    .from("variants")
    .select("id", { count: "exact", head: true })
    .eq("session_id", parsed.data.session_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if ((count ?? 0) >= MAX_VARIANTS_PER_SESSION) {
    return NextResponse.json({ error: "Max 5 variants per session." }, { status: 409 });
  }

  const storageKey = `sessions/${parsed.data.session_id}/${randomUUID()}-${sanitizeFileName(parsed.data.file_name)}`;
  const presignedUrl = await createPresignedPutUrl(storageKey, parsed.data.file_type);

  return NextResponse.json({
    presigned_url: presignedUrl,
    storage_key: storageKey,
    public_url: getR2PublicUrl(storageKey),
  });
}
