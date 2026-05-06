interface UploadProgressProps {
  value: number;
}

export function UploadProgress({ value }: UploadProgressProps) {
  return (
    <div className="w-full border-3 border-[var(--color-border)] bg-black p-1" aria-label="Upload progress">
      <div
        className="h-4 bg-[var(--color-green)] transition-[width]"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
