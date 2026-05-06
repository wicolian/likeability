import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DeleteObjectCommand, S3Client } from "https://esm.sh/@aws-sdk/client-s3@3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${Deno.env.get("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
  },
});

Deno.serve(async (req) => {
  const cleanupSecret = Deno.env.get("CLEANUP_SECRET");
  if (cleanupSecret) {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (token !== cleanupSecret && token !== Deno.env.get("SUPABASE_ANON_KEY")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  const { data: expiredSessions, error: sessionError } = await supabase
    .from("sessions")
    .select("id, slug")
    .lt("expires_at", new Date().toISOString())
    .eq("is_expired", false);

  if (sessionError) {
    return new Response(JSON.stringify({ error: sessionError.message }), { status: 500 });
  }

  if (!expiredSessions?.length) {
    return new Response(JSON.stringify({ deleted: 0, files_removed: 0, failures: 0 }), { status: 200 });
  }

  const sessionIds = expiredSessions.map((session) => session.id);
  const { data: variants, error: variantError } = await supabase
    .from("variants")
    .select("session_id, storage_key")
    .in("session_id", sessionIds)
    .not("storage_key", "is", null);

  if (variantError) {
    return new Response(JSON.stringify({ error: variantError.message }), { status: 500 });
  }

  const keys = (variants ?? []).filter((variant) => variant.storage_key);
  const results = await Promise.allSettled(
    keys.map((variant) =>
      r2.send(
        new DeleteObjectCommand({
          Bucket: Deno.env.get("R2_BUCKET_NAME")!,
          Key: variant.storage_key!,
        }),
      ),
    ),
  );

  const failures = results
    .map((result, index) => ({ result, variant: keys[index] }))
    .filter((entry) => entry.result.status === "rejected");

  if (failures.length) {
    await supabase.from("deletion_failures").insert(
      failures.map((failure) => ({
        session_id: failure.variant.session_id,
        storage_key: failure.variant.storage_key,
        error:
          failure.result.status === "rejected" && failure.result.reason instanceof Error
            ? failure.result.reason.message
            : "Unknown R2 deletion failure",
      })),
    );
  }

  const { error: deleteError } = await supabase.from("sessions").delete().in("id", sessionIds);
  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 500 });
  }

  console.log(
    `Deleted expired sessions: ${expiredSessions.map((session) => session.slug).join(", ")}; files=${keys.length}; failures=${failures.length}`,
  );

  return new Response(
    JSON.stringify({
      deleted: expiredSessions.length,
      files_removed: results.length - failures.length,
      failures: failures.length,
    }),
    { status: 200 },
  );
});
