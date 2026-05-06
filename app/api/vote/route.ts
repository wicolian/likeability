import { NextResponse } from "next/server";
import { getRequestIp, hashIpForSession } from "@/lib/ip-hash";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { voteSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = voteSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const voterHash = hashIpForSession(getRequestIp(request), parsed.data.session_id);

  const { error } = await supabase.from("votes").insert({
    session_id: parsed.data.session_id,
    variant_id: parsed.data.variant_id,
    voter_hash: voterHash,
  });

  if (error?.code === "23505") {
    return NextResponse.json({ error: "Voting is limited to one vote per network." }, { status: 409 });
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
