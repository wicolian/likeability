"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function useVotes(sessionId: string, initialVotes: Record<string, number>) {
  const [liveVotes, setLiveVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!sessionId) return;

    let channel: ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null = null;
    try {
      const supabase = getSupabaseBrowserClient();
      channel = supabase
        .channel(`votes:${sessionId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "votes", filter: `session_id=eq.${sessionId}` },
          (payload) => {
            const variantId = String(payload.new.variant_id);
            setLiveVotes((current) => ({
              ...current,
              [variantId]: (current[variantId] ?? 0) + 1,
            }));
          },
        )
        .subscribe();
    } catch {
      return;
    }

    return () => {
      if (channel) void getSupabaseBrowserClient().removeChannel(channel);
    };
  }, [sessionId]);

  return useMemo(() => {
    const merged = { ...initialVotes };
    for (const [variantId, count] of Object.entries(liveVotes)) {
      merged[variantId] = (merged[variantId] ?? 0) + count;
    }
    return merged;
  }, [initialVotes, liveVotes]);
}
