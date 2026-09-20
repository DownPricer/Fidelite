import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

const page = readSrc("src/app/page.tsx");
const header = readSrc("src/components/landing/landing-header.tsx");
const footer = readSrc("src/components/landing/landing-footer.tsx");
const faq = readSrc("src/components/landing/landing-faq.tsx");

describe("landing page balance and structure", () => {
  it("exposes exactly one h1", () => {
    const matches = page.match(/<h1[\s>]/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("presents both audiences in the hero", () => {
    expect(page).toMatch(/Une seule carte\. Toutes vos fidélités\./);
    expect(page).toContain("Je suis client");
    expect(page).toContain("Je suis commerçant");
  });

  it("gives client and merchant CTAs the same visual level (glass-cta)", () => {
    const heroClientCta = /href="#clients" className="glass-cta[^"]*">\s*Je suis client/;
    expect(page).toMatch(heroClientCta);
    expect(page).toContain('href="#commercants"');
    // Both hero buttons share the same size and padding classes (min-w-[200px], px-6 py-3.5 text-sm).
    const clientButtonClasses = page.match(/<a href="#clients" className="([^"]*)">/)?.[1] ?? "";
    const merchantButtonClasses = page.match(/href="#commercants"\s*className="([^"]*)"/)?.[1] ?? "";
    expect(clientButtonClasses).toContain("min-w-[200px]");
    expect(merchantButtonClasses).toContain("min-w-[200px]");
    expect(clientButtonClasses).toContain("px-6 py-3.5 text-sm");
    expect(merchantButtonClasses).toContain("px-6 py-3.5 text-sm");

    // Final dual CTA block: both use glass-cta, same markup shape.
    const finalCtas = page.match(/glass-cta mt-6 inline-flex px-6 py-3\.5 text-sm/g) ?? [];
    expect(finalCtas.length).toBeGreaterThanOrEqual(2);
  });

  it("declares every required anchor id", () => {
    for (const id of ["parcours", "fonctionnement", "clients", "commercants", "tarifs", "avantages", "faq", "contact"]) {
      expect(page).toContain(`id="${id}"`);
    }
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
    for (const forbidden of ['href="/clients"', 'href="/commercants"', 'href="/fonctionnement"', 'href="/faq"', 'href="/contact"']) {
      expect(page).not.toContain(forbidden);
    }
  });

  it("never redirects to an external domain", () => {
    expect(page).not.toMatch(/href="https?:\/\//);
    expect(header).not.toMatch(/href="https?:\/\//);
    expect(footer).not.toMatch(/href="https?:\/\//);
  });

  it("contains every required section", () => {
    expect(page).toContain("Que souhaitez-vous faire avec Fidelo ?");
    expect(page).toContain("Comment ça marche");
    expect(page).toContain("Vos récompenses vous suivent partout.");
    expect(page).toContain("Créez une fidélité qui donne envie de revenir.");
    expect(page).toContain("Des formules adaptées à votre activité");
    expect(page).toContain("Tout ce qu&apos;il faut. Rien de compliqué.");
    expect(page).toContain("Vos données restent les vôtres.");
    expect(page).toContain("Questions fréquentes");
    expect(page).toContain("Une question ?");
  });

  it("exposes the FAQ as an accessible accordion with all required questions", () => {
    expect(faq).toContain("aria-expanded");
    expect(faq).toContain("aria-controls");
    const requiredQuestions = [
      "Fidelo est-il une carte de fidélité unique ?",
      "Comment fonctionne le QR personnel ?",
      "Puis-je utiliser Google Wallet ?",
      "Comment rejoindre un commerce ?",
      "Comment créer un programme ?",
      "Puis-je choisir entre points et passages ?",
      "Mes employés peuvent-ils utiliser la caisse ?",
      "Comment sont protégées mes données ?",
      "Comment supprimer mon compte ?",
      "Comment contacter l'assistance ?",
    ];
    for (const question of requiredQuestions) {
      expect(faq).toContain(question);
    }
  });

  it("links legal pages that actually exist in the repo", () => {
    expect(footer).toContain('href: "/confidentialite"');
    expect(footer).toContain('href: "/conditions"');
  });

  it("keeps light and dark theme support via light-dark() tokens, no theme removal", () => {
    expect(header).toContain("light-dark(");
    expect(footer).toContain("light-dark(");
    expect(page).toContain("light-dark(");
  });

  it("contains no private customer data or functional QR/session tokens", () => {
    for (const forbidden of ["getSessionUser", "prisma.", "fetch(", "qrToken", "membershipId"]) {
      expect(page).not.toContain(forbidden);
    }
  });

  it("contains no fabricated testimonials or unverified statistics", () => {
    expect(page).not.toMatch(/\d[\d\s]*\+?\s*(clients|commerces|utilisateurs) (actifs|inscrits)/i);
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

  it("keeps the connexion hub as the single sign-in entry point from the header", () => {
    expect(header).toContain('href="/connexion"');
    expect(header).toContain("Se connecter");
  });
});
