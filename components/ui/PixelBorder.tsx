import type { ReactNode } from "react";

interface PixelBorderProps {
  children: ReactNode;
  green?: boolean;
  className?: string;
}

export function PixelBorder({ children, green = false, className = "" }: PixelBorderProps) {
  return <div className={`${green ? "pixel-border-green" : "pixel-border"} ${className}`}>{children}</div>;
}
