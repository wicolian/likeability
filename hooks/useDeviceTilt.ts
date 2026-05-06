"use client";

export function useDeviceTilt(_enabled = true) {
  return {
    rotateX: 0,
    rotateY: 0,
    handlers: {} as Record<string, never>,
  };
}
