import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "@/lib/env";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.customerOrigin),
  title: "Fideto",
  description: "Fideto — portefeuille universel de fidélité.",
  applicationName: "Fideto",
  openGraph: {
    siteName: "Fideto",
    title: "Fideto",
    description: "Fideto — portefeuille universel de fidélité.",
    type: "website",
    locale: "fr_FR",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fideto",
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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${manrope.variable} min-h-dvh antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
