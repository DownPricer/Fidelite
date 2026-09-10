import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { resolveDisplayQrSrc } from "@/components/fife-life/merchant-card-renderer";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import {
  CUSTOMER_QR_DATA_KEY,
  isQrTemplateElement,
  listQrTemplateElements,
  normalizeQrTemplateElement,
  qrElementDimensionsValid,
  resolveMerchantCardQrSrc,
} from "@/lib/merchant-card-qr";
import {
  DEFAULT_QR_ELEMENT_ID,
  ensureDefaultQrElement,
  normalizePublishedWalletTemplate,
  templateHasVisibleQr,
} from "@/lib/wallet-card-template";

const REAL_QR = "data:image/png;base64,merchant-test-qr";

describe("merchant card — affichage QR client", () => {
  const baseConfig = defaultCardTemplateConfig("/media/bg.png");

  it("traverse la propriété canonique qrSrc jusqu’au renderer", () => {
    expect(
      resolveMerchantCardQrSrc("personalized", true, REAL_QR, null, null),
    ).toBe(REAL_QR);
    expect(
      resolveMerchantCardQrSrc("personalized", true, null, REAL_QR, null),
    ).toBe(REAL_QR);
    expect(resolveDisplayQrSrc("personalized", true, REAL_QR)).toBe(REAL_QR);
  });

  it("reconnaît customer.qrCode hérité comme élément QR", () => {
    const legacy = {
      ...baseConfig.elements[0],
      id: "legacy-qr",
      type: "staticText" as const,
      dataKey: CUSTOMER_QR_DATA_KEY,
      hidden: false,
    };
    expect(isQrTemplateElement(legacy)).toBe(true);
    expect(normalizeQrTemplateElement(legacy).type).toBe("qr");
  });

  it("injecte un QR de secours déterministe sans doublon", () => {
    const withoutQr = {
      ...baseConfig,
      elements: baseConfig.elements.filter((element) => element.type !== "qr"),
    };
    const next = ensureDefaultQrElement(withoutQr);
    const qrElements = listQrTemplateElements(next);
    expect(qrElements).toHaveLength(1);
    expect(qrElements[0]?.id).toBe(DEFAULT_QR_ELEMENT_ID);
    expect(qrElements[0]?.dataKey).toBe(CUSTOMER_QR_DATA_KEY);
  });

  it("conserve un seul QR quand le gabarit en contient déjà un", () => {
    const withQr = ensureDefaultQrElement(baseConfig);
    expect(listQrTemplateElements(withQr)).toHaveLength(1);
    expect(templateHasVisibleQr(withQr)).toBe(true);
  });

  it("valide des dimensions QR non nulles et carrées", () => {
    const qr = listQrTemplateElements(baseConfig)[0]!;
    const dims = qrElementDimensionsValid(qr);
    expect(dims.nonZero).toBe(true);
    expect(dims.square).toBe(true);
    expect(dims.widthPct).toBeGreaterThan(0);
    expect(dims.heightPct).toBeGreaterThan(0);
  });

  it("place le fond sous les éléments dynamiques dans le renderer", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/merchant-card-renderer.tsx"),
      "utf8",
    );
    expect(source).toContain("merchant-card-renderer__background");
    expect(source).toContain("merchant-card-renderer__elements");
    expect(source).toContain("merchant-card-qr-shell");
  });

  it("propage qrSrc dans le carrousel, l’agrandissement et la fiche commerce", () => {
    const deck = readFileSync(resolve(process.cwd(), "src/components/fife-life/card-deck.tsx"), "utf8");
    const enlarged = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/card-enlarged-view.tsx"),
      "utf8",
    );
    const detail = readFileSync(
      resolve(process.cwd(), "src/components/fife-life/merchant-detail.tsx"),
      "utf8",
    );
    const toast = readFileSync(resolve(process.cwd(), "src/components/fife-life/new-card-toast.tsx"), "utf8");

    expect(deck).toContain("qrSrc={personalizedQr}");
    expect(enlarged).toContain("qrSrc={personalizedQr ?? qr}");
    expect(detail).toContain("qrSrc={personalizedQr}");
    expect(toast).toContain("qrSrc={qrSrc}");
  });

  it("n’expose jamais le QR réel en mode public", () => {
    expect(resolveDisplayQrSrc("publicPreview", true, REAL_QR)).not.toBe(REAL_QR);
    expect(resolveDisplayQrSrc("adminPreview", true, REAL_QR)).not.toBe(REAL_QR);
    expect(resolveMerchantCardQrSrc("publicPreview", true, REAL_QR, REAL_QR, REAL_QR)).toBeNull();
  });

  it("normalise un gabarit publié sans QR pour le wallet", () => {
    const normalized = normalizePublishedWalletTemplate({
      backgroundUrl: "/media/bg.png",
      loyaltyMode: "VISITS",
      config: {
        ...baseConfig,
        elements: baseConfig.elements.filter((element) => element.type !== "qr"),
      },
    });
    expect(normalized?.config.elements.some((element) => element.id === DEFAULT_QR_ELEMENT_ID)).toBe(
      true,
    );
  });
});
