import { requireMutatingRequest, requireSuperAdmin } from "@/lib/api-guard";
import { writeAudit } from "@/lib/audit";
import {
  GoogleWalletApiError,
  GoogleWalletConfigError,
  buildGoogleWalletIds,
  isGoogleWalletConfigured,
  publicGoogleWalletError,
  syncGoogleWalletMerchant,
  testGoogleWalletMerchantConfig,
} from "@/lib/google-wallet";
import {
  GOOGLE_WALLET_RECOMMENDED_COLORS,
  googleWalletAppearanceSchema,
  googleWalletHexSchema,
  isReadableGoogleWalletColor,
  mergeGoogleWalletDraftConfig,
  parseGoogleWalletConfig,
  publishGoogleWalletConfig,
  resetGoogleWalletConfig,
} from "@/lib/google-wallet-appearance";
import { clientIp, jsonError, jsonOkPrivate, readJson, userAgent } from "@/lib/http";
import { getUploadsRoot, saveGoogleWalletMerchantMedia } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";
import { stat } from "fs/promises";
import { join, normalize } from "path";
import { z } from "zod";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.enum(["test", "sync", "preview", "resetAppearance"]) }),
  z.object({
    action: z.literal("publishAppearance"),
    appearance: googleWalletAppearanceSchema.optional(),
  }),
  z.object({
    action: z.literal("saveAppearance"),
    appearance: googleWalletAppearanceSchema,
  }),
  z.object({
    action: z.literal("uploadMedia"),
    kind: z.enum(["hero", "logo", "wideLogo"]),
    dataUrl: z.string().min(30).max(7_000_000),
  }),
]);

async function ensureWalletClassRecord(merchantId: string) {
  const ids = buildGoogleWalletIds({ merchantId });
  return prisma.googleWalletClass.upsert({
    where: { googleClassId: ids.merchantClassId! },
    update: { kind: "MERCHANT", merchantId },
    create: {
      kind: "MERCHANT",
      merchantId,
      googleClassId: ids.merchantClassId!,
      configByMode: {},
      syncStatus: "NEVER_SYNCED",
    },
  });
}

async function parseWalletAction(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return schema.safeParse(await readJson(req));
  }
  const form = await req.formData();
  const action = form.get("action");
  if (action !== "uploadMedia") {
    return schema.safeParse({ action });
  }
  const kind = form.get("kind");
  const file = form.get("file");
  if (!(file instanceof File)) {
    return schema.safeParse({ action, kind, dataUrl: "" });
  }
  if (file.size > 5 * 1024 * 1024) {
    return schema.safeParse({ action, kind, dataUrl: "" });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  return schema.safeParse({ action, kind, dataUrl });
}

async function publishedMediaExists(input: { merchantId: string; config: ReturnType<typeof parseGoogleWalletConfig> }) {
  const appearance = input.config.draftAppearance ?? {};
  const urls = [appearance.heroImageUrl, appearance.logoUrl, appearance.wideLogoUrl].filter(Boolean) as string[];
  for (const url of urls) {
    if (!url.startsWith(`/google-wallet/media/merchant/${input.merchantId}/`)) continue;
    const item = (input.config.mediaGallery ?? []).find((entry) => entry.publicUrl === url);
    if (!item || !item.path.startsWith(`google-wallet/merchant/${input.merchantId}/`)) {
      return { ok: false as const, url };
    }
    const root = getUploadsRoot();
    const filepath = normalize(join(root, item.path));
    const allowedRoot = normalize(join(root, "google-wallet", "merchant", input.merchantId));
    if (!filepath.startsWith(allowedRoot)) return { ok: false as const, url };
    try {
      await stat(filepath);
    } catch {
      return { ok: false as const, url };
    }
  }
  return { ok: true as const };
}

function validateAppearanceColor(appearance: { backgroundColor?: string | null }) {
  const color = appearance.backgroundColor;
  if (!color) return null;
  const hex = googleWalletHexSchema.parse(color);
  if (!isReadableGoogleWalletColor(hex)) {
    return "Couleur trop claire : le texte Google Wallet risque d'être illisible.";
  }
  return null;
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const csrf = await requireMutatingRequest(req);
  if (csrf.error) return csrf.error;
  const admin = await requireSuperAdmin(req);
  if (admin.error || !admin.user) return admin.error ?? jsonError("Accès refusé.", 403);
  const { id } = await context.params;
  const parsed = await parseWalletAction(req).catch(() => null);
  if (!parsed) return jsonError("Requête Google Wallet illisible.", 400);
  if (!parsed.success) return jsonError("Action Google Wallet invalide.", 400);

  const merchant = await prisma.merchant.findUnique({
    where: { id },
    include: { program: true },
  });
  if (!merchant) return jsonError("Commerce introuvable.", 404);

  if (parsed.data.action === "preview") {
    const walletClass = await prisma.googleWalletClass.findFirst({
      where: { kind: "MERCHANT", merchantId: id },
      orderBy: { updatedAt: "desc" },
    });
    const config = parseGoogleWalletConfig(walletClass?.configByMode);
    return jsonOkPrivate({
      preview: {
        programName: `Fidélité ${merchant.name}`,
        profile: merchant.program?.mode ?? "GENERAL",
        backgroundColor: config.draftAppearance?.backgroundColor ?? config.publishedAppearance?.backgroundColor ?? merchant.primaryColor,
        appLinkLabel: config.draftAppearance?.appLinkLabel ?? config.publishedAppearance?.appLinkLabel ?? "Voir ma carte",
        heroImageUrl: config.draftAppearance?.heroImageUrl ?? config.publishedAppearance?.heroImageUrl ?? null,
        recommendedColors: GOOGLE_WALLET_RECOMMENDED_COLORS,
        note: "Aperçu approximatif conforme aux contraintes Google Wallet, pas une reproduction pixel parfaite.",
      },
    });
  }

  if (parsed.data.action === "saveAppearance") {
    const colorError = validateAppearanceColor(parsed.data.appearance);
    if (colorError) return jsonError(colorError, 400);
    const walletClass = await ensureWalletClassRecord(id);
    const config = mergeGoogleWalletDraftConfig({
      existing: walletClass.configByMode,
      appearance: parsed.data.appearance,
    });
    const updated = await prisma.googleWalletClass.update({
      where: { id: walletClass.id },
      data: { configByMode: config },
    });
    await writeAudit({
      actorId: admin.user.id,
      merchantId: id,
      action: "GOOGLE_WALLET_APPEARANCE_DRAFT",
      metadata: { appearance: parsed.data.appearance },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });
    return jsonOkPrivate({ ok: true, config: parseGoogleWalletConfig(updated.configByMode) });
  }

  if (parsed.data.action === "uploadMedia") {
    const walletClass = await ensureWalletClassRecord(id);
    const mediaKind = parsed.data.kind;
    try {
      const media = await saveGoogleWalletMerchantMedia({
        merchantId: id,
        kind: mediaKind,
        dataUrl: parsed.data.dataUrl,
      });
      const current = parseGoogleWalletConfig(walletClass.configByMode);
      const gallery = current.mediaGallery ?? [];
      const item = {
        id: media.version,
        kind: mediaKind,
        publicUrl: media.publicUrl,
        path: media.path,
        version: media.version,
        mime: media.mime,
        dimensions: media.dimensions,
        active: true,
        createdAt: new Date().toISOString(),
      };
      const appearanceKey =
        mediaKind === "hero" ? "heroImageUrl" : mediaKind === "logo" ? "logoUrl" : "wideLogoUrl";
      const config = mergeGoogleWalletDraftConfig({
        existing: {
          ...current,
          mediaGallery: [...gallery.map((entry) => ({ ...entry, active: entry.kind === mediaKind ? false : entry.active })), item],
        },
        appearance: { ...(current.draftAppearance ?? {}), [appearanceKey]: media.publicUrl },
      });
      const updated = await prisma.googleWalletClass.update({
        where: { id: walletClass.id },
        data: { configByMode: config },
      });
      return jsonOkPrivate({ ok: true, media: item, config: parseGoogleWalletConfig(updated.configByMode) });
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : "Média Google Wallet invalide.", 400);
    }
  }

  if (parsed.data.action === "resetAppearance") {
    const walletClass = await ensureWalletClassRecord(id);
    const updated = await prisma.googleWalletClass.update({
      where: { id: walletClass.id },
      data: { configByMode: resetGoogleWalletConfig(walletClass.configByMode) },
    });
    return jsonOkPrivate({ ok: true, config: parseGoogleWalletConfig(updated.configByMode) });
  }

  if (!isGoogleWalletConfigured()) return jsonError("Google Wallet non configuré.", 503);

  try {
    if (parsed.data.action === "publishAppearance") {
      const walletClass = await ensureWalletClassRecord(id);
      const colorError = parsed.data.appearance ? validateAppearanceColor(parsed.data.appearance) : null;
      if (colorError) return jsonError(colorError, 400);
      const withDraft = parsed.data.appearance
        ? await prisma.googleWalletClass.update({
            where: { id: walletClass.id },
            data: {
              configByMode: mergeGoogleWalletDraftConfig({
                existing: walletClass.configByMode,
                appearance: parsed.data.appearance,
              }),
            },
          })
        : walletClass;
      const nextConfig = parseGoogleWalletConfig(withDraft.configByMode);
      const mediaCheck = await publishedMediaExists({ merchantId: id, config: nextConfig });
      if (!mediaCheck.ok) {
        return jsonError("Média Google Wallet publié introuvable.", 400, { url: mediaCheck.url });
      }
      await prisma.googleWalletClass.update({
        where: { id: withDraft.id },
        data: { configByMode: publishGoogleWalletConfig(withDraft.configByMode), syncStatus: "PENDING", lastError: null },
      });
    }
    await testGoogleWalletMerchantConfig(id);
    let syncedObjects = 0;
    if (parsed.data.action === "sync" || parsed.data.action === "publishAppearance") {
      syncedObjects = (await syncGoogleWalletMerchant({ merchantId: id, includeObjects: true })).syncedObjects;
    }

    await writeAudit({
      actorId: admin.user.id,
      merchantId: id,
      action: `GOOGLE_WALLET_${parsed.data.action.toUpperCase()}`,
      metadata: { syncedObjects },
      ip: clientIp(req),
      userAgent: userAgent(req),
    });

    return jsonOkPrivate({ ok: true, syncedObjects });
  } catch (error) {
    if (error instanceof GoogleWalletConfigError) {
      return jsonError(publicGoogleWalletError(error), 503);
    }
    if (error instanceof GoogleWalletApiError) {
      return jsonError("Google Wallet est temporairement indisponible.", 502);
    }
    return jsonError("Action Google Wallet impossible.", 502);
  }
}
