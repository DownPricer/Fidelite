import { describe, expect, it } from "vitest";

import { resolveDisplayQrSrc } from "@/components/fife-life/merchant-card-renderer";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import {
  DEFAULT_QR_ELEMENT_ID,
  ensureDefaultQrElement,
  hasRenderReadyTemplate,
  normalizePublishedWalletTemplate,
  templateHasVisibleQr,
} from "@/lib/wallet-card-template";
import {
  UNLOCK_REVEAL_DISPLAY_MODE,
  cardFromUnlockPayload,
  isUnlockCardReadyForReveal,
} from "@/lib/wallet-unlock-card";

describe("wallet — cartes personnalisées et QR", () => {
  const baseConfig = defaultCardTemplateConfig("/media/bg.png");
  const publishedTemplate = {
    backgroundUrl: "/media/bg.png",
    config: {
      ...baseConfig,
      elements: baseConfig.elements.filter((element) => element.type !== "qr"),
    },
    loyaltyMode: "VISITS" as const,
  };

  it("utilise le mode personalized pour la révélation", () => {
    expect(UNLOCK_REVEAL_DISPLAY_MODE).toBe("personalized");
  });

  it("reconstruit la carte débloquée depuis l’événement avec gabarit publié", () => {
    const card = cardFromUnlockPayload({
      id: "evt-1",
      type: "CARD_UNLOCKED",
      createdAt: "2026-09-10T12:00:00.000Z",
      merchantId: "merchant-1",
      customerMembershipId: "membership-1",
      payload: {
        merchantName: "Brasserie Nova",
        slug: "brasserie-nova",
        logoUrl: "/logo.png",
        primaryColor: "#8557ff",
        points: 2,
        visitsRequired: 10,
        rewardLabel: "Cocktail",
        loyaltyMode: "VISITS",
        cardTemplate: publishedTemplate,
      },
    });

    expect(card.name).toBe("Brasserie Nova");
    expect(card.slug).toBe("brasserie-nova");
    expect(hasRenderReadyTemplate(card)).toBe(true);
    expect(templateHasVisibleQr(card.cardTemplate!.config)).toBe(true);
  });

  it("attend les données réelles avant de révéler une carte publiée", () => {
    const incomplete = cardFromUnlockPayload({
      id: "evt-2",
      type: "CARD_UNLOCKED",
      createdAt: "2026-09-10T12:00:00.000Z",
      merchantId: "merchant-2",
      customerMembershipId: "membership-2",
      payload: { merchantName: "Test", slug: "test" },
    });
    expect(isUnlockCardReadyForReveal(incomplete)).toBe(true);

    expect(
      isUnlockCardReadyForReveal(
        cardFromUnlockPayload({
          id: "evt-3",
          type: "CARD_UNLOCKED",
          createdAt: "2026-09-10T12:00:00.000Z",
          merchantId: null,
          customerMembershipId: null,
          payload: {},
        }),
      ),
    ).toBe(false);
  });

  it("ajoute un QR par défaut aux gabarits publiés sans élément QR", () => {
    const normalized = normalizePublishedWalletTemplate(publishedTemplate);
    expect(normalized).not.toBeNull();
    expect(templateHasVisibleQr(normalized!.config)).toBe(true);
    expect(normalized!.config.elements.some((element) => element.id === DEFAULT_QR_ELEMENT_ID)).toBe(
      true,
    );
  });

  it("conserve le recadrage et le fond publiés", () => {
    const normalized = normalizePublishedWalletTemplate({
      ...publishedTemplate,
      config: {
        ...publishedTemplate.config,
        background: {
          ...publishedTemplate.config.background,
          crop: { x: 0.1, y: 0.2, width: 0.8, height: 0.6 },
        },
      },
    });
    expect(normalized?.config.background.crop?.x).toBe(0.1);
    expect(normalized?.backgroundUrl).toBe("/media/bg.png");
  });

  it("expose le QR réel uniquement en mode personalized", () => {
    expect(resolveDisplayQrSrc("personalized", true, "data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
    expect(resolveDisplayQrSrc("publicPreview", true, "data:image/png;base64,abc")).not.toBe(
      "data:image/png;base64,abc",
    );
    expect(resolveDisplayQrSrc("adminPreview", true, "data:image/png;base64,abc")).not.toBe(
      "data:image/png;base64,abc",
    );
  });

  it("masque le QR en mode compact", () => {
    expect(resolveDisplayQrSrc("compact", true, "data:image/png;base64,abc")).toBeNull();
  });

  it("normalise un gabarit sans QR via ensureDefaultQrElement", () => {
    const next = ensureDefaultQrElement(publishedTemplate.config);
    expect(next.elements.some((element) => element.type === "qr")).toBe(true);
  });

  it("réutilise MerchantCardRenderer en mode personalized dans l’animation", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/new-card-toast.tsx"),
      "utf8",
    );
    expect(source).toContain("MerchantCardRenderer");
    expect(source).toContain("UNLOCK_REVEAL_DISPLAY_MODE");
    expect(source).toContain("showQr");
    expect(source).not.toContain("publicPreview");
  });
});
