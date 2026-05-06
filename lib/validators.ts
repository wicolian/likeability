import { z } from "zod";
import type { VariantType } from "./types";

export const MAX_NON_VIDEO_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
export const MAX_VARIANTS_PER_SESSION = 5;

export const allowedFileTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/webm",
  "application/json",
  "application/octet-stream",
] as const;

export const createSessionSchema = z.object({
  password: z.string().trim().min(1).max(128).nullable().optional(),
  expires_in_hours: z.coerce.number().int().min(1).max(168).default(24),
});

export const presignedUploadSchema = z.object({
  session_id: z.string().uuid(),
  file_name: z.string().min(1).max(180),
  file_type: z.enum(allowedFileTypes),
  file_size: z.number().int().positive().max(MAX_VIDEO_BYTES),
  magic_bytes: z.string().regex(/^[0-9a-f]*$/i).max(32).optional(),
});

export const variantSchema = z.object({
  session_id: z.string().uuid(),
  type: z.enum(["image", "video_upload", "video_link", "figma", "lottie", "rive"]),
  storage_key: z.string().max(512).nullable().optional(),
  public_url: z.string().url(),
  original_name: z.string().max(180).nullable().optional(),
  file_size_bytes: z.number().int().positive().max(MAX_VIDEO_BYTES).nullable().optional(),
});

export const voteSchema = z.object({
  session_id: z.string().uuid(),
  variant_id: z.string().uuid(),
});

export const commentSchema = voteSchema.extend({
  x_percent: z.number().min(0).max(100),
  y_percent: z.number().min(0).max(100),
  content: z.string().trim().min(1).max(280),
});

export function variantTypeFromUpload(fileName: string, mime: string): VariantType {
  const lower = fileName.toLowerCase();
  if (mime.startsWith("video/")) return "video_upload";
  if (mime === "application/json" || lower.endsWith(".lottie")) return "lottie";
  if (lower.endsWith(".riv")) return "rive";
  return "image";
}

export function sanitizeFileName(name: string): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

  return cleaned || "upload.bin";
}

export function validateUploadSize(mime: string, size: number): string | null {
  if (mime.startsWith("video/")) {
    return size <= MAX_VIDEO_BYTES ? null : "FILE TOO LARGE. MAX 500MB.";
  }

  return size <= MAX_NON_VIDEO_BYTES ? null : "FILE TOO LARGE. MAX 10MB.";
}

export function validateMagicBytes(mime: string, magicBytes?: string): string | null {
  if (!magicBytes) return null;

  const bytes = magicBytes.toLowerCase();
  const matches: Record<string, (hex: string) => boolean> = {
    "image/png": (hex) => hex.startsWith("89504e47"),
    "image/jpeg": (hex) => hex.startsWith("ffd8ff"),
    "image/webp": (hex) => hex.startsWith("52494646") && hex.slice(16, 24) === "57454250",
    "application/pdf": (hex) => hex.startsWith("25504446"),
    "video/mp4": (hex) => hex.slice(8, 16) === "66747970",
    "video/webm": (hex) => hex.startsWith("1a45dfa3"),
    "application/json": (hex) => {
      const first = Number.parseInt(hex.slice(0, 2), 16);
      return first === 0x7b || first === 0x5b;
    },
    "application/octet-stream": () => true,
  };

  return matches[mime]?.(bytes) ? null : "Declared file type does not match file signature.";
}
