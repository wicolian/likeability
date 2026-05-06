import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: "green" | "orange" | "red" | "neutral";
}

const tones = {
  green: "border-[var(--color-green)] text-[var(--color-green)] hover:bg-[rgba(57,255,20,0.12)]",
  orange: "border-[var(--color-orange)] text-[var(--color-orange)] hover:bg-[rgba(255,107,0,0.12)]",
  red: "border-[var(--color-red)] text-[var(--color-red)] hover:bg-[rgba(255,34,68,0.12)]",
  neutral: "border-[var(--color-border)] text-[var(--color-white)] hover:bg-[rgba(255,255,255,0.06)]",
};

export function PixelButton({ children, tone = "green", className = "", ...props }: PixelButtonProps) {
  return (
    <button
      className={`pixel-button inline-flex min-h-11 items-center justify-center gap-2 border-3 bg-[var(--color-bg)] px-4 py-3 text-center text-[10px] leading-5 uppercase transition disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
