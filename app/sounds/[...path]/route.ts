import { type NextRequest, NextResponse } from "next/server";

// react-sounds CDN base
const CDN = "https://reactsounds.sfo3.cdn.digitaloceanspaces.com/v1";

// Hashed filenames from react-sounds manifest — redirect local HEAD checks straight to CDN
// so the library skips the 404→fallback path and console stays clean.
const soundFiles: Record<string, string> = {
  "arcade/coin": "arcade/coin.5ec00e3.mp3",
  "game/hit": "game/hit.7f64763.mp3",
  "notification/popup": "notification/popup.cf74b54.mp3",
  "notification/success": "notification/success.f38c2ed.mp3",
  "notification/error": "notification/error.b92d3c6.mp3",
  "notification/warning": "notification/warning.207aed9.mp3",
  "ui/success_blip": "ui/success_blip.911b304.mp3",
};

function handler(req: NextRequest) {
  const name = new URL(req.url).pathname
    .replace(/^\/sounds\//, "")
    .replace(/\.mp3$/, "");

  const file = soundFiles[name];
  if (!file) return new NextResponse(null, { status: 404 });

  return NextResponse.redirect(`${CDN}/${file}`, { status: 302 });
}

export { handler as GET, handler as HEAD };
