import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function InstagramStory({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="9 / 16" className="max-h-[72vh]" label="INSTAGRAM STORY">
      {children}
    </FrameShell>
  );
}
