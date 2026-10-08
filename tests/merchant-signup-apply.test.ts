import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  merchantSignupApplicationFromFormData,
  normalizeMerchantSignupApplicationInput,
  parseMerchantSignupApplication,
} from "../src/lib/merchant-signup-application-input";

const requireMutatingRequest = vi.fn();
const submitMerchantSignupApplication = vi.fn();

vi.mock("@/lib/api-guard", () => ({ requireMutatingRequest }));
vi.mock("@/lib/merchant-signup-mode", () => ({ isMerchantSignupBetaForm: () => true }));
vi.mock("@/lib/rate-limit", () => ({
  LIMITS: { merchantSignupApply: { limit: 5, windowMs: 60_000 } },
  rateLimit: () => ({ ok: true as const, remaining: 1 }),
}));
vi.mock("@/lib/merchant-signup-service", () => ({ submitMerchantSignupApplication }));

const validPayload = {
  planId: "fideto",
  firstName: "Jean",
  lastName: "Dupont",
  businessName: "Boulangerie Dupont",
  businessActivity: "Commerce de proximité",
  email: "jean@example.com",
  mobilePhone: "06 12 34 56 78",
  landlinePhone: "",
  website: "",
  siret: "",
  message: "",
  addressLine1: "1 rue de la Paix",
  postalCode: "75001",
  city: "Paris",
  contactConsent: true,
};

function applyRequest(body: unknown, origin = "https://fideto.fr") {
  return new NextRequest("https://fideto.fr/api/public/merchant-signup/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  requireMutatingRequest.mockResolvedValue({ error: null });
  submitMerchantSignupApplication.mockResolvedValue({
    record: { id: "req_test_1" },
    emailDelivery: { ackSent: true, adminNotified: true },
  });
});

describe("parseMerchantSignupApplication — alignement formulaire / API", () => {
  it("accepte un payload valide (formule fideto, téléphones normalisés)", () => {
    const parsed = parseMerchantSignupApplication(validPayload);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.planId).toBe("fideto");
      expect(parsed.data.mobilePhone).toBe("0612345678");
    }
  });

  it("ignore le placeholder https:// et les champs facultatifs vides", () => {
    const parsed = parseMerchantSignupApplication({
      ...validPayload,
      website: "https://",
      landlinePhone: "   ",
      siret: "  ",
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.website).toBe("");
      expect(parsed.data.landlinePhone).toBe("");
      expect(parsed.data.siret).toBe("");
    }
  });

  it("refuse le consentement manquant avec fieldErrors.contactConsent", () => {
    const parsed = parseMerchantSignupApplication({ ...validPayload, contactConsent: false });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.contactConsent).toContain("consentement");
      expect(parsed.message).toContain("incorrectes");
    }
  });

  it("refuse les valeurs null (comme un JSON mal formé depuis le navigateur)", () => {
    const parsed = parseMerchantSignupApplication({
      ...validPayload,
      firstName: null,
      mobilePhone: null,
    });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.firstName).toBeTruthy();
      expect(parsed.fieldErrors.mobilePhone).toBeTruthy();
    }
  });

  it("construit le même objet depuis FormData", () => {
    const fd = new FormData();
    fd.set("firstName", "Jean");
    fd.set("lastName", "Dupont");
    fd.set("businessName", "Boulangerie");
    fd.set("businessActivity", "Autre");
    fd.set("email", "jean@example.com");
    fd.set("mobilePhone", "0612345678");
    fd.set("addressLine1", "1 rue Test");
    fd.set("postalCode", "75001");
    fd.set("city", "Paris");
    fd.set("contactConsent", "on");
    const fromForm = merchantSignupApplicationFromFormData(fd, "fideto");
    const fromJson = normalizeMerchantSignupApplicationInput(validPayload);
    expect(fromForm.email).toBe(fromJson.email);
    expect(parseMerchantSignupApplication(fromForm).ok).toBe(true);
  });
});

describe("POST /api/public/merchant-signup/apply", () => {
  it("enregistre une demande valide et prépare les deux e-mails", async () => {
    const { POST } = await import("../src/app/api/public/merchant-signup/apply/route");
    const response = await POST(applyRequest(validPayload));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.requestId).toBe("req_test_1");
    expect(submitMerchantSignupApplication).toHaveBeenCalledTimes(1);
  });

  it("renvoie 400 avec message général et fieldErrors (pas un faux succès)", async () => {
    const { POST } = await import("../src/app/api/public/merchant-signup/apply/route");
    const response = await POST(applyRequest({ ...validPayload, contactConsent: false }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("incorrectes");
    expect(body.fieldErrors?.contactConsent).toBeTruthy();
    expect(submitMerchantSignupApplication).not.toHaveBeenCalled();
  });

  it("ne transforme pas un échec SMTP en 400 après enregistrement", async () => {
    submitMerchantSignupApplication.mockResolvedValueOnce({
      record: { id: "req_email_fail" },
      emailDelivery: { ackSent: false, adminNotified: true },
    });
    const { POST } = await import("../src/app/api/public/merchant-signup/apply/route");
    const response = await POST(applyRequest(validPayload));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.emailWarning).toBeTruthy();
  });
});

describe("liens cross-domaine commerçant", () => {
  it("demarrer et tarifs pointent vers app.fideto.fr en absolu", () => {
    const demarrer = readSrc("src/app/demarrer/page.tsx");
    const tarifs = readSrc("src/app/tarifs/page.tsx");
    const ui = readSrc("src/app/demarrer/ui.tsx");
    expect(demarrer).toContain('publicAppUrl("/app/connexion")');
    expect(tarifs).toContain('publicAppUrl("/app/connexion")');
    expect(ui).toContain("merchantSignupApplicationFromFormData");
    expect(ui).toContain("submitLock");
    expect(demarrer).not.toContain('href="/app/connexion"');
  });

  it("verify-code renvoie une nextUrl absolue app", async () => {
    const verifyCode = readSrc("src/app/api/public/merchant-signup/verify-code/route.ts");
    expect(verifyCode).toContain('publicAppUrl("/app/compte-commercant")');
  });
});

describe("public/sw.js — respondWith toujours une Response", () => {
  const source = readSrc("public/sw.js");

  it("versionne le cache et garantit Response.error en repli", () => {
    expect(source).toContain("fifelite-v3");
    expect(source).toContain("Response.error()");
    expect(source).toContain("/demarrer");
  });

  it("n'intercepte pas /api ni _rsc", () => {
    expect(source).toContain('url.pathname.startsWith("/api/")');
    expect(source).toContain('url.searchParams.has("_rsc")');
  });
});

function readSrc(relativePath: string) {
  const { readFileSync } = require("fs") as typeof import("fs");
  const { join } = require("path") as typeof import("path");
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}
