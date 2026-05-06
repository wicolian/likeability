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

function RailIcon({ label, path, count }: { label: string; path: string; count?: string }) {
  return (
    <div className="grid justify-items-center gap-1">
      <svg aria-label={label} className="h-7 w-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
      {count ? <span className="text-[11px] font-semibold">{count}</span> : null}
    </div>
  );
}

export function InstagramReelChrome({
  children,
  variantIndex = 0,
  totalVariants = 1,
  onSlideChange,
  showSafeZone = false,
}: PlatformChromeProps) {
  const hasCarousel = totalVariants > 1;

  return (
    <div className="relative h-full overflow-hidden bg-black text-white" style={platformFont}>
      <div className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">{children}</div>
      {showSafeZone ? <SafeZoneOverlay kind="instagram-reel" /> : null}
      <div className="absolute inset-x-4 top-4 z-10 flex items-center text-[18px] font-semibold drop-shadow">
        <span className="text-2xl">←</span>
        <span className="ml-4">Reels</span>
        <span className="ml-auto">↥</span>
      </div>

      {hasCarousel ? (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45"
            onClick={() => onSlideChange?.(Math.max(0, variantIndex - 1))}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-14 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45"
            onClick={() => onSlideChange?.(Math.min(totalVariants - 1, variantIndex + 1))}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </>
      ) : null}

      <div className="absolute bottom-24 right-3 z-10 grid gap-5 text-center drop-shadow">
        <RailIcon count="12.4K" label="Like" path="M20.8 4.6c-1.8-1.7-4.7-1.5-6.4.4L12 7.5 9.6 5C7.9 3.1 5 2.9 3.2 4.6 1.1 6.5 1 9.8 3 11.8l9 8.7 9-8.7c2-2 1.9-5.3-.2-7.2Z" />
        <RailIcon count="847" label="Comment" path="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
        <RailIcon count="2.1K" label="Share" path="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
        <RailIcon label="Save" path="M6 3h12v18l-6-4-6 4V3Z" />
        <div className="text-2xl leading-none">···</div>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-10 space-y-2 pr-12 text-[13px] drop-shadow">
        <div className="font-semibold">@username</div>
        <div>♪ Original Audio - username ▶</div>
        {hasCarousel ? (
          <div className="flex gap-1">
            {Array.from({ length: totalVariants }, (_, index) => (
              <span className={`h-1.5 w-1.5 rounded-full ${index === variantIndex ? "bg-white" : "bg-white/35"}`} key={index} />
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2 text-[11px]">
          <span>▷</span>
          <span className="flex flex-1 gap-0.5">
            {Array.from({ length: 12 }, (_, index) => (
              <span className={`h-1 flex-1 rounded ${index < 8 ? "bg-white" : "bg-white/35"}`} key={index} />
            ))}
          </span>
          <span>00:12 / 00:30</span>
        </div>
      </div>
    </div>
  );
}
