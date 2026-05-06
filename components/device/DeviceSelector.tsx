"use client";

import type { DeviceType } from "@/lib/types";

type PlatformKey = "generic" | "instagram-post" | "instagram-story" | "instagram-reel" | "linkedin" | "x-post" | "tiktok" | "webpage";

const platformOptions: { value: PlatformKey; label: string; hint: string }[] = [
  { value: "generic",          label: "GENERIC",   hint: "Responsive preview — mobile / tablet / desktop" },
  { value: "instagram-post",   label: "IG POST",   hint: "Instagram feed — 4:5 ratio, 1080 × 1350px" },
  { value: "instagram-story",  label: "IG STORY",  hint: "Instagram story — full-screen 9:16, 1080 × 1920px" },
  { value: "instagram-reel",   label: "IG REEL",   hint: "Instagram reel — full-screen 9:16, 1080 × 1920px" },
  { value: "linkedin",         label: "LINKEDIN",  hint: "LinkedIn feed post or banner — mobile or desktop" },
  { value: "x-post",           label: "X / TWEET", hint: "X (Twitter) post — 16:9 image in card, 1200 × 675px" },
  { value: "tiktok",           label: "TIKTOK",    hint: "TikTok full-screen vertical — 9:16, 1080 × 1920px" },
  { value: "webpage",          label: "WEBPAGE",   hint: "Desktop browser — landing pages, Figma embeds, PDFs" },
];

const genericViewports: { value: DeviceType; label: string }[] = [
  { value: "iphone-16-pro-portrait", label: "MOBILE" },
  { value: "ipad-pro-portrait",      label: "TABLET" },
  { value: "desktop-browser",        label: "DESKTOP" },
];

const linkedinViewports: { value: DeviceType; label: string }[] = [
  { value: "linkedin-feed-mobile", label: "MOBILE" },
  { value: "linkedin-feed",        label: "DESKTOP" },
  { value: "linkedin-banner",      label: "BANNER" },
];

const socialViewportMap: Partial<Record<PlatformKey, { value: DeviceType; label: string }[]>> = {
  "instagram-post": [
    { value: "instagram-post",         label: "MOBILE" },
    { value: "instagram-post-tablet",  label: "TABLET" },
    { value: "instagram-post-desktop", label: "DESKTOP" },
  ],
  "instagram-story": [
    { value: "instagram-story",         label: "MOBILE" },
    { value: "instagram-story-tablet",  label: "TABLET" },
    { value: "instagram-story-desktop", label: "DESKTOP" },
  ],
  "instagram-reel": [
    { value: "instagram-reel",         label: "MOBILE" },
    { value: "instagram-reel-tablet",  label: "TABLET" },
    { value: "instagram-reel-desktop", label: "DESKTOP" },
  ],
  "x-post": [
    { value: "x-post",         label: "MOBILE" },
    { value: "x-post-desktop", label: "DESKTOP" },
  ],
  "tiktok": [
    { value: "tiktok",         label: "MOBILE" },
    { value: "tiktok-tablet",  label: "TABLET" },
    { value: "tiktok-desktop", label: "DESKTOP" },
  ],
};

interface DeviceSelectorProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
}

export function activePlatform(value: DeviceType): PlatformKey {
  if (value.startsWith("instagram-post"))   return "instagram-post";
  if (value.startsWith("instagram-story"))  return "instagram-story";
  if (value.startsWith("instagram-reel"))   return "instagram-reel";
  if (value.startsWith("linkedin-"))        return "linkedin";
  if (value.startsWith("x-post"))           return "x-post";
  if (value.startsWith("tiktok"))           return "tiktok";
  if (value === "desktop-browser")          return "webpage";
  return "generic";
}

export function isGenericPlatform(value: DeviceType): boolean {
  return (
    value === "iphone-16-pro-portrait" ||
    value === "iphone-16-pro-landscape" ||
    value === "ipad-pro-portrait" ||
    value === "android-portrait" ||
    value === "desktop-browser"
  );
}

function platformDefault(platform: PlatformKey): DeviceType {
  switch (platform) {
    case "instagram-post":  return "instagram-post";
    case "instagram-story": return "instagram-story";
    case "instagram-reel":  return "instagram-reel";
    case "x-post":          return "x-post";
    case "tiktok":          return "tiktok";
    case "linkedin":        return "linkedin-feed";
    case "webpage":         return "desktop-browser";
    default:                return "iphone-16-pro-portrait";
  }
}

export function DeviceSelector({ value, onChange }: DeviceSelectorProps) {
  const platform = activePlatform(value);

  const viewportOptions =
    platform === "generic"
      ? genericViewports
      : platform === "linkedin"
      ? linkedinViewports
      : socialViewportMap[platform] ?? [];

  const currentHint = platformOptions.find((p) => p.value === platform)?.hint ?? "";

  return (
    <div className="space-y-2">
      {/* Platform tabs */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Platform">
        {platformOptions.map((option) => (
          <button
            className={`device-tab shrink-0 ${platform === option.value ? "device-tab-active" : ""}`}
            key={option.value}
            onClick={() => onChange(platformDefault(option.value))}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Viewport sub-tabs */}
      {viewportOptions.length > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Viewport">
          {viewportOptions.map((option) => (
            <button
              className={`device-tab shrink-0 text-[8px] ${value === option.value ? "device-tab-active" : ""}`}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="tab"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Context hint */}
      <p className="text-[8px] text-[var(--color-dim)]">{currentHint}</p>
    </div>
  );
}
