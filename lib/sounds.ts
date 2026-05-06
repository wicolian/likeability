"use client";

import { Howl } from "howler";

type SoundName = "upload" | "vote" | "comment" | "warning" | "expired";

const paths: Record<SoundName, string> = {
  upload: "/sounds/upload.mp3",
  vote: "/sounds/vote.mp3",
  comment: "/sounds/comment.mp3",
  warning: "/sounds/warning.mp3",
  expired: "/sounds/expired.mp3",
};

const sounds = new Map<SoundName, Howl>();

export function isSfxEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("sfx") !== "off";
}

export function setSfxEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("sfx", enabled ? "on" : "off");
  if (!enabled) stopSound("warning");
}

export function playSound(name: SoundName, volume = 0.7) {
  if (!isSfxEnabled()) return;
  const sound =
    sounds.get(name) ??
    new Howl({
      src: [paths[name]],
      volume,
      loop: name === "warning",
      html5: true,
    });

  sounds.set(name, sound);
  if (name === "warning" && sound.playing()) return;
  sound.volume(volume);
  sound.play();
}

export function stopSound(name: SoundName) {
  sounds.get(name)?.stop();
}
