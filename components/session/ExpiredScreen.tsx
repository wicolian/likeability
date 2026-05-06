"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sounds";

export function ExpiredScreen({ status = 410 }: { status?: 404 | 410 }) {
  useEffect(() => {
    if (status === 410) playSound("expired");
  }, [status]);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-bg)] p-6 text-center">
      <div className="pixel-border max-w-lg space-y-5 bg-[var(--color-surface)] p-8">
        <p className="text-5xl text-[var(--color-red)]">{status}</p>
        <h1 className="text-lg text-[var(--color-white)]">{status === 410 ? "SESSION EXPIRED" : "SESSION NOT FOUND"}</h1>
        <p className="text-[10px] leading-6 text-[var(--color-dim)]">
          {status === 410 ? "FILES WERE REMOVED AND FEEDBACK WAS DESTROYED." : "THIS LIKEABILITY SESSION NEVER EXISTED."}
        </p>
      </div>
    </main>
  );
}
