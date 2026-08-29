import type { Metadata, Viewport } from "next";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FifeLite",
  description: "Carte de fidélité simple pour les commerces.",
  applicationName: "FifeLite",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FifeLite",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-dvh antialiased">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
