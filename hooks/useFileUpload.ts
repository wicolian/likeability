"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(sessionId: string, file: File): Promise<UploadResult> {
    setIsUploading(true);
    setProgress(5);

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

      const presigned = await presignedResponse.json();
      if (!presignedResponse.ok) throw new Error(presigned.error ?? "Could not prepare upload");

      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("PUT", presigned.presigned_url);
        request.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        request.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setProgress(Math.round((event.loaded / event.total) * 85) + 10);
        };
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) resolve();
          else reject(new Error("Upload failed"));
        };
        request.onerror = () => reject(new Error("Upload failed"));
        request.send(file);
      });

      const variantResponse = await fetch(`/api/session/${sessionId}/variant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          type: variantTypeFromUpload(file.name, file.type || "application/octet-stream"),
          storage_key: presigned.storage_key,
          public_url: presigned.public_url,
          original_name: file.name,
          file_size_bytes: file.size,
        }),
      });

      const variant = await variantResponse.json();
      if (!variantResponse.ok) throw new Error(variant.error ?? "Upload registered but variant failed");

      setProgress(100);
      playSound("upload");
      return { ...variant.variant, storage_key: presigned.storage_key, public_url: presigned.public_url };
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  }

  return { uploadFile, progress, isUploading };
}
