# Likeability — CLAUDE.md

## What This Is
Zero-login design feedback web app. Upload designs or paste links (Figma/YouTube/Drive/Dropbox).
View inside device mockups. Anonymous voting. Zone comments. Auto-destruct sessions.
8-bit Minecraft aesthetic. No accounts. No landing page. App opens straight to upload.

## Stack (exact versions — do not upgrade without asking)
- next: 16.2.4
- react: 19.2.5
- tailwindcss: 4.2.4
- framer-motion: 12.38.0
- react-player: latest
- @lottiefiles/dotlottie-react: latest
- @rive-app/react-canvas: latest
- react-sounds: latest
- howler: 2.x
- @supabase/supabase-js: 2.x
- @aws-sdk/client-s3: 3.x + @aws-sdk/s3-request-presigner: 3.x
- bcryptjs: 2.x
- uuid: 9.x
- zod: 3.x

## Absolute Rules
- NEVER add a landing page. app/page.tsx IS the upload interface.
- NEVER require login or email anywhere in the app.
- NEVER store raw IP addresses. Always SHA-256(IP + session_id).
- NEVER store raw passwords. Always bcrypt hash with 12 rounds.
- NEVER serve files after expiry. 410 Gone immediately.
- ALWAYS validate file type via magic bytes server-side, not just MIME headers.
- ALWAYS use presigned R2 URLs — files never pass through Next.js server.
- ALWAYS use TypeScript strict mode. No `any` types.
- ALWAYS use Zod for API input validation.

## Design Rules
- Dark mode ONLY. No light mode.
- Primary font: PressStart2P (pixel). Body copy max-width: 640px.
- 8-bit pixel borders everywhere (see globals.css .pixel-border class).
- Framer Motion for all transitions. 8-bit "wipe" style between states.
- Sounds via Howler.js. Check localStorage('sfx') before playing.
- Presentation Mode toggle hides 8-bit chrome, uses clean Inter font.

## File Size Limits
- Images/PDF/Lottie/Rive: 10MB max
- Video uploads: 500MB max
- Linked videos (YouTube/Drive/Dropbox): no file stored, just URL

## Expiry Hard Caps
- Any session: max 7 days (168 hours)
- Default: 24 hours
- After expiry: R2 files deleted, DB rows deleted, page shows 410 ExpiredScreen

## Video URL Normalization (lib/video-url.ts)
- YouTube: react-player native
- Google Drive: extract file ID -> /file/d/{id}/preview
- Dropbox: replace dl=0 with raw=1, rewrite to dl.dropboxusercontent.com
- Direct MP4/WebM: pass through as-is

## Realtime
- Votes and comments use Supabase Realtime subscriptions
- useVotes hook: subscribe to INSERT on votes where session_id matches
- useComments hook: subscribe to INSERT on comments where session_id matches

## Build Order
Follow PRODUCT.md Section 12 step by step. Do not skip steps.
