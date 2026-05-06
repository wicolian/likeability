"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PixelButton } from "@/components/ui/PixelButton";
import { detectVariantTypeFromUrl, shouldWarnAboutSource } from "@/lib/video-url";

interface LinkInputProps {
  disabled?: boolean;
  onLink: (url: string, type: ReturnType<typeof detectVariantTypeFromUrl>) => Promise<void>;
}

export function LinkInput({ disabled, onLink }: LinkInputProps) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);

  async function submit() {
    const url = value.trim();
    if (!url) return;

    try {
      new URL(url);
    } catch {
      toast.error("ENTER A VALID URL.");
      return;
    }

    setPending(true);
    try {
      const warning = shouldWarnAboutSource(url);
      if (warning) toast.warning(warning);
      await onLink(url, detectVariantTypeFromUrl(url));
      setValue("");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row">
      <label className="relative min-w-0 flex-1">
        <Link2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dim)]" size={18} />
        <input
          className="pixel-input w-full pl-12"
          disabled={disabled || pending}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void submit();
          }}
          placeholder="FIGMA / YOUTUBE / DRIVE / DROPBOX URL"
          value={value}
        />
      </label>
      <PixelButton disabled={disabled || pending || !value.trim()} onClick={() => void submit()} type="button">
        ADD LINK
      </PixelButton>
    </div>
  );
}
