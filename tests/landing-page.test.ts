import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

const page = readSrc("src/app/page.tsx");
const header = readSrc("src/components/landing/landing-header.tsx");
const mobileNav = readSrc("src/components/landing/landing-mobile-nav.tsx");
const footer = readSrc("src/components/landing/landing-footer.tsx");
const explainerVideo = readSrc("src/components/landing/landing-explainer-video.tsx");
const explainerConfig = readSrc("src/lib/landing-explainer-video.ts");
const siteMedia = readSrc("src/lib/site-media.ts");
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
    expect(page).toContain("Voir mes cartes");
    expect(page).toContain("Je suis commerçant");
  });

  it("declares every required anchor id", () => {
    for (const id of ["fonctionnement", "commercants", "avantages", "faq"]) {
      expect(page).toContain(`id="${id}"`);
    }
  });

  it("does not reintroduce the removed journey-choice section", () => {
    expect(page).not.toContain("Que souhaitez-vous faire avec Fideto");
  });

  it("resolves auth-aware destinations server-side instead of hardcoding routes", () => {
    expect(page).toContain('from "@/lib/landing-auth-targets"');
    expect(page).toContain("resolveLandingAuthTargets");
    expect(page).toMatch(/href=\{clientHref\}/);
    expect(page).toContain('clientMerchantAppHref("/app")');
    expect(page).toMatch(/href=\{merchantAppEntryHref\}/);
    expect(page).not.toMatch(/href=\{proHref\}/);
    expect(header).toMatch(/href=\{clientHref\}/);
    expect(header).toContain('href={MERCHANT_PROGRAM_HREF}');
    expect(header).not.toMatch(/proHref/);
  });

  it("does not create separate marketing pages replacing the single landing page", () => {
    for (const forbidden of ['href="/clients"', 'href="/commercants"', 'href="/fonctionnement"', 'href="/faq"']) {
      expect(page).not.toContain(forbidden);
    }
  });

  it("n'utilise pas de lien absolu sauf l'entrée commerçant cross-domaine", () => {
    expect(header).not.toMatch(/href="https?:\/\//);
    expect(footer).not.toMatch(/href="https?:\/\//);
    expect(page).toContain("clientMerchantAppHref");
    expect(page).toMatch(/<a[\s\S]*merchantAppEntryHref/);
  });

  it("contains every required section", () => {
    expect(page).toContain("Vos récompenses vous suivent partout.");
    expect(page).toContain("Créez une fidélité qui donne envie de revenir.");
    expect(page).toContain("Tout ce qu&apos;il faut. Rien de compliqué.");
    expect(page).toContain("Vos données restent les vôtres.");
    expect(page).toContain("Tout ce qu&apos;il faut savoir");
    expect(page).toContain(
      "Découvrez en quelques minutes comment Fideto fonctionne pour les clients et les commerçants.",
    );
    expect(page).toContain("Prêt à créer une fidélité qui compte vraiment ?");
  });

  it("exposes the explainer section as an accessible HTML5 video player", () => {
    expect(page).toContain("LandingExplainerVideo");
    expect(explainerVideo).toContain('preload="metadata"');
    expect(explainerVideo).toContain("playsInline");
    expect(explainerVideo).toContain("Votre navigateur ne permet pas de lire cette vidéo.");
    expect(explainerVideo).toContain("prefers-reduced-motion");
    expect(page).toContain("LANDING_EXPLAINER_VIDEO_SRC");
    expect(siteMedia).toContain("fideto-presentation.mp4");
    expect(siteMedia).toContain("/api/media/site/");
    expect(explainerConfig).toContain("/branding/fideto-presentation-poster.webp");
    expect(page).not.toContain("LandingFaq");
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
    expect(page).toContain("Fideto — Toutes vos cartes de fidélité au même endroit");
    expect(page).toContain(
      "Fideto réunit les cartes, les points et les avantages des clients, tout en donnant aux commerçants les outils pour créer et gérer leur programme de fidélité.",
    );
  });

  it("separates client sign-in from merchant program creation in the header", () => {
    expect(header).toContain("Se connecter");
    expect(header).toContain("Créer mon programme");
    expect(header).toContain("border border-[var(--fh-border)]");
    expect(header).toContain("linear-gradient(135deg, #7c3aed, #a855f7)");
    expect(header).not.toMatch(/href=\{proHref\}/);
  });

  it("keeps mobile CTAs compact and routes merchants to /tarifs", () => {
    expect(mobileNav).toContain("Voir mes cartes");
    expect(mobileNav).toContain("Créer mon programme");
    expect(mobileNav).toContain("flex gap-2");
    expect(mobileNav).toContain("flex-1");
    expect(mobileNav).toContain("MERCHANT_PROGRAM_HREF");
    expect(mobileNav).not.toContain("app.fideto.fr");
  });

  it("routes merchant CTAs on the landing page to /tarifs instead of pro login", () => {
    const merchantCtas = page.match(/Créer mon programme[\s\S]{0,120}/g) ?? [];
    expect(merchantCtas.length).toBeGreaterThanOrEqual(2);
    expect(page).toContain('href="/tarifs"');
    expect(page).not.toMatch(/Créer mon programme[\s\S]{0,80}href=\{proHref\}/);
  });

  it("describes the real client onboarding flow: account first, own QR presented at checkout", () => {
    expect(page).toContain("Créez votre compte Fideto");
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
    expect(page).not.toContain("Scannez son QR code ou ouvrez son lien Fideto");
    expect(connexionUi).not.toMatch(/scannez le qr en magasin/i);
  });

  it("adds the merchant network card harmoniously into the existing bento grid", () => {
    expect(page).toContain("Rejoignez le réseau Fideto");
    expect(page).toContain(
      "Intégrez une communauté de commerçants, développez votre visibilité auprès des clients Fideto et renforcez l'image moderne de votre établissement.",
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
    expect(proPage).toContain('publicAppUrl("/app/connexion")');
    expect(proPage).toContain('publicEmployeeUrl("/employe/connexion")');
  });

  it("redirects an already-known role straight to its space using the server-verified session", () => {
    expect(proPage).toContain("getSessionUser");
    expect(proPage).toContain("getEmployeeSession");
    expect(proPage).toContain("firstActiveStaffMembership");
    expect(proPage).toContain('publicEmployeeUrl("/employe/scan")');
    expect(proPage).toContain('publicAppUrl("/app/caisse")');
    expect(proPage).toContain('publicAppUrl("/app")');
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
