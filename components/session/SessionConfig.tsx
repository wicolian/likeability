"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { PixelButton } from "@/components/ui/PixelButton";

export interface SessionConfigValue {
  password: string | null;
  expires_in_hours: number;
}

interface SessionConfigProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: SessionConfigValue) => void;
}

export function SessionConfig({ open, onClose, onSubmit }: SessionConfigProps) {
  const [password, setPassword] = useState("");
  const [expires, setExpires] = useState(24);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
      <form
        className="pixel-border w-full max-w-md space-y-5 bg-[var(--color-surface)] p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ password: password.trim() || null, expires_in_hours: expires });
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm text-[var(--color-green)]">SESSION CONFIG</h2>
          <button aria-label="Close session config" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        <label className="block space-y-2">
          <span className="text-[10px] text-[var(--color-dim)]">PASSWORD OPTIONAL</span>
          <input
            className="pixel-input w-full"
            maxLength={128}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[10px] text-[var(--color-dim)]">EXPIRES IN HOURS</span>
          <input
            className="w-full accent-[var(--color-green)]"
            max={168}
            min={1}
            onChange={(event) => setExpires(Number(event.target.value))}
            type="range"
            value={expires}
          />
          <span className="text-[10px] text-[var(--color-white)]">{expires} HOURS</span>
        </label>
        <PixelButton className="w-full" type="submit">
          CREATE SESSION
        </PixelButton>
      </form>
    </div>
  );
}
