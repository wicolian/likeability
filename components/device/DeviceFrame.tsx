"use client";

import type { ReactNode } from "react";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";
import type { DeviceType } from "@/lib/types";
import { AndroidGeneric } from "./frames/AndroidGeneric";
import { DesktopBrowser } from "./frames/DesktopBrowser";
import { IPhone16Pro } from "./frames/IPhone16Pro";
import { InstagramPost } from "./frames/InstagramPost";
import { InstagramReel } from "./frames/InstagramReel";
import { InstagramStory } from "./frames/InstagramStory";
import { iPadPro as IPadPro } from "./frames/iPadPro";
import { LinkedInBanner } from "./frames/LinkedInBanner";

interface DeviceFrameProps {
  device: DeviceType;
  children: ReactNode;
  interactive?: boolean;
}

export function DeviceFrame({ device, children, interactive = true }: DeviceFrameProps) {
  const { rotateX, rotateY, handlers } = useDeviceTilt(interactive);

  const frame = (() => {
    switch (device) {
      case "iphone-16-pro-landscape":
        return <IPhone16Pro landscape>{children}</IPhone16Pro>;
      case "android-portrait":
        return <AndroidGeneric>{children}</AndroidGeneric>;
      case "instagram-post":
        return <InstagramPost>{children}</InstagramPost>;
      case "instagram-story":
        return <InstagramStory>{children}</InstagramStory>;
      case "instagram-reel":
        return <InstagramReel>{children}</InstagramReel>;
      case "linkedin-banner":
        return <LinkedInBanner>{children}</LinkedInBanner>;
      case "desktop-browser":
        return <DesktopBrowser>{children}</DesktopBrowser>;
      case "ipad-pro-portrait":
        return <IPadPro>{children}</IPadPro>;
      default:
        return <IPhone16Pro>{children}</IPhone16Pro>;
    }
  })();

  return (
    <div className="device-perspective" {...handlers}>
      <div
        className="mx-auto w-full max-w-[760px] transition-transform duration-150"
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}
      >
        {frame}
      </div>
    </div>
  );
}
