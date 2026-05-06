"use client";

import type { ReactNode } from "react";
import { useDeviceTilt } from "@/hooks/useDeviceTilt";
import type { DeviceType } from "@/lib/types";
import { AndroidGeneric } from "./frames/AndroidGeneric";
import { DesktopBrowser } from "./frames/DesktopBrowser";
import { IPhone16Pro } from "./frames/IPhone16Pro";
import { iPadPro as IPadPro } from "./frames/iPadPro";
import { InstagramFeedChrome } from "./platforms/InstagramFeedChrome";
import { InstagramReelChrome } from "./platforms/InstagramReelChrome";
import { InstagramStoryChrome } from "./platforms/InstagramStoryChrome";
import { LinkedInBannerChrome } from "./platforms/LinkedInBannerChrome";
import { LinkedInFeedChrome } from "./platforms/LinkedInFeedChrome";
import { TikTokChrome } from "./platforms/TikTokChrome";
import { XPostChrome } from "./platforms/XPostChrome";

interface DeviceFrameProps {
  device: DeviceType;
  children: ReactNode;
  interactive?: boolean;
  variantIndex?: number;
  totalVariants?: number;
  onSlideChange?: (i: number) => void;
}

export function DeviceFrame({
  device,
  children,
  interactive = true,
  variantIndex = 0,
  totalVariants = 1,
  onSlideChange,
}: DeviceFrameProps) {
  const { rotateX, rotateY, handlers } = useDeviceTilt(interactive);
  const platformProps = { variantIndex, totalVariants, onSlideChange };

  const frame = (() => {
    switch (device) {
      case "iphone-16-pro-landscape":
        return <IPhone16Pro landscape>{children}</IPhone16Pro>;
      case "android-portrait":
        return <AndroidGeneric>{children}</AndroidGeneric>;
      case "instagram-post":
        return (
          <IPhone16Pro>
            <InstagramFeedChrome {...platformProps}>{children}</InstagramFeedChrome>
          </IPhone16Pro>
        );
      case "instagram-story":
        return (
          <IPhone16Pro>
            <InstagramStoryChrome {...platformProps}>{children}</InstagramStoryChrome>
          </IPhone16Pro>
        );
      case "instagram-reel":
        return (
          <IPhone16Pro>
            <InstagramReelChrome {...platformProps}>{children}</InstagramReelChrome>
          </IPhone16Pro>
        );
      case "linkedin-feed":
        return (
          <DesktopBrowser>
            <LinkedInFeedChrome {...platformProps}>{children}</LinkedInFeedChrome>
          </DesktopBrowser>
        );
      case "linkedin-feed-mobile":
        return (
          <IPhone16Pro>
            <LinkedInFeedChrome {...platformProps}>{children}</LinkedInFeedChrome>
          </IPhone16Pro>
        );
      case "linkedin-banner":
        return (
          <DesktopBrowser>
            <LinkedInBannerChrome {...platformProps}>{children}</LinkedInBannerChrome>
          </DesktopBrowser>
        );
      case "x-post":
        return (
          <IPhone16Pro>
            <XPostChrome {...platformProps}>{children}</XPostChrome>
          </IPhone16Pro>
        );
      case "tiktok":
        return (
          <IPhone16Pro>
            <TikTokChrome {...platformProps}>{children}</TikTokChrome>
          </IPhone16Pro>
        );
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
