import { describe, expect, it } from "vitest";
import {
  CARD_ASPECT_RATIO,
  CARD_SCHEMA_VERSION,
  cardTemplateConfigSchema,
  validateCardTemplateForPublish,
  defaultCardTemplateConfig,
} from "../src/lib/card-template-schema";
import {
  computeArr,
  computeMrr,
  normalizeToMrr,
  sumCollectedRevenue,
  sumContractualForecast,
} from "../src/lib/billing-stats";
import { isSuperAdminEmailAllowed } from "../src/lib/super-admin-session";
import { syncIsActiveFromStatus } from "../src/lib/merchant-status";

describe("super-admin sécurité", () => {
  it("refuse les e-mails non autorisés quand une liste blanche est définie", () => {
    const prev = process.env.SUPER_ADMIN_ALLOWED_EMAILS;
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = "owner@fife.life";
    expect(isSuperAdminEmailAllowed("owner@fife.life")).toBe(true);
    expect(isSuperAdminEmailAllowed("other@fife.life")).toBe(false);
    process.env.SUPER_ADMIN_ALLOWED_EMAILS = prev ?? "";
  });
});

describe("statuts commerçant", () => {
  it("synchronise isActive depuis le statut", () => {
    expect(syncIsActiveFromStatus("ACTIVE")).toBe(true);
    expect(syncIsActiveFromStatus("TRIAL")).toBe(true);
    expect(syncIsActiveFromStatus("SUSPENDED")).toBe(false);
    expect(syncIsActiveFromStatus("ARCHIVED")).toBe(false);
  });
});

describe("billing stats", () => {
  it("normalise un abonnement annuel pour le MRR", () => {
    expect(normalizeToMrr(1200, "YEARLY")).toBe(100);
    expect(normalizeToMrr(49, "MONTHLY")).toBe(49);
  });

  it("calcule MRR et ARR", () => {
    const mrr = computeMrr([
      { amount: 1200, frequency: "YEARLY", status: "ACTIVE" },
      { amount: 29, frequency: "MONTHLY", status: "ACTIVE" },
      { amount: 99, frequency: "MONTHLY", status: "CANCELLED" },
    ]);
    expect(mrr).toBe(129);
    expect(computeArr(mrr)).toBe(1548);
  });

  it("sépare revenu encaissé et prévisionnel contractuel", () => {
    const payments = [
      { amount: 29, status: "PAID" as const, paidAt: new Date("2026-09-01") },
      { amount: 49, status: "PENDING" as const, paidAt: null },
    ];
    const collected = sumCollectedRevenue(payments, new Date("2026-09-01"), new Date("2026-09-30"));
    expect(collected).toBe(29);
    const forecast = sumContractualForecast([
      { amount: 49, frequency: "MONTHLY", status: "ACTIVE" },
    ]);
    expect(forecast).toBe(49);
  });
});

describe("gabarits de carte", () => {
  it("valide le schéma JSON et le ratio fixe", () => {
    const config = defaultCardTemplateConfig("/api/media/demo.png");
    const parsed = cardTemplateConfigSchema.parse(config);
    expect(parsed.schemaVersion).toBe(CARD_SCHEMA_VERSION);
    expect(parsed.aspectRatio).toBe(CARD_ASPECT_RATIO);
  });

  it("refuse la publication sans QR ou QR trop petit", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    const withoutQr = { ...config, elements: config.elements.filter((el) => el.type !== "qr") };
    expect(validateCardTemplateForPublish(withoutQr).length).toBeGreaterThan(0);

    const tinyQr = {
      ...config,
      elements: config.elements.map((el) =>
        el.type === "qr" ? { ...el, width: 0.05, height: 0.05 } : el,
      ),
    };
    expect(validateCardTemplateForPublish(tinyQr).some((msg) => msg.includes("QR"))).toBe(true);
  });

  it("refuse les coordonnées hors limites via Zod", () => {
    const config = defaultCardTemplateConfig("/bg.png");
    expect(() =>
      cardTemplateConfigSchema.parse({
        ...config,
        elements: [{ ...config.elements[0], x: 1.5 }],
      }),
    ).toThrow();
  });
});
