"use client";

import {
  isSoundEnabled,
  playSound as playReactSound,
  setSoundEnabled,
} from "react-sounds";

type SoundName =
  | "positiveReaction"
  | "negativeReaction"
  | "soundOn"
  | "upload"
  | "uploadFailed"
  | "comment"
  | "warning"
  | "expired";

const librarySounds: Record<SoundName, string> = {
  positiveReaction: "arcade/coin",
  negativeReaction: "game/hit",
  soundOn: "notification/popup",
  upload: "notification/success",
  uploadFailed: "notification/error",
  comment: "ui/success_blip",
  warning: "notification/warning",
  expired: "game/void",
};

const localFallbacks: Partial<Record<SoundName, string>> = {
  positiveReaction: "/sounds/vote.mp3",
  negativeReaction: "/sounds/comment.mp3",
  soundOn: "/sounds/upload.mp3",
  upload: "/sounds/upload.mp3",
  uploadFailed: "/sounds/expired.mp3",
  comment: "/sounds/comment.mp3",
  warning: "/sounds/warning.mp3",
  expired: "/sounds/expired.mp3",
};

function playFallback(name: SoundName, volume: number) {
  if (typeof window === "undefined") return;
  const path = localFallbacks[name];
  if (!path) return;
  const audio = new Audio(path);
  audio.volume = volume;
  void audio.play().catch(() => {});
}

export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const legacy = window.localStorage.getItem("sfx");
  if (legacy === "off") return false;
  return isSoundEnabled();
}

export function setSfxEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("sfx", enabled ? "on" : "off");
  setSoundEnabled(enabled);
  if (!enabled) stopSound("warning");
}

export function playSound(name: SoundName, volume = 0.7) {
  if (!isSfxEnabled()) return;

  void playReactSound(librarySounds[name], { volume }).catch((error) => {
    console.warn(`Failed to play sound "${name}"`, error);
    playFallback(name, volume);
  });
}

export function playSoundOnce(name: SoundName, volume = 0.7) {
  void playReactSound(librarySounds[name], { volume }).catch(() => {
    playFallback(name, volume);
  });
}

export function stopSound(name: SoundName) {
  if (name !== "warning") return;
}
