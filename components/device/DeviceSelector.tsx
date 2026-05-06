"use client";

import type { DeviceType } from "@/lib/types";

type PlatformKey = "generic" | "instagram-post" | "instagram-story" | "instagram-reel" | "linkedin" | "x-post" | "tiktok";

const platformOptions: { value: PlatformKey; label: string }[] = [
  { value: "generic", label: "📱 GENERIC" },
  { value: "instagram-post", label: "IG POST" },
  { value: "instagram-story", label: "IG STORY" },
  { value: "instagram-reel", label: "IG REEL" },
  { value: "linkedin", label: "LINKEDIN" },
  { value: "x-post", label: "X" },
  { value: "tiktok", label: "TIKTOK" },
];

const genericViewports: { value: DeviceType; label: string }[] = [
  { value: "iphone-16-pro-portrait", label: "MOBILE" },
  { value: "ipad-pro-portrait", label: "TABLET" },
  { value: "desktop-browser", label: "DESKTOP" },
];

const linkedinViewports: { value: DeviceType; label: string }[] = [
  { value: "linkedin-feed-mobile", label: "MOBILE" },
  { value: "linkedin-feed", label: "DESKTOP" },
  { value: "linkedin-banner", label: "BANNER" },
];

interface DeviceSelectorProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
}

function activePlatform(value: DeviceType): PlatformKey {
  if (value.startsWith("instagram-")) return value as PlatformKey;
  if (value.startsWith("linkedin-")) return "linkedin";
  if (value === "x-post" || value === "tiktok") return value;
  return "generic";
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
    default:
      return "iphone-16-pro-portrait";
  }
}

export function DeviceSelector({ value, onChange }: DeviceSelectorProps) {
  const platform = activePlatform(value);
  const viewportOptions = platform === "generic" ? genericViewports : platform === "linkedin" ? linkedinViewports : [];

  return (
    <div className="space-y-2">
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Platform">
        {platformOptions.map((option) => (
          <button
            className={`device-tab ${platform === option.value ? "device-tab-active" : ""}`}
            key={option.value}
            onClick={() => onChange(platformDefault(option.value))}
            role="tab"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      {viewportOptions.length > 0 ? (
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Viewport">
          {viewportOptions.map((option) => (
            <button
              className={`device-tab text-[8px] ${value === option.value ? "device-tab-active" : ""}`}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="tab"
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
