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

function Avatar({ size = 32 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 40 40" width={size}>
      <circle cx="20" cy="20" fill="#d1d5db" r="20" />
      <circle cx="20" cy="15" fill="#9ca3af" r="7" />
      <path d="M8 35c2.5-8 21.5-8 24 0" fill="#9ca3af" />
    </svg>
  );
}

function Icon({ path, label }: { path: string; label: string }) {
  return (
    <svg aria-label={label} className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

export function InstagramFeedChrome({
  children,
  variantIndex = 0,
  totalVariants = 1,
  onSlideChange,
  showSafeZone = false,
}: PlatformChromeProps) {
  const hasCarousel = totalVariants > 1;

  return (
    <div className="h-full overflow-hidden bg-white text-black" style={platformFont}>
      <div className="flex h-full flex-col text-[13px]">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-200 px-3">
          <div className="text-[22px] font-semibold italic tracking-tight">Instagram</div>
          <div className="flex items-center gap-4 text-neutral-900">
            <Icon label="Search" path="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
            <Icon label="Like" path="M20.8 4.6c-1.8-1.7-4.7-1.5-6.4.4L12 7.5 9.6 5C7.9 3.1 5 2.9 3.2 4.6 1.1 6.5 1 9.8 3 11.8l9 8.7 9-8.7c2-2 1.9-5.3-.2-7.2Z" />
            <Icon label="Messenger" path="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
          </div>
        </div>

        <div className="flex shrink-0 gap-3 overflow-hidden border-b border-neutral-200 px-3 py-3">
          {["Your story", "mika", "studio", "noah", "casey"].map((name) => (
            <div className="w-14 shrink-0 text-center" key={name}>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[conic-gradient(#f97316,#ec4899,#8b5cf6,#f97316)] p-[2px]">
                <div className="grid h-full w-full place-items-center rounded-full bg-white">
                  <Avatar size={40} />
                </div>
              </div>
              <div className="mt-1 truncate text-[10px] text-neutral-600">{name}</div>
            </div>
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
          <div className="flex h-12 shrink-0 items-center gap-2 px-3">
            <Avatar />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold">@username <span className="font-normal text-neutral-500">· Sponsored</span> <span className="text-neutral-500">▾</span></div>
            </div>
            <div className="text-xl leading-none">···</div>
          </div>

          <div className="relative aspect-[4/5] shrink-0 overflow-hidden bg-neutral-950 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">
            {children}
            {showSafeZone ? <SafeZoneOverlay kind="instagram-feed" /> : null}
            {hasCarousel ? (
              <>
                <button
                  aria-label="Previous slide"
                  className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white"
                  onClick={() => onSlideChange?.(Math.max(0, variantIndex - 1))}
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button
                  aria-label="Next slide"
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white"
                  onClick={() => onSlideChange?.(Math.min(totalVariants - 1, variantIndex + 1))}
                  type="button"
                >
                  <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </>
            ) : null}
          </div>

          <div className="flex h-11 shrink-0 items-center justify-between px-3">
            <div className="flex items-center gap-4">
              <Icon label="Like" path="M20.8 4.6c-1.8-1.7-4.7-1.5-6.4.4L12 7.5 9.6 5C7.9 3.1 5 2.9 3.2 4.6 1.1 6.5 1 9.8 3 11.8l9 8.7 9-8.7c2-2 1.9-5.3-.2-7.2Z" />
              <Icon label="Comment" path="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.4A8.5 8.5 0 1 1 21 11.5Z" />
              <Icon label="Share" path="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
            </div>
            <Icon label="Save" path="M6 3h12v18l-6-4-6 4V3Z" />
          </div>

          {hasCarousel ? (
            <div className="flex shrink-0 justify-center gap-1 pb-2">
              {Array.from({ length: totalVariants }, (_, index) => (
                <span className={`h-1.5 w-1.5 rounded-full ${index === variantIndex ? "bg-sky-500" : "bg-neutral-300"}`} key={index} />
              ))}
            </div>
          ) : null}

          <div className="space-y-1 px-3 pb-4 text-[13px] leading-5">
            <p><span className="font-semibold">Liked by username</span> and <span className="font-semibold">2,847 others</span></p>
            <p><span className="font-semibold">@username</span> Your caption would appear here... <span className="text-neutral-500">more</span></p>
            <p className="text-neutral-500">View all 142 comments</p>
            <p className="text-[10px] uppercase text-neutral-500">2 minutes ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
