import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function InstagramPost({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="1 / 1" label="INSTAGRAM POST">
      {children}
    </FrameShell>
  );
}
