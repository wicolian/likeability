"use client";

import {
  playSound as rsPlaySound,
  isSoundEnabled,
  setSoundEnabled,
} from "react-sounds";

const soundMap = {
  positiveReaction: "arcade/coin",
  negativeReaction: "game/hit",
  soundOn: "notification/popup",
  popup: "notification/popup",
  upload: "notification/success",
  uploadFailed: "notification/error",
  comment: "ui/success_blip",
  warning: "notification/warning",
  expired: "notification/error",
} as const;

export type SoundName = keyof typeof soundMap;

export function isSfxEnabled(): boolean {
  return isSoundEnabled();
}

export function setSfxEnabled(enabled: boolean): void {
  setSoundEnabled(enabled);
}

export function playSound(name: SoundName, volume = 0.7): void {
  if (!isSoundEnabled()) return;
  rsPlaySound(soundMap[name], { volume }).catch(() => {});
}

// Plays regardless of sfx preference (e.g. the mute-toggle click itself)
export function playSoundOnce(name: SoundName, volume = 0.7): void {
  rsPlaySound(soundMap[name], { volume }).catch(() => {});
}

// react-sounds auto-cleans up; all mapped sounds are <2s so this is a safe no-op
export function stopSound(_name: SoundName): void {}
