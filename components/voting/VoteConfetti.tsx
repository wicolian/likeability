"use client";

import { motion } from "framer-motion";

export function VoteConfetti({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          animate={{
            opacity: [1, 1, 0],
            transform: `translate(${(index % 6) * 24 - 60}px, ${Math.floor(index / 6) * 22 - 20}px)`,
          }}
          className="absolute left-1/2 top-1/2 h-2 w-2 bg-[var(--color-green)]"
          initial={{ opacity: 0, transform: "translate(0, 0)" }}
          key={index}
          transition={{ duration: 0.65, ease: "linear" }}
        />
      ))}
    </div>
  );
}
