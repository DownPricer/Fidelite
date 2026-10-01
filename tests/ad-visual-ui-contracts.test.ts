import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { describeNextAction } from "../src/lib/ad-visual-workflow";
import { isExactBannerFormat } from "../src/lib/ad-visuals";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("routes neutres (aucun segment /ads/ pour les pages et appels du nouveau parcours)", () => {
  const files = [
    "src/app/super-admin/campagnes/fiche/[id]/ad-detail.tsx",
    "src/app/super-admin/campagnes/campaign-moderation-home.tsx",
    "src/app/app/campagnes/[id]/fiche.tsx",
    "src/components/ad-visual-parts.tsx",
    "src/components/notification-bell.tsx",
  ];
  it.each(files)("%s n'utilise aucune URL contenant /ads", (file) => {
    const source = read(file);
    expect(source).not.toMatch(/["'`]\/(api\/(super-admin|merchant)\/)?(campagnes\/)?ads[/"'`?]/);
    expect(source).not.toContain("campagnes/ads");
  });

  it("l'ancienne adresse /super-admin/campagnes/ads/[id] redirige vers la fiche neutre", async () => {
    vi.resetModules();
    vi.doMock("next/navigation", () => ({
      redirect: (url: string) => {
        throw new Error(`REDIRECT:${url}`);
      },
    }));
    const { default: Page } = await import("../src/app/super-admin/campagnes/ads/[id]/page");
    await expect(Page({ params: Promise.resolve({ id: "ad_9" }) })).rejects.toThrow("REDIRECT:/super-admin/campagnes/fiche/ad_9");
  });
});

describe("format du bandeau public", () => {
  it("n'accepte directement que les carrés d'au moins 400 px (ratio du composant SponsoredBanner)", () => {
    expect(isExactBannerFormat(800, 800)).toBe(true);
    expect(isExactBannerFormat(2000, 2000)).toBe(true);
    expect(isExactBannerFormat(800, 600)).toBe(false);
    expect(isExactBannerFormat(300, 300)).toBe(false);
    expect(read("src/components/fife-life/sponsored-banner.tsx")).toContain("h-14 w-14");
  });
});

describe("« qui doit agir maintenant »", () => {
  const base = { visualMode: "SELF" as const, versions: [], rejectionReason: null };
  it("désigne le bon acteur selon le statut", () => {
    expect(describeNextAction({ ...base, status: "PENDING_REVIEW" }).actor).toBe("FIDETO");
    expect(describeNextAction({ ...base, status: "NEEDS_CHANGES", rejectionReason: "Flou" })).toMatchObject({ actor: "MERCHANT", detail: "Motif : Flou" });
    expect(describeNextAction({ ...base, status: "AWAITING_MERCHANT" }).actor).toBe("MERCHANT");
    expect(describeNextAction({ ...base, status: "APPROVED" }).title).toContain("payer");
    expect(describeNextAction({ ...base, status: "REJECTED", rejectionReason: "Non conforme" }).title).toBe("Campagne refusée");
    expect(describeNextAction({ ...base, status: "LIVE" }).actor).toBe("NONE");
  });

  it("signale une modification demandée par le commerçant et une proposition sur une campagne déjà diffusée", () => {
    const requested = describeNextAction({
      status: "PENDING_REVIEW",
      visualMode: "FIDETO",
      rejectionReason: null,
      versions: [{ number: 1, author: "FIDETO", status: "CHANGES_REQUESTED", comment: "Plus de rouge" }],
    });
    expect(requested).toMatchObject({ actor: "FIDETO" });
    expect(requested.detail).toContain("Plus de rouge");
    const liveReplacement = describeNextAction({
      status: "LIVE",
      visualMode: "FIDETO",
      rejectionReason: null,
      versions: [{ number: 3, author: "FIDETO", status: "PROPOSED", comment: null }],
    });
    expect(liveReplacement.actor).toBe("MERCHANT");
    expect(liveReplacement.detail).toContain("reste diffusée");
  });
});
