import { createHash } from "crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  tokens: [] as Array<{
    tokenHash: string;
    role: "merchant" | "employee" | "customer";
    subjectId: string;
    expiresAt: Date;
    usedAt: Date | null;
  }>,
  cookieSets: [] as Array<{ name: string; value: string; options: Record<string, unknown> }>,
  audit: [] as Array<Record<string, unknown>>,
  createSession: vi.fn(),
  createEmployeeSession: vi.fn(),
  destroySession: vi.fn(),
  destroyEmployeeSession: vi.fn(),
}));

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function installQaMocks() {
  vi.doMock("next/headers", () => ({
    cookies: vi.fn(async () => ({
      get: vi.fn(() => undefined),
      set: vi.fn((name: string, value: string, options: Record<string, unknown>) => {
        state.cookieSets.push({ name, value, options });
      }),
    })),
  }));

  vi.doMock("@/lib/audit", () => ({
    writeAudit: vi.fn(async (input) => {
      state.audit.push(input);
    }),
  }));

  vi.doMock("@/lib/session", () => ({
    hashToken: sha256,
    createSession: state.createSession,
    destroySession: state.destroySession,
  }));

  vi.doMock("@/lib/employee-session", () => ({
    employeeSessionCookieName: () => "fifelite_employee_session",
    createEmployeeSession: state.createEmployeeSession,
    destroyEmployeeSession: state.destroyEmployeeSession,
  }));

  vi.doMock("@/lib/prisma", () => ({
    prisma: {
      qaMagicLoginToken: {
        create: vi.fn(async ({ data }) => {
          state.tokens.push({ ...data, usedAt: null });
          return data;
        }),
        updateMany: vi.fn(async ({ where, data }) => {
          const row = state.tokens.find(
            (item) =>
              item.tokenHash === where.tokenHash &&
              item.usedAt === null &&
              item.expiresAt > where.expiresAt.gt,
          );
          if (!row) return { count: 0 };
          row.usedAt = data.usedAt;
          return { count: 1 };
        }),
        findUnique: vi.fn(async ({ where }) =>
          state.tokens.find((item) => item.tokenHash === where.tokenHash) ?? null,
        ),
      },
      user: {
        findUnique: vi.fn(async ({ where }) => {
          if (where.id === "merchant-user") {
            return {
              id: "merchant-user",
              isActive: true,
              merchantMemberships: [
                { id: "merchant-membership", merchantId: "merchant-1", merchant: { isActive: true } },
              ],
            };
          }
          if (where.id === "customer-user") {
            return {
              id: "customer-user",
              isActive: true,
              platformRole: "CUSTOMER",
              customerMemberships: [{ id: "customer-membership" }],
            };
          }
          return null;
        }),
      },
      merchantMembership: {
        findMany: vi.fn(async ({ where }) => {
          const ids = where.OR.map((item: Record<string, string>) => item.id ?? item.userId);
          if (!ids.includes("employee-membership") && !ids.includes("employee-user")) return [];
          return [
            {
              id: "employee-membership",
              userId: "employee-user",
              merchantId: "merchant-1",
              role: "EMPLOYEE",
              isActive: true,
              invitationStatus: "ACCEPTED",
              user: { id: "employee-user", isActive: true },
              merchant: { id: "merchant-1", isActive: true },
            },
          ];
        }),
      },
    },
  }));
}

async function loadQaLogin() {
  vi.resetModules();
  vi.stubEnv("QA_MAGIC_LOGIN_ENABLED", "true");
  vi.stubEnv("QA_MERCHANT_USER_ID", "merchant-user");
  vi.stubEnv("QA_EMPLOYEE_ID", "employee-membership");
  vi.stubEnv("QA_CUSTOMER_USER_ID", "customer-user");
  vi.stubEnv("QA_MAGIC_LOGIN_ORIGIN", "https://fidelite.sitereadyshd.fr");
  installQaMocks();
  return import("@/lib/qa-login");
}

beforeEach(() => {
  state.tokens = [];
  state.cookieSets = [];
  state.audit = [];
  state.createSession.mockReset();
  state.createEmployeeSession.mockReset();
  state.destroySession.mockReset();
  state.destroyEmployeeSession.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("QA magic login", () => {
  it("retourne 404 quand la fonctionnalité est désactivée", async () => {
    vi.resetModules();
    vi.stubEnv("QA_MAGIC_LOGIN_ENABLED", "false");
    installQaMocks();
    const route = await import("@/app/api/qa-login/exchange/route");
    const response = await route.POST(
      new Request("http://localhost:3000/api/qa-login/exchange", {
        method: "POST",
        headers: { origin: "http://localhost:3000", "content-type": "application/json" },
        body: JSON.stringify({ token: "x" }),
      }),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("refuse un rôle inconnu", async () => {
    const qa = await loadQaLogin();
    expect(qa.parseQaLoginRole("admin")).toBeNull();
  });

  it("utilise 5 minutes par défaut", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-18T12:00:00.000Z"));
    try {
      const qa = await loadQaLogin();
      const created = await qa.createQaMagicLoginToken("customer");
      expect(created.expiresAt.getTime() - Date.now()).toBe(5 * 60 * 1000);
      expect(state.tokens[0].expiresAt.getTime() - Date.now()).toBe(5 * 60 * 1000);
    } finally {
      vi.useRealTimers();
    }
  });

  it("accepte une durée personnalisée de 90 minutes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-18T12:00:00.000Z"));
    try {
      const qa = await loadQaLogin();
      const created = await qa.createQaMagicLoginToken("customer", {}, { ttlMinutes: 90 });
      expect(created.expiresAt.getTime() - Date.now()).toBe(90 * 60 * 1000);
      expect(qa.parseQaLoginTtlMinutes("90")).toBe(90);
    } finally {
      vi.useRealTimers();
    }
  });

  it("refuse les TTL invalides", async () => {
    const qa = await loadQaLogin();
    expect(() => qa.parseQaLoginTtlMinutes("0")).toThrow(/minimum/i);
    expect(() => qa.parseQaLoginTtlMinutes("-1")).toThrow(/entier positif/i);
    expect(() => qa.parseQaLoginTtlMinutes("texte")).toThrow(/entier positif/i);
    expect(() => qa.parseQaLoginTtlMinutes("121")).toThrow(/maximum/i);
  });

  it("refuse la création quand la fonctionnalité est désactivée", async () => {
    vi.resetModules();
    vi.stubEnv("QA_MAGIC_LOGIN_ENABLED", "false");
    vi.stubEnv("QA_CUSTOMER_USER_ID", "customer-user");
    installQaMocks();
    const qa = await import("@/lib/qa-login");
    await expect(qa.createQaMagicLoginToken("customer")).rejects.toThrow(/disabled/i);
  });

  it("refuse un compte hors liste", async () => {
    const qa = await loadQaLogin();
    await expect(qa.isQaSubjectAllowed("customer", "someone-else")).resolves.toBe(false);
  });

  it("échange un token valide contre la bonne session et la bonne redirection", async () => {
    const qa = await loadQaLogin();
    const created = await qa.createQaMagicLoginToken("merchant");
    const result = await qa.exchangeQaMagicLoginToken(created.token, { ip: "127.0.0.1" });

    expect(result).toEqual({ ok: true, role: "merchant", redirectTo: "/app" });
    expect(state.createSession).toHaveBeenCalledWith(
      "merchant-user",
      expect.objectContaining({ ip: "127.0.0.1", expiresAt: created.expiresAt, isQaMagicLogin: true }),
    );
    expect(state.createEmployeeSession).not.toHaveBeenCalled();
  });

  it("refuse la réutilisation", async () => {
    const qa = await loadQaLogin();
    const created = await qa.createQaMagicLoginToken("customer");
    await qa.exchangeQaMagicLoginToken(created.token);
    const second = await qa.exchangeQaMagicLoginToken(created.token);
    expect(second.ok).toBe(false);
    expect(second.status).toBe(401);
  });

  it("crée deux liens client successifs avec deux jetons distincts", async () => {
    const qa = await loadQaLogin();
    const first = await qa.createQaMagicLoginToken("customer");
    const second = await qa.createQaMagicLoginToken("customer");

    expect(first.token).not.toBe(second.token);
    expect(first.url).not.toBe(second.url);
    expect(state.tokens).toHaveLength(2);
    expect(state.tokens[0].tokenHash).not.toBe(state.tokens[1].tokenHash);
  });

  it("consommer un lien client ne consomme pas l'autre", async () => {
    const qa = await loadQaLogin();
    const first = await qa.createQaMagicLoginToken("customer");
    const second = await qa.createQaMagicLoginToken("customer");

    const firstResult = await qa.exchangeQaMagicLoginToken(first.token);
    const secondResult = await qa.exchangeQaMagicLoginToken(second.token);

    expect(firstResult).toEqual({ ok: true, role: "customer", redirectTo: "/carte" });
    expect(secondResult).toEqual({ ok: true, role: "customer", redirectTo: "/carte" });
    expect(state.createSession).toHaveBeenCalledTimes(2);
  });

  it("refuse un token expiré", async () => {
    const qa = await loadQaLogin();
    state.tokens.push({
      tokenHash: sha256("expired-token"),
      role: "merchant",
      subjectId: "merchant-user",
      expiresAt: new Date(Date.now() - 1000),
      usedAt: null,
    });
    const result = await qa.exchangeQaMagicLoginToken("expired-token");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });

  it("refuse un token falsifié", async () => {
    const qa = await loadQaLogin();
    const result = await qa.exchangeQaMagicLoginToken("fake-token");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });

  it("ne transforme pas un token client en session employé", async () => {
    const qa = await loadQaLogin();
    const created = await qa.createQaMagicLoginToken("customer");
    const result = await qa.exchangeQaMagicLoginToken(created.token);

    expect(result).toEqual({ ok: true, role: "customer", redirectTo: "/carte" });
    expect(state.createSession).toHaveBeenCalledWith(
      "customer-user",
      expect.objectContaining({ expiresAt: created.expiresAt, isQaMagicLogin: true }),
    );
    expect(state.createEmployeeSession).not.toHaveBeenCalled();
  });

  it("efface les anciens cookies de session et de démo", async () => {
    const qa = await loadQaLogin();
    const created = await qa.createQaMagicLoginToken("employee");
    await qa.exchangeQaMagicLoginToken(created.token);

    expect(state.destroySession).toHaveBeenCalled();
    expect(state.destroyEmployeeSession).toHaveBeenCalled();
    for (const name of [
      "fifelite_session",
      "fifelite_employee_session",
      "fife_client_demo",
      "fife_merchant_demo",
      "fife_employee_demo",
    ]) {
      expect(state.cookieSets.some((cookie) => cookie.name === name && cookie.options.maxAge === 0)).toBe(true);
    }
    expect(state.createEmployeeSession).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "employee-user",
        merchantMembershipId: "employee-membership",
        expiresAt: created.expiresAt,
        isQaMagicLogin: true,
      }),
      {},
    );
  });

  it("ne stocke ni ne journalise le token en clair", async () => {
    const qa = await loadQaLogin();
    const created = await qa.createQaMagicLoginToken("customer");

    expect(state.tokens[0].tokenHash).toBe(sha256(created.token));
    expect(state.tokens[0].tokenHash).not.toBe(created.token);
    expect(JSON.stringify(state.tokens)).not.toContain(created.token);
    expect(JSON.stringify(state.audit)).not.toContain(created.token);
  });
});
