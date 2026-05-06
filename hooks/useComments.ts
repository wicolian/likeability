"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { CommentRecord } from "@/lib/types";

export function useComments(sessionId: string, initialComments: CommentRecord[]) {
  const [liveComments, setLiveComments] = useState<CommentRecord[]>([]);

  useEffect(() => {
    if (!sessionId) return;

    let channel: ReturnType<ReturnType<typeof getSupabaseBrowserClient>["channel"]> | null = null;
    try {
      const supabase = getSupabaseBrowserClient();
      channel = supabase
        .channel(`comments:${sessionId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "comments", filter: `session_id=eq.${sessionId}` },
          (payload) => setLiveComments((current) => [...current, payload.new as CommentRecord]),
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
    const seen = new Set(initialComments.map((comment) => comment.id));
    return [...initialComments, ...liveComments.filter((comment) => !seen.has(comment.id))];
  }, [initialComments, liveComments]);
}
