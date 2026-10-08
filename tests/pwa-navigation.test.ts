import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clientMerchantAppHref } from "@/lib/client-cross-origin-links";
import { merchantLoginRedirectPath, sanitizeMerchantNextPath } from "@/lib/merchant-auth-path";
import { customerPwaManifest, merchantPwaManifest, resolvePwaManifestForHost } from "@/lib/pwa-manifests";
import { shouldRegisterFidetoServiceWorker } from "@/lib/pwa-client";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

describe("manifestes PWA distincts", () => {
  it("client : entrée wallet /carte sur fideto.fr", () => {
    const manifest = resolvePwaManifestForHost("fideto.fr");
    expect(manifest.start_url).toBe("/carte");
    expect(manifest.id).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.name).toBe("Fideto");
  });

  it("commerçant : start_url /app sur app.fideto.fr", () => {
    const manifest = resolvePwaManifestForHost("app.fideto.fr");
    expect(manifest.start_url).toBe("/app");
    expect(manifest.id).toBe("/app");
    expect(manifest.short_name).toBe("Commerçant");
    expect(manifest.name).toBe("Fideto Commerçant");
  });

  it("n'utilise pas le même identifiant", () => {
    expect(customerPwaManifest().id).not.toBe(merchantPwaManifest().id);
  });
});

describe("Je suis commerçant — entrée app.fideto.fr/app", () => {
  it("lien absolu depuis la landing", () => {
    const page = readSrc("src/app/page.tsx");
    expect(page).toContain("clientMerchantAppHref");
    expect(page).toContain('clientMerchantAppHref("/app")');
    expect(page).toMatch(/<a[\s\S]*Je suis commerçant/);
    expect(page).not.toMatch(/Je suis commerçant[\s\S]{0,80}#commercants/);
    expect(page).not.toMatch(/Je suis commerçant[\s\S]{0,120}href="\/tarifs"/);
  });

  it("tarifs : commerçant distinct de créer mon programme", () => {
    const tarifs = readSrc("src/app/tarifs/page.tsx");
    expect(tarifs).toContain('clientMerchantAppHref("/app")');
    expect(tarifs).toContain("merchantSignupEntryHref");
    expect(tarifs).not.toContain("resolveLandingAuthTargets");
  });

  it("helper cross-origin", () => {
    expect(clientMerchantAppHref("/app")).toBe("https://app.fideto.fr/app");
  });
});

describe("connexion commerçant avec next=/app", () => {
  it("sanitise les chemins internes /app", () => {
    expect(sanitizeMerchantNextPath("/app/campagnes")).toBe("/app/campagnes");
    expect(sanitizeMerchantNextPath("//evil")).toBe("/app");
    expect(sanitizeMerchantNextPath("/connexion")).toBe("/app");
  });

  it("redirige /app vers la connexion avec next", () => {
    expect(merchantLoginRedirectPath("/app")).toBe("/app/connexion?next=%2Fapp");
  });

  it("page connexion lit next et espaces absolus", () => {
    const connexion = readSrc("src/app/app/connexion/page.tsx");
    expect(connexion).toContain("sanitizeMerchantNextPath");
    expect(connexion).toContain("publicCustomerUrl");
    expect(connexion).toContain("publicEmployeeUrl");
  });
});

describe("service worker", () => {
  const source = readSrc("public/sw.js");

  it("cache versionné v3 et precache selon l'hôte", () => {
    expect(source).toContain("fifelite-v3");
    expect(source).toContain("installPrecacheUrls");
    expect(source).toContain('"/carte"');
    expect(source).toContain('"/app"');
  });

  it("n'intercepte pas les connexions ni RSC", () => {
    expect(source).toContain("/app/connexion");
    expect(source).toContain('url.searchParams.has("_rsc")');
  });

  it("enregistrement limité aux hôtes client et commerçant", () => {
    expect(shouldRegisterFidetoServiceWorker("fideto.fr")).toBe(true);
    expect(shouldRegisterFidetoServiceWorker("app.fideto.fr")).toBe(true);
    expect(shouldRegisterFidetoServiceWorker("employe.fideto.fr")).toBe(false);
    expect(readSrc("src/components/pwa-register.tsx")).toContain("shouldRegisterFidetoServiceWorker");
  });
});

describe("aperçu carte client depuis l'espace commerçant", () => {
  it("pointe vers fideto.fr sans target _blank", () => {
    const ui = readSrc("src/app/app/parametres/avantages/advantages-ui.tsx");
    expect(ui).toContain("publicCustomerUrl");
    expect(ui).not.toMatch(/\/carte\/\$\{merchantSlug\}`\} target="_blank"/);
  });
});
