import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("e-mail de campagne (Partie 10)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetModules();
    // vi.stubEnv touche uniquement les clés listées (jamais une réaffectation globale de
    // process.env, qui créerait une fenêtre de course avec d'autres fichiers de test
    // exécutés en parallèle dans le même worker) ; vi.unstubAllEnvs() restaure exactement
    // ces clés après chaque test.
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASS", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    global.fetch = originalFetch;
  });

  it("refuse d'envoyer sans fournisseur configuré, sans jamais prétendre avoir réussi", async () => {
    const mod = await import("../src/lib/email");

    const result = await mod.sendCampaignEmail({
      to: "client@example.com",
      merchantName: "Café Demo",
      subject: "Offre du mois",
      title: "Offre du mois",
      message: "Profitez de -20% ce week-end.",
      reasonLabel: "Vous recevez cet e-mail car vous avez la carte de ce commerce.",
      unsubscribeUrl: "https://app.example.com/desinscription?token=abc",
      preferencesUrl: "https://app.example.com/compte/parametres",
    });

    expect(result.ok).toBe(false);
  });

  it("envoie via Resend avec le lien de désinscription et la raison de réception dans le corps", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    global.fetch = fetchMock as unknown as typeof fetch;

    const mod = await import("../src/lib/email");
    const result = await mod.sendCampaignEmail({
      to: "client@example.com",
      merchantName: "Café Demo",
      subject: "Offre du mois",
      title: "Offre du mois",
      message: "Profitez de -20% ce week-end.",
      actionLabel: "Voir l'offre",
      actionUrl: "https://fidelite.example.com/c/cafe-demo",
      reasonLabel: "Vous recevez cet e-mail car vous avez la carte de ce commerce.",
      unsubscribeUrl: "https://app.example.com/desinscription?token=abc",
      preferencesUrl: "https://app.example.com/compte/parametres",
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.to).toEqual(["client@example.com"]);
    expect(body.html).toContain("desinscription?token=abc");
    expect(body.html).toContain("Vous recevez cet e-mail car vous avez la carte de ce commerce.");
    expect(body.html).toContain("Café Demo");
    expect(body.text).toContain("Se désinscrire : https://app.example.com/desinscription?token=abc");
  });

  it("échappe le HTML fourni par le commerçant (pas de HTML arbitraire — Partie 7/10)", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    global.fetch = fetchMock as unknown as typeof fetch;

    const mod = await import("../src/lib/email");
    await mod.sendCampaignEmail({
      to: "client@example.com",
      merchantName: "Café <script>alert(1)</script>",
      subject: "Offre",
      title: "<img src=x onerror=alert(1)>",
      message: "Bonjour",
      reasonLabel: "Test",
      unsubscribeUrl: "https://app.example.com/desinscription?token=abc",
      preferencesUrl: "https://app.example.com/compte/parametres",
    });

    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.html).not.toContain("<script>");
    expect(body.html).not.toContain("<img src=x onerror=alert(1)>");
  });
});

describe("validation d'adresse e-mail", () => {
  it("accepte les adresses plausibles et rejette le reste", async () => {
    const { isValidEmailAddress } = await import("../src/lib/email");
    expect(isValidEmailAddress("client@example.com")).toBe(true);
    expect(isValidEmailAddress("pas-un-email")).toBe(false);
    expect(isValidEmailAddress("")).toBe(false);
  });
});
