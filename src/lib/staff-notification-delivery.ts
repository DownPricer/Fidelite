import type { StaffNotificationAudience } from "@prisma/client";
import { env } from "./env";
import { isValidEmailAddress, sendCampaignEmail } from "./email";
import { publicAppUrl } from "./hosts";
import { prisma } from "./prisma";
import { sendPushToUser } from "./push";
import { isSuperAdminEmailAllowed } from "./super-admin-session";
import type { Db } from "./ad-visual-workflow";

type DeliveryInput = {
  audience: StaffNotificationAudience;
  kind: string;
  message: string;
  merchantId: string | null;
  campaignId: string | null;
  adRequestId: string | null;
  comment?: string | null;
};

async function claimDispatch(db: Db, dedupeKey: string, channel: string) {
  try {
    await db.staffNotificationDispatch.create({ data: { dedupeKey, channel } });
    return true;
  } catch {
    return false;
  }
}

function campaignHref(campaignId: string | null) {
  return campaignId ? publicAppUrl(`/app/campagnes/${campaignId}`) : publicAppUrl("/app/campagnes");
}

async function merchantAdminContacts(merchantId: string) {
  const rows = await prisma.merchantMembership.findMany({
    where: { merchantId, role: "MERCHANT_ADMIN", isActive: true },
    select: { user: { select: { id: true, email: true, firstName: true } } },
  });
  return rows.map((r) => r.user).filter((u) => u.email && isValidEmailAddress(u.email));
}

async function superAdminContacts() {
  const users = await prisma.user.findMany({
    where: { platformRole: "SUPER_ADMIN", isActive: true },
    select: { id: true, email: true, firstName: true },
  });
  return users.filter((u) => isSuperAdminEmailAllowed(u.email));
}

async function merchantMeta(merchantId: string) {
  return prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { name: true, logoUrl: true, city: true, postalCode: true },
  });
}

/** E-mails / push idempotents pour les événements campagne & visuels (après création StaffNotification). */
export async function deliverStaffNotificationSideEffects(db: Db, input: DeliveryInput) {
  const href = campaignHref(input.campaignId);
  const commentBlock = input.comment?.trim() ? `\n\nCommentaire : ${input.comment.trim()}` : "";

  if (input.audience === "MERCHANT" && input.merchantId) {
    const [merchant, contacts] = await Promise.all([merchantMeta(input.merchantId), merchantAdminContacts(input.merchantId)]);
    if (!merchant || contacts.length === 0) return;

    for (const user of contacts) {
      const pushKey = `merchant:${input.kind}:${input.adRequestId ?? input.campaignId ?? "x"}:${user.id}:push`;
      if (await claimDispatch(db, pushKey, "PUSH")) {
        await sendPushToUser(user.id, {
          title: merchant.name,
          body: `${input.message}${commentBlock}`.slice(0, 240),
          url: href,
        }).catch(() => undefined);
      }

      const emailEvents = new Set([
        "BANNER_PROPOSED",
        "NEW_VERSION_PROPOSED",
        "VISUAL_APPROVED",
        "VISUAL_REFUSED",
        "READY_FOR_PAYMENT",
        "WALLET_VISUAL_PROPOSED",
        "WALLET_VISUAL_APPROVED",
        "WALLET_VISUAL_CHANGES_REQUESTED",
        "CAMPAIGN_PAYMENT_CONFIRMED",
      ]);
      if (!emailEvents.has(input.kind)) continue;

      const emailKey = `merchant:${input.kind}:${input.adRequestId ?? input.campaignId ?? "x"}:${user.email!.toLowerCase()}:email`;
      if (!(await claimDispatch(db, emailKey, "EMAIL"))) continue;

      const subject =
        input.kind === "CAMPAIGN_PAYMENT_CONFIRMED"
          ? "Paiement confirmé — votre campagne Fideto"
          : input.kind.startsWith("WALLET_")
            ? "Visuel Google Wallet — action requise"
            : "Votre campagne Fideto — mise à jour";

      await sendCampaignEmail({
        to: user.email!,
        merchantName: merchant.name,
        merchantLogoUrl: merchant.logoUrl,
        merchantAddress: [merchant.postalCode, merchant.city].filter(Boolean).join(" ") || null,
        subject,
        title: input.message,
        message: `${input.message}${commentBlock}`,
        actionLabel: "Ouvrir la campagne",
        actionUrl: href,
        reasonLabel: "Vous recevez cet e-mail car vous administrez ce commerce sur Fideto.",
        unsubscribeUrl: publicAppUrl("/app/profil"),
        preferencesUrl: publicAppUrl("/app/profil"),
      }).catch(() => undefined);
    }
    return;
  }

  if (input.audience === "SUPER_ADMIN") {
    const contacts = await superAdminContacts();
    const merchant = input.merchantId ? await merchantMeta(input.merchantId) : null;
    for (const user of contacts) {
      const emailKey = `super:${input.kind}:${input.adRequestId ?? input.campaignId ?? "x"}:${user.email.toLowerCase()}:email`;
      if (!(await claimDispatch(db, emailKey, "EMAIL"))) continue;
      await sendCampaignEmail({
        to: user.email,
        merchantName: merchant?.name ?? "Fideto",
        merchantLogoUrl: merchant?.logoUrl ?? null,
        merchantAddress: null,
        subject: "Campagne commerçant — action ou information",
        title: input.message,
        message: `${input.message}${commentBlock}`,
        actionLabel: input.adRequestId ? "Ouvrir la fiche" : "Ouvrir la modération",
        actionUrl: input.adRequestId
          ? `${env.appUrl.replace(/\/$/, "")}/super-admin/campagnes/fiche/${input.adRequestId}`
          : `${env.appUrl.replace(/\/$/, "")}/super-admin/campagnes`,
        reasonLabel: "Vous recevez cet e-mail car vous faites partie de l'équipe Fideto configurée pour la modération.",
        unsubscribeUrl: publicAppUrl("/"),
        preferencesUrl: publicAppUrl("/"),
      }).catch(() => undefined);
    }
  }
}
