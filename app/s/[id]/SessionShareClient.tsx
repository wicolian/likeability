"use client";

import { LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Countdown } from "@/components/session/Countdown";
import { ExpiredScreen } from "@/components/session/ExpiredScreen";
import { ShareLink } from "@/components/session/ShareLink";
import { DeviceSelector } from "@/components/device/DeviceSelector";
import { VoteCard } from "@/components/voting/VoteCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { PresentationMode } from "@/components/ui/PresentationMode";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { useComments } from "@/hooks/useComments";
import { useVotes } from "@/hooks/useVotes";
import type { DeviceType, SessionPayload } from "@/lib/types";

interface SessionShareClientProps {
  slug: string;
}

export function SessionShareClient({ slug }: SessionShareClientProps) {
  const [payload, setPayload] = useState<SessionPayload | null>(null);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [device, setDevice] = useState<DeviceType>("iphone-16-pro-portrait");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/s/${slug}`;
  }, [slug]);

  async function loadSession(pass = password) {
    const query = pass ? `?password=${encodeURIComponent(pass)}` : "";
    const response = await fetch(`/api/session/${slug}${query}`, { cache: "no-store" });
    const data = await response.json();

    if (response.status === 401) {
      setNeedsPassword(true);
      setStatus(401);
      if (pass) toast.error(data.error ?? "Incorrect password");
      return;
    }

    if (!response.ok) {
      setStatus(response.status);
      return;
    }

    setPayload(data);
    setNeedsPassword(false);
    setStatus(null);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadSession(""), 0);
    return () => window.clearTimeout(timeout);
    // Initial fetch only; password retries are user-initiated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const votes = useVotes(payload?.session.id ?? "", payload?.votes ?? {});
  const comments = useComments(payload?.session.id ?? "", payload?.comments ?? []);
  const useInstagramCarousel =
    !!payload &&
    (device === "instagram-post" || device === "instagram-reel") &&
    payload.variants.length >= 2 &&
    payload.variants.length <= 5 &&
    payload.variants.every((variant) => variant.type === "image");
  const activeCarouselVariant = useInstagramCarousel ? payload.variants[carouselIndex] : null;

  useEffect(() => {
    if (!payload) return;
    setCarouselIndex((current) => Math.min(current, Math.max(0, payload.variants.length - 1)));
  }, [payload]);

  if (status === 410 || status === 404) return <ExpiredScreen status={status} />;

  if (needsPassword && !payload) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg)] p-4">
        <form
          className="pixel-border w-full max-w-md space-y-5 bg-[var(--color-surface)] p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void loadSession(password);
          }}
        >
          <LockKeyhole className="text-[var(--color-green)]" />
          <h1 className="text-sm text-[var(--color-white)]">PASSWORD REQUIRED</h1>
          <input
            className="pixel-input w-full"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
          <PixelButton className="w-full" type="submit">
            ENTER
          </PixelButton>
        </form>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--color-bg)] p-4 text-[10px] text-[var(--color-dim)]">
        LOADING LIKEABILITY...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-white)] md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="pixel-border relative flex flex-col gap-4 overflow-hidden bg-[var(--color-surface)] p-4 md:flex-row md:items-center md:justify-between">
          <span className="absolute bottom-0 left-0 h-1 w-1/5 bg-[var(--color-green)]" />
          <span className="absolute bottom-0 left-1/5 h-1 w-1/5 bg-[var(--color-cyan)]" />
          <span className="absolute bottom-0 left-2/5 h-1 w-1/5 bg-[var(--color-pink)]" />
          <span className="absolute bottom-0 left-3/5 h-1 w-1/5 bg-[var(--color-yellow)]" />
          <span className="absolute bottom-0 left-4/5 h-1 w-1/5 bg-[var(--color-orange)]" />
          <div className="min-w-0 space-y-2">
            <h1 className="text-lg text-[var(--color-green)]">LIKEABILITY / {payload.session.slug}</h1>
            <p className="text-[10px] text-[var(--color-dim)]">VOTING IS LIMITED TO ONE VOTE PER NETWORK.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Countdown expiresAt={payload.session.expires_at} />
            <ShareLink url={shareUrl} />
            <SoundToggle />
            <PresentationMode />
          </div>
        </header>
        <DeviceSelector value={device} onChange={setDevice} />
        <section className="grid gap-8 xl:grid-cols-2">
          {activeCarouselVariant ? (
            <div className="xl:col-span-2">
              <VoteCard
                comments={comments}
                count={votes[activeCarouselVariant.id] ?? 0}
                device={device}
                isCarousel
                onSlideChange={setCarouselIndex}
                sessionId={payload.session.id}
                totalVariants={payload.variants.length}
                variant={activeCarouselVariant}
                variantIndex={carouselIndex}
              />
            </div>
          ) : (
            payload.variants.map((variant) => (
              <VoteCard
                comments={comments}
                count={votes[variant.id] ?? 0}
                device={device}
                key={variant.id}
                sessionId={payload.session.id}
                variant={variant}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
