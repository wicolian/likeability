export type SafeZoneKind =
  | "instagram-feed"
  | "instagram-story"
  | "instagram-reel"
  | "linkedin-feed"
  | "linkedin-banner"
  | "x-post"
  | "tiktok";

interface SafeZoneOverlayProps {
  kind: SafeZoneKind;
}

interface SafeZoneSpec {
  label: string;
  size: string;
  safe: {
    left: string;
    top: string;
    width: string;
    height: string;
  };
  blocked?: {
    left: string;
    top: string;
    width: string;
    height: string;
  }[];
}

const specs: Record<SafeZoneKind, SafeZoneSpec> = {
  "instagram-feed": {
    label: "IG FEED SAFE ZONE",
    size: "1080 x 1350",
    safe: { left: "3.15%", top: "0%", width: "93.7%", height: "100%" },
  },
  "instagram-story": {
    label: "IG STORY SAFE ZONE",
    size: "1080 x 1920",
    safe: { left: "0%", top: "13%", width: "100%", height: "74%" },
    blocked: [
      { left: "0%", top: "0%", width: "100%", height: "13%" },
      { left: "0%", top: "87%", width: "100%", height: "13%" },
    ],
  },
  "instagram-reel": {
    label: "IG REEL SAFE ZONE",
    size: "1080 x 1920",
    safe: { left: "6%", top: "11.5%", width: "73%", height: "67%" },
    blocked: [
      { left: "0%", top: "0%", width: "100%", height: "11.5%" },
      { left: "0%", top: "78.5%", width: "100%", height: "21.5%" },
      { left: "79%", top: "0%", width: "21%", height: "100%" },
    ],
  },
  "linkedin-feed": {
    label: "LINKEDIN FEED SAFE ZONE",
    size: "1080 x 1350",
    safe: { left: "4%", top: "4%", width: "92%", height: "92%" },
  },
  "linkedin-banner": {
    label: "LINKEDIN BANNER SAFE ZONE",
    size: "1584 x 396",
    safe: { left: "22%", top: "10%", width: "74%", height: "70%" },
    blocked: [{ left: "0%", top: "56%", width: "22%", height: "44%" }],
  },
  "x-post": {
    label: "X POST SAFE ZONE",
    size: "1200 x 675",
    safe: { left: "4%", top: "6%", width: "92%", height: "88%" },
  },
  tiktok: {
    label: "TIKTOK SAFE ZONE",
    size: "1080 x 1920",
    safe: { left: "6%", top: "12%", width: "70%", height: "62%" },
    blocked: [
      { left: "0%", top: "0%", width: "100%", height: "12%" },
      { left: "0%", top: "74%", width: "100%", height: "26%" },
      { left: "76%", top: "0%", width: "24%", height: "100%" },
    ],
  },
};

export function SafeZoneOverlay({ kind }: SafeZoneOverlayProps) {
  const spec = specs[kind];

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden text-white" aria-hidden="true">
      {spec.blocked?.map((zone, index) => (
        <div
          className="absolute bg-black/35"
          key={`${kind}-blocked-${index}`}
          style={{
            left: zone.left,
            top: zone.top,
            width: zone.width,
            height: zone.height,
          }}
        />
      ))}
      <div
        className="absolute border-2 border-[#ffd600] bg-[#9fb0b8]/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.08)]"
        style={{
          left: spec.safe.left,
          top: spec.safe.top,
          width: spec.safe.width,
          height: spec.safe.height,
        }}
      >
        <span className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l-2 border-dashed border-[#ffd600]" />
        <span className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t-2 border-dashed border-[#ffd600]" />
        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold leading-4 text-[#ffd600]">
          {spec.label}
          <br />
          {spec.size}
        </span>
      </div>
    </div>
  );
}
