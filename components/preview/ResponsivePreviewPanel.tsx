"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { playSound } from "@/lib/sounds";
import type { Variant } from "@/lib/types";

interface ResponsivePreviewProps {
  variant: Variant;
  isOpen: boolean;
  onClose: () => void;
}

const previews = [
  {
    key: "mobile",
    label: "Mobile",
    dimensions: "375 × 812px",
    width: 375,
    height: 812,
    scale: 0.44,
    chrome: "IPHONE 16 PRO",
  },
  {
    key: "tablet",
    label: "Tablet",
    dimensions: "768 × 1024px",
    width: 768,
    height: 1024,
    scale: 0.34,
    chrome: "IPAD PRO",
  },
  {
    key: "desktop",
    label: "Desktop",
    dimensions: "1440 × 900px",
    width: 1440,
    height: 900,
    scale: 0.24,
    chrome: "LIKEABILITY.FYI/PREVIEW",
  },
] as const;

function ViewportPreview({ preview, variant }: { preview: (typeof previews)[number]; variant: Variant }) {
  const isDesktop = preview.key === "desktop";
  const scaledWidth = preview.width * preview.scale;
  const scaledHeight = (preview.height + 34) * preview.scale;

  return (
    <section className="grid min-w-0 justify-items-center gap-3">
      <h3 className="text-[10px] text-[var(--color-cyan)]">{preview.label.toUpperCase()}</h3>
      <div style={{ width: scaledWidth, height: scaledHeight }}>
        <div
          className={`origin-top-left overflow-hidden border-[5px] border-black bg-black shadow-[0_0_0_3px_var(--color-border),8px_8px_0_rgba(0,0,0,0.55)] ${isDesktop ? "rounded-none" : "rounded-[26px]"}`}
          style={{
            width: preview.width,
            height: preview.height + 34,
            transform: `scale(${preview.scale})`,
          }}
        >
          <div className="flex h-[34px] items-center justify-between border-b-[3px] border-[var(--color-border)] bg-[#050505] px-3 text-[8px] text-[var(--color-dim)]">
            <span className="truncate">{preview.chrome}</span>
            <span className="h-2 w-2 bg-[var(--color-pink)] shadow-[0_0_10px_var(--color-pink)]" />
          </div>
          <div className="relative bg-black" style={{ width: preview.width, height: preview.height }}>
            <MediaRenderer variant={variant} />
          </div>
        </div>
      </div>
      <p className="text-[9px] text-[var(--color-dim)]">{preview.dimensions}</p>
    </section>
  );
}

export function ResponsivePreviewPanel({ variant, isOpen, onClose }: ResponsivePreviewProps) {
  const [active, setActive] = useState<(typeof previews)[number]["key"]>("mobile");

  useEffect(() => {
    if (isOpen) playSound("popup", 0.55);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          animate={{ x: 0 }}
          className="fixed inset-0 z-50 bg-black/70 p-3 text-[var(--color-white)] backdrop-blur-sm md:p-6"
          exit={{ x: "100%" }}
          initial={{ x: "100%" }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pixel-border flex h-full flex-col overflow-hidden bg-[var(--color-surface)]">
            <header className="relative flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-[var(--color-border)] p-4">
              <div className="min-w-0">
                <h2 className="truncate text-[12px] text-[var(--color-green)]">PREVIEW ON ALL SCREENS</h2>
                <p className="mt-2 truncate text-[9px] text-[var(--color-dim)]">
                  {variant.original_name ?? `VARIANT ${variant.position + 1}`}
                </p>
              </div>
              <button
                className="device-tab device-tab-active"
                onClick={() => {
                  playSound("popup", 0.45);
                  onClose();
                }}
                type="button"
              >
                CLOSE
              </button>
            </header>

            <div className="flex shrink-0 gap-2 overflow-x-auto border-b-[3px] border-[var(--color-border)] p-3 md:hidden">
              {previews.map((preview) => (
                <button
                  className={`device-tab ${active === preview.key ? "device-tab-active" : ""}`}
                  key={preview.key}
                  onClick={() => setActive(preview.key)}
                  type="button"
                >
                  {preview.label.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              <div className="hidden h-full min-h-[520px] grid-cols-3 items-center gap-6 md:grid">
                {previews.map((preview) => (
                  <ViewportPreview key={preview.key} preview={preview} variant={variant} />
                ))}
              </div>
              <div className="grid min-h-[520px] place-items-center md:hidden">
                {previews
                  .filter((preview) => preview.key === active)
                  .map((preview) => (
                    <ViewportPreview key={preview.key} preview={preview} variant={variant} />
                  ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
