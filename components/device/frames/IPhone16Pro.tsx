import type { ReactNode } from "react";
import { FrameShell } from "./FrameShell";

export function IPhone16Pro({ children, landscape = false }: { children: ReactNode; landscape?: boolean }) {
  return (
    <FrameShell
      aspect={landscape ? "16 / 9" : "9 / 19.5"}
      className="max-h-[72vh]"
      label={landscape ? "IPHONE 16 PRO WIDE" : "IPHONE 16 PRO"}
    >
      {children}
    </FrameShell>
  );
}
