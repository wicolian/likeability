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
      className={`pixel-border-cyan relative flex min-h-72 w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[var(--color-surface)] p-8 text-center transition ${
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
      <span className="absolute left-0 top-0 h-2 w-1/4 bg-[var(--color-green)]" />
      <span className="absolute left-1/4 top-0 h-2 w-1/4 bg-[var(--color-cyan)]" />
      <span className="absolute left-1/2 top-0 h-2 w-1/4 bg-[var(--color-pink)]" />
      <span className="absolute left-3/4 top-0 h-2 w-1/4 bg-[var(--color-yellow)]" />
      <Upload size={34} className="text-[var(--color-green)]" />
      <span className="flex max-w-full flex-col gap-2 text-center text-[11px] leading-5 text-[var(--color-white)] sm:text-sm sm:leading-7">
        <span>DROP FILES OR CLICK</span>
        <span>TO UPLOAD</span>
      </span>
      <span className="block max-w-[30ch] text-[10px] leading-6 text-[var(--color-dim)] sm:max-w-lg">
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
