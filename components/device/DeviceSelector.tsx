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

interface DeviceSelectorProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
}

export function activePlatform(value: DeviceType): PlatformKey {
  if (value.startsWith("instagram-")) return value as PlatformKey;
  if (value.startsWith("linkedin-"))  return "linkedin";
  if (value === "x-post" || value === "tiktok") return value;
  if (value === "desktop-browser") {
    // desktop-browser alone = webpage; iphone/ipad/android = generic
    return "webpage";
  }
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
    case "instagram-post":
    case "instagram-story":
    case "instagram-reel":
    case "x-post":
    case "tiktok":
      return platform;
    case "linkedin":
      return "linkedin-feed";
    case "webpage":
      return "desktop-browser";
    default:
      return "iphone-16-pro-portrait";
  }
}

export function DeviceSelector({ value, onChange }: DeviceSelectorProps) {
  const platform = activePlatform(value);
  // Generic uses viewport sub-tabs; LinkedIn does too; webpage is always desktop
  const viewportOptions =
    platform === "generic"
      ? genericViewports.filter((v) => v.value !== "desktop-browser") // desktop is under "webpage"
      : platform === "linkedin"
      ? linkedinViewports
      : [];

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

      {/* Viewport sub-tabs (generic / linkedin) */}
      {viewportOptions.length > 0 && (
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
