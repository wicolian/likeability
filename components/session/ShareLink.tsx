"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PixelButton } from "@/components/ui/PixelButton";
import { playSound } from "@/lib/sounds";

export function ShareLink({ url }: { url: string }) {
  return (
    <PixelButton
      onClick={() => {
        void navigator.clipboard.writeText(url);
        playSound("popup", 0.6);
        toast.success("LINK COPIED.");
      }}
      tone="yellow"
      type="button"
    >
      <Copy size={15} /> COPY LINK
    </PixelButton>
  );
}
