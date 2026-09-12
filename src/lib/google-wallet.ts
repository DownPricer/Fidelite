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
import { formatUnitCount, loyaltyUnitForMode, progressBalanceLabel } from "./loyalty-labels";
import { signQrToken } from "./qr";
import { prisma } from "./prisma";
import { getCustomerLoyaltyOverview } from "./customer-loyalty-overview";

const WALLET_SCOPE = "https://www.googleapis.com/auth/wallet_object.issuer";
const WALLET_API = "https://walletobjects.googleapis.com/walletobjects/v1";
const SAVE_URL_BASE = "https://pay.google.com/gp/v/save";
const GLOBAL_PROGRAM_NAME = "Fife Life";
const GLOBAL_LOGO_PATH = "/google-wallet/fife-life-logo.png";

type ServiceAccountJson = {
  client_email?: string;
  private_key?: string;
};

type GoogleWalletImage = {
  sourceUri: { uri: string };
  contentDescription: { defaultValue: { language: "fr-FR"; value: string } };
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

export function publicGoogleWalletImageUrl(pathOrUrl: string | null | undefined) {
  const url = publicUrl(pathOrUrl);
  return isPublicHttpsImageUrl(url) ? url : null;
}

function localized(value: string) {
  return { defaultValue: { language: "fr-FR" as const, value } };
}

function imageData(url: string | null | undefined, description: string): GoogleWalletImage | undefined {
  if (!url) return undefined;
  return {
    sourceUri: { uri: url },
    contentDescription: localized(description),
  };
}

function appLinkData(uri: string, label: string) {
  return {
    webAppLinkInfo: {
      appTarget: {
        targetUri: {
          uri,
          description: label,
        },
      },
    },
    displayText: localized(label),
  };
}

function cardUrl(slug?: string | null) {
  const origin = env.googleWalletOrigin.replace(/\/$/, "");
  return slug ? `${origin}/carte/${slug}` : `${origin}/carte`;
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
  return loyaltyUnitForMode(mode) === "passages" ? "Passages" : "Points";
}

function primaryRewardLabel(context: ActiveMerchantLoyaltyContext) {
  return context.primaryRewardLabel ?? "Aucun avantage configuré";
}

function classTemplateInfo() {
  return {
    cardTemplateOverride: {
      cardRowTemplateInfos: [
        {
          twoItems: {
            startItem: { firstValue: { fields: [{ fieldPath: "object.loyaltyPoints" }] } },
            endItem: { firstValue: { fields: [{ fieldPath: "object.secondaryLoyaltyPoints" }] } },
          },
        },
      ],
    },
  };
}

export function globalClassPatchBody(input: { classId: string }) {
  const logo = imageData(googleWalletLogoUrl(), "Logo Fife Life");
  return {
    id: input.classId,
    issuerName: GLOBAL_PROGRAM_NAME,
    localizedIssuerName: localized(GLOBAL_PROGRAM_NAME),
    programName: GLOBAL_PROGRAM_NAME,
    localizedProgramName: localized(GLOBAL_PROGRAM_NAME),
    programLogo: logo,
    wideProgramLogo: logo,
    hexBackgroundColor: "#0B0B12",
    accountNameLabel: "Titulaire",
    localizedAccountNameLabel: localized("Titulaire"),
    accountIdLabel: "N° client",
    localizedAccountIdLabel: localized("N° client"),
    rewardsTierLabel: "Statut",
    localizedRewardsTierLabel: localized("Statut"),
    rewardsTier: "Fife Life",
    localizedRewardsTier: localized("Fife Life"),
    countryCode: "FR",
    reviewStatus: "UNDER_REVIEW",
    multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
    classTemplateInfo: classTemplateInfo(),
    appLinkData: appLinkData(cardUrl(), "Ouvrir mon wallet"),
  };
}

export function merchantClassBody(input: {
  classId: string;
  merchant: ActiveMerchantLoyaltyContext["merchant"];
  mode: LoyaltyMode;
  rewardLabel: string;
  heroImageUrl?: string | null;
}) {
  const logoUrl = publicGoogleWalletImageUrl(input.merchant.logoUrl) ?? googleWalletLogoUrl();
  const heroUrl = publicGoogleWalletImageUrl(input.heroImageUrl);
  return {
    id: input.classId,
    issuerName: input.merchant.name,
    localizedIssuerName: localized(input.merchant.name),
    programName: `Fidélité ${input.merchant.name}`,
    localizedProgramName: localized(`Fidélité ${input.merchant.name}`),
    programLogo: imageData(logoUrl, `Logo ${input.merchant.name}`),
    wideProgramLogo: imageData(logoUrl, `Logo ${input.merchant.name}`),
    heroImage: imageData(heroUrl, `Carte ${input.merchant.name}`),
    hexBackgroundColor: input.merchant.primaryColor || "#1a1a1a",
    reviewStatus: "UNDER_REVIEW",
    countryCode: "FR",
    rewardsTierLabel: "Prochain avantage",
    localizedRewardsTierLabel: localized("Avantage"),
    rewardsTier: input.rewardLabel,
    localizedRewardsTier: localized(input.rewardLabel),
    accountNameLabel: "Titulaire",
    localizedAccountNameLabel: localized("Titulaire"),
    accountIdLabel: "N° client",
    localizedAccountIdLabel: localized("N° client"),
    secondaryRewardsTierLabel: "Programme",
    localizedSecondaryRewardsTierLabel: localized("Programme"),
    secondaryRewardsTier: loyaltyPointLabel(input.mode),
    localizedSecondaryRewardsTier: localized(loyaltyPointLabel(input.mode)),
    multipleDevicesAndHoldersAllowedStatus: "MULTIPLE_HOLDERS",
    classTemplateInfo: classTemplateInfo(),
    appLinkData: appLinkData(cardUrl(input.merchant.slug), "Voir ma carte"),
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
    const body = merchantClassBody({
      classId,
      merchant: context.merchant,
      mode: context.mode,
      rewardLabel: primaryRewardLabel(context),
      heroImageUrl: context.cardTemplateMeta?.backgroundUrl ?? null,
    });
    await upsertGoogleResource({
      kind: "loyaltyClass",
      id: classId,
      body,
    });
    const remote = await walletFetch<Record<string, unknown>>(`/loyaltyClass/${encodeURIComponent(classId)}`, {
      method: "GET",
    });
    await db.googleWalletClass.update({
      where: { id: classRecord.id },
      data: {
        syncStatus: "SYNCED",
        lastSyncedAt: new Date(),
        lastError: null,
        configByMode: {
          activeMode: context.mode,
          activeProfile: profile,
          templateId: context.cardTemplateMeta?.id ?? null,
          templateVersion: context.cardTemplateMeta?.version ?? null,
          templateUsedFallback: context.cardTemplateMeta?.usedFallback ?? false,
          reviewStatus: remote.body?.reviewStatus ?? null,
          heroImageUrl: body.heroImage ? context.cardTemplateMeta?.backgroundUrl ?? null : null,
        },
      },
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
  const remote = (existing.body ?? {}) as Record<string, unknown>;
  await walletFetch(`/loyaltyClass/${encodeURIComponent(classId)}`, {
    method: "PATCH",
    body: JSON.stringify(globalClassPatchBody({ classId })),
  });
  const remoteSnapshot = {
    id: remote.id ?? classId,
    reviewStatus: remote.reviewStatus ?? null,
    programName: remote.programName ?? null,
    issuerName: remote.issuerName ?? null,
    syncedManagedFieldsAt: new Date().toISOString(),
  };
  return db.googleWalletClass.upsert({
    where: { googleClassId: classId },
    update: {
      kind: "GLOBAL",
      syncStatus: "SYNCED",
      lastSyncedAt: new Date(),
      lastError: null,
      configByMode: remoteSnapshot,
    },
    create: {
      kind: "GLOBAL",
      googleClassId: classId,
      syncStatus: "SYNCED",
      lastSyncedAt: new Date(),
      configByMode: remoteSnapshot,
      activeProfile: "GENERAL",
    },
  });
}

export async function globalObjectBody(input: {
  user: { id: string; firstName: string; lastName: string | null; clientNumber: string | null; fifeLifePoints: number; isActive: boolean };
  objectId: string;
  qrValue: string;
  activeCardCount: number;
  nextReward: string | null;
  availableRewardsCount: number | null;
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
      textModule("next_reward", "Prochain avantage", input.nextReward ?? "Aucun avantage global disponible"),
      textModule(
        "available_rewards",
        "Avantages disponibles",
        input.availableRewardsCount == null ? null : `${input.availableRewardsCount}`,
      ),
    ].filter(Boolean),
    appLinkData: appLinkData(cardUrl(), "Ouvrir mon wallet"),
  };
}

function availableRewardModules(input: {
  balance: number;
  context: ActiveMerchantLoyaltyContext;
}) {
  const unit = loyaltyUnitForMode(input.context.mode);
  return input.context.rewards
    .filter((reward) => reward.isActive !== false && input.balance >= reward.threshold)
    .slice(0, 3)
    .map((reward, index) =>
      textModule(
        `available_reward_${index + 1}`,
        index === 0 ? "Avantage disponible" : `Avantage ${index + 1}`,
        `${reward.name} · Présentez votre QR au commerçant`,
      ),
    )
    .filter(Boolean);
}

export function merchantObjectBody(input: {
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
      : `Encore ${formatUnitCount(programView.upcomingRemaining, loyaltyUnitForMode(input.context.mode))}`;
  const pointLabel = loyaltyPointLabel(input.context.mode);
  const availableModules = availableRewardModules({ balance: input.membership.points, context: input.context });
  const hasAvailableReward = availableModules.length > 0;
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
      textModule("program", "Type de fidélité", input.context.programTitle),
      textModule("next_reward", hasAvailableReward ? "À utiliser" : "Prochain avantage", nextName),
      textModule("remaining", "Reste", hasAvailableReward ? "Avantage disponible" : remaining),
      textModule(
        "progress",
        "Solde",
        progressBalanceLabel(input.context.mode, input.membership.points, programView.progressTarget),
      ),
      ...availableModules,
    ].filter(Boolean),
    appLinkData: appLinkData(cardUrl(input.membership.merchant.slug), "Voir ma carte"),
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

async function globalObjectSyncContext(userId: string) {
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
  const overview = await getCustomerLoyaltyOverview({ userId, activityLimit: 1 });
  const nextGlobalReward = overview.cardRewards.find((entry) => entry.cardKey === "global")?.nextReward ?? null;
  const availableRewardsCount = overview.cardRewards.filter((entry) => entry.availableReward).length;
  return { user, nextReward: nextGlobalReward?.rewardName ?? null, availableRewardsCount };
}

async function syncGlobalObjectToGoogle(input: { userId: string; googleObjectId: string }) {
  const { user, nextReward, availableRewardsCount } = await globalObjectSyncContext(input.userId);
  const qrValue = await customerQrValue(input.userId);
  await upsertGoogleResource({
    kind: "loyaltyObject",
    id: input.googleObjectId,
    body: await globalObjectBody({
      user,
      objectId: input.googleObjectId,
      qrValue,
      activeCardCount: user.customerMemberships.length,
      nextReward,
      availableRewardsCount,
    }),
  });
}

export async function createGlobalGoogleWalletSaveUrl(userId: string) {
  assertConfigured();
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
    await syncGlobalObjectToGoogle({ userId, googleObjectId });
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

export async function syncGoogleWalletGlobalObject(userId: string) {
  if (!isGoogleWalletConfigured()) return;
  const row = await prisma.googleWalletObject.findFirst({
    where: { userId, customerMembershipId: null, merchantId: null },
    select: { googleObjectId: true },
  });
  if (!row) return;
  await ensureGlobalClassRecord();
  await prisma.googleWalletObject.update({
    where: { googleObjectId: row.googleObjectId },
    data: { syncStatus: "PENDING", needsSync: true, lastError: null },
  });
  try {
    await syncGlobalObjectToGoogle({ userId, googleObjectId: row.googleObjectId });
    await prisma.googleWalletObject.update({
      where: { googleObjectId: row.googleObjectId },
      data: { syncStatus: "SYNCED", needsSync: false, lastSyncedAt: new Date(), lastError: null },
    });
  } catch (error) {
    await markObjectError(row.googleObjectId, error);
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

export async function syncGoogleWalletMerchant(input: { merchantId: string; includeObjects?: boolean }) {
  if (!isGoogleWalletConfigured()) return { syncedObjects: 0 };
  await ensureMerchantClass({ merchantId: input.merchantId });
  if (!input.includeObjects) return { syncedObjects: 0 };
  const memberships = await prisma.customerMembership.findMany({
    where: { merchantId: input.merchantId, removedAt: null },
    select: { id: true },
  });
  let syncedObjects = 0;
  for (const membership of memberships) {
    try {
      await syncGoogleWalletMembershipObject(membership.id);
      syncedObjects += 1;
    } catch {
      // L'objet conserve son état ERROR ; on continue les autres cartes.
    }
  }
  return { syncedObjects };
}

export async function syncGoogleWalletUserObjects(userId: string) {
  if (!isGoogleWalletConfigured()) return { syncedObjects: 0 };
  const rows = await prisma.googleWalletObject.findMany({
    where: { userId },
    select: { customerMembershipId: true, merchantId: true },
  });
  if (rows.length === 0) return { syncedObjects: 0 };
  let syncedObjects = 0;
  if (rows.some((row) => !row.customerMembershipId && !row.merchantId)) {
    try {
      await syncGoogleWalletGlobalObject(userId);
      syncedObjects += 1;
    } catch {
      // L'objet global conserve son état ERROR ; les cartes commerce restent synchronisables.
    }
  }
  const membershipIds = new Set(rows.map((row) => row.customerMembershipId).filter(Boolean) as string[]);
  for (const membershipId of membershipIds) {
    try {
      await syncGoogleWalletMembershipObject(membershipId);
      syncedObjects += 1;
    } catch {
      // L'objet conserve son état ERROR ; on continue les autres cartes.
    }
  }
  return { syncedObjects };
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
  await syncGoogleWalletGlobalObject(row.userId);
}

export async function testGoogleWalletMerchantConfig(merchantId: string) {
  assertConfigured();
  await ensureMerchantClass({ merchantId });
  return { ok: true };
}

export { isGoogleWalletConfigured, publicGoogleWalletError };
