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
 * Un fetch() de prefetch RSC (survol de <Link>) vers un chemin d'un autre hôte/espace ne doit
 * jamais être redirigé cross-origine : le navigateur applique alors CORS à cette requête en
 * arrière-plan et échoue faute d'en-tête Access-Control-Allow-Origin sur le domaine cible, même
 * si la vraie navigation (clic) fonctionne très bien. Voir isNextPrefetchRequest dans middleware.ts.
 */
describe("middleware — prefetch RSC jamais redirigé cross-domaine", () => {
  it("redirige une vraie navigation vers /app sur l'ancien domaine client (cross-space, reproduit le bug signalé)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app"));
    expect([307, 308]).toContain(res.status);
    expect(res.headers.get("location")).toContain("app.fideto.fr");
  });

  it("ne redirige pas un prefetch RSC (en-tête RSC) vers un autre domaine", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app", { rsc: "1" }));
    expect(res.status).not.toBe(308);
    expect(res.status).not.toBe(307);
  });

  it("ne redirige pas un prefetch RSC (en-tête Next-Router-Prefetch) vers un autre domaine", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fidelite.sitereadyshd.fr", "/app", { "next-router-prefetch": "1" }));
    expect(res.status).not.toBe(308);
    expect(res.status).not.toBe(307);
  });

  it("ne redirige pas un prefetch RSC (paramètre _rsc) vers un autre espace", async () => {
    const middleware = await loadMiddleware();
    // fideto.fr (customer host) demandant /app : redirection cross-space normale (307) sauf prefetch.
    const res = middleware(makeRequest("fideto.fr", "/app?_rsc=abc123"));
    expect(res.status).not.toBe(307);
  });

  it("redirige toujours une vraie navigation cross-space (sans marqueur de prefetch)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("fideto.fr", "/app"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("app.fideto.fr");
  });
});
