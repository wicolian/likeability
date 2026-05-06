"use client";

import type { DeviceType } from "@/lib/types";

const devices: { value: DeviceType; label: string }[] = [
  { value: "iphone-16-pro-portrait", label: "IPHONE" },
  { value: "iphone-16-pro-landscape", label: "WIDE" },
  { value: "android-portrait", label: "ANDROID" },
  { value: "instagram-post", label: "POST" },
  { value: "instagram-story", label: "STORY" },
  { value: "instagram-reel", label: "REEL" },
  { value: "linkedin-banner", label: "BANNER" },
  { value: "desktop-browser", label: "DESKTOP" },
  { value: "ipad-pro-portrait", label: "IPAD" },
];

interface DeviceSelectorProps {
  value: DeviceType;
  onChange: (device: DeviceType) => void;
}

export function DeviceSelector({ value, onChange }: DeviceSelectorProps) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2" role="tablist">
      {devices.map((device) => (
        <button
          className={`device-tab ${value === device.value ? "device-tab-active" : ""}`}
          key={device.value}
          onClick={() => onChange(device.value)}
          role="tab"
          type="button"
        >
          {device.label}
        </button>
      ))}
    </div>
  );
}
