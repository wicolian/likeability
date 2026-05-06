"use client";

import { useCallback, useRef, useState } from "react";

export function useDeviceTilt(enabled = true) {
  const frame = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!enabled || "ontouchstart" in window) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setTilt({
          rotateX: Math.max(-15, Math.min(15, y * -30)),
          rotateY: Math.max(-15, Math.min(15, x * 30)),
        });
      });
    },
    [enabled],
  );

  const onMouseLeave = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setTilt({ rotateX: 0, rotateY: 0 }));
  }, []);

  return {
    rotateX: tilt.rotateX,
    rotateY: tilt.rotateY,
    handlers: {
      onMouseMove,
      onMouseLeave,
    },
  };
}
