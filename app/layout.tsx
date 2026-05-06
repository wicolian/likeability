import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SoundProviderClient } from "@/components/ui/SoundProviderClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Likeability",
  description: "Anonymous design voting and zone comments inside device mockups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-mode="pixel">
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-white)] antialiased">
        <SoundProviderClient>
          {children}
          <Toaster richColors theme="dark" />
        </SoundProviderClient>
      </body>
    </html>
  );
}
