"use client";

import { useState } from "react";
import type { CommentRecord } from "@/lib/types";
import { CommentForm } from "./CommentForm";
import { CommentPin } from "./CommentPin";

interface CommentListProps {
  comments: CommentRecord[];
  sessionId: string;
  variantId: string;
}

export function CommentList({ comments, sessionId, variantId }: CommentListProps) {
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="absolute inset-0 z-20"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setDraft({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      {comments
        .filter((comment) => comment.variant_id === variantId)
        .map((comment) => (
          <CommentPin comment={comment} key={comment.id} />
        ))}
      {draft ? (
        <CommentForm
          sessionId={sessionId}
          variantId={variantId}
          x={draft.x}
          y={draft.y}
          onClose={() => setDraft(null)}
        />
      ) : null}
    </div>
  );
}
