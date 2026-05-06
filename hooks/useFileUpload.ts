"use client";

import { useState } from "react";
import { toast } from "sonner";
import { readApiResponse } from "@/lib/http";
import { playSound } from "@/lib/sounds";
import { variantTypeFromUpload } from "@/lib/validators";

interface UploadResult {
  id?: string;
  public_url: string;
  storage_key: string;
}

async function readMagicBytes(file: File): Promise<string> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(
    sessionId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<UploadResult> {
    setIsUploading(true);
    onProgress?.(5);

    try {
      const presignedResponse = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          file_name: file.name,
          file_type: file.type || "application/octet-stream",
          file_size: file.size,
          magic_bytes: await readMagicBytes(file),
        }),
      });

      const presigned = await readApiResponse(presignedResponse);
      if (!presignedResponse.ok) throw new Error(presigned.error ?? "Could not prepare upload");
      const presignedUrl = String(presigned.presigned_url ?? "");
      const storageKey = String(presigned.storage_key ?? "");
      const publicUrl = String(presigned.public_url ?? "");
      if (!presignedUrl || !storageKey || !publicUrl) throw new Error("Upload response was incomplete");

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("PUT", presignedUrl);
        request.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          onProgress?.(Math.round((event.loaded / event.total) * 80) + 10);
        };
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) resolve();
          else reject(new Error("Upload failed"));
        };
        request.onerror = () =>
          reject(
            new Error(
              "Upload blocked by storage CORS. Apply config/r2-cors.json to the R2 bucket, then retry.",
            ),
          );
        request.send(file);
      });

      const variantResponse = await fetch(`/api/session/${sessionId}/variant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          type: variantTypeFromUpload(file.name, file.type || "application/octet-stream"),
          storage_key: storageKey,
          public_url: publicUrl,
          original_name: file.name,
          file_size_bytes: file.size,
        }),
      });

      const variant = await readApiResponse(variantResponse);
      if (!variantResponse.ok) throw new Error(variant.error ?? "Upload registered but variant failed");

      onProgress?.(100);
      return {
        ...(variant.variant as object),
        storage_key: storageKey,
        public_url: publicUrl,
      } as UploadResult;
    } catch (error) {
      playSound("uploadFailed");
      toast.error(error instanceof Error ? error.message : "Upload failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadFile, isUploading };
}
