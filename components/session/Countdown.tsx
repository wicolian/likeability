"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { playSound, stopSound } from "@/lib/sounds";

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [days, hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function Countdown({ expiresAt }: { expiresAt: string }) {
  const router = useRouter();
  const expiry = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  const [remaining, setRemaining] = useState(0);
  const urgent = remaining < 2 * 60 * 60 * 1000;

  useEffect(() => {
    function tick() {
      const next = expiry - Date.now();
      setRemaining(next);
      if (next <= 0) {
        stopSound("warning");
        playSound("expired");
        router.refresh();
      } else if (next < 10 * 60 * 1000) {
        playSound("warning", 0.35);
      }
    }

    const timeout = window.setTimeout(tick, 0);
    const interval = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
      stopSound("warning");
    };
  }, [expiry, router]);

  return (
    <motion.div
      animate={urgent ? { opacity: [1, 0.55, 1] } : undefined}
      className={`countdown ${urgent ? "text-[var(--color-red)]" : "text-[var(--color-green)]"}`}
      transition={{ duration: 1, repeat: urgent ? Infinity : 0, ease: "linear" }}
    >
      {parts(remaining)}
    </motion.div>
  );
}
