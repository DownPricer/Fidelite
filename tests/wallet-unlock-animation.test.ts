import { describe, expect, it } from "vitest";

import {
  canEnqueueUnlockEvent,
  shouldDeferUnlockPlayback,
  shouldSendSseEvent,
} from "@/lib/wallet-unlock-client";
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

describe("wallet unlock — client", () => {
  const event = { id: "evt-42", acknowledgedAt: null as string | null };

  it("autorise l’animation pour un événement serveur non acquitté même si la carte SSR existe", () => {
    expect(canEnqueueUnlockEvent(event, new Set())).toBe(true);
  });

  it("ne met pas deux fois le même événement en file", () => {
    const queued = new Set(["evt-42"]);
    expect(canEnqueueUnlockEvent(event, queued)).toBe(false);
  });

  it("reporte le déblocage quand l’onglet est caché", () => {
    expect(shouldDeferUnlockPlayback(false)).toBe(true);
    expect(shouldDeferUnlockPlayback(true)).toBe(false);
  });

  it("n’envoie qu’une fois un événement par connexion SSE", () => {
    const sent = new Set<string>();
    expect(shouldSendSseEvent("evt-1", sent)).toBe(true);
    sent.add("evt-1");
    expect(shouldSendSseEvent("evt-1", sent)).toBe(false);
  });

  it("peut renvoyer un événement non acquitté sur une nouvelle connexion SSE", () => {
    const firstConnection = new Set<string>(["evt-1"]);
    const secondConnection = new Set<string>();
    expect(shouldSendSseEvent("evt-1", firstConnection)).toBe(false);
    expect(shouldSendSseEvent("evt-1", secondConnection)).toBe(true);
  });
});

describe("wallet unlock — QR preload", () => {
  it("expose preloadWalletQr pour le chargement immédiat", async () => {
    const { preloadWalletQr, getCachedQr, resetQrCache } = await import(
      "@/components/fife-life/qr-cache"
    );
    resetQrCache();
    expect(getCachedQr("fife-life")).toBeNull();
    preloadWalletQr("fife-life");
    expect(typeof preloadWalletQr).toBe("function");
  });

  it("acquitte uniquement après montage overlay côté toast", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/new-card-toast.tsx"),
      "utf8",
    );
    expect(source).toContain("onDisplayedRef.current?.(eventId)");
    expect(source).toContain("requestAnimationFrame");
  });
});
