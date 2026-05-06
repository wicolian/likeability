"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { isSfxEnabled, setSfxEnabled } from "@/lib/sounds";

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
        setSfxEnabled(next);
      }}
      type="button"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
