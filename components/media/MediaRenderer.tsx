"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useMemo, useState } from "react";
import { normalizeVideoUrl } from "@/lib/video-url";
import type { Variant } from "@/lib/types";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
const RivePlayer = dynamic(() => import("@rive-app/react-canvas"), { ssr: false });

interface MediaRendererProps {
  variant: Variant;
  isPlaying?: boolean;
}

export function MediaRenderer({ variant, isPlaying = true }: MediaRendererProps) {
  const [figmaError, setFigmaError] = useState(false);
  const source = useMemo(
    () => (variant.type === "video_link" ? normalizeVideoUrl(variant.public_url) : variant.public_url),
    [variant.public_url, variant.type],
  );

  if (variant.type === "figma") {
    const embedUrl = `https://www.figma.com/embed?embed_host=likeability&url=${encodeURIComponent(
      variant.public_url,
    )}`;

    return (
      <div className="relative h-full w-full bg-black">
        {figmaError ? (
          <div className="grid h-full place-items-center p-5 text-center text-[10px] leading-6 text-[var(--color-red)]">
            Make sure your Figma file is set to &apos;Anyone with link can view&apos;.
          </div>
        ) : (
          <iframe
            className="h-full w-full border-0"
            onError={() => setFigmaError(true)}
            sandbox="allow-scripts allow-same-origin"
            src={embedUrl}
            title={variant.original_name ?? "Figma preview"}
          />
        )}
      </div>
    );
  }

  if (variant.type === "video_upload" || variant.type === "video_link") {
    return (
      <ReactPlayer
        controls={variant.type === "video_link"}
        height="100%"
        loop
        muted={variant.type === "video_upload"}
        playing={isPlaying}
        src={source}
        width="100%"
      />
    );
  }

  if (variant.type === "lottie") {
    return <DotLottieReact autoplay loop src={variant.public_url} />;
  }

  if (variant.type === "rive") {
    return (
      <div className="h-full w-full">
        <RivePlayer src={variant.public_url} />
      </div>
    );
  }

  if (variant.public_url.toLowerCase().includes(".pdf")) {
    return <iframe className="h-full w-full border-0" src={variant.public_url} title={variant.original_name ?? "PDF"} />;
  }

  return (
    <Image
      alt={variant.original_name ?? "Uploaded design"}
      className="object-contain"
      fill
      sizes="(max-width: 768px) 92vw, 680px"
      src={variant.public_url}
      unoptimized
    />
  );
}
