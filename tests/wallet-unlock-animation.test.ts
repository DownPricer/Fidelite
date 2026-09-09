import { describe, expect, it } from "vitest";

import {
  cardFromUnlockEvent,
  isUnlockEventType,
  serializeWalletEvent,
  shouldPlayUnlockAnimation,
} from "@/lib/wallet-unlock";

describe("wallet unlock — événements persistants", () => {
  const baseEvent = {
    id: "evt-1",
    type: "CARD_UNLOCKED",
    createdAt: "2026-09-09T12:00:00.000Z",
    merchantId: "merchant-1",
    customerMembershipId: "membership-1",
    payload: {
      merchantName: "Brasserie Nova",
      slug: "brasserie-nova",
      logoUrl: null,
      primaryColor: "#8557ff",
      points: 0,
      visitsRequired: 10,
      rewardLabel: "Cocktail offert",
    },
    acknowledgedAt: null as string | null,
  };

  it("identifie les types de déblocage", () => {
    expect(isUnlockEventType("CARD_UNLOCKED")).toBe(true);
    expect(isUnlockEventType("CARD_CREATED")).toBe(true);
    expect(isUnlockEventType("MERCHANT_POINTS_UPDATED")).toBe(false);
  });

  it("joue l’animation pour un événement non acquitté", () => {
    const processed = new Set<string>();
    expect(shouldPlayUnlockAnimation(baseEvent, processed)).toBe(true);
    processed.add("evt-1");
    expect(shouldPlayUnlockAnimation(baseEvent, processed)).toBe(false);
  });

  it("ne rejoue pas un événement déjà acquitté côté serveur", () => {
    expect(
      shouldPlayUnlockAnimation(
        { ...baseEvent, acknowledgedAt: "2026-09-09T12:01:00.000Z" },
        new Set(),
      ),
    ).toBe(false);
  });

  it("joue l’animation même si la carte est déjà dans le wallet SSR", () => {
    expect(shouldPlayUnlockAnimation(baseEvent, new Set())).toBe(true);
    const card = cardFromUnlockEvent(baseEvent);
    expect(card.name).toBe("Brasserie Nova");
    expect(card.id).toBe("membership-1");
  });

  it("sérialise acknowledgedAt pour le client", () => {
    const serialized = serializeWalletEvent({
      id: "evt-2",
      type: "CARD_UNLOCKED",
      createdAt: new Date("2026-09-09T12:00:00.000Z"),
      merchantId: "merchant-1",
      customerMembershipId: "membership-2",
      payload: { merchantName: "Test" },
      acknowledgedAt: null,
    });
    expect(serialized.acknowledgedAt).toBeNull();
  });

  it("accepte CARD_CREATED legacy comme déblocage", () => {
    expect(isUnlockEventType("CARD_CREATED")).toBe(true);
    expect(
      shouldPlayUnlockAnimation({ ...baseEvent, type: "CARD_CREATED" }, new Set()),
    ).toBe(true);
  });
});
