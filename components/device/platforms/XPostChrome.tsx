import type { ReactNode } from "react";
import { SafeZoneOverlay } from "./SafeZoneOverlay";

interface PlatformChromeProps {
  children: ReactNode;
  variantIndex?: number;
  totalVariants?: number;
  onSlideChange?: (i: number) => void;
  showSafeZone?: boolean;
}

const platformFont = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

function Avatar() {
  return (
    <svg aria-hidden="true" height="40" viewBox="0 0 40 40" width="40">
      <circle cx="20" cy="20" fill="#d1d5db" r="20" />
      <circle cx="20" cy="15" fill="#9ca3af" r="7" />
      <path d="M8 35c2.5-8 21.5-8 24 0" fill="#9ca3af" />
    </svg>
  );
}

function IconMetric({ icon, count }: { icon: string; count?: string }) {
  return <div className="flex items-center gap-1 text-[13px] text-neutral-500"><span>{icon}</span>{count ? <span>{count}</span> : null}</div>;
}

export function XPostChrome({ children, showSafeZone = false }: PlatformChromeProps) {
  return (
    <div className="flex h-full flex-col bg-black text-neutral-100" style={platformFont}>
      <header className="flex h-12 shrink-0 items-center border-b border-neutral-800 px-4">
        <span className="text-xl">←</span>
        <span className="ml-6 font-semibold">Home</span>
        <span className="ml-auto">✦</span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto border-b border-neutral-800">
        <article className="border-b border-neutral-800 p-4">
          <div className="flex gap-3">
            <Avatar />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[15px]">
                <span className="font-semibold">Display Name</span>
                <span className="text-neutral-500">@handle · 2h</span>
                <span className="ml-auto text-xl leading-none text-neutral-500">···</span>
              </div>
              <p className="mt-2 text-[15px] leading-5">Tweet content would appear here, your design is below.</p>
              <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">
                {children}
                {showSafeZone ? <SafeZoneOverlay kind="x-post" /> : null}
              </div>
              <div className="mt-3 flex justify-between">
                <IconMetric count="142" icon="💬" />
                <IconMetric count="847" icon="🔁" />
                <IconMetric count="12.4K" icon="♥" />
                <IconMetric icon="📊" />
                <IconMetric icon="🔖" />
                <IconMetric icon="↑" />
              </div>
            </div>
          </div>
        </article>
      </div>
      <nav className="grid h-12 shrink-0 grid-cols-5 place-items-center text-[18px] text-neutral-200">
        <span>⌂</span>
        <span>⌕</span>
        <span>G</span>
        <span>🔔</span>
        <span>✉</span>
      </nav>
    </div>
  );
}
