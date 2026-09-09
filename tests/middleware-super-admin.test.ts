import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SUPER_ADMIN_ENTRY_COOKIE } from "../src/lib/super-admin-entry";

async function loadMiddleware(superAdminPath = "test-secret-admin") {
  vi.resetModules();
  process.env.SUPER_ADMIN_PATH = superAdminPath;
  const mod = await import("../src/middleware");
  return mod.middleware;
}

function makeRequest(path: string, cookie?: string) {
  const headers: Record<string, string> = { host: "localhost:3000" };
  if (cookie) headers.cookie = cookie;
  return new NextRequest(`http://localhost:3000${path}`, { headers });
}

describe("middleware — chemin secret super-admin", () => {
  it("/super-admin direct retourne 404 sans cookie d'entrée", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/super-admin"));
    expect(res.status).toBe(404);
  });

  it("/super-admin/connexion retourne 404 sans cookie d'entrée", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/super-admin/connexion"));
    expect(res.status).toBe(404);
  });

  it("le chemin secret réécrit vers /super-admin et pose le cookie d'entrée", async () => {
    const middleware = await loadMiddleware("my-secret-path");
    const res = middleware(makeRequest("/my-secret-path/connexion"));
    expect(res.status).not.toBe(404);
    expect(res.headers.get("x-middleware-rewrite") ?? res.headers.get("location")).toBeTruthy();
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain(SUPER_ADMIN_ENTRY_COOKIE);
  });

  it("/super-admin accessible avec cookie d'entrée", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/super-admin", `${SUPER_ADMIN_ENTRY_COOKIE}=1`));
    expect(res.status).toBe(200);
  });

  it("/admin redirige vers le chemin secret, pas vers /super-admin", async () => {
    const middleware = await loadMiddleware("my-secret-path");
    const res = middleware(makeRequest("/admin"));
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("/my-secret-path");
    expect(location).not.toContain("/super-admin");
  });

  it("les API /api/super-admin passent le middleware sans cookie d'entrée", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/api/super-admin/auth/me"));
    expect(res.status).toBe(200);
  });

  it("/api/admin retourne 410 via la route (middleware laisse passer)", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/api/admin/merchants"));
    expect(res.status).toBe(200);
  });
});
