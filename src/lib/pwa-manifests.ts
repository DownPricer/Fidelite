import type { MetadataRoute } from "next";

const ICONS = [
  { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" as const },
  { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" as const },
  { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" as const },
];

const SHARED = {
  display: "standalone" as const,
  background_color: "#06060B",
  theme_color: "#090911",
  lang: "fr",
  icons: ICONS,
};

/** PWA installée depuis fideto.fr (portefeuille client). */
export function customerPwaManifest(): MetadataRoute.Manifest {
  return {
    ...SHARED,
    id: "/",
    name: "Fideto",
    short_name: "Fideto",
    description: "Fideto — portefeuille universel de fidélité.",
    start_url: "/carte",
    scope: "/",
  };
}

/** PWA installée depuis app.fideto.fr (espace commerçant). */
export function merchantPwaManifest(): MetadataRoute.Manifest {
  return {
    ...SHARED,
    id: "/app",
    name: "Fideto Commerçant",
    short_name: "Commerçant",
    description: "Gérez votre programme de fidélité Fideto.",
    start_url: "/app",
    scope: "/",
  };
}

export function resolvePwaManifestForHost(hostHeader: string | null): MetadataRoute.Manifest {
  const name = (hostHeader ?? "").split(":")[0]?.toLowerCase() ?? "";
  const appHosts = new Set(
    [process.env.APP_HOST, process.env.LEGACY_APP_HOST, "app.fideto.fr", "app-fidelite.sitereadyshd.fr"]
      .filter(Boolean)
      .map((h) => String(h).toLowerCase()),
  );
  if (appHosts.has(name)) return merchantPwaManifest();
  return customerPwaManifest();
}
