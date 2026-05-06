export type VideoSource = "youtube" | "drive" | "dropbox" | "direct" | "unknown";

export function detectSource(url: string): VideoSource {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("drive.google.com")) return "drive";
  if (url.includes("dropbox.com") || url.includes("dropboxusercontent.com")) return "dropbox";
  if (/\.(mp4|webm|mov|avi)(\?.*)?$/i.test(url)) return "direct";
  return "unknown";
}

export function normalizeVideoUrl(url: string): string {
  const source = detectSource(url);

  if (source === "drive") {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match?.[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  if (source === "dropbox") {
    const rewritten = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
    return rewritten.includes("dl=0")
      ? rewritten.replace("dl=0", "raw=1")
      : rewritten;
  }

  return url;
}

export function shouldWarnAboutSource(url: string): string | null {
  if (detectSource(url) === "drive") {
    return "Files over 100MB on Google Drive may not stream reliably. Consider using direct upload or YouTube.";
  }

  return null;
}

export function detectVariantTypeFromUrl(url: string): "video_link" | "figma" {
  return url.includes("figma.com") ? "figma" : "video_link";
}
