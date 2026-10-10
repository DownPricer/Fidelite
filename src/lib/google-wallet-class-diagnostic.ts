import { env, isGoogleWalletConfigured } from "./env";
import { buildGoogleWalletIds, publicGoogleWalletError } from "./google-wallet";
import { prisma } from "./prisma";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";

export type LoyaltyClassDiagnosticRow = {
  googleClassId: string;
  name: string | null;
  type: "global" | "merchant";
  merchantId: string | null;
  reviewStatus: string | null;
  presentInGoogle: boolean;
  associatedObjectCount: number;
  dbSyncStatus: string | null;
  error: string | null;
  submitForReviewRecommended: boolean;
};

async function accessToken() {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    keyFile: env.googleWalletServiceAccountFile,
    scopes: [WALLET_SCOPE],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const value = typeof token === "string" ? token : token?.token;
  if (!value) throw new Error("Jeton OAuth Google Wallet absent.");
  return value;
}

async function fetchLoyaltyClass(token: string, classId: string) {
  const response = await fetch(`${WALLET_API}/loyaltyClass/${encodeURIComponent(classId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return { status: 404 as const, body: null };
  if (!response.ok) {
    const text = (await response.text()).slice(0, 240).replace(/private_key|access_token|client_email/gi, "[redacted]");
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return {
    status: response.status,
    body: (await response.json()) as {
      id?: string;
      programName?: string;
      issuerName?: string;
      reviewStatus?: string;
    },
  };
}

/**
 * Interroge réellement l'API Google pour chaque LoyaltyClass connue en base
 * (+ classe globale configurée). Ne recrée aucune classe et ne soumet pas à révision.
 */
export async function diagnoseGoogleWalletLoyaltyClasses(): Promise<{
  issuerId: string;
  stripeMode: string;
  googleWalletConfigured: boolean;
  classes: LoyaltyClassDiagnosticRow[];
}> {
  const issuerId = env.googleWalletIssuerId || "3388000000023198536";
  const stripeMode = env.stripeMode || "test";
  if (!isGoogleWalletConfigured()) {
    return { issuerId, stripeMode, googleWalletConfigured: false, classes: [] };
  }

  const globalClassId = buildGoogleWalletIds({}).globalClassId;
  const dbClasses = await prisma.googleWalletClass.findMany({
    select: {
      googleClassId: true,
      kind: true,
      merchantId: true,
      syncStatus: true,
      configByMode: true,
      merchant: { select: { name: true } },
      _count: { select: { walletObjects: true } },
    },
    orderBy: [{ kind: "asc" }, { googleClassId: "asc" }],
  });

  const byId = new Map(dbClasses.map((row) => [row.googleClassId, row]));
  if (!byId.has(globalClassId)) {
    byId.set(globalClassId, {
      googleClassId: globalClassId,
      kind: "GLOBAL",
      merchantId: null,
      syncStatus: "NEVER_SYNCED",
      configByMode: {},
      merchant: null,
      _count: { walletObjects: 0 },
    });
  }

  const token = await accessToken();
  const classes: LoyaltyClassDiagnosticRow[] = [];

  for (const row of byId.values()) {
    const type = row.kind === "GLOBAL" ? ("global" as const) : ("merchant" as const);
    const associatedObjectCount =
      row.googleClassId === globalClassId
        ? await prisma.googleWalletObject.count({
            where: { merchantId: null, customerMembershipId: null, googleClassId: globalClassId },
          })
        : row._count.walletObjects;

    try {
      const remote = await fetchLoyaltyClass(token, row.googleClassId);
      if (remote.status === 404 || !remote.body) {
        classes.push({
          googleClassId: row.googleClassId,
          name: row.merchant?.name ?? (type === "global" ? "Fideto" : null),
          type,
          merchantId: row.merchantId,
          reviewStatus: null,
          presentInGoogle: false,
          associatedObjectCount,
          dbSyncStatus: row.syncStatus,
          error: "Classe absente de Google (404).",
          submitForReviewRecommended: false,
        });
        continue;
      }
      const reviewStatus = remote.body.reviewStatus ?? null;
      classes.push({
        googleClassId: remote.body.id ?? row.googleClassId,
        name: remote.body.programName ?? remote.body.issuerName ?? row.merchant?.name ?? null,
        type,
        merchantId: row.merchantId,
        reviewStatus,
        presentInGoogle: true,
        associatedObjectCount,
        dbSyncStatus: row.syncStatus,
        error: null,
        // Soumettre uniquement si Google exige encore une revue (DRAFT / REJECTED).
        submitForReviewRecommended: reviewStatus === "DRAFT" || reviewStatus === "REJECTED",
      });
    } catch (error) {
      classes.push({
        googleClassId: row.googleClassId,
        name: row.merchant?.name ?? (type === "global" ? "Fideto" : null),
        type,
        merchantId: row.merchantId,
        reviewStatus: null,
        presentInGoogle: false,
        associatedObjectCount,
        dbSyncStatus: row.syncStatus,
        error: publicGoogleWalletError(error),
        submitForReviewRecommended: false,
      });
    }
  }

  return { issuerId, stripeMode, googleWalletConfigured: true, classes };
}
