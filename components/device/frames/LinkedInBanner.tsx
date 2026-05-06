import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function LinkedInBanner({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="4 / 1" label="LINKEDIN BANNER">
      {children}
    </FrameShell>
  );
}
