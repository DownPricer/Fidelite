import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

async function loadMiddleware() {
  vi.resetModules();
  const mod = await import("../src/middleware");
  return mod.middleware;
}

function makeRequest(host: string, path: string, cookie?: string) {
  const headers: Record<string, string> = { host };
  if (cookie) headers.cookie = cookie;
  return new NextRequest(`http://${host}${path}`, { headers });
}

const AD_DETAIL_PATH = "/super-admin/campagnes/ads/ad_123";

describe("middleware — /super-admin/campagnes/ads/[id] ne devient jamais une route commerçant", () => {
  it("n'est jamais classée cross-space vers /app, quel que soit l'hôte (historique ou nouveau)", async () => {
    const middleware = await loadMiddleware();
    for (const host of ["fidelite.sitereadyshd.fr", "fideto.fr", "app.fideto.fr", "admin.fideto.fr"]) {
      const res = middleware(makeRequest(host, AD_DETAIL_PATH, "fifelite_super_admin_entry=1"));
      const location = res.headers.get("location") ?? "";
      expect(location).not.toContain("app.fideto.fr");
      expect(location).not.toContain("/app");
    }
  });

  it("renvoie 404 sans le cookie d'entrée super-admin (jamais une redirection vers /app)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", AD_DETAIL_PATH));
    expect(res.status).toBe(404);
  });

  it("reste accessible (pas de redirection) avec le cookie d'entrée, sur l'hôte historique", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", AD_DETAIL_PATH, "fifelite_super_admin_entry=1"));
    expect(res.status).not.toBe(307);
    expect(res.status).not.toBe(308);
  });

  it("reste accessible (pas de redirection) avec le cookie d'entrée, sur admin.fideto.fr", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("admin.fideto.fr", AD_DETAIL_PATH, "fifelite_super_admin_entry=1"));
    expect(res.status).not.toBe(307);
    expect(res.status).not.toBe(308);
  });
});

/**
 * Le bouton "Ouvrir la fiche" utilise une route relative /super-admin/campagnes/ads/[id] —
 * jamais /app, une route commerçant, APP_ORIGIN, ou une URL absolue vers app.fideto.fr.
 */
describe("campaign-moderation-home.tsx — destination du bouton « Ouvrir la fiche »", () => {
  const source = readFileSync(
    join(process.cwd(), "src/app/super-admin/campagnes/campaign-moderation-home.tsx"),
    "utf8",
  );

  it("pointe vers une route relative /super-admin/campagnes/ads/[id]", () => {
    expect(source).toContain("href={`/super-admin/campagnes/ads/${ad.id}`}");
  });

  it("n'utilise jamais /app, appOrigin ni une URL absolue vers app.fideto.fr", () => {
    expect(source).not.toContain('"/app"');
    expect(source).not.toContain("appOrigin");
    expect(source).not.toContain("app.fideto.fr");
  });
});

/**
 * Le service worker ne doit jamais intercepter une requête de navigation/RSC Next.js (voir
 * public/sw.js) : le faire masquait silencieusement tout échec réseau derrière la page d'accueil
 * mise en cache (`caches.match("/")`), donnant l'impression qu'un clic "redirigeait vers l'accueil"
 * alors que la requête avait simplement échoué (ex. redirection cross-domaine bloquée par CORS).
 */
describe("public/sw.js — ne doit jamais masquer un échec de navigation derrière l'accueil en cache", () => {
  const source = readFileSync(join(process.cwd(), "public/sw.js"), "utf8");

  it("exclut explicitement les requêtes de navigation et RSC de l'interception", () => {
    expect(source).toContain('request.mode === "navigate"');
    expect(source).toContain('request.headers.get("rsc")');
    expect(source).toContain('request.headers.get("next-router-prefetch")');
    expect(source).toContain('url.searchParams.has("_rsc")');
  });

  it("ne retombe plus jamais sur caches.match(\"/\") en cas d'échec réseau", () => {
    expect(source).not.toContain('caches.match("/")');
  });
});
