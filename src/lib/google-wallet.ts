import { GoogleAuth } from "google-auth-library";
import { SignJWT, importPKCS8 } from "jose";
import { env, isGoogleWalletConfigured } from "./env";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";

type LoyaltyClassInput = {
  merchantId: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
  primaryColor: string;
  rewardLabel: string;
  visitsRequired: number;
};

type LoyaltyObjectInput = {
  membershipId: string;
  classId: string;
  firstName: string;
  points: number;
  visitsRequired: number;
  rewardAvailable: boolean;
  merchantName: string;
};

function privateKeyPem() {
  return env.googleServiceAccountPrivateKey.replace(/\\n/g, "\n");
}

function classIdFor(slug: string) {
  const prefix = env.googleWalletClassPrefix || env.googleWalletIssuerId;
  return `${prefix}.${slug.replace(/[^a-z0-9_-]/gi, "_")}`;
}

function objectIdFor(membershipId: string) {
  return `${env.googleWalletIssuerId}.${membershipId}`;
}

async function walletClient() {
  const auth = new GoogleAuth({
    credentials: {
      client_email: env.googleServiceAccountEmail,
      private_key: privateKeyPem(),
    },
    scopes: [WALLET_SCOPE],
  });
  return auth.getClient();
}

async function walletFetch(path: string, init: RequestInit = {}) {
  const client = await walletClient();
  const token = await client.getAccessToken();
  const accessToken = typeof token === "string" ? token : token?.token;
  if (!accessToken) {
    throw new Error("Impossible d'obtenir un jeton Google Wallet.");
  }
  const response = await fetch(`${WALLET_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok && response.status !== 409) {
    const body = await response.text();
    console.error("[google-wallet]", response.status, body.slice(0, 500));
    throw new Error("Erreur Google Wallet.");
  }
  if (response.status === 204) return null;
  return response.json();
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const n = Number.parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function loyaltyClassBody(input: LoyaltyClassInput) {
  const { r, g, b } = hexToRgb(input.primaryColor);
  return {
    id: classIdFor(input.slug),
    issuerName: input.name,
    programName: `Fidélité ${input.name}`,
    programLogo: input.logoUrl
      ? { sourceUri: { uri: input.logoUrl }, contentDescription: { defaultValue: { language: "fr", value: input.name } } }
      : undefined,
    hexBackgroundColor: input.primaryColor,
    reviewStatus: "UNDER_REVIEW",
    localizedIssuerName: { defaultValue: { language: "fr", value: input.name } },
    rewardsTier: input.rewardLabel,
    rewardsTierLabel: "Récompense",
    hexBackgroundColorRgb: { red: r / 255, green: g / 255, blue: b / 255 },
    countryCode: "FR",
  };
}

function loyaltyObjectBody(input: LoyaltyObjectInput) {
  return {
    id: objectIdFor(input.membershipId),
    classId: input.classId,
    state: "ACTIVE",
    accountId: input.membershipId,
    accountName: input.firstName,
    loyaltyPoints: {
      label: "Passages",
      balance: { int: input.points },
    },
    secondaryLoyaltyPoints: {
      label: "Objectif",
      balance: { int: input.visitsRequired },
    },
    textModulesData: [
      {
        header: "Avantage",
        body: input.rewardAvailable
          ? "Récompense disponible"
          : `${input.points} / ${input.visitsRequired} passages`,
        id: "progress",
      },
    ],
  };
}

export async function ensureLoyaltyClass(input: LoyaltyClassInput) {
  if (!isGoogleWalletConfigured()) return null;
  const id = classIdFor(input.slug);
  try {
    await walletFetch(`/loyaltyClass/${id}`, { method: "GET" });
    await walletFetch(`/loyaltyClass/${id}`, {
      method: "PATCH",
      body: JSON.stringify(loyaltyClassBody(input)),
    });
  } catch {
    await walletFetch("/loyaltyClass", {
      method: "POST",
      body: JSON.stringify(loyaltyClassBody(input)),
    });
  }
  return id;
}

export async function upsertLoyaltyObject(input: LoyaltyObjectInput) {
  if (!isGoogleWalletConfigured()) return null;
  const id = objectIdFor(input.membershipId);
  try {
    await walletFetch(`/loyaltyObject/${id}`, { method: "GET" });
    await walletFetch(`/loyaltyObject/${id}`, {
      method: "PATCH",
      body: JSON.stringify(loyaltyObjectBody(input)),
    });
  } catch {
    await walletFetch("/loyaltyObject", {
      method: "POST",
      body: JSON.stringify(loyaltyObjectBody(input)),
    });
  }
  return id;
}

export async function updateWalletBalance(input: {
  membershipId: string;
  points: number;
  visitsRequired: number;
  rewardAvailable: boolean;
  classId?: string | null;
}) {
  if (!isGoogleWalletConfigured()) return;
  const id = objectIdFor(input.membershipId);
  try {
    await walletFetch(`/loyaltyObject/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        loyaltyPoints: { label: "Passages", balance: { int: input.points } },
        textModulesData: [
          {
            header: "Avantage",
            body: input.rewardAvailable
              ? "Récompense disponible"
              : `${input.points} / ${input.visitsRequired} passages`,
            id: "progress",
          },
        ],
      }),
    });
  } catch (error) {
    console.error("[google-wallet] mise à jour solde", error);
  }
}

export async function createSaveToWalletUrl(input: {
  classId: string;
  objectId: string;
}) {
  if (!isGoogleWalletConfigured()) return null;
  const origins = (env.googleWalletOrigins || env.customerOrigin)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const claims = {
    iss: env.googleServiceAccountEmail,
    aud: "google",
    typ: "savetowallet",
    origins,
    payload: {
      loyaltyClasses: [{ id: input.classId }],
      loyaltyObjects: [{ id: input.objectId }],
    },
  };

  const key = await importPKCS8(privateKeyPem(), "RS256");
  const jwt = await new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .sign(key);

  return `https://pay.google.com/gp/v/save/${jwt}`;
}

export function walletIds(membershipId: string, slug: string) {
  return {
    classId: classIdFor(slug),
    objectId: objectIdFor(membershipId),
  };
}

export { isGoogleWalletConfigured };
