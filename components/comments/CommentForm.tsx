"use client";

import { Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { playSound } from "@/lib/sounds";

interface CommentFormProps {
  sessionId: string;
  variantId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export function CommentForm({ sessionId, variantId, x, y, onClose }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function submit() {
    if (!content.trim()) return;
    setPending(true);

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          variant_id: variantId,
          x_percent: x,
          y_percent: y,
          content,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not post comment");
      playSound("comment");
      onClose();
    } catch (error) {
      playSound("negativeReaction");
      toast.error(error instanceof Error ? error.message : "Could not post comment");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="comment-form" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[8px] text-[var(--color-green)]">COMMENT</span>
        <button aria-label="Close comment form" onClick={onClose} type="button">
          <X size={13} />
        </button>
      </div>
      <textarea
        className="pixel-input min-h-24 w-64 resize-none text-[10px]"
        maxLength={280}
        onChange={(event) => setContent(event.target.value)}
        placeholder="280 CHARS MAX"
        value={content}
      />
      <button className="inline-flex items-center gap-2 text-[9px] text-[var(--color-green)]" disabled={pending} onClick={() => void submit()} type="button">
        <Send size={13} /> POST
      </button>
    </div>
  );
}
