# Likeability

**Anonymous design feedback — no accounts, no noise.**

Upload designs or paste Figma/YouTube/Drive links. Share a link. Get honest votes and zone-pinned comments from anyone, instantly. Sessions auto-delete.

---

## What it does

- **Zero login** — no accounts, no email, nothing.
- **Upload or link** — images, PDF, Lottie, Rive, video (up to 500 MB), or paste a Figma / YouTube / Google Drive / Dropbox URL.
- **Device mockups** — preview designs inside Instagram Feed, Story, Reel, TikTok, LinkedIn, X post, or generic mobile/tablet/desktop frames.
- **Anonymous voting** — thumbs up/down per variant. Realtime via Supabase.
- **Zone comments** — click anywhere on the design to drop a pinned comment thread.
- **Auto-destruct** — sessions expire in 24 h by default (max 7 days). Files deleted from R2, rows deleted from DB, page returns 410.
- **8-bit aesthetic** — PressStart2P font, pixel borders, arcade sound effects, Framer Motion wipe transitions.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Sound | Howler 2 via react-sounds (CDN) |
| Database | Supabase (Postgres + Realtime) |
| Storage | Cloudflare R2 (presigned URLs) |
| Auth | None — anonymous sessions via UUID |
| Validation | Zod |
| Video | react-player |

---

## Getting started

```bash
npm install
cp .env.local.example .env.local
# fill in the env vars (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `R2_ACCOUNT_ID` | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public base URL for R2 bucket |
| `CLEANUP_SECRET` | Secret token for the cleanup cron endpoint |
| `NEXT_PUBLIC_APP_URL` | Full app URL — set to `https://likeability.fyi` in production |

---

## R2 CORS

Run once after creating your R2 bucket:

```bash
npm run r2:cors
```

---

## Sound effects

Sounds are loaded on demand from the [react-sounds](https://www.npmjs.com/package/react-sounds) CDN — no local audio files required.

| Event | Sound |
|---|---|
| Positive vote / reaction | `arcade/coin` |
| Negative vote / error reaction | `game/hit` |
| Sound toggle on/off | `notification/popup` |
| Upload / session / link success | `notification/success` |
| Upload / link failure | `notification/error` |
| Comment posted | `ui/success_blip` |

---

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Set all environment variables in the Vercel dashboard or via `vercel env add`.

For session auto-expiry, wire a daily cron to `POST /api/cleanup` with the `CLEANUP_SECRET` header.
