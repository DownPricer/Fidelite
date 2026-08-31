import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fife Life",
  description: "Fife Life — portefeuille universel de fidélité.",
  applicationName: "Fife Life",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fife Life",
    statusBarStyle: "black",
  },
};

export const viewport: Viewport = {
  themeColor: "#090911",
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
      <body className={`${manrope.variable} min-h-dvh antialiased`}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
