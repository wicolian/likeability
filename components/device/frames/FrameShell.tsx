import type { ReactNode } from "react";

interface FrameShellProps {
  children: ReactNode;
  label: string;
  aspect: string;
  className?: string;
  overlay?: ReactNode;
}

export function FrameShell({ children, label, aspect, className = "", overlay }: FrameShellProps) {
  return (
    <div className={`device-shell ${className}`} style={{ aspectRatio: aspect }}>
      <div className="device-topbar">
        <span>{label}</span>
        <span className="device-led" />
      </div>
      <div className="device-screen">
        {children}
        {overlay}
      </div>
    </div>
  );
}
