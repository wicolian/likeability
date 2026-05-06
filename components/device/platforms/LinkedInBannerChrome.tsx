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
    <svg aria-hidden="true" className="h-28 w-28 rounded-full border-4 border-white bg-neutral-200" viewBox="0 0 120 120">
      <circle cx="60" cy="60" fill="#d1d5db" r="60" />
      <circle cx="60" cy="44" fill="#9ca3af" r="22" />
      <path d="M24 105c9-30 63-30 72 0" fill="#9ca3af" />
    </svg>
  );
}

export function LinkedInBannerChrome({ children, showSafeZone = false }: PlatformChromeProps) {
  return (
    <div className="h-full overflow-auto bg-[#f4f2ee] p-4 text-[#191919]" style={platformFont}>
      <section className="mx-auto max-w-[820px] overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
        <div className="relative aspect-[4/1] overflow-hidden bg-neutral-950 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">
          {children}
          {showSafeZone ? <SafeZoneOverlay kind="linkedin-banner" /> : null}
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-14">
            <Avatar />
          </div>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Name Surname</h2>
              <p className="text-[15px] text-neutral-700">Job Title</p>
              <p className="mt-1 text-[13px] text-neutral-600">Company · School · Location</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-[#0a66c2] px-4 py-1.5 text-[14px] font-semibold text-white" type="button">Connect</button>
              <button className="rounded-full border border-[#0a66c2] px-4 py-1.5 text-[14px] font-semibold text-[#0a66c2]" type="button">Message</button>
              <button className="rounded-full border border-neutral-500 px-3 py-1.5 text-[14px] font-semibold text-neutral-600" type="button">···</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
