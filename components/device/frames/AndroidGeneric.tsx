import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function AndroidGeneric({ children }: { children: ReactNode }) {
  return (
    <FrameShell aspect="9 / 19" className="max-h-[72vh]" label="ANDROID">
      {children}
    </FrameShell>
  );
}
