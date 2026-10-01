import { beforeEach, describe, expect, it, vi } from "vitest";

const getSuperAdminSessionUser = vi.fn();
const adRequestFindUnique = vi.fn();
const redirect = vi.fn((url: string) => {
  throw new Error(`REDIRECT:${url}`);
});
const notFound = vi.fn(() => {
  throw new Error("NOT_FOUND");
});

vi.mock("next/navigation", () => ({ redirect, notFound }));
vi.mock("@/lib/super-admin-session", () => ({ getSuperAdminSessionUser }));
vi.mock("@/lib/prisma", () => ({ prisma: { adRequest: { findUnique: adRequestFindUnique } } }));
vi.mock("./ad-detail", () => ({ AdDetailPage: () => null }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("page /super-admin/campagnes/ads/[id] — gardes serveur", () => {
  it("redirige vers /super-admin/connexion si non authentifié (jamais vers /app)", async () => {
    getSuperAdminSessionUser.mockResolvedValueOnce(null);
    const { default: Page } = await import("../src/app/super-admin/campagnes/ads/[id]/page");
    await expect(Page({ params: Promise.resolve({ id: "ad_1" }) })).rejects.toThrow("REDIRECT:/super-admin/connexion");
    expect(adRequestFindUnique).not.toHaveBeenCalled();
  });

  it("renvoie une vraie page 404 si la mise en avant n'existe pas", async () => {
    getSuperAdminSessionUser.mockResolvedValueOnce({ firstName: "Admin" });
    adRequestFindUnique.mockResolvedValueOnce(null);
    const { default: Page } = await import("../src/app/super-admin/campagnes/ads/[id]/page");
    await expect(Page({ params: Promise.resolve({ id: "missing" }) })).rejects.toThrow("NOT_FOUND");
  });

  it("rend la fiche quand authentifié et que la mise en avant existe", async () => {
    getSuperAdminSessionUser.mockResolvedValueOnce({ firstName: "Admin" });
    adRequestFindUnique.mockResolvedValueOnce({ id: "ad_1" });
    const { default: Page } = await import("../src/app/super-admin/campagnes/ads/[id]/page");
    const result = await Page({ params: Promise.resolve({ id: "ad_1" }) });
    expect(result).toBeTruthy();
  });
});
