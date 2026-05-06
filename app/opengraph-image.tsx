import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Likeability — Designs that get liked";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontData = await readFile(join(process.cwd(), "public/fonts/PressStart2P.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"PressStart2P"',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Pixel grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(57,255,20,0.07) 0 3px, transparent 3px 100%), linear-gradient(180deg, rgba(0,229,255,0.05) 0 3px, transparent 3px 100%)",
            backgroundSize: "128px 128px",
          }}
        />

        {/* Colour bar — top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>
          <div style={{ flex: 1, background: "#39ff14" }} />
          <div style={{ flex: 1, background: "#00e5ff" }} />
          <div style={{ flex: 1, background: "#ff4fd8" }} />
          <div style={{ flex: 1, background: "#ffe14d" }} />
          <div style={{ flex: 1, background: "#ff6b00" }} />
        </div>

        {/* Colour bar — bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, display: "flex" }}>
          <div style={{ flex: 1, background: "#39ff14" }} />
          <div style={{ flex: 1, background: "#00e5ff" }} />
          <div style={{ flex: 1, background: "#ff4fd8" }} />
          <div style={{ flex: 1, background: "#ffe14d" }} />
          <div style={{ flex: 1, background: "#ff6b00" }} />
        </div>

        {/* Pixel border frame */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "4px solid #2f2f36",
            boxShadow: "4px 0 0 #2f2f36, -4px 0 0 #2f2f36, 0 4px 0 #2f2f36, 0 -4px 0 #2f2f36",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            padding: "0 80px",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 64,
              color: "#39ff14",
              letterSpacing: "-1px",
              textShadow: "0 0 40px rgba(57,255,20,0.5)",
              display: "flex",
            }}
          >
            LIKEABILITY
          </div>

          {/* Divider */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 80, height: 3, background: "#39ff14" }} />
            <div style={{ width: 80, height: 3, background: "#00e5ff" }} />
            <div style={{ width: 80, height: 3, background: "#ff4fd8" }} />
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 18,
              color: "#8b8b96",
              textAlign: "center",
              lineHeight: 2.2,
              maxWidth: 820,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#f5f5f7" }}>UPLOAD DESIGNS · SHARE ONE LINK</span>
            <span>COLLECT ANONYMOUS VOTES + COMMENTS</span>
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {["NO LOGIN", "AUTO-DELETES", "REALTIME VOTES"].map((label, i) => (
              <div
                key={label}
                style={{
                  padding: "10px 20px",
                  border: `3px solid ${["#39ff14", "#00e5ff", "#ff4fd8"][i]}`,
                  color: ["#39ff14", "#00e5ff", "#ff4fd8"][i],
                  fontSize: 11,
                  display: "flex",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 48,
            fontSize: 10,
            color: "#2f2f36",
            display: "flex",
          }}
        >
          likeability.fyi
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "PressStart2P", data: fontData, style: "normal" }],
    },
  );
}
