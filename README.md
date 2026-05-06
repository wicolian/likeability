# Likeability

Zero-login design feedback app for sharing mockups, collecting anonymous votes, and adding pinned comments inside device frames.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment

Copy `.env.local.example` to `.env.local` and fill in Supabase, Cloudflare R2, and cleanup credentials.

`NEXT_PUBLIC_APP_URL` controls generated session share links. For production, set it to:

```bash
NEXT_PUBLIC_APP_URL=https://likeablity.fyi
```
