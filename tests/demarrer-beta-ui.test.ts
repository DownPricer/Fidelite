import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

describe("page bêta /demarrer — structure UI", () => {
  const page = readSrc("src/app/demarrer/page.tsx");
  const ui = readSrc("src/app/demarrer/ui.tsx");
  const css = readSrc("src/app/demarrer/beta-signup.css");
  const codeInputs = readSrc("src/app/demarrer/signup-code-inputs.tsx");

  it("expose une mise en page deux colonnes et le header compact", () => {
    expect(css).toContain("grid-template-columns: minmax(255px, 0.75fr) minmax(0, 1.6fr)");
    expect(page).toContain("fd-header");
    expect(ui).toContain("Accès bêta");
    expect(ui).toContain("Construisons votre fidélité.");
  });

  it("sépare formulaire et code sans les afficher ensemble", () => {
    expect(ui).toContain('hidden={panel !== "form"}');
    expect(ui).toContain('hidden={panel !== "code"}');
    expect(ui).toContain("J&apos;ai déjà un code");
    expect(ui).toContain("Continuer mon inscription");
  });

  it("conserve les appels API existants", () => {
    expect(ui).toContain("/api/public/merchant-signup/apply");
    expect(ui).toContain("/api/public/merchant-signup/verify-code");
    expect(ui).toContain("planId: plan.id");
  });

  it("gère le collage et la navigation du code à six chiffres", () => {
    expect(codeInputs).toContain("onPaste");
    expect(codeInputs).toContain("Backspace");
    expect(codeInputs).toContain('inputMode="numeric"');
  });

  it("propose une liste d'activités commerçant", () => {
    expect(ui).toContain("Restaurant ou café");
    expect(ui).toContain('name="businessActivity"');
  });
});
