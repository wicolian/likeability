# Likeability Product Notes

## PRD Addendum v1.1

### Project Rename
- Previous project naming is retired in favor of Likeability.
- Package name: `likeability`.
- App title: `Likeability`.
- Figma embed host param: `embed_host=likeability`.
- `.env.local.example`: `NEXT_PUBLIC_APP_URL=https://likeability.fyi`.
- `<title>` tag: `Likeability — Designs that get liked`.
- Meta description: `Share your designs. Get anonymous feedback. Votes tell the truth.`
- GitHub repo description and README tagline: `Designs which gets liked by anonymity with feedbacks`.

### Platform Chrome Components
- Platform chrome wraps uploaded media in faithful hardcoded social UI.
- Components live in `components/device/platforms/`.
- Designer media fills only the content slot.
- Chrome uses system-ui, deterministic placeholder content, and no random data.
- Instagram feed and reel support carousel indicators and slide controls for 2-5 image variants.

### Responsive Preview Panel
- `components/preview/ResponsivePreviewPanel.tsx` opens as a full-screen slide-in overlay.
- Shows Mobile `375 x 812px`, Tablet `768 x 1024px`, and Desktop `1440 x 900px`.
- Desktop shows all three side by side; mobile uses a tab switcher.
- Uses CSS `transform: scale(...)` and does not create a new route.

### Device Selector
- Tier 1 selects platform: Generic, IG Post, IG Story, IG Reel, LinkedIn, X, TikTok.
- Tier 2 appears only for Generic and LinkedIn.
- Generic supports Mobile, Tablet, Desktop.
- LinkedIn supports Mobile, Desktop, Banner.

### Build Order Additions
- Step 6b: build platform chrome components and route `DeviceFrame.tsx`.
- Step 6c: build responsive preview panel and wire preview buttons on upload/voting cards.
