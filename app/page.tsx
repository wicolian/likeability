"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { DropZone } from "@/components/upload/DropZone";
import { LinkInput } from "@/components/upload/LinkInput";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { SessionConfig, type SessionConfigValue } from "@/components/session/SessionConfig";
import { ShareLink } from "@/components/session/ShareLink";
import { DeviceSelector } from "@/components/device/DeviceSelector";
import { DeviceFrame } from "@/components/device/DeviceFrame";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { ResponsivePreviewPanel } from "@/components/preview/ResponsivePreviewPanel";
import { PresentationMode } from "@/components/ui/PresentationMode";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { PixelButton } from "@/components/ui/PixelButton";
import { useFileUpload } from "@/hooks/useFileUpload";
import { readApiResponse } from "@/lib/http";
import { detectVariantTypeFromUrl } from "@/lib/video-url";
import { playSound } from "@/lib/sounds";
import type { DeviceType, Variant } from "@/lib/types";

interface SessionState {
  session_id: string;
  slug: string;
  share_url: string;
  expires_at: string;
}

export default function Home() {
  const [configOpen, setConfigOpen] = useState(false);
  const [pendingConfig, setPendingConfig] = useState<SessionConfigValue | null>(null);
  const [session, setSession] = useState<SessionState | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [device, setDevice] = useState<DeviceType>("iphone-16-pro-portrait");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { uploadFile, progress, isUploading } = useFileUpload();

  async function createSession(config: SessionConfigValue) {
    const response = await fetch("/api/session/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const payload = await readApiResponse(response);
    if (!response.ok) throw new Error(payload.error ?? "Could not create session");
    playSound("upload");
    const created = payload as unknown as SessionState;
    setSession(created);
    return created;
  }

  async function ensureSession(config = pendingConfig ?? { password: null, expires_in_hours: 24 }) {
    if (session) return session;
    const created = await createSession(config);
    setPendingConfig(config);
    return created;
  }

  async function handleFiles(files: File[]) {
    if (variants.length + files.length > 5) {
      toast.error("MAX 5 VARIANTS PER SESSION.");
      return;
    }

    setBusy(true);
    try {
      const activeSession = await ensureSession();
      const uploaded: Variant[] = [];
      for (const file of files) {
        const variant = await uploadFile(activeSession.session_id, file);
        uploaded.push(variant as Variant);
      }
      setVariants((current) => [...current, ...uploaded].slice(0, 5));
    } catch (error) {
      playSound("uploadFailed");
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleLink(url: string, type: ReturnType<typeof detectVariantTypeFromUrl>) {
    if (variants.length >= 5) {
      toast.error("MAX 5 VARIANTS PER SESSION.");
      return;
    }

    setBusy(true);
    try {
      const activeSession = await ensureSession();
      const response = await fetch(`/api/session/${activeSession.session_id}/variant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: activeSession.session_id,
          type,
          public_url: url,
          original_name: type === "figma" ? "Figma link" : "Video link",
          storage_key: null,
          file_size_bytes: null,
        }),
      });
      const payload = await readApiResponse(response);
      if (!response.ok) throw new Error(payload.error ?? "Could not add link");
      setVariants((current) => [...current, payload.variant as Variant]);
      playSound("upload");
      toast.success("LINK ACCEPTED.");
    } catch (error) {
      playSound("uploadFailed");
      toast.error(error instanceof Error ? error.message : "Could not add link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] p-4 text-[var(--color-white)] md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="pixel-border relative flex items-center justify-between gap-4 overflow-hidden bg-[var(--color-surface)] p-4">
          <span className="absolute bottom-0 left-0 h-1 w-1/5 bg-[var(--color-green)]" />
          <span className="absolute bottom-0 left-1/5 h-1 w-1/5 bg-[var(--color-cyan)]" />
          <span className="absolute bottom-0 left-2/5 h-1 w-1/5 bg-[var(--color-pink)]" />
          <span className="absolute bottom-0 left-3/5 h-1 w-1/5 bg-[var(--color-yellow)]" />
          <span className="absolute bottom-0 left-4/5 h-1 w-1/5 bg-[var(--color-orange)]" />
          <div className="min-w-0">
            <h1 className="text-lg text-[var(--color-green)] md:text-2xl">LIKEABILITY</h1>
            <p className="mt-2 max-w-[640px] text-[10px] leading-6 text-[var(--color-dim)]">
              UPLOAD MOCKS. SHARE ONE LINK. COLLECT ANONYMOUS VOTES AND PINNED COMMENTS.
            </p>
          </div>
          <div className="flex gap-2">
            <SoundToggle />
            <PresentationMode />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
          <div className="space-y-4">
            <DropZone disabled={busy || isUploading || variants.length >= 5} onFiles={(files) => void handleFiles(files)} />
            {isUploading ? <UploadProgress value={progress} /> : null}
            <LinkInput disabled={busy || variants.length >= 5} onLink={handleLink} />
            <div className="flex flex-wrap items-center gap-3">
              <PixelButton onClick={() => setConfigOpen(true)} tone="pink" type="button">
                SESSION SETTINGS
              </PixelButton>
              {session ? <ShareLink url={session.share_url} /> : null}
              <span className="text-[10px] text-[var(--color-dim)]">{variants.length}/5 VARIANTS</span>
            </div>
            {session ? (
              <div className="pixel-border bg-[var(--color-surface)] p-4 text-[10px] leading-6 text-[var(--color-dim)]">
                SHARE URL: <span className="text-[var(--color-white)]">{session.share_url}</span>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <DeviceSelector value={device} onChange={setDevice} />
            <motion.div className="pixel-border min-h-[420px] bg-[var(--color-surface)] p-4" layout>
              {variants[0] ? (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button className="device-tab text-[8px]" onClick={() => setPreviewOpen(true)} type="button">
                      👁 PREVIEW ALL SCREENS
                    </button>
                  </div>
                  <DeviceFrame device={device}>
                    <div className="relative h-full w-full">
                      <MediaRenderer variant={variants[0]} />
                    </div>
                  </DeviceFrame>
                </div>
              ) : (
                <div className="grid min-h-[380px] place-items-center text-center text-[10px] leading-6 text-[var(--color-dim)]">
                  FIRST VARIANT PREVIEW APPEARS HERE.
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>

      <SessionConfig
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        onSubmit={(config) => {
          setPendingConfig(config);
          setConfigOpen(false);
          if (!session) {
            void createSession(config).catch((error) =>
              toast.error(error instanceof Error ? error.message : "Could not create session"),
            );
          }
        }}
      />
      {variants[0] ? (
        <ResponsivePreviewPanel isOpen={previewOpen} onClose={() => setPreviewOpen(false)} variant={variants[0]} />
      ) : null}
    </main>
  );
}
