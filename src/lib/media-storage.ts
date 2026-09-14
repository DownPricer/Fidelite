import { mkdir, stat, unlink, writeFile } from "fs/promises";
import { join, relative, resolve } from "path";
import { env } from "./env";

/**
 * Stockage persistant des médias uploadés (fonds de cartes, logos locaux).
 * En développement : `data/uploads/` à la racine du projet.
 * En production VPS : bind mount hôte /opt/fifelite/data/uploads → UPLOADS_DIR (/var/lib/fifelite/uploads).
 */
export function getUploadsRoot() {
  if (env.uploadsDir) return env.uploadsDir;
  return join(process.cwd(), "data", "uploads");
}

const CARD_BG_MAX_BYTES = 5 * 1024 * 1024;
const CARD_BG_MAX_DIMENSION = 4096;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ParsedImage = {
  mime: string;
  buffer: Buffer;
  ext: string;
};

export function parseImageDataUrl(dataUrl: string, maxBytes = CARD_BG_MAX_BYTES) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  const mime = match[1].toLowerCase();
  if (mime === "image/svg+xml") return null;
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > maxBytes) return null;
  return { mime, buffer, ext: MIME_TO_EXT[mime] ?? "webp" };
}

function readPngDimensions(buffer: Buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function readJpegDimensions(buffer: Buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 9) };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebpDimensions(buffer: Buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X" && buffer.length >= 30) {
    return {
      width: (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1,
      height: (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1,
    };
  }
  return null;
}

export function validateImageDimensions(buffer: Buffer, mime: string) {
  const dims = readImageDimensions(buffer, mime);
  if (!dims || dims.width < 1 || dims.height < 1) return false;
  return dims.width <= CARD_BG_MAX_DIMENSION && dims.height <= CARD_BG_MAX_DIMENSION;
}

export function readImageDimensions(buffer: Buffer, mime: string) {
  if (mime === "image/png") return readPngDimensions(buffer);
  if (mime === "image/jpeg") return readJpegDimensions(buffer);
  if (mime === "image/webp") return readWebpDimensions(buffer);
  return null;
}

function assertExactDimensions(input: { width: number; height: number; expectedWidth: number; expectedHeight: number }) {
  return input.width === input.expectedWidth && input.height === input.expectedHeight;
}

export type GoogleWalletMediaKind = "hero" | "logo" | "wideLogo";
export type GoogleWalletPublicMediaKind = GoogleWalletMediaKind;

export type GoogleWalletPublishedMediaConfig = {
  publishedAppearance?: {
    heroImageUrl?: string | null;
    logoUrl?: string | null;
    wideLogoUrl?: string | null;
  } | null;
};

export function normalizeGoogleWalletMediaKind(kind: string): GoogleWalletMediaKind | null {
  if (kind === "hero" || kind === "logo" || kind === "wideLogo") return kind;
  if (kind === "wide-logo") return "wideLogo";
  return null;
}

function appearanceKeyForGoogleWalletMedia(kind: GoogleWalletMediaKind) {
  return kind === "hero" ? "heroImageUrl" : kind === "logo" ? "logoUrl" : "wideLogoUrl";
}

function publicGoogleWalletMediaUrl(input: { merchantId: string; kind: GoogleWalletMediaKind; version: string }) {
  return `/google-wallet/media/merchant/${input.merchantId}/${input.kind}?v=${input.version}`;
}

export function resolvePublishedGoogleWalletMedia(input: {
  merchantId: string;
  kind: string;
  version: string | null;
  config: GoogleWalletPublishedMediaConfig;
  uploadsRoot?: string;
}) {
  const kind = normalizeGoogleWalletMediaKind(input.kind);
  if (!/^[\w-]+$/.test(input.merchantId)) {
    return { ok: false as const, reason: "commerce absent" as const };
  }
  if (!kind || input.kind === "wide-logo") {
    return { ok: false as const, reason: "mauvais kind" as const };
  }
  if (!input.version || !/^\d{10,16}-[a-z0-9]{8}$/.test(input.version)) {
    return { ok: false as const, reason: "version invalide" as const };
  }

  const publishedUrl = input.config.publishedAppearance?.[appearanceKeyForGoogleWalletMedia(kind)] ?? null;
  const expectedUrl = publicGoogleWalletMediaUrl({
    merchantId: input.merchantId,
    kind,
    version: input.version,
  });
  if (!publishedUrl) {
    return { ok: false as const, reason: "média non publié" as const };
  }
  if (publishedUrl !== expectedUrl) {
    return { ok: false as const, reason: "version différente" as const, publishedUrl, expectedUrl };
  }

  const root = resolve(input.uploadsRoot ?? getUploadsRoot());
  const mediaDir = resolve(root, "google-wallet", "merchant", input.merchantId);
  const filename = `${kind}-${input.version}.png`;
  const filepath = resolve(mediaDir, filename);
  const relativePath = relative(mediaDir, filepath);
  if (relativePath.startsWith("..") || relativePath === "" || relativePath.includes(":")) {
    return { ok: false as const, reason: "traversée de chemin" as const };
  }
  return {
    ok: true as const,
    kind,
    version: input.version,
    publishedUrl,
    mediaDir,
    filename,
    filepath,
    mime: "image/png",
  };
}

export async function assertPublishedGoogleWalletMediaReadable(input: {
  merchantId: string;
  kind: GoogleWalletMediaKind;
  version: string;
  config: GoogleWalletPublishedMediaConfig;
}) {
  const resolved = resolvePublishedGoogleWalletMedia(input);
  if (!resolved.ok) return resolved;
  try {
    await stat(resolved.filepath);
    return resolved;
  } catch {
    return { ok: false as const, reason: "fichier absent" as const, filepath: resolved.filepath };
  }
}

export function validateGoogleWalletMedia(kind: GoogleWalletMediaKind, buffer: Buffer, mime: string) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(mime)) {
    return { ok: false as const, error: "Image invalide (PNG, JPEG ou WebP uniquement)." };
  }
  const dims = readImageDimensions(buffer, mime);
  if (!dims || dims.width < 1 || dims.height < 1 || dims.width > CARD_BG_MAX_DIMENSION || dims.height > CARD_BG_MAX_DIMENSION) {
    return { ok: false as const, error: "Dimensions d'image invalides ou trop grandes (max 4096 px)." };
  }
  if (kind === "hero" && !assertExactDimensions({ ...dims, expectedWidth: 1032, expectedHeight: 812 })) {
    return { ok: false as const, error: "L'image principale doit mesurer exactement 1032 × 812 px." };
  }
  if (kind === "logo" && !assertExactDimensions({ ...dims, expectedWidth: 660, expectedHeight: 660 })) {
    return { ok: false as const, error: "Le logo carré doit mesurer exactement 660 × 660 px." };
  }
  if (kind === "wideLogo" && !assertExactDimensions({ ...dims, expectedWidth: 1280, expectedHeight: 400 })) {
    return { ok: false as const, error: "Le logo large doit mesurer exactement 1280 × 400 px." };
  }
  return { ok: true as const, dimensions: dims };
}

export async function saveGoogleWalletMerchantMedia(input: {
  merchantId: string;
  kind: GoogleWalletMediaKind;
  dataUrl: string;
}) {
  if (!/^[\w-]+$/.test(input.merchantId)) {
    throw new Error("Identifiant commerce invalide.");
  }
  const parsed = parseImageDataUrl(input.dataUrl);
  if (!parsed) throw new Error("Image invalide (PNG, JPEG ou WebP, max 5 Mo).");
  const validation = validateGoogleWalletMedia(input.kind, parsed.buffer, parsed.mime);
  if (!validation.ok) throw new Error(validation.error);

  const version = `${Date.now()}-${randomSuffix()}`;
  const dir = join(getUploadsRoot(), "google-wallet", "merchant", input.merchantId);
  await mkdir(dir, { recursive: true });
  const filename = `${input.kind}-${version}.${parsed.ext}`;
  const filepath = join(dir, filename);
  await writeFile(filepath, parsed.buffer);
  return {
    path: `google-wallet/merchant/${input.merchantId}/${filename}`,
    publicUrl: `/google-wallet/media/merchant/${input.merchantId}/${input.kind}?v=${version}`,
    version,
    mime: parsed.mime,
    dimensions: validation.dimensions,
  };
}

export async function saveCardBackground(merchantId: string, dataUrl: string) {
  if (!/^[\w-]+$/.test(merchantId)) {
    throw new Error("Identifiant commerce invalide.");
  }
  const parsed = parseImageDataUrl(dataUrl);
  if (!parsed) throw new Error("Image invalide (PNG, JPEG ou WebP, max 5 Mo).");
  if (!validateImageDimensions(parsed.buffer, parsed.mime)) {
    throw new Error("Dimensions d'image invalides ou trop grandes (max 4096 px).");
  }

  const dir = join(getUploadsRoot(), "card-backgrounds", merchantId);
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${randomSuffix()}.${parsed.ext}`;
  const filepath = join(dir, filename);
  await writeFile(filepath, parsed.buffer);
  return `/api/media/card-backgrounds/${merchantId}/${filename}`;
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export async function deleteCardBackground(relativePath: string) {
  const match = /\/api\/media\/card-backgrounds\/([^/]+)\/([^/?]+)/.exec(relativePath);
  if (!match) return;
  const filepath = join(getUploadsRoot(), "card-backgrounds", match[1], match[2]);
  await unlink(filepath).catch(() => undefined);
}

export function resolveMediaFilePath(category: string, ...parts: string[]) {
  const root = getUploadsRoot();
  const filepath = join(root, category, ...parts);
  if (!filepath.startsWith(join(root, category))) {
    throw new Error("Chemin invalide.");
  }
  return filepath;
}
