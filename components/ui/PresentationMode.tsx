"use client";

import { MonitorCog } from "lucide-react";
import { useEffect, useState } from "react";

export function PresentationMode() {
  const [presentation, setPresentation] = useState(() =>
    typeof window === "undefined" ? false : window.localStorage.getItem("mode") === "presentation",
  );

  useEffect(() => {
    document.documentElement.dataset.mode = presentation ? "presentation" : "pixel";
  }, [presentation]);

  function toggle() {
    const next = !presentation;
    setPresentation(next);
    window.localStorage.setItem("mode", next ? "presentation" : "pixel");
  }

  return (
    <button
      aria-label="Toggle presentation mode"
      title="Toggle presentation mode"
      className="icon-button"
      onClick={toggle}
      type="button"
    >
      <MonitorCog size={18} />
    </button>
  );
}
