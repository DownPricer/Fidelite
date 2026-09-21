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
const authTargets = readSrc("src/lib/landing-auth-targets.ts");
const proPage = readSrc("src/app/pro/page.tsx");
const connexionUi = readSrc("src/app/connexion/ui.tsx");

describe("landing page structure and balance", () => {
  it("exposes exactly one h1", () => {
    const matches = page.match(/<h1[\s>]/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("presents both audiences in the hero", () => {
    expect(page).toContain("Une seule carte.");
    expect(page).toContain("Toutes vos fidélités.");
    expect(page).toContain("Se connecter");
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

  it("resolves auth-aware destinations server-side instead of hardcoding routes", () => {
    expect(page).toContain('from "@/lib/landing-auth-targets"');
    expect(page).toContain("resolveLandingAuthTargets");
    expect(page).toMatch(/href=\{clientHref\}/);
    expect(page).toMatch(/href=\{proHref\}/);
    expect(header).toMatch(/href=\{clientHref\}/);
    expect(header).toMatch(/href=\{proHref\}/);
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

  it("contains no private customer data or functional QR/session tokens in the page markup", () => {
    for (const forbidden of ["prisma.", "qrToken", "membershipId"]) {
      expect(page).not.toContain(forbidden);
      expect(heroVisual).not.toContain(forbidden);
    }
  });

  it("contains no fabricated testimonials or unverified pricing claims", () => {
    expect(page).not.toMatch(/témoignage/i);
    // "gratuitement" is allowed in the mandated client-onboarding copy (account creation is free);
    // this only forbids standalone pricing/promo claims like a bare "gratuit" badge.
    expect(page).not.toMatch(/\bgratuit\b|sans engagement|essai gratuit|satisfait ou remboursé/i);
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

  it("gives the header a violet primary CTA, not a white one", () => {
    expect(header).toContain("Créer mon programme");
    expect(header).toContain("linear-gradient(135deg, #7c3aed, #a855f7)");
  });

  it("describes the real client onboarding flow: account first, own QR presented at checkout", () => {
    expect(page).toContain("Créez votre compte Fidelo");
    expect(page).toContain(
      "Créez gratuitement votre compte et retrouvez un QR personnel unique, utilisable dans tous les commerces partenaires.",
    );
    expect(page).toContain("Présentez votre QR personnel");
    expect(page).toContain(
      "Lors de votre passage en caisse, le commerçant scanne votre QR pour ajouter sa carte à votre espace ou retrouver votre programme de fidélité.",
    );
    expect(page).toContain(
      "Suivez vos points, consultez votre progression et utilisez vos récompenses directement chez vos commerçants.",
    );
  });

  it("never claims the client should scan the merchant's QR or a join link to add a card", () => {
    expect(page).not.toContain("Rejoignez un commerce");
    expect(page).not.toContain("Scannez son QR code ou ouvrez son lien Fidelo");
    expect(connexionUi).not.toMatch(/scannez le qr en magasin/i);
  });

  it("adds the merchant network card harmoniously into the existing bento grid", () => {
    expect(page).toContain("Rejoignez le réseau Fidelo");
    expect(page).toContain(
      "Intégrez une communauté de commerçants, développez votre visibilité auprès des clients Fidelo et renforcez l'image moderne de votre établissement.",
    );
    // Still exactly one large "main" bento tile — the new card is a normal-sized tile, not a separate giant block.
    const mainSpans = page.match(/span: "main"/g) ?? [];
    expect(mainSpans.length).toBe(1);
    expect(page).not.toContain('span: "wide"');
    // Existing cards are preserved verbatim.
    expect(page).toContain("Une expérience vraiment universelle");
    expect(page).toContain("À votre image");
    expect(page).toContain("Chaque commerce garde ses couleurs, sa carte et ses propres avantages.");
    expect(page).toContain("Rapide en caisse");
    expect(page).toContain("Une équipe bien organisée");
  });

  it("keeps the three hero guarantees on a single symmetric row on mobile", () => {
    expect(page).toMatch(/grid grid-cols-3[^"]*sm:flex/);
    expect(page).not.toMatch(/mt-5 flex flex-wrap gap-4\.5/);
  });
});

describe("professional entry point (/pro)", () => {
  it("offers a clean choice between Commerçant and Employé", () => {
    expect(proPage).toContain("Commerçant");
    expect(proPage).toContain("Gérez votre programme de fidélité, vos récompenses et votre équipe.");
    expect(proPage).toContain("Employé");
    expect(proPage).toContain("Accédez à la caisse et aux fonctionnalités autorisées par votre commerce.");
  });

  it("routes each choice to the existing auth forms without duplicating them", () => {
    expect(proPage).toContain('href: "/app/connexion"');
    expect(proPage).toContain('href: "/employe/connexion"');
  });

  it("redirects an already-known role straight to its space using the server-verified session", () => {
    expect(proPage).toContain("getSessionUser");
    expect(proPage).toContain("getEmployeeSession");
    expect(proPage).toContain("firstActiveStaffMembership");
    expect(proPage).toContain('redirect("/employe/scan")');
    expect(proPage).toContain('"/app/caisse"');
    expect(proPage).toContain('"/app"');
  });
});

describe("landing-auth-targets resolver", () => {
  it("only derives destinations from server-verified session helpers", () => {
    expect(authTargets).toContain("getSessionUser");
    expect(authTargets).toContain("getEmployeeSession");
    expect(authTargets).toContain("firstActiveStaffMembership");
  });

  it("knows every real destination route", () => {
    for (const route of ['"/connexion"', '"/carte"', '"/pro"', '"/app"', '"/app/caisse"', '"/employe/scan"']) {
      expect(authTargets).toContain(route);
    }
  });
});
