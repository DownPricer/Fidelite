import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

const page = readSrc("src/app/page.tsx");
const header = readSrc("src/components/landing/landing-header.tsx");
const footer = readSrc("src/components/landing/landing-footer.tsx");
const faq = readSrc("src/components/landing/landing-faq.tsx");
const heroVisual = readSrc("src/components/landing/landing-hero-visual.tsx");

describe("landing page structure and balance", () => {
  it("exposes exactly one h1", () => {
    const matches = page.match(/<h1[\s>]/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("presents both audiences in the hero", () => {
    expect(page).toContain("Une seule carte.");
    expect(page).toContain("Toutes vos fidélités.");
    expect(page).toContain("Découvrir Fidelo");
    expect(page).toContain("Je suis commerçant");
  });

  it("declares every required anchor id", () => {
    for (const id of ["fonctionnement", "commercants", "avantages", "faq"]) {
      expect(page).toContain(`id="${id}"`);
    }
  });

  it("does not reintroduce the removed journey-choice section", () => {
    expect(page).not.toContain("Que souhaitez-vous faire avec Fidelo");
  });

  it("links the client CTA to the real client login route", () => {
    expect(page).toContain('href="/connexion"');
    expect(page).not.toContain('href="/clients"');
  });

  it("links the merchant CTA to the real merchant onboarding/login route", () => {
    expect(page).toContain('href="/app/connexion"');
    expect(page).not.toContain('href="/commercants"');
  });

  it("does not create separate marketing pages replacing the single landing page", () => {
    for (const forbidden of ['href="/clients"', 'href="/commercants"', 'href="/fonctionnement"', 'href="/faq"']) {
      expect(page).not.toContain(forbidden);
    }
  });

  it("never redirects to an external domain", () => {
    expect(page).not.toMatch(/href="https?:\/\//);
    expect(header).not.toMatch(/href="https?:\/\//);
    expect(footer).not.toMatch(/href="https?:\/\//);
  });

  it("contains every required section", () => {
    expect(page).toContain("Vos récompenses vous suivent partout.");
    expect(page).toContain("Créez une fidélité qui donne envie de revenir.");
    expect(page).toContain("Tout ce qu&apos;il faut. Rien de compliqué.");
    expect(page).toContain("Vos données restent les vôtres.");
    expect(page).toContain("Vous vous demandez peut-être");
    expect(page).toContain("Prêt à créer une fidélité qui compte vraiment ?");
  });

  it("exposes the FAQ as an accessible accordion", () => {
    expect(faq).toContain("aria-expanded");
    expect(faq).toContain("aria-controls");
    expect(faq).toContain("Fidelo est-il une carte de fidélité unique ?");
    expect(faq).toContain("Comment fonctionne le QR code ?");
    expect(faq).toContain("Puis-je ajouter ma carte à Google Wallet ?");
  });

  it("links legal pages that actually exist in the repo", () => {
    expect(footer).toContain('href: "/confidentialite"');
    expect(footer).toContain('href: "/conditions"');
  });

  it("keeps light and dark theme support via the fidelo-landing token scope", () => {
    expect(page).toContain("fidelo-landing");
    expect(header).toContain("var(--fh-");
    expect(footer).toContain("var(--fh-");
  });

  it("contains no private customer data or functional QR/session tokens", () => {
    for (const forbidden of ["getSessionUser", "prisma.", "fetch(", "qrToken", "membershipId"]) {
      expect(page).not.toContain(forbidden);
      expect(heroVisual).not.toContain(forbidden);
    }
  });

  it("contains no fabricated testimonials or unverified pricing claims", () => {
    expect(page).not.toMatch(/témoignage/i);
    expect(page).not.toMatch(/gratuit|sans engagement|essai gratuit|satisfait ou remboursé/i);
  });

  it("does not reference the old Fife Life brand", () => {
    expect(page).not.toMatch(/fife life/i);
    expect(header).not.toMatch(/fife life/i);
    expect(footer).not.toMatch(/fife life/i);
  });

  it("exports SEO metadata with the agreed title and description", () => {
    expect(page).toContain("Fidelo — Toutes vos cartes de fidélité au même endroit");
    expect(page).toContain(
      "Fidelo réunit les cartes, les points et les avantages des clients, tout en donnant aux commerçants les outils pour créer et gérer leur programme de fidélité.",
    );
  });

  it("keeps the connexion hub reachable as the sign-in entry point", () => {
    expect(header).toContain('href="/connexion"');
    expect(header).toContain("Se connecter");
  });

  it("gives the header a violet primary CTA, not a white one", () => {
    expect(header).toContain("Créer mon programme");
    expect(header).toContain("linear-gradient(135deg, #7c3aed, #a855f7)");
  });
});
