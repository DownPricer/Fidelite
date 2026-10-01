import type { AdRequestStatus, AdVisualAuthor, AdVisualVersionStatus, Prisma, StaffNotificationAudience } from "@prisma/client";
import { prisma } from "./prisma";

/** Client Prisma ou transaction — seules les méthodes utilisées ici sont requises. */
export type Db = Prisma.TransactionClient | typeof prisma;

export type AdForWorkflow = {
  id: string;
  merchantId: string;
  campaignId: string | null;
  status: AdRequestStatus;
};

const LIVE_LIKE: AdRequestStatus[] = ["SCHEDULED", "LIVE", "SUSPENDED"];

/* ------------------------------ notifications ------------------------------ */

export async function notifyMerchant(
  db: Db,
  ad: AdForWorkflow,
  kind: string,
  message: string,
) {
  await db.staffNotification.create({
    data: {
      audience: "MERCHANT" satisfies StaffNotificationAudience,
      merchantId: ad.merchantId,
      campaignId: ad.campaignId,
      adRequestId: ad.id,
      kind,
      message,
    },
  });
}

export async function notifySuperAdmin(db: Db, ad: AdForWorkflow, kind: string, message: string) {
  await db.staffNotification.create({
    data: {
      audience: "SUPER_ADMIN" satisfies StaffNotificationAudience,
      merchantId: ad.merchantId,
      campaignId: ad.campaignId,
      adRequestId: ad.id,
      kind,
      message,
    },
  });
}

/* --------------------------------- versions --------------------------------- */

async function nextNumber(db: Db, adRequestId: string) {
  const last = await db.adVisualVersion.findFirst({ where: { adRequestId }, orderBy: { number: "desc" }, select: { number: true } });
  return (last?.number ?? 0) + 1;
}

async function supersedePending(db: Db, adRequestId: string) {
  await db.adVisualVersion.updateMany({
    where: { adRequestId, status: { in: ["DRAFT", "SUBMITTED", "PROPOSED"] } },
    data: { status: "SUPERSEDED" satisfies AdVisualVersionStatus },
  });
}

export type VersionFiles = {
  url: string;
  originalUrl: string;
  width: number;
  height: number;
  reframed: boolean;
};

async function createVersion(
  db: Db,
  ad: AdForWorkflow,
  author: AdVisualAuthor,
  status: AdVisualVersionStatus,
  files: VersionFiles,
  actorId: string | null,
) {
  await supersedePending(db, ad.id);
  return db.adVisualVersion.create({
    data: {
      adRequestId: ad.id,
      number: await nextNumber(db, ad.id),
      author,
      status,
      url: files.url,
      originalUrl: files.originalUrl,
      width: files.width,
      height: files.height,
      reframed: files.reframed,
      createdBy: actorId,
    },
  });
}

/** Le commerçant soumet (ou re-soumet) SON bandeau → en attente de la décision de Fideto. */
export async function submitMerchantVersion(db: Db, ad: AdForWorkflow, files: VersionFiles, actorId: string | null, firstSubmission = false) {
  const version = await createVersion(db, ad, "MERCHANT", "SUBMITTED", files, actorId);
  await db.adRequest.update({
    where: { id: ad.id },
    data: { status: "PENDING_REVIEW", rejectionReason: null, requestedImageUrl: files.url },
  });
  if (ad.campaignId) {
    await db.campaign.update({ where: { id: ad.campaignId }, data: { status: "PENDING_REVIEW", rejectionReason: null } });
  }
  await notifySuperAdmin(
    db,
    ad,
    firstSubmission ? "MERCHANT_BANNER_SUBMITTED" : "MERCHANT_BANNER_RESUBMITTED",
    firstSubmission ? "Un commerçant a soumis son bandeau." : "Un commerçant a corrigé et re-soumis son bandeau.",
  );
  return version;
}

/** Super-admin : approuve la version soumise par le commerçant → prête pour le paiement. */
export async function approveSubmittedVersion(db: Db, ad: AdForWorkflow, adminId: string) {
  const version = await db.adVisualVersion.findFirst({
    where: { adRequestId: ad.id, status: "SUBMITTED" },
    orderBy: { number: "desc" },
  });
  if (!version) return null;
  // Réservation atomique : deux validations simultanées (double clic, deux onglets) ne passent jamais
  // toutes les deux — seule la requête qui fait basculer la version de SUBMITTED à APPROVED continue.
  const claimed = await db.adVisualVersion.updateMany({
    where: { id: version.id, status: "SUBMITTED" },
    data: { status: "APPROVED" satisfies AdVisualVersionStatus, decidedBy: adminId, decidedAt: new Date() },
  });
  if (claimed.count !== 1) return null;
  await publishVersionAsFinal(db, ad, version.id, version.url, adminId);
  // Aucun paiement ni diffusion ici : la campagne passe seulement « prête pour le paiement ».
  await db.adRequest.update({
    where: { id: ad.id },
    data: { status: "APPROVED", rejectionReason: null, reviewedBy: adminId, reviewedAt: new Date() },
  });
  await notifyMerchant(db, ad, "VISUAL_APPROVED", "Votre visuel est approuvé.");
  await notifyMerchant(db, ad, "READY_FOR_PAYMENT", "Votre campagne peut passer au paiement.");
  return version;
}

/** Marque une version comme finale (approuvée) : seule opération qui modifie finalImageUrl. */
async function publishVersionAsFinal(db: Db, ad: AdForWorkflow, versionId: string, url: string, deciderId: string | null) {
  await db.adVisualVersion.updateMany({
    where: { adRequestId: ad.id, status: "APPROVED", NOT: { id: versionId } },
    data: { status: "SUPERSEDED" satisfies AdVisualVersionStatus },
  });
  await db.adVisualVersion.update({
    where: { id: versionId },
    data: { status: "APPROVED" satisfies AdVisualVersionStatus, decidedBy: deciderId, decidedAt: new Date() },
  });
  await db.adRequest.update({ where: { id: ad.id }, data: { finalImageUrl: url, finalVersionId: versionId } });
  if (ad.campaignId) await db.campaign.update({ where: { id: ad.campaignId }, data: { imageUrl: url } });
}

/** Super-admin : refuse le VISUEL (pas la campagne) avec un motif → le commerçant corrige. */
export async function refuseVisual(db: Db, ad: AdForWorkflow, adminId: string, reason: string) {
  await db.adVisualVersion.updateMany({
    where: { adRequestId: ad.id, status: "SUBMITTED" },
    data: { status: "CHANGES_REQUESTED" satisfies AdVisualVersionStatus, comment: reason, decidedBy: adminId, decidedAt: new Date() },
  });
  await db.adRequest.update({
    where: { id: ad.id },
    data: { status: "NEEDS_CHANGES", rejectionReason: reason, reviewedBy: adminId, reviewedAt: new Date() },
  });
  if (ad.campaignId) await db.campaign.update({ where: { id: ad.campaignId }, data: { rejectionReason: reason } });
  await notifyMerchant(db, ad, "VISUAL_REFUSED", `Votre visuel est refusé : ${reason}`);
}

/** Super-admin : envoie un bandeau préparé par Fideto comme proposition au commerçant. */
export async function proposeVersion(db: Db, ad: AdForWorkflow, files: VersionFiles, adminId: string) {
  const previousFideto = await db.adVisualVersion.findFirst({ where: { adRequestId: ad.id, author: "FIDETO" }, select: { id: true } });
  const version = await createVersion(db, ad, "FIDETO", "PROPOSED", files, adminId);
  // Campagne déjà payée/diffusée : l'image actuelle reste diffusée tant que le commerçant n'a pas accepté.
  if (!LIVE_LIKE.includes(ad.status)) {
    await db.adRequest.update({ where: { id: ad.id }, data: { status: "AWAITING_MERCHANT", rejectionReason: null } });
    if (ad.campaignId) await db.campaign.update({ where: { id: ad.campaignId }, data: { rejectionReason: null } });
  }
  await notifyMerchant(
    db,
    ad,
    previousFideto ? "NEW_VERSION_PROPOSED" : "BANNER_PROPOSED",
    previousFideto ? "Une nouvelle version de votre bandeau vous est envoyée." : "Fideto vous propose un bandeau.",
  );
  return version;
}

/** Commerçant : accepte la proposition en cours, ou demande une modification (commentaire obligatoire). */
export async function merchantRespond(
  db: Db,
  ad: AdForWorkflow,
  input: { action: "accept" | "request_changes"; comment?: string | null },
  actorId: string,
) {
  const version = await db.adVisualVersion.findFirst({
    where: { adRequestId: ad.id, status: "PROPOSED" },
    orderBy: { number: "desc" },
  });
  if (!version) return null;

  if (input.action === "accept") {
    await publishVersionAsFinal(db, ad, version.id, version.url, actorId);
    if (ad.status === "AWAITING_MERCHANT") {
      await db.adRequest.update({ where: { id: ad.id }, data: { status: "APPROVED", rejectionReason: null, reviewedAt: new Date() } });
      await notifyMerchant(db, ad, "READY_FOR_PAYMENT", "Votre campagne peut passer au paiement.");
    }
    await notifySuperAdmin(db, ad, "MERCHANT_ACCEPTED", "Le commerçant a accepté la proposition de bandeau.");
    return version;
  }

  const comment = (input.comment ?? "").trim();
  await db.adVisualVersion.update({
    where: { id: version.id },
    data: { status: "CHANGES_REQUESTED" satisfies AdVisualVersionStatus, comment, decidedBy: actorId, decidedAt: new Date() },
  });
  if (ad.status === "AWAITING_MERCHANT") {
    await db.adRequest.update({ where: { id: ad.id }, data: { status: "PENDING_REVIEW" } });
  }
  await notifySuperAdmin(db, ad, "MERCHANT_CHANGES_REQUESTED", `Le commerçant demande une modification : ${comment}`);
  return version;
}

/* ------------------------- « qui doit agir maintenant » ------------------------- */

export type NextAction = {
  actor: "MERCHANT" | "FIDETO" | "NONE";
  title: string;
  detail: string;
};

type VersionLite = { number: number; author: AdVisualAuthor; status: AdVisualVersionStatus; comment: string | null };

export function describeNextAction(input: {
  status: AdRequestStatus;
  visualMode: "SELF" | "FIDETO" | null;
  versions: VersionLite[];
  rejectionReason?: string | null;
}): NextAction {
  const latest = [...input.versions].sort((a, b) => b.number - a.number)[0];
  const fidetoMode = input.visualMode !== "SELF";
  const pendingProposal = input.versions.some((v) => v.status === "PROPOSED");
  const lastRequest = [...input.versions].filter((v) => v.status === "CHANGES_REQUESTED").sort((a, b) => b.number - a.number)[0];

  if (pendingProposal && ["SCHEDULED", "LIVE", "SUSPENDED"].includes(input.status)) {
    return {
      actor: "MERCHANT",
      title: "Le commerçant doit répondre",
      detail: "Une nouvelle version est proposée. La version actuelle reste diffusée tant qu'elle n'est pas remplacée.",
    };
  }
  switch (input.status) {
    case "DRAFT":
      return { actor: "MERCHANT", title: "Le commerçant doit soumettre son visuel", detail: "Brouillon non envoyé." };
    case "PENDING_REVIEW":
      if (lastRequest && latest?.status === "CHANGES_REQUESTED" && latest.author === "FIDETO") {
        return { actor: "FIDETO", title: "Fideto doit préparer une nouvelle version", detail: `Modification demandée : ${lastRequest.comment ?? ""}`.trim() };
      }
      return fidetoMode
        ? { actor: "FIDETO", title: "Fideto doit créer le bandeau", detail: "Téléchargez les images sources, créez le bandeau puis importez-le." }
        : { actor: "FIDETO", title: "Fideto doit examiner le bandeau", detail: "Approuvez le bandeau, importez une autre proposition ou refusez-le avec un motif." };
    case "NEEDS_CHANGES":
      return {
        actor: "MERCHANT",
        title: "Le commerçant doit corriger son visuel",
        detail: input.rejectionReason ? `Motif : ${input.rejectionReason}` : "Une correction a été demandée.",
      };
    case "AWAITING_MERCHANT":
      return { actor: "MERCHANT", title: "Le commerçant doit répondre", detail: "Accepter la proposition ou demander une modification." };
    case "APPROVED":
      return { actor: "MERCHANT", title: "Le commerçant doit payer", detail: "Visuel validé : le paiement est la prochaine étape." };
    case "SCHEDULED":
      return { actor: "NONE", title: "Programmée", detail: "Diffusion automatique pendant les créneaux achetés." };
    case "LIVE":
      return { actor: "NONE", title: "En cours de diffusion", detail: "Le bandeau est visible pendant ses créneaux." };
    case "SUSPENDED":
      return { actor: "FIDETO", title: "Suspendue", detail: "Relancez ou arrêtez la mise en avant." };
    case "REJECTED":
      return { actor: "NONE", title: "Campagne refusée", detail: input.rejectionReason ? `Motif : ${input.rejectionReason}` : "Refusée définitivement." };
    default:
      return { actor: "NONE", title: "Terminée", detail: "Aucune action requise." };
  }
}

/** Remplace la liste des sources d'une demande (les fichiers eux-mêmes sont toujours conservés en stockage). */
export async function setAdSources(db: Db, adRequestId: string, sources: { url: string; sizeBytes?: number | null }[]) {
  await db.adRequestImage.deleteMany({ where: { adRequestId } });
  if (sources.length > 0) {
    await db.adRequestImage.createMany({
      data: sources.map((source, position) => ({ adRequestId, url: source.url, position, sizeBytes: source.sizeBytes ?? null })),
    });
  }
}

export type JourneyStage = { label: string; state: "done" | "current" | "todo" };

/** Progression affichée en tête de la fiche super-admin : demande → visuel → accord → paiement → diffusion. */
export function adJourney(input: { status: AdRequestStatus; visualMode: "SELF" | "FIDETO" | null }): JourneyStage[] {
  const labels = [
    "Demande reçue",
    input.visualMode === "SELF" ? "Visuel examiné" : "Visuel préparé",
    "Accord du commerçant",
    "Paiement",
    "Diffusion",
  ];
  // Indice de l'étape courante (1-5) ; 6 = tout est terminé ; 0 = aucune (campagne refusée/annulée).
  const current: Record<AdRequestStatus, number> = {
    DRAFT: 2,
    PENDING_REVIEW: 2,
    NEEDS_CHANGES: 2,
    AWAITING_MERCHANT: 3,
    APPROVED: 4,
    SCHEDULED: 5,
    LIVE: 5,
    SUSPENDED: 5,
    ENDED: 6,
    STOPPED: 6,
    REJECTED: 0,
    CANCELLED: 0,
  };
  const at = current[input.status];
  return labels.map((label, i) => {
    const n = i + 1;
    if (at === 0) return { label, state: n === 1 ? "done" : "todo" };
    return { label, state: n < at ? "done" : n === at ? "current" : "todo" };
  });
}
