import type { ReactNode } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { FrameShell } from "./FrameShell";

export function InstagramReel({ children }: { children: ReactNode }) {
  return (
    <FrameShell
      aspect="9 / 16"
      className="max-h-[72vh]"
      label="INSTAGRAM REEL"
      overlay={
        <div className="pointer-events-none absolute bottom-5 right-3 flex flex-col gap-4 text-white drop-shadow">
          <Heart size={18} />
          <MessageCircle size={18} />
          <Send size={18} />
        </div>
      }
    >
      {children}
    </FrameShell>
  );
}
