import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, expect, it } from "vitest";

const source = () =>
  readFileSync(
    resolve(process.cwd(), "src/app/super-admin/commerces/[id]/merchant-detail.tsx"),
    "utf8",
  );

describe("Google Wallet media draft previews", () => {
  it("utilise des Object URLs pour les brouillons et les révoque", () => {
    const detail = source();
    expect(detail).toContain("URL.createObjectURL(file)");
    expect(detail).toContain("URL.revokeObjectURL");
    expect(detail).toContain("revokeWalletPreviews");
    expect(detail).toContain("clearWalletLocalPreviews()");
  });

  it("n'assigne pas directement les URLs publiques de brouillon aux images", () => {
    const detail = source();
    expect(detail).toContain('walletMediaState("hero").src');
    expect(detail).toContain('walletMediaState("logo").src');
    expect(detail).toContain('walletMediaState("wideLogo").src');
    expect(detail).not.toContain("src={walletAppearance.heroImageUrl}");
    expect(detail).not.toContain("src={walletAppearance.logoUrl}");
    expect(detail).not.toContain("src={walletAppearance.wideLogoUrl}");
  });

  it("conserve les médias quand la couleur change", () => {
    const detail = source();
    expect(detail).toContain("setWalletAppearance((current) => ({ ...current, backgroundColor: event.target.value.toUpperCase() }))");
    expect(detail).toContain("setWalletAppearance((current) => ({ ...current, backgroundColor: color }))");
  });
});
