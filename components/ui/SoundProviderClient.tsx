"use client";

import { SoundProvider } from "react-sounds";
import type { ReactNode } from "react";

const PRELOAD = [
  "arcade/coin",
  "game/hit",
  "notification/popup",
  "notification/success",
  "notification/error",
  "ui/success_blip",
  "notification/warning",
] as const;

export function SoundProviderClient({ children }: { children: ReactNode }) {
  return (
    <SoundProvider preload={[...PRELOAD]}>
      {children}
    </SoundProvider>
  );
}
