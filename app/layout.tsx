import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { SoundProviderClient } from "@/components/ui/SoundProviderClient";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://likeability.fyi"),
  title: {
    default: "Likeability — Designs that get liked",
    template: "%s | Likeability",
  },
  description:
    "Share designs. Get anonymous votes and pinned comments. No login, no accounts. Sessions auto-delete in 24 hours. Built for designers who want honest feedback fast.",
  keywords: [
    "design feedback",
    "anonymous design review",
    "design voting tool",
    "UI feedback",
    "UX critique",
    "share design for feedback",
    "no login design tool",
    "figma feedback",
    "design critique app",
    "anonymous design comments",
  ],
  authors: [{ name: "Likeability" }],
  creator: "Likeability",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { title: "Likeability" },
  openGraph: {
    type: "website",
    url: "https://likeability.fyi",
    siteName: "Likeability",
    title: "Likeability — Designs that get liked",
    description:
      "Share designs. Get anonymous votes and pinned comments. No login, no accounts. Sessions auto-delete in 24 hours.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Likeability — Designs that get liked",
    description:
      "Share designs. Get anonymous votes and pinned comments. No login, no accounts. Sessions auto-delete in 24 hours.",
    creator: "@likeabilityfyi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://likeability.fyi",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://likeability.fyi/#app",
      name: "Likeability",
      url: "https://likeability.fyi",
      description:
        "Anonymous design feedback tool. Upload designs or paste Figma/YouTube/Drive links. Get honest votes and zone-pinned comments with no login required.",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Anonymous voting — no login required",
        "Zone-pinned comments on designs",
        "Figma, YouTube, Google Drive, Dropbox link support",
        "Device mockup previews (Instagram, TikTok, LinkedIn, X, generic)",
        "Sessions auto-delete after 24 hours",
        "Realtime vote and comment updates",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need to create an account to use Likeability?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Likeability requires zero login or account creation. Upload your design or paste a link, share the session URL, and collect anonymous feedback instantly.",
          },
        },
        {
          "@type": "Question",
          name: "How long do design feedback sessions last?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sessions default to 24 hours and can be set up to 7 days. After expiry, all files and data are permanently deleted.",
          },
        },
        {
          "@type": "Question",
          name: "What file types can I upload for design feedback?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can upload images (PNG, JPG, GIF, WebP), PDFs, Lottie JSON, and Rive files up to 10 MB, or video files up to 500 MB. You can also paste Figma, YouTube, Google Drive, or Dropbox links.",
          },
        },
        {
          "@type": "Question",
          name: "Is Likeability free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Likeability is completely free to use with no subscription required.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-mode="pixel">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-white)] antialiased">
        <SoundProviderClient>
          {children}
          <Toaster richColors theme="dark" />
          <Analytics />
        </SoundProviderClient>
      </body>
    </html>
  );
}
