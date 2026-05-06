"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CommentList } from "@/components/comments/CommentList";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { ResponsivePreviewPanel } from "@/components/preview/ResponsivePreviewPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { playSound } from "@/lib/sounds";
import type { CommentRecord, DeviceType, Variant } from "@/lib/types";
import { VoteConfetti } from "./VoteConfetti";
import { VoteResults } from "./VoteResults";

interface VoteCardProps {
  comments: CommentRecord[];
  count: number;
  device: DeviceType;
  isCarousel?: boolean;
  onSlideChange?: (i: number) => void;
  sessionId: string;
  totalVariants?: number;
  variant: Variant;
  variantIndex?: number;
}

export function VoteCard({
  comments,
  count,
  device,
  isCarousel = false,
  onSlideChange,
  sessionId,
  totalVariants = 1,
  variant,
  variantIndex = 0,
}: VoteCardProps) {
  const [voted, setVoted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(true);

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
      playSound("positiveReaction");
      window.setTimeout(() => setConfetti(false), 700);
    } catch (error) {
      playSound("negativeReaction");
      toast.error(error instanceof Error ? error.message : "Could not vote");
    }
  }

  return (
    <article className="relative space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-[11px] text-[var(--color-white)]">
          {variant.original_name ?? `VARIANT ${variant.position + 1}`}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button className="device-tab text-[8px]" onClick={() => setShowSafeZone((value) => !value)} type="button">
            {showSafeZone ? "HIDE SAFE ZONE" : "SHOW SAFE ZONE"}
          </button>
          <button className="device-tab text-[8px]" onClick={() => setPreviewOpen(true)} type="button">
            👁 PREVIEW ALL SCREENS
          </button>
          <VoteResults count={count} />
        </div>
      </div>
      <div className="relative">
        <DeviceFrame
          device={device}
          onSlideChange={onSlideChange}
          showSafeZone={showSafeZone}
          totalVariants={totalVariants}
          variantIndex={variantIndex}
        >
          <div className="relative h-full w-full">
            <MediaRenderer variant={variant} />
            <CommentList comments={comments} sessionId={sessionId} variantId={variant.id} />
          </div>
        </DeviceFrame>
        <VoteConfetti active={confetti} />
      </div>
      <PixelButton className="w-full" disabled={voted} onClick={() => void submitVote()} tone="cyan" type="button">
        <Check size={15} /> {voted ? "VOTE LOCKED" : isCarousel ? "VOTE FOR THIS ONE ♥" : "VOTE FOR THIS"}
      </PixelButton>
      <ResponsivePreviewPanel isOpen={previewOpen} onClose={() => setPreviewOpen(false)} variant={variant} />
    </article>
  );
}
