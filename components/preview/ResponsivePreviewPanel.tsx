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
  { key: "mobile",  label: "Mobile",  dimensions: "375 × 812",  width: 375, height: 812,  scale: 0.42, tag: "iPhone 16 Pro" },
  { key: "tablet",  label: "Tablet",  dimensions: "768 × 1024", width: 768, height: 1024, scale: 0.32, tag: "iPad Pro" },
  { key: "desktop", label: "Desktop", dimensions: "1440 × 900", width: 1440, height: 900, scale: 0.22, tag: "Browser" },
] as const;

function ViewportPreview({ preview, variant }: { preview: (typeof previews)[number]; variant: Variant }) {
  const isDesktop = preview.key === "desktop";
  const chrome = 34;
  const scaledW = Math.round(preview.width * preview.scale);
  const scaledH = Math.round((preview.height + chrome) * preview.scale);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[9px] text-[var(--color-cyan)]">{preview.label.toUpperCase()}</div>
      {/* Outer wrapper: exactly the scaled size so it sits flush in the grid */}
      <div style={{ width: scaledW, height: scaledH, position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: preview.width,
            height: preview.height + chrome,
            transform: `scale(${preview.scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            overflow: "hidden",
            border: "5px solid #020202",
            background: "#020202",
            boxShadow: "0 0 0 3px var(--color-border), 8px 8px 0 rgba(0,0,0,0.55)",
            borderRadius: isDesktop ? 0 : 26,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: chrome,
              borderBottom: "3px solid var(--color-border)",
              background: "#050505",
              padding: "0 12px",
              color: "var(--color-dim)",
              fontSize: 8,
              fontFamily: "inherit",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {preview.tag.toUpperCase()}
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                background: "var(--color-pink)",
                boxShadow: "0 0 10px var(--color-pink)",
                display: "block",
                flexShrink: 0,
              }}
            />
          </div>
          {/* Content */}
          <div style={{ position: "relative", width: preview.width, height: preview.height, background: "black" }}>
            <MediaRenderer variant={variant} />
          </div>
        </div>
      </div>
      <div className="text-[8px] text-[var(--color-dim)]">{preview.dimensions}</div>
    </div>
  );
}

export function ResponsivePreviewPanel({ variant, isOpen, onClose }: ResponsivePreviewProps) {
  const [active, setActive] = useState<(typeof previews)[number]["key"]>("mobile");

  useEffect(() => {
    if (isOpen) playSound("popup", 0.55);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ x: 0, opacity: 1 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
          exit={{ x: "100%", opacity: 0 }}
          initial={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pixel-border flex h-full flex-col overflow-hidden bg-[var(--color-surface)]">
            {/* Header */}
            <header className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-[var(--color-border)] px-5 py-3">
              <div>
                <div className="text-[11px] text-[var(--color-green)]">PREVIEW ALL SCREENS</div>
                <div className="mt-1 text-[9px] text-[var(--color-dim)]">
                  {variant.original_name ?? `VARIANT ${variant.position + 1}`}
                </div>
              </div>
              <button
                className="device-tab device-tab-active"
                onClick={() => { playSound("popup", 0.45); onClose(); }}
                type="button"
              >
                ✕ CLOSE
              </button>
            </header>

            {/* Mobile tab switcher */}
            <div className="flex shrink-0 gap-2 overflow-x-auto border-b-[3px] border-[var(--color-border)] px-4 py-2 md:hidden">
              {previews.map((p) => (
                <button
                  className={`device-tab text-[8px] ${active === p.key ? "device-tab-active" : ""}`}
                  key={p.key}
                  onClick={() => setActive(p.key)}
                  type="button"
                >
                  {p.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Preview area */}
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
              {/* Desktop: all three side by side, centered */}
              <div className="hidden w-full items-end justify-center gap-10 md:flex">
                {previews.map((p) => (
                  <ViewportPreview key={p.key} preview={p} variant={variant} />
                ))}
              </div>
              {/* Mobile: active only, centered */}
              <div className="flex items-center justify-center md:hidden">
                {previews.filter((p) => p.key === active).map((p) => (
                  <ViewportPreview key={p.key} preview={p} variant={variant} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
