import { deleteR2Object } from "./r2";
import { getSupabaseAdminClient } from "./supabase";

interface ExpiredSession {
  id: string;
  slug: string;
}

interface StorageVariant {
  session_id: string;
  storage_key: string | null;
}

export async function cleanupExpiredSessions() {
  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();

  const { data: expiredSessions, error: sessionError } = await supabase
    .from("sessions")
    .select("id, slug")
    .lt("expires_at", now)
    .eq("is_expired", false)
    .returns<ExpiredSession[]>();

  if (sessionError) throw sessionError;
  if (!expiredSessions?.length) return { deleted: 0, files_removed: 0, failures: 0 };

  const sessionIds = expiredSessions.map((session) => session.id);
  const { data: variants, error: variantError } = await supabase
    .from("variants")
    .select("session_id, storage_key")
    .in("session_id", sessionIds)
    .not("storage_key", "is", null)
    .returns<StorageVariant[]>();

  if (variantError) throw variantError;

  const keys = (variants ?? []).flatMap((variant) =>
    variant.storage_key ? [{ session_id: variant.session_id, storage_key: variant.storage_key }] : [],
  );

  const results = await Promise.allSettled(keys.map((entry) => deleteR2Object(entry.storage_key)));
  const failures = results
    .map((result, index) => ({ result, entry: keys[index] }))
    .filter((item): item is { result: PromiseRejectedResult; entry: (typeof keys)[number] } => item.result.status === "rejected");

  if (failures.length) {
    await supabase.from("deletion_failures").insert(
      failures.map(({ entry, result }) => ({
        session_id: entry.session_id,
        storage_key: entry.storage_key,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      })),
    );
  }

  const { error: deleteError } = await supabase.from("sessions").delete().in("id", sessionIds);
  if (deleteError) throw deleteError;

  return {
    deleted: expiredSessions.length,
    files_removed: results.length - failures.length,
    failures: failures.length,
  };
}
