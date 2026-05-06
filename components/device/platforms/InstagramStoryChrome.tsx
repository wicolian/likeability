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
    <svg aria-hidden="true" height="28" viewBox="0 0 40 40" width="28">
      <circle cx="20" cy="20" fill="#d1d5db" r="20" />
      <circle cx="20" cy="15" fill="#9ca3af" r="7" />
      <path d="M8 35c2.5-8 21.5-8 24 0" fill="#9ca3af" />
    </svg>
  );
}

export function InstagramStoryChrome({ children, showSafeZone = false }: PlatformChromeProps) {
  return (
    <div className="relative h-full overflow-hidden bg-black text-white" style={platformFont}>
      <div className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">{children}</div>
      {showSafeZone ? <SafeZoneOverlay kind="instagram-story" /> : null}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 space-y-3 drop-shadow">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <div className="h-0.5 overflow-hidden rounded bg-white/35" key={index}>
              <div className={`h-full ${index === 1 ? "w-3/5 bg-white" : index < 1 ? "w-full bg-white" : "w-0"}`} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <Avatar />
          <span>@username</span>
          <span className="font-normal text-white/80">3h</span>
          <span className="ml-auto text-2xl font-light leading-none">×</span>
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-4 z-10 flex items-center gap-3 text-white drop-shadow">
        <div className="h-10 flex-1 rounded-full border border-white/70 px-4 text-[13px] leading-10">Send message...</div>
        <svg aria-label="Share" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" /></svg>
        <svg aria-label="Like" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.8 4.6c-1.8-1.7-4.7-1.5-6.4.4L12 7.5 9.6 5C7.9 3.1 5 2.9 3.2 4.6 1.1 6.5 1 9.8 3 11.8l9 8.7 9-8.7c2-2 1.9-5.3-.2-7.2Z" /></svg>
      </div>
    </div>
  );
}
