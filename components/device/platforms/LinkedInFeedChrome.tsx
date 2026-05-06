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

function Avatar({ size = 48 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 40 40" width={size}>
      <circle cx="20" cy="20" fill="#d1d5db" r="20" />
      <circle cx="20" cy="15" fill="#9ca3af" r="7" />
      <path d="M8 35c2.5-8 21.5-8 24 0" fill="#9ca3af" />
    </svg>
  );
}

function Action({ icon, label }: { icon: string; label: string }) {
  return <button className="flex flex-1 items-center justify-center gap-2 py-3 text-[13px] font-semibold text-neutral-600" type="button"><span>{icon}</span>{label}</button>;
}

export function LinkedInFeedChrome({ children, showSafeZone = false }: PlatformChromeProps) {
  return (
    <div className="h-full overflow-auto bg-[#f4f2ee] p-4 text-[#191919]" style={platformFont}>
      <article className="mx-auto max-w-[560px] overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-sm">
        <header className="flex items-start gap-3 p-4">
          <Avatar />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold">Name Surname</div>
            <div className="truncate text-[13px] text-neutral-600">Job Title · Company</div>
            <div className="text-[12px] text-neutral-500">1h · 🌐</div>
          </div>
          <button className="text-xl text-neutral-500" type="button">×</button>
        </header>
        <div className="px-4 pb-3 text-[14px] leading-5">A quick look at the new design direction.</div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">
          {children}
          {showSafeZone ? <SafeZoneOverlay kind="linkedin-feed" /> : null}
        </div>
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 text-[13px] text-neutral-600">
          <span><span className="tracking-[-6px]">👍❤️💡</span> 847 reactions</span>
          <span>142 comments · 38 reposts</span>
        </div>
        <div className="flex border-b border-neutral-200 px-2">
          <Action icon="👍" label="Like" />
          <Action icon="💬" label="Comment" />
          <Action icon="🔄" label="Repost" />
          <Action icon="➤" label="Send" />
        </div>
        <div className="flex items-center gap-3 p-4">
          <Avatar size={36} />
          <div className="h-10 flex-1 rounded-full border border-neutral-300 px-4 text-[13px] leading-10 text-neutral-500">Add a comment...</div>
        </div>
      </article>
    </div>
  );
}
