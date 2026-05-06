"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import type { CommentRecord } from "@/lib/types";

interface CommentPinProps {
  comment: CommentRecord;
}

export function CommentPin({ comment }: CommentPinProps) {
  const [open, setOpen] = useState(false);

  return (
    <button
      className="comment-pin"
      onClick={(event) => {
        event.stopPropagation();
        setOpen((current) => !current);
      }}
      style={{ left: `${comment.x_percent}%`, top: `${comment.y_percent}%` }}
      title={comment.content}
      type="button"
    >
      <MessageSquare size={13} />
      {open ? <span className="comment-bubble">{comment.content}</span> : null}
    </button>
  );
}
