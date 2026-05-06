"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { isSfxEnabled, playSound, playSoundOnce, setSfxEnabled } from "@/lib/sounds";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(() => (typeof window === "undefined" ? true : isSfxEnabled()));

  return (
    <button
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
      title={enabled ? "Mute sound effects" : "Enable sound effects"}
      className="icon-button"
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        if (next) {
          setSfxEnabled(true);
          window.setTimeout(() => playSound("soundOn", 1), 0);
          return;
        }

        playSoundOnce("soundOn", 0.75);
        window.setTimeout(() => {
          setSfxEnabled(false);
        }, 120);
      }}
      type="button"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
