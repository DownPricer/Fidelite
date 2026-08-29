import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FifeLite",
    short_name: "FifeLite",
    description: "Votre carte de fidélité, toujours dans le téléphone.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F1EA",
    theme_color: "#0F766E",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
