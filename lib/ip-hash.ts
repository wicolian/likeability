import { createHash } from "node:crypto";

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function hashIpForSession(ip: string, sessionId: string): string {
  return createHash("sha256").update(`${ip}:${sessionId}`).digest("hex");
}
