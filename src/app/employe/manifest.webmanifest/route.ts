import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "Fife Life Employé",
    short_name: "Employé",
    description: "Scannez les cartes Fife Life en caisse.",
    start_url: "/employe/scan",
    scope: "/employe/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#06060B",
    theme_color: "#090911",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  });
}
