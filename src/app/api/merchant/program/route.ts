import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { syncGoogleWalletMerchant } from "@/lib/google-wallet";
import { programToConfig, validateTiers } from "@/lib/loyalty-program";
import {
  REWARD_LIMIT_MESSAGE,
  assertRewardLimit,
  modeChangeRequiresRewardDecision,
  publishLoyaltyProgram,
  type ModeChangeDecision,
} from "@/lib/loyalty-program-publication";
import { logMerchantCardSwitch } from "@/lib/merchant-card-switch-log";
import { prisma } from "@/lib/prisma";
import { loyaltyDraftSchema, programSimulateSchema, zodErrorMessage } from "@/lib/validation";
import { Prisma, type LoyaltyMode } from "@prisma/client";

async function loadProgram(merchantId: string) {
  return prisma.loyaltyProgram.findUnique({
    where: { merchantId },
    include: { rewards: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function GET(req: Request) {
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const program = await loadProgram(staff.membership.merchantId);
  if (!program) return jsonError("Programme introuvable.", 404);

  const active = programToConfig(program, { activeOnly: false, filterByMode: false });
  const draftRaw = program.draftConfig as { mode?: LoyaltyMode; rules?: Record<string, unknown>; rewards?: unknown[] } | null;
  const draft = draftRaw
    ? {
        mode: draftRaw.mode ?? program.mode,
        rules: { ...active.rules, ...(draftRaw.rules ?? {}) },
        rewards: (draftRaw.rewards as typeof active.rewards) ?? active.rewards,
      }
    : null;

  const [customerCount, totalPoints] = await Promise.all([
    prisma.customerMembership.count({ where: { merchantId: staff.membership.merchantId } }),
    prisma.customerMembership.aggregate({
      where: { merchantId: staff.membership.merchantId },
      _sum: { points: true },
    }),
  ]);

  return jsonOk({
    status: program.status,
    version: program.version,
    publishedAt: program.publishedAt,
    scheduledAt: program.scheduledAt,
    active,
    draft,
    impact: {
      customers: customerCount,
      totalPoints: totalPoints._sum.points ?? 0,
      rewardsUnlocked: active.rewards.filter((r) => r.isActive).length,
    },
  });
}

export async function PUT(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const parsed = loyaltyDraftSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  if (parsed.data.mode === "AMOUNT_TIERS") {
    const tiers = (parsed.data.rules.amountTiers as { minAmount: number; maxAmount: number | null; earnValue: number; id: string }[]) ?? [];
    const err = validateTiers(tiers);
    if (err) return jsonError(err);
  }
  try {
    assertRewardLimit(parsed.data.rewards);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : REWARD_LIMIT_MESSAGE, 400);
  }

  await prisma.loyaltyProgram.update({
    where: { merchantId: staff.membership.merchantId },
    data: {
      draftConfig: {
        mode: parsed.data.mode,
        rules: parsed.data.rules,
        rewards: parsed.data.rewards,
      } as Prisma.InputJsonValue,
      status: "DRAFT",
    },
  });

  return jsonOk({ ok: true, saved: true });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const staff = await requireMerchantAdmin(req);
  if (staff.error || !staff.user || !staff.membership) return staff.error ?? jsonError("Accès refusé.", 403);

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "publish";
  const program = await loadProgram(staff.membership.merchantId);
  if (!program) return jsonError("Programme introuvable.", 404);

  if (action === "simulate") {
    const parsed = programSimulateSchema.safeParse(await readJson(req));
    if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));
    const { simulateProgram } = await import("@/lib/loyalty-program");
    const config = programToConfig(program);
    if (parsed.data.mode) config.mode = parsed.data.mode;
    if (parsed.data.rules) config.rules = { ...config.rules, ...parsed.data.rules };
    if (parsed.data.rewards) {
      config.rewards = parsed.data.rewards.map((r, i) => ({
        id: `sim-${i}`,
        name: r.name,
        threshold: r.threshold,
        thresholdUnit: r.thresholdUnit as "visits" | "points",
        rewardType: "CUSTOM",
        isActive: r.isActive,
        sortOrder: i,
      }));
    }
    return jsonOk(simulateProgram(config, parsed.data));
  }

  const draft = program.draftConfig as {
    mode: LoyaltyMode;
    rules: Record<string, unknown>;
    rewards: Array<{
      id?: string;
      name: string;
      description?: string | null;
      rewardType?: string;
      threshold: number;
      thresholdUnit: string;
      value?: number | null;
      minPurchase?: number | null;
      maxDiscount?: number | null;
      isActive?: boolean;
      sortOrder?: number;
      validFrom?: string | null;
      validUntil?: string | null;
      maxUsesPerCustomer?: number | null;
      reuseDelayDays?: number | null;
      globalLimit?: number | null;
      archivedAt?: string | null;
    }>;
  } | null;

  if (!draft) return jsonError("Aucun brouillon à publier.", 400);

  const merchantId = staff.membership.merchantId;
  const body = await readJson(req).catch(() => ({}));
  const decision = (body as { modeChangeDecision?: ModeChangeDecision }).modeChangeDecision;
  const modeChanged = draft.mode !== program.mode;
  logMerchantCardSwitch("mode sélectionné", { merchantId, mode: draft.mode });
  logMerchantCardSwitch("mode actif en base", { merchantId, mode: program.mode });

  if (modeChangeRequiresRewardDecision(program.mode, draft.mode) && !decision) {
    const [customers, sum] = await Promise.all([
      prisma.customerMembership.count({ where: { merchantId: staff.membership.merchantId, points: { gt: 0 } } }),
      prisma.customerMembership.aggregate({
        where: { merchantId: staff.membership.merchantId },
        _sum: { points: true },
      }),
    ]);
    return jsonOk({
      requiresConfirmation: true,
      requiresRewardDecision: true,
      impact: {
        customersWithBalance: customers,
        totalPoints: sum._sum.points ?? 0,
        previousMode: program.mode,
        newMode: draft.mode,
        message: "Que souhaitez-vous faire des avantages actuels ?",
      },
    });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { id: true, slug: true, name: true },
  });
  const normalizeDraftRewards = (rewards: typeof draft.rewards) =>
    rewards.map((reward) => ({
      ...reward,
      rewardType: reward.rewardType ?? "CUSTOM",
      isActive: reward.isActive ?? true,
      sortOrder: reward.sortOrder ?? 0,
      description: reward.description ?? null,
      value: reward.value ?? null,
      minPurchase: reward.minPurchase ?? null,
      maxDiscount: reward.maxDiscount ?? null,
      validFrom: reward.validFrom ?? null,
      validUntil: reward.validUntil ?? null,
      maxUsesPerCustomer: reward.maxUsesPerCustomer ?? null,
      reuseDelayDays: reward.reuseDelayDays ?? null,
      globalLimit: reward.globalLimit ?? null,
      archivedAt: reward.archivedAt ?? null,
      iconUrl: null,
      conditions: null,
    }));
  const publicationDraft = {
    ...draft,
    rewards: normalizeDraftRewards(draft.rewards),
  };
  const publicationDecision =
    decision?.action === "CONVERT"
      ? { action: "CONVERT" as const, rewards: normalizeDraftRewards(decision.rewards as typeof draft.rewards) }
      : decision;

  let published: Awaited<ReturnType<typeof publishLoyaltyProgram>>;
  try {
    published = await prisma.$transaction((tx) =>
      publishLoyaltyProgram({
        tx,
        program,
        merchant,
        draft: publicationDraft,
        actorId: staff.user!.id,
        decision: publicationDecision,
      }),
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Publication impossible.", 400);
  }

  if (published.requiresRewardDecision) {
    return jsonOk({ requiresConfirmation: true, requiresRewardDecision: true });
  }

  logMerchantCardSwitch(modeChanged ? "mode publié" : "programme publié", {
    merchantId,
    mode: draft.mode,
  });

  const activeProgram = await loadProgram(merchantId);
  if (!activeProgram || activeProgram.mode !== draft.mode) {
    return jsonError("Le mode actif n'a pas été mis à jour en base.", 500);
  }
  logMerchantCardSwitch("mode actif en base", {
    merchantId,
    mode: activeProgram.mode,
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "LOYALTY_PROGRAM_PUBLISH",
    metadata: {
      version: published.version,
      mode: draft.mode,
      modeChanged,
      modeChangeDecision: decision?.action ?? null,
      entitlementsCreated: published.entitlementCount,
    },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  void syncGoogleWalletMerchant({ merchantId, includeObjects: true }).catch((error) =>
    console.error("[google-wallet] sync après publication programme", error instanceof Error ? error.message : error),
  );

  return jsonOk({
    ok: true,
    published: true,
    version: published.version,
    activeMode: activeProgram.mode,
    modeChanged,
    entitlementsCreated: published.entitlementCount,
  });
}
