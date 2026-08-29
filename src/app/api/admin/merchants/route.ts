import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import { clientIp, jsonError, jsonOk, readJson, userAgent } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { createMerchantSchema, zodErrorMessage } from "@/lib/validation";

export async function GET(req: Request) {
  const admin = await requireSuperAdmin(req);
  if (admin.error) return admin.error;

  const merchants = await prisma.merchant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      program: true,
      _count: {
        select: {
          customerMemberships: true,
          memberships: true,
        },
      },
    },
  });

  return jsonOk({
    merchants: merchants.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      logoUrl: item.logoUrl,
      primaryColor: item.primaryColor,
      isActive: item.isActive,
      visitsRequired: item.program?.visitsRequired,
      rewardLabel: item.program?.rewardLabel,
      customers: item._count.customerMemberships,
      staff: item._count.memberships,
    })),
  });
}

export async function POST(req: Request) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);

  const parsed = createMerchantSchema.safeParse(await readJson(req));
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const exists = await prisma.merchant.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return jsonError("Ce slug est déjà utilisé.", 409);

  const emailTaken = await prisma.user.findUnique({ where: { email: parsed.data.adminEmail } });
  if (emailTaken) return jsonError("Impossible de créer ce commerce.", 409);

  const merchant = await prisma.$transaction(async (tx) => {
    const created = await tx.merchant.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        logoUrl: parsed.data.logoUrl || null,
        primaryColor: parsed.data.primaryColor ?? "#0F766E",
        program: {
          create: {
            visitsRequired: parsed.data.visitsRequired,
            rewardLabel: parsed.data.rewardLabel,
          },
        },
      },
    });
    const adminUser = await tx.user.create({
      data: {
        email: parsed.data.adminEmail,
        passwordHash: await hashPassword(parsed.data.adminPassword),
        firstName: parsed.data.adminFirstName,
        privacyConsentAt: new Date(),
        mustChangePassword: true,
      },
    });
    await tx.merchantMembership.create({
      data: {
        userId: adminUser.id,
        merchantId: created.id,
        role: "MERCHANT_ADMIN",
      },
    });
    return created;
  });

  await writeAudit({
    actorId: admin.user.id,
    merchantId: merchant.id,
    action: "MERCHANT_CREATE",
    ip: clientIp(req),
    userAgent: userAgent(req),
  });

  return jsonOk({ ok: true, id: merchant.id }, 201);
}
