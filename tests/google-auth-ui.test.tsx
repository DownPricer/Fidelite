import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GoogleAuthButton } from "../src/components/google-auth-button";
import { CustomerLoginForm } from "../src/app/connexion/ui";
import { MerchantPublic } from "../src/app/c/[slug]/ui";

const merchant = {
  name: "Café Demo",
  slug: "cafe-demo",
  logoUrl: null,
  primaryColor: "#0F766E",
  rewardLabel: "1 boisson offerte",
  visitsRequired: 10,
  cardTemplate: null,
};

describe("Google auth UI", () => {
  it("rend le bouton Continuer avec Google", () => {
    const html = renderToStaticMarkup(<GoogleAuthButton href="/api/auth/google/start" />);
    expect(html).toContain("Continuer avec Google");
  });

  it("affiche le bouton Google sur la connexion quand le provider est configuré", () => {
    const html = renderToStaticMarkup(<CustomerLoginForm googleEnabled googleStatus={null} returnTo="/carte" />);
    expect(html).toContain("Continuer avec Google");
    expect(html).toContain("ou");
  });

  it("masque le bouton Google sur la connexion quand les variables manquent", () => {
    const html = renderToStaticMarkup(<CustomerLoginForm googleEnabled={false} googleStatus={null} returnTo="/carte" />);
    expect(html).not.toContain("Continuer avec Google");
  });

  it("affiche le bouton Google sur l'inscription client quand le provider est configuré", () => {
    const html = renderToStaticMarkup(
      <MerchantPublic
        merchant={merchant}
        alreadyMember={false}
        signedIn={false}
        firstName={null}
        googleEnabled
        googleStatus={null}
      />,
    );
    expect(html).toContain("Continuer avec Google");
    expect(html).toContain("politique de confidentialité");
  });

  it("rend un message neutre pour l'annulation Google", () => {
    const html = renderToStaticMarkup(<CustomerLoginForm googleEnabled googleStatus="cancelled" returnTo="/carte" />);
    expect(html).toContain("Connexion Google annulée");
  });
});
