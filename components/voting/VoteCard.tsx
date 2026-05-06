"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CommentList } from "@/components/comments/CommentList";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { PixelButton } from "@/components/ui/PixelButton";
import { playSound } from "@/lib/sounds";
import type { CommentRecord, DeviceType, Variant } from "@/lib/types";
import { VoteConfetti } from "./VoteConfetti";
import { VoteResults } from "./VoteResults";

interface VoteCardProps {
  comments: CommentRecord[];
  count: number;
  device: DeviceType;
  sessionId: string;
  variant: Variant;
}

export function VoteCard({ comments, count, device, sessionId, variant }: VoteCardProps) {
  const [voted, setVoted] = useState(false);
  const [confetti, setConfetti] = useState(false);

  async function submitVote() {
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, variant_id: variant.id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not vote");
      setVoted(true);
      setConfetti(true);
      playSound("vote");
      window.setTimeout(() => setConfetti(false), 700);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not vote");
    }
  }

  return (
    <article className="relative space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-[11px] text-[var(--color-white)]">
          {variant.original_name ?? `VARIANT ${variant.position + 1}`}
        </h2>
        <VoteResults count={count} />
      </div>
      <div className="relative">
        <DeviceFrame device={device}>
          <div className="relative h-full w-full">
            <MediaRenderer variant={variant} />
            <CommentList comments={comments} sessionId={sessionId} variantId={variant.id} />
          </div>
        </DeviceFrame>
        <VoteConfetti active={confetti} />
      </div>
      <PixelButton className="w-full" disabled={voted} onClick={() => void submitVote()} type="button">
        <Check size={15} /> {voted ? "VOTE LOCKED" : "VOTE FOR THIS"}
      </PixelButton>
    </article>
  );
}
