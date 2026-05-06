import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function iPadPro({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="3 / 4" className="max-h-[72vh]" label="IPAD PRO">
      {children}
    </FrameShell>
  );
}
