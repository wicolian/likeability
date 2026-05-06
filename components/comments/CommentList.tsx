"use client";

import { MessageSquare } from "lucide-react";
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

  const variantComments = comments.filter((c) => c.variant_id === variantId);

  return (
    <div
      className="absolute inset-0 z-20"
      style={{ cursor: draft ? "default" : "crosshair" }}
      onClick={(event) => {
        if (draft) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setDraft({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      {variantComments.map((comment) => (
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
      ) : (
        /* Comment hint — bottom edge of the design area */
        <div className="comment-hint" aria-hidden>
          <MessageSquare size={10} />
          CLICK TO COMMENT
          {variantComments.length > 0 && (
            <span className="comment-hint-count">{variantComments.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
