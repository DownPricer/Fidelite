import { readFile } from "fs/promises";
import { createHash } from "crypto";
import { GoogleAuth } from "google-auth-library";
import { SignJWT, importPKCS8 } from "jose";
import type { LoyaltyMode, MerchantCardSlot, Prisma } from "@prisma/client";
import { env, isGoogleWalletConfigured } from "./env";
import { resolveClientNumber } from "./client-number";
import { ensureCustomerQrToken } from "./customer-qr";
import {
  buildCustomerProgramView,
  getActiveMerchantLoyaltyContext,
  progressTargetForBalance,
  type ActiveMerchantLoyaltyContext,
} from "./loyalty-context";
import { loyaltyUnitForMode, progressBalanceLabel } from "./loyalty-labels";
import { signQrToken } from "./qr";
import { prisma } from "./prisma";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";
const SAVE_URL_BASE = "https://pay.google.com/gp/v/save";
const FIFE_LIFE_CARD_URL = "https://fidelite.sitereadyshd.fr/carte";
const GLOBAL_PROGRAM_NAME = "Fife Life";
const GLOBAL_LOGO_PATH = "/google-wallet/fife-life-logo.png";

type ServiceAccountJson = {
  client_email?: string;
  private_key?: string;
};

export class GoogleWalletConfigError extends Error {
  status = 503;
}

export class GoogleWalletApiError extends Error {
  status = 502;
  constructor(
    message: string,
    public googleStatus?: number,
  ) {
    super(message);
  }
}

function assertConfigured() {
  if (!isGoogleWalletConfigured()) {
    throw new GoogleWalletConfigError("Google Wallet non configuré.");
  }
}

function sanitizeGoogleIdPart(value: string) {
  return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 160);
}

function opaqueIdPart(scope: string, value: string) {
  return sanitizeGoogleIdPart(createHash("sha256").update(`${scope}:${value}`).digest("hex").slice(0, 32));
}

export function buildGoogleWalletIds(input: {
  userId?: string;
  merchantId?: string;
  membershipId?: string;
}) {
  const issuer = env.googleWalletIssuerId || "3388000000023198536";
  return {
    globalClassId:
      env.googleWalletGlobalClassId || `${issuer}.fifelife_global`,
    globalObjectId: input.userId
      ? `${issuer}.fifelife_user_${opaqueIdPart("user", input.userId)}`
      : null,
    merchantClassId: input.merchantId
      ? `${issuer}.merchant_${opaqueIdPart("merchant", input.merchantId)}`
      : null,
    merchantObjectId: input.membershipId
      ? `${issuer}.membership_${opaqueIdPart("membership", input.membershipId)}`
      : null,
  };
}

function publicUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("https://")) return pathOrUrl;
  if (pathOrUrl.startsWith("/")) return `${env.googleWalletOrigin.replace(/\/$/, "")}${pathOrUrl}`;
  return null;
}

export function googleWalletLogoUrl() {
  return publicUrl(GLOBAL_LOGO_PATH) ?? `${env.googleWalletOrigin.replace(/\/$/, "")}${GLOBAL_LOGO_PATH}`;
}

function isPublicHttpsImageUrl(value: string | null | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

async function serviceAccount() {
  assertConfigured();
  const raw = await readFile(env.googleWalletServiceAccountFile, "utf8");
  const json = JSON.parse(raw) as ServiceAccountJson;
  if (json.client_email !== env.googleServiceAccountEmail) {
    throw new GoogleWalletConfigError("Compte de service Google Wallet inattendu.");
  }
  if (!json.private_key) {
    throw new GoogleWalletConfigError("Clé privée Google Wallet absente du JSON.");
  }
  return json;
}

async function accessToken() {
  assertConfigured();
  const auth = new GoogleAuth({
    keyFile: env.googleWalletServiceAccountFile,
    scopes: [WALLET_SCOPE],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const value = typeof token === "string" ? token : token?.token;
  if (!value) throw new GoogleWalletApiError("Authentification Google Wallet impossible.");
  return value;
}

async function walletFetch<T>(path: string, init: RequestInit = {}) {
  const token = await accessToken();
  const response = await fetch(`${WALLET_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (response.status === 404) return { status: 404 as const, body: null as T | null };
  if (!response.ok) {
    const body = await response.text();
    const safeMessage = body.slice(0, 240).replace(/private_key|client_email/gi, "[redacted]");
    throw new GoogleWalletApiError(`Google Wallet API ${response.status}: ${safeMessage}`, response.status);
  }
  if (response.status === 204) return { status: response.status, body: null as T | null };
  return { status: response.status, body: (await response.json()) as T };
}

async function upsertGoogleResource<T>(input: {
  kind: "loyaltyClass" | "loyaltyObject";
  id: string;
  body: T;
}) {
  const existing = await walletFetch<T>(`/${input.kind}/${encodeURIComponent(input.id)}`, { method: "GET" });
  if (existing.status === 404) {
    try {
      await walletFetch(`/${input.kind}`, { method: "POST", body: JSON.stringify(input.body) });
    } catch (error) {
      if (error instanceof GoogleWalletApiError && error.googleStatus === 409) {
        await walletFetch(`/${input.kind}/${encodeURIComponent(input.id)}`, {
          method: "PATCH",
          body: JSON.stringify(input.body),
        });
      } else {
        throw error;
      }
    }
    return;
  }
  await walletFetch(`/${input.kind}/${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    body: JSON.stringify(input.body),
  });
}

function textModule(id: string, header: string, body: string | null | undefined) {
  return body ? { id, header, body } : null;
}

function rows(fields: { label: string; value: string | null | undefined }[]) {
  const columns = fields.filter((field) => field.value).map((field) => ({ label: field.label, value: field.value }));
  return columns.length ? [{ columns }] : [];
}

function classProfileForMode(mode: LoyaltyMode | "GENERAL"): MerchantCardSlot {
  if (mode === "VISITS") return "VISITS";
  if (mode === "POINTS_BY_AMOUNT") return "POINTS_BY_AMOUNT";
  if (mode === "FIXED_POINTS") return "FIXED_POINTS";
  if (mode === "AMOUNT_TIERS") return "AMOUNT_TIERS";
  return "GENERAL";
}

function loyaltyPointLabel(mode: LoyaltyMode) {
  return mode === "VISITS" || mode === "AMOUNT_TIERS" ? "Passages" : "Points";
}

function merchantClassBody(input: {
  classId: string;
  merchant: ActiveMerchantLoyaltyContext["merchant"];
  mode: LoyaltyMode;
  rewardLabel: string;
}) {
  const logoUrl = publicUrl(input.merchant.logoUrl) ?? googleWalletLogoUrl();
  return {
    id: input.classId,
    issuerName: input.merchant.name,
    localizedIssuerName: { defaultValue: { language: "fr-FR", value: input.merchant.name } },
    programName: `Fidélité ${input.merchant.name}`,
    localizedProgramName: {
      defaultValue: { language: "fr-FR", value: `Fidélité ${input.merchant.name}` },
    },
    programLogo: isPublicHttpsImageUrl(logoUrl)
      ? {
          sourceUri: { uri: logoUrl },
          contentDescription: { defaultValue: { language: "fr-FR", value: input.merchant.name } },
        }
      : undefined,
    hexBackgroundColor: input.merchant.primaryColor || "#1a1a1a",
    reviewStatus: "UNDER_REVIEW",
    countryCode: "FR",
    rewardsTierLabel: "Prochain avantage",
    rewardsTier: input.rewardLabel,
    multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
  };
}

async function ensureMerchantClass(input: {
  merchantId: string;
  db?: Prisma.TransactionClient | typeof prisma;
}) {
  const db = input.db ?? prisma;
  const context = await getActiveMerchantLoyaltyContext(input.merchantId, db);
  if (!context || !context.isOperational) {
    throw new GoogleWalletConfigError("Programme ou commerce inactif.");
  }
  const ids = buildGoogleWalletIds({ merchantId: input.merchantId });
  const classId = ids.merchantClassId!;
  const profile = classProfileForMode(context.mode);
  const classRecord = await db.googleWalletClass.upsert({
    where: { googleClassId: classId },
    update: {
      kind: "MERCHANT",
      merchantId: input.merchantId,
      activeProfile: profile,
      syncStatus: "PENDING",
      lastError: null,
    },
    create: {
      kind: "MERCHANT",
      merchantId: input.merchantId,
      googleClassId: classId,
      activeProfile: profile,
      syncStatus: "PENDING",
      configByMode: {},
    },
  });

  try {
    await upsertGoogleResource({
      kind: "loyaltyClass",
      id: classId,
      body: merchantClassBody({
        classId,
        merchant: context.merchant,
        mode: context.mode,
        rewardLabel: context.primaryRewardLabel ?? "Avantage",
      }),
    });
    await db.googleWalletClass.update({
      where: { id: classRecord.id },
      data: { syncStatus: "SYNCED", lastSyncedAt: new Date(), lastError: null },
    });
  } catch (error) {
    await db.googleWalletClass.update({
      where: { id: classRecord.id },
      data: { syncStatus: "ERROR", lastError: publicGoogleWalletError(error) },
    });
    throw error;
  }

  return { classId, classRecordId: classRecord.id, context };
}

async function ensureGlobalClassRecord(db: Prisma.TransactionClient | typeof prisma = prisma) {
  const classId = buildGoogleWalletIds({}).globalClassId;
  const existing = await walletFetch(`/loyaltyClass/${encodeURIComponent(classId)}`, { method: "GET" });
  if (existing.status === 404) {
    throw new GoogleWalletConfigError("Classe générale Google Wallet introuvable.");
  }
  return db.googleWalletClass.upsert({
    where: { googleClassId: classId },
    update: { kind: "GLOBAL", syncStatus: "SYNCED", lastSyncedAt: new Date(), lastError: null },
    create: {
      kind: "GLOBAL",
      googleClassId: classId,
      syncStatus: "SYNCED",
      lastSyncedAt: new Date(),
      configByMode: {},
      activeProfile: "GENERAL",
    },
  });
}

async function globalObjectBody(input: {
  user: { id: string; firstName: string; lastName: string | null; clientNumber: string | null; fifeLifePoints: number; isActive: boolean };
  objectId: string;
  qrValue: string;
  activeCardCount: number;
  nextReward: string | null;
}) {
  const displayName = [input.user.firstName, input.user.lastName].filter(Boolean).join(" ") || input.user.firstName;
  const clientNumber = resolveClientNumber({ clientNumber: input.user.clientNumber, userId: input.user.id });
  return {
    id: input.objectId,
    classId: buildGoogleWalletIds({}).globalClassId,
    state: input.user.isActive ? "ACTIVE" : "INACTIVE",
    accountId: clientNumber,
    accountName: displayName,
    barcode: {
      type: "QR_CODE",
      value: input.qrValue,
      alternateText: clientNumber,
    },
    loyaltyPoints: {
      label: "Points Fife Life",
      balance: { int: input.user.fifeLifePoints },
    },
    textModulesData: [
      textModule("cards", "Cartes actives", `${input.activeCardCount}`),
      textModule("next_reward", "Prochaine récompense", input.nextReward ?? "Aucun avantage global disponible"),
    ].filter(Boolean),
    infoModuleData: {
      labelValueRows: rows([
        { label: "Titulaire", value: displayName },
        { label: "Numéro client", value: clientNumber },
      ]),
    },
    linksModuleData: {
      uris: [{ id: "fife_life_wallet", uri: FIFE_LIFE_CARD_URL, description: "Ouvrir ma carte Fife Life" }],
    },
  };
}

function merchantObjectBody(input: {
  membership: {
    id: string;
    points: number;
    user: { id: string; firstName: string; lastName: string | null; clientNumber: string | null; isActive: boolean };
    merchant: { name: string; slug: string; isActive: boolean; status: string };
  };
  classId: string;
  objectId: string;
  qrValue: string;
  context: ActiveMerchantLoyaltyContext;
}) {
  const programView = buildCustomerProgramView(input.context, input.membership.points);
  const displayName =
    [input.membership.user.firstName, input.membership.user.lastName].filter(Boolean).join(" ") ||
    input.membership.user.firstName;
  const clientNumber = resolveClientNumber({
    clientNumber: input.membership.user.clientNumber,
    userId: input.membership.user.id,
  });
  const nextName = programView.upcomingRewardName ?? input.context.primaryRewardLabel ?? "Avantage";
  const remaining =
    programView.upcomingRemaining == null
      ? null
      : `${programView.upcomingRemaining} ${loyaltyUnitForMode(input.context.mode)}`;
  const pointLabel = loyaltyPointLabel(input.context.mode);
  return {
    id: input.objectId,
    classId: input.classId,
    state: input.membership.user.isActive && input.membership.merchant.isActive ? "ACTIVE" : "INACTIVE",
    accountId: clientNumber,
    accountName: displayName,
    barcode: {
      type: "QR_CODE",
      value: input.qrValue,
      alternateText: clientNumber,
    },
    loyaltyPoints: {
      label: pointLabel,
      balance: { int: input.membership.points },
    },
    secondaryLoyaltyPoints: {
      label: "Objectif",
      balance: { int: progressTargetForBalance(input.context.config, input.membership.points) },
    },
    textModulesData: [
      textModule("merchant", "Commerce", input.membership.merchant.name),
      textModule("next_reward", "Prochain avantage", nextName),
      textModule("remaining", "Reste", remaining),
      textModule("progress", "Solde", progressBalanceLabel(input.context.mode, input.membership.points, programView.progressTarget)),
    ].filter(Boolean),
    infoModuleData: {
      labelValueRows: rows([
        { label: "Titulaire", value: displayName },
        { label: "Numéro client", value: clientNumber },
        { label: pointLabel, value: `${input.membership.points}` },
      ]),
    },
    linksModuleData: {
      uris: [
        {
          id: "merchant_card",
          uri: `${env.googleWalletOrigin.replace(/\/$/, "")}/carte/${input.membership.merchant.slug}`,
          description: `Ouvrir la carte ${input.membership.merchant.name}`,
        },
      ],
    },
  };
}

async function customerQrValue(userId: string) {
  const qr = await ensureCustomerQrToken(userId);
  return signQrToken({ jti: qr.jti });
}

async function signSaveJwt(input: { objectId: string }) {
  const credentials = await serviceAccount();
  const origins = (env.googleWalletOrigins || env.googleWalletOrigin)
    .split(",")
    .map((item) => item.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const claims = {
    iss: env.googleServiceAccountEmail,
    aud: "google",
    typ: "savetowallet",
    origins,
    payload: {
      loyaltyObjects: [{ id: input.objectId }],
    },
  };

  const key = await importPKCS8(credentials.private_key!, "RS256");
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .sign(key);
}

async function saveUrlForObject(objectId: string) {
  const jwt = await signSaveJwt({ objectId });
  return `${SAVE_URL_BASE}/${jwt}`;
}

function publicGoogleWalletError(error: unknown) {
  if (error instanceof GoogleWalletConfigError || error instanceof GoogleWalletApiError) {
    return error.message.slice(0, 500);
  }
  if (error instanceof Error) return error.message.slice(0, 500);
  return "Erreur Google Wallet.";
}

async function markObjectError(googleObjectId: string, error: unknown) {
  await prisma.googleWalletObject
    .update({
      where: { googleObjectId },
      data: { syncStatus: "ERROR", needsSync: true, lastError: publicGoogleWalletError(error) },
    })
    .catch(() => undefined);
}

export async function createGlobalGoogleWalletSaveUrl(userId: string) {
  assertConfigured();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      clientNumber: true,
      fifeLifePoints: true,
      isActive: true,
      customerMemberships: { where: { removedAt: null, merchant: { isActive: true } }, select: { id: true } },
    },
  });
  if (!user) throw new GoogleWalletConfigError("Client introuvable.");
  const ids = buildGoogleWalletIds({ userId });
  const classRecord = await ensureGlobalClassRecord();
  const googleObjectId = ids.globalObjectId!;

  await prisma.googleWalletObject.upsert({
    where: { googleObjectId },
    update: {
      userId,
      merchantId: null,
      customerMembershipId: null,
      googleClassId: ids.globalClassId,
      classRecordId: classRecord.id,
      syncStatus: "PENDING",
      needsSync: true,
      lastError: null,
    },
    create: {
      userId,
      googleObjectId,
      googleClassId: ids.globalClassId,
      classRecordId: classRecord.id,
      syncStatus: "PENDING",
      needsSync: true,
    },
  });

  try {
    const qrValue = await customerQrValue(userId);
    await upsertGoogleResource({
      kind: "loyaltyObject",
      id: googleObjectId,
      body: await globalObjectBody({
        user,
        objectId: googleObjectId,
        qrValue,
        activeCardCount: user.customerMemberships.length,
        nextReward: null,
      }),
    });
    await prisma.googleWalletObject.update({
      where: { googleObjectId },
      data: { syncStatus: "SYNCED", needsSync: false, lastSyncedAt: new Date(), lastError: null },
    });
    return { saveUrl: await saveUrlForObject(googleObjectId), objectId: googleObjectId };
  } catch (error) {
    await markObjectError(googleObjectId, error);
    throw error;
  }
}

export async function createMerchantGoogleWalletSaveUrl(input: { userId: string; slug: string }) {
  assertConfigured();
  const membership = await prisma.customerMembership.findFirst({
    where: { userId: input.userId, removedAt: null, merchant: { slug: input.slug, isActive: true } },
    include: { user: true, merchant: true },
  });
  if (!membership) return { forbidden: true as const };
  const { classId, classRecordId, context } = await ensureMerchantClass({ merchantId: membership.merchantId });
  const googleObjectId = buildGoogleWalletIds({ membershipId: membership.id }).merchantObjectId!;

  await prisma.googleWalletObject.upsert({
    where: { googleObjectId },
    update: {
      userId: membership.userId,
      merchantId: membership.merchantId,
      customerMembershipId: membership.id,
      googleClassId: classId,
      classRecordId,
      syncStatus: "PENDING",
      needsSync: true,
      lastError: null,
    },
    create: {
      userId: membership.userId,
      merchantId: membership.merchantId,
      customerMembershipId: membership.id,
      googleObjectId,
      googleClassId: classId,
      classRecordId,
      syncStatus: "PENDING",
      needsSync: true,
    },
  });

  try {
    const qrValue = await customerQrValue(membership.userId);
    await upsertGoogleResource({
      kind: "loyaltyObject",
      id: googleObjectId,
      body: merchantObjectBody({
        membership,
        classId,
        objectId: googleObjectId,
        qrValue,
        context,
      }),
    });
    await prisma.$transaction([
      prisma.googleWalletObject.update({
        where: { googleObjectId },
        data: { syncStatus: "SYNCED", needsSync: false, lastSyncedAt: new Date(), lastError: null },
      }),
      prisma.customerMembership.update({
        where: { id: membership.id },
        data: { googleWalletClassId: classId, googleWalletObjectId: googleObjectId },
      }),
    ]);
    return { saveUrl: await saveUrlForObject(googleObjectId), objectId: googleObjectId };
  } catch (error) {
    await markObjectError(googleObjectId, error);
    throw error;
  }
}

export async function syncGoogleWalletMembershipObject(membershipId: string) {
  if (!isGoogleWalletConfigured()) return;
  const membership = await prisma.customerMembership.findUnique({
    where: { id: membershipId },
    include: { user: true, merchant: true },
  });
  if (!membership || membership.removedAt) return;
  const googleObjectId = buildGoogleWalletIds({ membershipId }).merchantObjectId!;
  await prisma.googleWalletObject.upsert({
    where: { googleObjectId },
    update: { syncStatus: "PENDING", needsSync: true, lastError: null },
    create: {
      userId: membership.userId,
      merchantId: membership.merchantId,
      customerMembershipId: membership.id,
      googleObjectId,
      googleClassId: buildGoogleWalletIds({ merchantId: membership.merchantId }).merchantClassId!,
      syncStatus: "PENDING",
      needsSync: true,
    },
  });
  const { classId, classRecordId, context } = await ensureMerchantClass({ merchantId: membership.merchantId });
  try {
    await upsertGoogleResource({
      kind: "loyaltyObject",
      id: googleObjectId,
      body: merchantObjectBody({
        membership,
        classId,
        objectId: googleObjectId,
        qrValue: await customerQrValue(membership.userId),
        context,
      }),
    });
    await prisma.googleWalletObject.update({
      where: { googleObjectId },
      data: {
        googleClassId: classId,
        classRecordId,
        syncStatus: "SYNCED",
        needsSync: false,
        lastSyncedAt: new Date(),
        lastError: null,
      },
    });
  } catch (error) {
    await markObjectError(googleObjectId, error);
    throw error;
  }
}

export async function updateWalletBalance(input: {
  membershipId: string;
  points?: number;
  visitsRequired?: number;
  rewardAvailable?: boolean;
  classId?: string | null;
}) {
  void input.points;
  void input.visitsRequired;
  void input.rewardAvailable;
  void input.classId;
  if (!isGoogleWalletConfigured()) return;
  await syncGoogleWalletMembershipObject(input.membershipId);
}

export async function retryGoogleWalletObjectSync(objectId: string) {
  const row = await prisma.googleWalletObject.findUnique({ where: { id: objectId } });
  if (!row) throw new GoogleWalletConfigError("Objet Google Wallet introuvable.");
  if (row.customerMembershipId) {
    await syncGoogleWalletMembershipObject(row.customerMembershipId);
    return;
  }
  await createGlobalGoogleWalletSaveUrl(row.userId);
}

export async function testGoogleWalletMerchantConfig(merchantId: string) {
  assertConfigured();
  await ensureMerchantClass({ merchantId });
  return { ok: true };
}

export { isGoogleWalletConfigured, publicGoogleWalletError };
