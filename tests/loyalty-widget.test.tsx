import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { defaultCardTemplateConfig } from "@/lib/card-template-schema";
import { validateCardTemplateForPublishDetailed } from "@/lib/card-template-validation";
import { sanitizeLoyaltyWidgetsForSlot, validateLoyaltyWidgetsForSlot } from "@/lib/loyalty-widget";
import {
  allowedElementTypesForSlot,
  applyStyleVariantPreservingColors,
  convertConfigForTargetSlot,
  createDefaultLoyaltyWidgetElement,
  defaultLoyaltyWidgetConfig,
  migrateLegacyLoyaltyElements,
  POINTS_STYLE_VARIANTS,
  styleVariantsForMode,
  TIERS_STYLE_VARIANTS,
  VISITS_STYLE_VARIANTS,
} from "@/lib/loyalty-widget";
import { LoyaltyWidgetView } from "@/components/fife-life/loyalty-widget-view";
import { MerchantCardRenderer } from "@/components/fife-life/merchant-card-renderer";

function configWithWidget(slot: "VISITS" | "POINTS_BY_AMOUNT" | "FIXED_POINTS" | "AMOUNT_TIERS" | "GENERAL") {
  const base = defaultCardTemplateConfig("/bg.png");
  if (slot === "GENERAL") {
    return sanitizeLoyaltyWidgetsForSlot(
      {
        ...base,
        elements: base.elements.filter((el) => el.type !== "loyaltyWidget"),
      },
      "GENERAL",
    );
  }
  const widget = createDefaultLoyaltyWidgetElement(slot, 5)!;
  return sanitizeLoyaltyWidgetsForSlot(
    {
      ...base,
      elements: [
        ...base.elements.filter((el) => el.type !== "loyaltyWidget"),
        {
          id: "client-1",
          type: "clientName" as const,
          x: 0.06,
          y: 0.28,
          width: 0.5,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
        },
        widget,
      ],
    },
    slot,
  );
}

describe("blocs de fidélité par type de carte", () => {
  it("la carte par passages n’accepte que le bloc passages", () => {
    const allowed = allowedElementTypesForSlot("VISITS");
    expect(allowed).toContain("loyaltyWidget");
    expect(allowed).not.toContain("pointsBalance");
    expect(allowed).not.toContain("visitsCount");
  });

  it("les cartes à points n’acceptent que le bloc points", () => {
    for (const slot of ["POINTS_BY_AMOUNT", "FIXED_POINTS"] as const) {
      const allowed = allowedElementTypesForSlot(slot);
      expect(allowed).toContain("loyaltyWidget");
      expect(allowed).not.toContain("visitsCount");
      expect(allowed).not.toContain("tierLevel");
    }
  });

  it("la carte par paliers n’accepte que le bloc paliers", () => {
    const allowed = allowedElementTypesForSlot("AMOUNT_TIERS");
    expect(allowed).toContain("loyaltyWidget");
    expect(allowed).not.toContain("visitsCount");
  });

  it("la carte générale n’accepte aucun bloc de fidélité", () => {
    const allowed = allowedElementTypesForSlot("GENERAL");
    expect(allowed).not.toContain("loyaltyWidget");
    const config = configWithWidget("GENERAL");
    const withWidget = {
      ...config,
      elements: [...config.elements, createDefaultLoyaltyWidgetElement("VISITS", 9)!],
    };
    expect(validateLoyaltyWidgetsForSlot(withWidget, "GENERAL").length).toBeGreaterThan(0);
  });

  it("chaque bloc propose plusieurs styles", () => {
    expect(VISITS_STYLE_VARIANTS.length).toBeGreaterThanOrEqual(6);
    expect(POINTS_STYLE_VARIANTS.length).toBeGreaterThanOrEqual(6);
    expect(TIERS_STYLE_VARIANTS.length).toBeGreaterThanOrEqual(6);
  });

  it("changer de style conserve les couleurs", () => {
    const base = defaultLoyaltyWidgetConfig("VISITS");
    const next = applyStyleVariantPreservingColors(base, "bigCounter", "VISITS");
    expect(next.styleVariant).toBe("bigCounter");
    expect(next.colors.fill).toBe(base.colors.fill);
    expect(next.colors.track).toBe(base.colors.track);
  });

  it("refuse une requête API incompatible (mode falsifié)", () => {
    const config = configWithWidget("VISITS");
    const tampered = {
      ...config,
      elements: config.elements.map((el) =>
        el.type === "loyaltyWidget" && el.loyaltyWidget
          ? { ...el, loyaltyWidget: { ...el.loyaltyWidget, loyaltyMode: "POINTS_BY_AMOUNT" as const } }
          : el,
      ),
    };
    const sanitized = sanitizeLoyaltyWidgetsForSlot(tampered, "VISITS");
    expect(sanitized.elements.find((el) => el.type === "loyaltyWidget")?.loyaltyWidget?.loyaltyMode).toBe(
      "VISITS",
    );
    const errors = validateLoyaltyWidgetsForSlot(tampered, "VISITS");
    expect(errors.some((e) => e.message.includes("Progression par passages"))).toBe(true);
  });

  it("convertit le bloc lors d’une duplication vers un autre mode", () => {
    const source = configWithWidget("VISITS");
    const converted = convertConfigForTargetSlot(source, "POINTS_BY_AMOUNT");
    const widget = converted.elements.find((el) => el.type === "loyaltyWidget");
    expect(widget?.loyaltyWidget?.loyaltyMode).toBe("POINTS_BY_AMOUNT");
    expect(converted.elements.some((el) => el.type === "visitsCount")).toBe(false);
    expect(converted.elements.some((el) => el.type === "logo")).toBe(true);
  });

  it("utilise le programme réel pour le nombre de cases (target dynamique)", () => {
    const html = renderToStaticMarkup(
      <LoyaltyWidgetView
        config={{ ...defaultLoyaltyWidgetConfig("VISITS"), styleVariant: "stampGrid" }}
        progress={{ current: 3, target: 10, label: "Encore 7" }}
        primaryColor="#8557ff"
      />,
    );
    expect(html).toContain("3 / 10");
  });

  it("rend tous les styles dans MerchantCardRenderer", () => {
    for (const mode of ["VISITS", "POINTS_BY_AMOUNT", "AMOUNT_TIERS"] as const) {
      for (const variant of styleVariantsForMode(mode)) {
        const config = configWithWidget(mode);
        const withVariant = {
          ...config,
          elements: config.elements.map((el) =>
            el.type === "loyaltyWidget" && el.loyaltyWidget
              ? { ...el, loyaltyWidget: { ...el.loyaltyWidget, styleVariant: variant } }
              : el,
          ),
        };
        const html = renderToStaticMarkup(
          <MerchantCardRenderer
            template={{ backgroundUrl: "/bg.png", config: withVariant, loyaltyMode: mode }}
            merchant={{ name: "Demo", logoUrl: null, primaryColor: "#8557ff" }}
            card={{
              id: "1",
              merchantId: "m1",
              slug: "demo",
              name: "Demo",
              logoUrl: null,
              primaryColor: "#8557ff",
              points: 40,
              visitsRequired: 10,
              rewardLabel: "Cadeau",
              loyaltyMode: mode,
            }}
            slug="demo"
            displayMode="adminPreview"
            interactive={false}
          />,
        );
        expect(html.length).toBeGreaterThan(100);
        expect(html).toContain("data-loyalty-widget");
      }
    }
  });
});

describe("publication avec bloc canonique", () => {
  it("valide une carte VISITS avec loyaltyWidget", () => {
    const config = configWithWidget("VISITS");
    const result = validateCardTemplateForPublishDetailed(config, "VISITS");
    expect(result.ok).toBe(true);
  });

  it("migre les éléments legacy vers un widget", () => {
    const base = defaultCardTemplateConfig("/bg.png");
    const legacy = {
      ...base,
      elements: [
        ...base.elements.filter((el) => el.type !== "loyaltyWidget"),
        {
          id: "visits-legacy",
          type: "visitsCount" as const,
          x: 0.1,
          y: 0.5,
          width: 0.2,
          height: 0.08,
          zIndex: 2,
          locked: false,
          hidden: false,
          anchor: "top-left" as const,
        },
      ],
    };
    const migrated = migrateLegacyLoyaltyElements(legacy, "VISITS");
    expect(migrated.elements.some((el) => el.type === "loyaltyWidget")).toBe(true);
    expect(migrated.elements.some((el) => el.type === "visitsCount")).toBe(false);
  });
});
