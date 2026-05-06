"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PixelButton } from "@/components/ui/PixelButton";

export function ShareLink({ url }: { url: string }) {
  return (
    <PixelButton
      onClick={() => {
        void navigator.clipboard.writeText(url);
        toast.success("LINK COPIED.");
      }}
      tone="yellow"
      type="button"
    >
      <Copy size={15} /> COPY LINK
    </PixelButton>
  );
}
