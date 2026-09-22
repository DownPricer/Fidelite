import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const requireMutatingRequest = vi.fn();
const requireUser = vi.fn();
const customerPreferencesFindUnique = vi.fn();
const customerPreferencesCreate = vi.fn();
const customerPreferencesUpdate = vi.fn();
const consentEventCreateMany = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest, requireUser }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    customerPreferences: {
      findUnique: (...args: unknown[]) => customerPreferencesFindUnique(...args),
      create: (...args: unknown[]) => customerPreferencesCreate(...args),
      update: (...args: unknown[]) => customerPreferencesUpdate(...args),
    },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        customerPreferences: { update: (...args: unknown[]) => customerPreferencesUpdate(...args) },
        consentEvent: { createMany: (...args: unknown[]) => consentEventCreateMany(...args) },
      }),
  },
}));

function makePatch(body: unknown) {
  return new NextRequest("http://localhost:3000/api/customer/preferences", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

const basePrefs = {
  notifyPointsMovements: true,
  notifyNewBenefit: true,
  notifyBenefitExpiring: true,
  notifyNewCard: true,
  notifyMerchantOffers: false,
  notifyFifeLifeNews: false,
  notifySecurity: true,
  notifyChannelPush: true,
  notifyChannelEmail: true,
  notifyChannelSms: false,
  adsMerchantPush: false,
  adsMerchantEmail: false,
  adsNetworkPush: false,
  adsNetworkEmail: false,
  marketingZoneCity: null,
  marketingZonePostalCode: null,
  consentPersonalizedOffers: false,
  consentMarketing: false,
  consentAnalytics: false,
  consentVersion: null,
  consentUpdatedAt: null,
  language: "fr",
};

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  requireUser.mockResolvedValue({ error: null, user: { id: "user_1" } });
  customerPreferencesFindUnique.mockResolvedValue(basePrefs);
  customerPreferencesUpdate.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
    ...basePrefs,
    ...data,
  }));
});

describe("PATCH /api/customer/preferences — consentement (Partie 6/19)", () => {
  it("aucune case de prospection n'est précochée par défaut", async () => {
    const { GET } = await import("../src/app/api/customer/preferences/route");
    const response = await GET(makePatch({}) as unknown as Request);
    const payload = (await response.json()) as { preferences: Record<string, unknown> };
    for (const field of [
      "notifyMerchantOffers",
      "notifyFifeLifeNews",
      "adsMerchantPush",
      "adsMerchantEmail",
      "adsNetworkPush",
      "adsNetworkEmail",
      "consentMarketing",
      "consentPersonalizedOffers",
    ]) {
      expect(payload.preferences[field]).toBe(false);
    }
  });

  it("journalise un événement de consentement avec date/source/version quand une case change", async () => {
    const { PATCH } = await import("../src/app/api/customer/preferences/route");
    await PATCH(makePatch({ adsMerchantEmail: true }));

    expect(consentEventCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          userId: "user_1",
          field: "adsMerchantEmail",
          value: true,
          source: "customer_preferences_page",
          version: expect.any(String),
        }),
      ],
    });
    expect(customerPreferencesUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ adsMerchantEmail: true, consentUpdatedAt: expect.any(Date) }),
      }),
    );
  });

  it("le retrait (false) est journalisé exactement comme l'octroi (true) — retrait immédiat", async () => {
    const { PATCH } = await import("../src/app/api/customer/preferences/route");
    await PATCH(makePatch({ adsNetworkPush: false }));

    expect(consentEventCreateMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ field: "adsNetworkPush", value: false })],
    });
  });

  it("ne journalise rien quand aucun champ de consentement n'est modifié (ex. langue seule)", async () => {
    const { PATCH } = await import("../src/app/api/customer/preferences/route");
    await PATCH(makePatch({ language: "en" }));

    expect(consentEventCreateMany).not.toHaveBeenCalled();
  });

  it("sépare bien membre (adsMerchant*) et réseau (adsNetwork*) sans se contaminer l'un l'autre", async () => {
    const { PATCH } = await import("../src/app/api/customer/preferences/route");
    await PATCH(makePatch({ adsMerchantPush: true }));

    const data = customerPreferencesUpdate.mock.calls[0]?.[0]?.data as Record<string, unknown>;
    expect(data.adsMerchantPush).toBe(true);
    expect(data.adsNetworkPush).toBeUndefined();
  });
});
