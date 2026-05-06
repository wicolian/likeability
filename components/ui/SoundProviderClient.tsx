"use client";

import { SoundProvider } from "react-sounds";
import type { ReactNode } from "react";

const preload = [
  "arcade/coin",
  "game/hit",
  "notification/popup",
  "notification/success",
  "notification/error",
  "ui/success_blip",
  "notification/warning",
  "game/void",
];

export function SoundProviderClient({ children }: { children: ReactNode }) {
  return (
    <SoundProvider initialEnabled preload={preload}>
      {children}
    </SoundProvider>
  );
}
