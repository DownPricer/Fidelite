import { describe, expect, it } from "vitest";
import { isCampaignEnCours } from "../src/lib/campaign-en-cours";

describe("isCampaignEnCours", () => {
  it("inclut une mise en avant en attente de paiement (visuel APPROVED)", () => {
    expect(
      isCampaignEnCours(
        { id: "c1", channel: "SPONSORED_AD", status: "PAYMENT_REQUIRED" },
        { status: "APPROVED", startDate: "2026-10-05", endDate: "2026-10-10", campaignId: "c1" },
      ),
    ).toBe(true);
  });

  it("inclut une campagne programmée aujourd'hui avant le créneau", () => {
    expect(
      isCampaignEnCours(
        { id: "c2", channel: "SPONSORED_AD", status: "SCHEDULED" },
        { status: "SCHEDULED", startDate: "2026-10-05", endDate: "2026-10-05", campaignId: "c2" },
        new Date("2026-10-05T08:00:00.000Z"),
      ),
    ).toBe(true);
  });

  it("exclut les campagnes terminées ou annulées", () => {
    expect(
      isCampaignEnCours(
        { id: "c3", channel: "SPONSORED_AD", status: "ENDED" },
        { status: "ENDED", startDate: "2026-09-01", endDate: "2026-09-02", campaignId: "c3" },
      ),
    ).toBe(false);
  });

  it("inclut une annonce e-mail programmée", () => {
    expect(isCampaignEnCours({ id: "c4", channel: "EMAIL", status: "SCHEDULED" }, undefined)).toBe(true);
  });
});
