import { requireMerchantAdmin, requireMutatingRequest } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { programToConfig, rewardFromDb, validateTiers } from "@/lib/loyalty-program";
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

  const active = programToConfig(program);
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
    }>;
  } | null;

  if (!draft) return jsonError("Aucun brouillon à publier.", 400);

  const body = await readJson(req).catch(() => ({}));
  const confirmImpact = (body as { confirmImpact?: boolean }).confirmImpact;
  const modeChanged = draft.mode !== program.mode;
  if (modeChanged && !confirmImpact) {
    const [customers, sum] = await Promise.all([
      prisma.customerMembership.count({ where: { merchantId: staff.membership.merchantId, points: { gt: 0 } } }),
      prisma.customerMembership.aggregate({
        where: { merchantId: staff.membership.merchantId },
        _sum: { points: true },
      }),
    ]);
    return jsonOk({
      requiresConfirmation: true,
      impact: {
        customersWithBalance: customers,
        totalPoints: sum._sum.points ?? 0,
        previousMode: program.mode,
        newMode: draft.mode,
        message:
          "Changer de mode de fidélité n'efface pas les soldes existants. Confirmez pour publier la nouvelle règle pour les prochaines transactions.",
      },
    });
  }

  const nextVersion = program.version + 1;
  const firstReward = draft.rewards[0];

  await prisma.$transaction(async (tx) => {
    await tx.loyaltyProgram.update({
      where: { id: program.id },
      data: {
        mode: draft.mode,
        config: draft.rules as Prisma.InputJsonValue,
        draftConfig: Prisma.JsonNull,
        status: "ACTIVE",
        version: nextVersion,
        publishedAt: new Date(),
        visitsRequired: firstReward?.threshold ?? program.visitsRequired,
        rewardLabel: firstReward?.name ?? program.rewardLabel,
      },
    });

    await tx.loyaltyReward.deleteMany({ where: { programId: program.id } });
    for (const [i, r] of draft.rewards.entries()) {
      await tx.loyaltyReward.create({
        data: {
          programId: program.id,
          name: r.name,
          description: r.description,
          rewardType: (r.rewardType as "CUSTOM") ?? "CUSTOM",
          threshold: r.threshold,
          thresholdUnit: r.thresholdUnit,
          value: r.value,
          minPurchase: r.minPurchase,
          maxDiscount: r.maxDiscount,
          isActive: r.isActive ?? true,
          sortOrder: r.sortOrder ?? i,
          validFrom: r.validFrom ? new Date(r.validFrom) : null,
          validUntil: r.validUntil ? new Date(r.validUntil) : null,
          maxUsesPerCustomer: r.maxUsesPerCustomer,
          reuseDelayDays: r.reuseDelayDays,
          globalLimit: r.globalLimit,
        },
      });
    }

    const fresh = await tx.loyaltyProgram.findUnique({
      where: { id: program.id },
      include: { rewards: true },
    });

    await tx.loyaltyProgramVersion.create({
      data: {
        programId: program.id,
        version: nextVersion,
        mode: draft.mode,
        config: draft.rules as Prisma.InputJsonValue,
        rewards: (fresh?.rewards.map(rewardFromDb) ?? []) as Prisma.InputJsonValue,
        publishedBy: staff.user!.id,
      },
    });
  });

  await writeAudit({
    actorId: staff.user.id,
    merchantId: staff.membership.merchantId,
    action: "LOYALTY_PROGRAM_PUBLISH",
    metadata: { version: nextVersion, mode: draft.mode },
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, published: true, version: nextVersion });
}
