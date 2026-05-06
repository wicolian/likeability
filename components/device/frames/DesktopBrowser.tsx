import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function DesktopBrowser({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="16 / 10" label="DESKTOP">
      {children}
    </FrameShell>
  );
}
