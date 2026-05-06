export type VariantType =
  | "image"
  | "video_upload"
  | "video_link"
  | "figma"
  | "lottie"
  | "rive";

export type DeviceType =
  | "iphone-16-pro-portrait"
  | "iphone-16-pro-landscape"
  | "android-portrait"
  | "instagram-post"
  | "instagram-story"
  | "instagram-reel"
  | "linkedin-feed-mobile"
  | "linkedin-feed"
  | "linkedin-banner"
  | "x-post"
  | "tiktok"
  | "desktop-browser"
  | "ipad-pro-portrait";

export interface SessionRecord {
  id: string;
  slug: string;
  expires_at: string;
  has_password: boolean;
}

export interface Variant {
  id: string;
  session_id: string;
  type: VariantType;
  storage_key: string | null;
  public_url: string;
  original_name: string | null;
  file_size_bytes: number | null;
  position: number;
  created_at?: string;
}

export interface CommentRecord {
  id: string;
  session_id: string;
  variant_id: string;
  x_percent: number;
  y_percent: number;
  content: string;
  created_at: string;
}

export interface SessionPayload {
  session: SessionRecord;
  variants: Variant[];
  votes: Record<string, number>;
  comments: CommentRecord[];
}
