"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CommentList } from "@/components/comments/CommentList";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { ResponsivePreviewPanel } from "@/components/preview/ResponsivePreviewPanel";
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
  const [reaction, setReaction] = useState<"like" | "pass" | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(true);

  async function submitLike() {
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, variant_id: variant.id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not vote");
      setVoted(true);
      setReaction("like");
      setConfetti(true);
      playSound("positiveReaction");
      window.setTimeout(() => setConfetti(false), 700);
    } catch (error) {
      playSound("negativeReaction");
      toast.error(error instanceof Error ? error.message : "Could not vote");
    }
  }

  function submitPass() {
    playSound("negativeReaction");
    setVoted(true);
    setReaction("pass");
  }

  return (
    <article className="relative space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-[11px] text-[var(--color-white)]">
          {variant.original_name ?? `VARIANT ${variant.position + 1}`}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <button className="device-tab text-[8px]" onClick={() => setShowSafeZone((v) => !v)} type="button">
            {showSafeZone ? "HIDE SAFE ZONE" : "SHOW SAFE ZONE"}
          </button>
          <button className="device-tab text-[8px]" onClick={() => setPreviewOpen(true)} type="button">
            👁 ALL SCREENS
          </button>
        </div>
      </div>

      {/* Device frame */}
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

      {/* Vote controls */}
      <div className="flex items-center gap-3">
        {/* ✓ Like */}
        <button
          aria-label="Like this design"
          className={`vote-btn vote-btn-like ${voted ? "vote-btn-done" : ""} ${reaction === "like" ? "vote-btn-chosen" : ""}`}
          disabled={voted}
          onClick={() => void submitLike()}
          type="button"
        >
          <Check size={16} strokeWidth={3} />
          <span>{isCarousel ? "PICK THIS" : "LIKE IT"}</span>
        </button>

        {/* Vote count pill */}
        <VoteResults count={count} />

        {/* ✗ Pass */}
        <button
          aria-label="Pass on this design"
          className={`vote-btn vote-btn-pass ${voted ? "vote-btn-done" : ""} ${reaction === "pass" ? "vote-btn-chosen" : ""}`}
          disabled={voted}
          onClick={submitPass}
          type="button"
        >
          <X size={16} strokeWidth={3} />
          <span>PASS</span>
        </button>
      </div>

      {/* Post-vote status */}
      {voted && (
        <p className="text-center text-[9px] text-[var(--color-dim)]">
          {reaction === "like" ? "▶ VOTE LOCKED — THANKS ♥" : "▶ SKIPPED"}
        </p>
      )}

      <ResponsivePreviewPanel isOpen={previewOpen} onClose={() => setPreviewOpen(false)} variant={variant} />
    </article>
  );
}
