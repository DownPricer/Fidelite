import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

async function loadMiddleware() {
  vi.resetModules();
  const mod = await import("../src/middleware");
  return mod.middleware;
}

function makeRequest(host: string, path: string, extraHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = { host, ...extraHeaders };
  return new NextRequest(`http://${host}${path}`, { headers });
}

/**
 * Un prefetch RSC pur (survol de <Link>, pas un clic) ne doit jamais être redirigé
 * cross-origine : le navigateur applique CORS à ce fetch() d'arrière-plan et échoue faute
 * d'en-tête Access-Control-Allow-Origin. Seul l'en-tête `Next-Router-Prefetch` identifie
 * un prefetch pur — l'en-tête `RSC` et le paramètre `_rsc` sont aussi présents sur une vraie
 * navigation cliquée, qui doit, elle, continuer à être redirigée normalement.
 */
describe("middleware — prefetch RSC pur jamais redirigé cross-domaine", () => {
  it("redirige une vraie navigation vers /app sur l'ancien domaine client (cross-space)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app"));
    expect([307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("app.fideto.fr");
  });

  it("redirige toujours une requête RSC portant seulement l'en-tête RSC (vraie navigation cliquée, pas un prefetch)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app", { rsc: "1" }));
    expect([307, 308]).toContain(res.status);
  });

  it("redirige toujours une requête portant seulement le paramètre _rsc (présent sur toute requête RSC, pas seulement un prefetch)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fideto.fr", "/app?_rsc=abc123"));
    expect(res.status).toBe(307);
  });

  it("ne redirige pas un vrai prefetch (en-tête Next-Router-Prefetch)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app", { "next-router-prefetch": "1" }));
    expect(res.status).not.toBe(308);
    expect(res.status).not.toBe(307);
  });

  it("ne redirige pas un vrai prefetch même combiné à l'en-tête RSC et au paramètre _rsc (cas réel Next.js)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(
      makeRequest("fidelite.sitereadyshd.fr", "/app?_rsc=abc123", { rsc: "1", "next-router-prefetch": "1" }),
    );
    expect(res.status).not.toBe(308);
    expect(res.status).not.toBe(307);
  });

  it("redirige toujours une vraie navigation cross-space sans aucun marqueur RSC", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fideto.fr", "/app"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("app.fideto.fr");
  });
});
