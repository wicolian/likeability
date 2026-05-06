import type { ReactNode } from "react";

interface PlatformChromeProps {
  children: ReactNode;
  variantIndex?: number;
  totalVariants?: number;
  onSlideChange?: (i: number) => void;
}

const platformFont = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

function RailButton({ icon, count }: { icon: string; count?: string }) {
  return (
    <div className="grid justify-items-center gap-1">
      <div className="grid h-9 w-9 place-items-center text-2xl">{icon}</div>
      {count ? <span className="text-[11px] font-semibold">{count}</span> : null}
    </div>
  );
}

export function TikTokChrome({ children }: PlatformChromeProps) {
  return (
    <div className="relative h-full overflow-hidden bg-black text-white" style={platformFont}>
      <div className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_img]:!object-cover [&_video]:!object-cover">{children}</div>
      <header className="absolute inset-x-4 top-4 z-10 flex items-center justify-center gap-4 text-[15px] font-semibold drop-shadow">
        <span className="text-white/70">Following</span>
        <span>For You</span>
        <span className="absolute right-8">⌕</span>
        <span className="absolute right-0 text-xl">⊕</span>
      </header>
      <aside className="absolute bottom-24 right-3 z-10 grid gap-4 text-center drop-shadow">
        <div className="relative mx-auto">
          <svg aria-hidden="true" className="h-10 w-10 rounded-full border border-white/70 bg-neutral-300" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="#d1d5db" r="20" />
            <circle cx="20" cy="15" fill="#9ca3af" r="7" />
            <path d="M8 35c2.5-8 21.5-8 24 0" fill="#9ca3af" />
          </svg>
          <span className="absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-[#fe2c55] text-sm font-bold">+</span>
        </div>
        <RailButton count="12.4K" icon="♥" />
        <RailButton count="847" icon="💬" />
        <RailButton count="2.1K" icon="🔖" />
        <RailButton count="384" icon="➤" />
        <RailButton icon="···" />
      </aside>
      <div className="absolute bottom-16 right-3 z-10 h-12 w-12 animate-spin rounded-full border-[10px] border-neutral-900 bg-[conic-gradient(#111,#666,#111)] shadow-lg">
        <div className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
      <div className="absolute inset-x-4 bottom-4 z-10 space-y-2 pr-16 text-[13px] drop-shadow">
        <div className="font-semibold">@username · Original Audio - username</div>
        <div className="overflow-hidden whitespace-nowrap">♪ ♬ Song Name - Artist</div>
        <div className="flex items-center gap-2 text-[11px]">
          <span>▷</span>
          <span className="flex flex-1 gap-0.5">
            {Array.from({ length: 10 }, (_, index) => (
              <span className={`h-1 flex-1 rounded ${index < 7 ? "bg-white" : "bg-white/35"}`} key={index} />
            ))}
          </span>
          <span>0:12 / 0:30</span>
        </div>
      </div>
    </div>
  );
}
