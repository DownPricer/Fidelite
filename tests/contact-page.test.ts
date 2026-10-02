import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi, beforeEach } from "vitest";

const root = process.cwd();
const readSrc = (path: string) => readFileSync(join(root, path), "utf8");

describe("page /contact (Google Wallet support URL)", () => {
  const page = readSrc("src/app/contact/page.tsx");
  const ui = readSrc("src/app/contact/ui.tsx");
  const sitemap = readSrc("src/app/sitemap.ts");
  const robots = readSrc("src/app/robots.ts");
  const header = readSrc("src/components/landing/landing-header.tsx");
  const footer = readSrc("src/components/landing/landing-footer.tsx");

  it("expose noindex dans les métadonnées", () => {
    expect(page).toContain("robots:");
    expect(page).toMatch(/index:\s*false/);
    expect(page).toMatch(/follow:\s*false/);
    expect(page).toContain("Contacter Fideto");
  });

  it("n'apparaît pas dans le sitemap, le menu ni le pied de page", () => {
    expect(sitemap).not.toContain("/contact");
    expect(header).not.toContain("/contact");
    expect(footer).not.toMatch(/href:\s*"\/contact"/);
  });

  it("n'est pas bloquée dans robots.txt", () => {
    expect(robots).not.toContain("/contact");
    expect(robots).toContain('allow: "/"');
  });

  it("propose le formulaire public et l'API dédiée", () => {
    expect(ui).toContain("/api/public/contact");
    expect(ui).toContain('name="name"');
    expect(ui).toContain('name="message"');
    expect(readSrc("src/app/api/public/contact/route.ts")).toContain("publicContactFormSchema");
    expect(readSrc("src/app/api/public/contact/route.ts")).toContain("LIMITS.publicContact");
  });

  it("n'affiche l'e-mail support que s'il est configuré côté serveur", () => {
    expect(page).toContain("getConfiguredSupportEmail");
    expect(ui).toContain("supportEmail");
    expect(readSrc("src/lib/support-contact.ts")).toContain("SUPPORT_EMAIL");
  });
});

describe("POST /api/public/contact", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("refuse l'envoi si SUPPORT_EMAIL ou le transport SMTP/Resend manque", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        supportEmail: "",
        resendApiKey: "",
        smtpHost: "",
        mailFrom: "",
        customerOrigin: "https://fideto.fr",
      },
    }));
    vi.doMock("@/lib/api-guard", () => ({
      requireMutatingRequest: vi.fn(async () => ({ error: null })),
    }));

    const { POST } = await import("@/app/api/public/contact/route");
    const req = new Request("http://localhost/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({ name: "Lea", email: "lea@example.com", message: "Bonjour, j'ai une question wallet." }),
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it("confirme uniquement après un envoi réussi", async () => {
    vi.doMock("@/lib/env", () => ({
      env: {
        supportEmail: "support@fideto.fr",
        resendApiKey: "re_test",
        smtpHost: "",
        mailFrom: "Fideto <noreply@fideto.fr>",
        customerOrigin: "https://fideto.fr",
      },
    }));
    vi.doMock("@/lib/api-guard", () => ({
      requireMutatingRequest: vi.fn(async () => ({ error: null })),
    }));
    vi.doMock("@/lib/support-contact", () => ({
      supportEmailConfigHint: vi.fn(() => null),
      sendPublicContactEmail: vi.fn(async () => ({ ok: true as const })),
    }));

    const { POST } = await import("@/app/api/public/contact/route");
    const req = new Request("http://localhost/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({
        name: "Lea",
        email: "lea@example.com",
        message: "Question sur Google Wallet.",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok?: boolean; message?: string };
    expect(json.ok).toBe(true);
    expect(json.message).toMatch(/envoyé/i);
  });
});
