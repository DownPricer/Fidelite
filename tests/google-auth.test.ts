import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const state = vi.hoisted(() => ({
  users: [] as Array<{ id: string; email: string; platformRole: string; isActive: boolean }>,
  accounts: [] as Array<{ userId: string; provider: string; providerAccountId: string; email: string }>,
  sessions: [] as string[],
  audits: [] as Array<Record<string, unknown>>,
  merchants: [{ id: "merchant-1", slug: "cafe-demo", isActive: true, program: { id: "program-1" } }],
}));

vi.mock("@/lib/session", () => ({
  createSession: vi.fn(async (userId: string) => {
    state.sessions.push(userId);
  }),
}));

vi.mock("@/lib/audit", () => ({
  writeAudit: vi.fn(async (input: Record<string, unknown>) => {
    state.audits.push(input);
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    oAuthAccount: {
      findUnique: vi.fn(async ({ where }) => {
        const account =
          state.accounts.find(
            (item) =>
              item.provider === where.provider_providerAccountId.provider &&
              item.providerAccountId === where.provider_providerAccountId.providerAccountId,
          ) ?? null;
        if (!account) return null;
        return { ...account, user: state.users.find((user) => user.id === account.userId) };
      }),
    },
    user: {
      findUnique: vi.fn(async ({ where }) => state.users.find((user) => user.email === where.email) ?? null),
    },
    merchant: {
      findUnique: vi.fn(async ({ where }) => state.merchants.find((merchant) => merchant.slug === where.slug) ?? null),
    },
    $transaction: vi.fn(async (callback) => {
      const tx = {
        user: {
          create: vi.fn(async ({ data }) => {
            if (state.users.some((user) => user.email === data.email)) {
              const error = new Error("Unique constraint failed");
              Object.assign(error, { code: "P2002", clientVersion: "test" });
              throw error;
            }
            const created = {
              id: `user-${state.users.length + 1}`,
              email: data.email,
              platformRole: data.platformRole,
              isActive: true,
            };
            state.users.push(created);
            return created;
          }),
        },
        oAuthAccount: {
          create: vi.fn(async ({ data }) => {
            if (
              state.accounts.some(
                (item) => item.provider === data.provider && item.providerAccountId === data.providerAccountId,
              )
            ) {
              const error = new Error("Unique constraint failed");
              Object.assign(error, { code: "P2002", clientVersion: "test" });
              throw error;
            }
            state.accounts.push(data);
            return data;
          }),
        },
      };
      return callback(tx);
    }),
  },
}));

const baseIntent = {
  flow: "register" as const,
  slug: "cafe-demo",
  returnTo: "/carte/cafe-demo",
  privacyConsent: true,
};

const profile = {
  sub: "google-sub-1",
  email: "lea@example.com",
  emailVerified: true,
  givenName: "Léa",
  familyName: "Martin",
  picture: null,
};

beforeEach(() => {
  state.users = [];
  state.accounts = [];
  state.sessions = [];
  state.audits = [];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Google authentication", () => {
  it("crée un nouveau compte client minimal avec un e-mail Google vérifié", async () => {
    const { signInWithGoogleProfile } = await import("@/lib/google-auth");

    const result = await signInWithGoogleProfile(profile, baseIntent);

    expect(result).toMatchObject({ ok: true, redirectTo: "/carte/cafe-demo", isNewUser: true });
    expect(state.users).toHaveLength(1);
    expect(state.users[0].platformRole).toBe("CUSTOMER");
    expect(state.accounts).toHaveLength(1);
    expect(state.sessions).toEqual(["user-1"]);
  });

  it("réutilise le même compte quand le sub Google est déjà associé", async () => {
    state.users.push({ id: "existing-user", email: "lea@example.com", platformRole: "CUSTOMER", isActive: true });
    state.accounts.push({
      userId: "existing-user",
      provider: "google",
      providerAccountId: "google-sub-1",
      email: "lea@example.com",
    });
    const { signInWithGoogleProfile } = await import("@/lib/google-auth");

    const result = await signInWithGoogleProfile(profile, { ...baseIntent, flow: "login" });

    expect(result).toMatchObject({ ok: true, userId: "existing-user", isNewUser: false });
    expect(state.users).toHaveLength(1);
    expect(state.sessions).toEqual(["existing-user"]);
  });

  it("refuse un e-mail existant avec une autre méthode sans créer de doublon", async () => {
    state.users.push({ id: "password-user", email: "lea@example.com", platformRole: "CUSTOMER", isActive: true });
    const { signInWithGoogleProfile } = await import("@/lib/google-auth");

    const result = await signInWithGoogleProfile(profile, baseIntent);

    expect(result).toMatchObject({ ok: false, reason: "compte_existant" });
    expect(state.users).toHaveLength(1);
    expect(state.accounts).toHaveLength(0);
    expect(state.sessions).toHaveLength(0);
  });

  it("refuse un e-mail Google non vérifié", async () => {
    const { signInWithGoogleProfile } = await import("@/lib/google-auth");

    const result = await signInWithGoogleProfile({ ...profile, emailVerified: false }, baseIntent);

    expect(result).toMatchObject({ ok: false, reason: "email_non_verifie" });
    expect(state.users).toHaveLength(0);
  });

  it("ignore tout rôle public falsifié", async () => {
    const { signInWithGoogleProfile } = await import("@/lib/google-auth");

    await signInWithGoogleProfile(profile, { ...baseIntent, returnTo: "/carte/cafe-demo?role=SUPER_ADMIN" });

    expect(state.users[0].platformRole).toBe("CUSTOMER");
  });
});

describe("OAuth return URLs", () => {
  it("refuse les redirections externes", async () => {
    const { sanitizeInternalReturnTo } = await import("@/lib/oauth-redirect");

    expect(sanitizeInternalReturnTo("https://evil.example/app", "/carte")).toBe("/carte");
    expect(sanitizeInternalReturnTo("//evil.example/app", "/carte")).toBe("/carte");
  });

  it("conserve une redirection interne autorisée", async () => {
    const { sanitizeInternalReturnTo } = await import("@/lib/oauth-redirect");

    expect(sanitizeInternalReturnTo("/carte/cafe-demo", "/carte")).toBe("/carte/cafe-demo");
  });
});
