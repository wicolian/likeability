"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface DropZoneProps {
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}

export function DropZone({ disabled, onFiles }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function accept(files: FileList | null) {
    if (!files?.length || disabled) return;
    onFiles(Array.from(files).slice(0, 5));
  }

  return (
    <button
      className={`pixel-border flex min-h-72 w-full flex-col items-center justify-center gap-5 bg-[var(--color-surface)] p-8 text-center transition ${
        dragging ? "pixel-border-green" : ""
      }`}
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        accept(event.dataTransfer.files);
      }}
      type="button"
    >
      <Upload size={34} className="text-[var(--color-green)]" />
      <span className="text-balance text-sm leading-7 text-[var(--color-white)]">
        DROP FILES OR CLICK TO UPLOAD
      </span>
      <span className="max-w-lg text-[10px] leading-6 text-[var(--color-dim)]">
        PNG, JPEG, WEBP, PDF, MP4, WEBM, LOTTIE, RIVE. MAX 5 VARIANTS.
      </span>
      <input
        ref={inputRef}
        className="hidden"
        multiple
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4,video/webm,application/json,.lottie,.riv"
        onChange={(event) => accept(event.currentTarget.files)}
      />
    </button>
  );
}
