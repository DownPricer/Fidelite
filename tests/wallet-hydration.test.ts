import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("wallet — hydratation SSR/client", () => {
  it("utilise un rendu réduit sûr pour le deck et le shell de carte", () => {
    expect(read("src/components/fife-life/card-deck.tsx")).toContain("useHydrationSafeReducedMotion");
    expect(read("src/components/fife-life/interactive-card-shell.tsx")).toContain(
      "useHydrationSafeReducedMotion",
    );
  });

  it("ne monte le portal d’animation qu’après le montage client", () => {
    const source = read("src/components/fife-life/new-card-toast.tsx");
    expect(source).toContain("useClientMounted");
    expect(source).toMatch(/if \(!mounted \|\| !visible\) return null;/);
    expect(source).not.toContain("suppressHydrationWarning");
  });

  it("initialise le QR avec un état déterministe (null) avant effet client", () => {
    expect(read("src/components/fife-life/use-personalized-qr.ts")).toContain(
      'useState<string | null>(null)',
    );
    expect(read("src/components/fife-life/global-card.tsx")).toContain(
      'useState<string | null>(null)',
    );
    expect(read("src/components/fife-life/merchant-card-renderer.tsx")).toContain(
      'useState<string | null>(null)',
    );
  });

  it("protège les lectures document dans le hook unlock", () => {
    const source = read("src/components/fife-life/use-wallet-unlock-animation.ts");
    expect(source).toContain('typeof document === "undefined"');
    expect(source).toContain("document.addEventListener(\"visibilitychange\"");
    expect(source).not.toMatch(/useState\([^)]*document/);
  });

  it("n’attend pas le QR pour lancer l’animation de déblocage", () => {
    const source = read("src/components/fife-life/use-wallet-unlock-animation.ts");
    expect(source).toContain("void loadPersonalizedQr(slug)");
    expect(source).not.toContain("Promise.all");
  });
});
