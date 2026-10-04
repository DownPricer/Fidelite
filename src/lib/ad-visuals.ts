import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { getUploadsRoot } from "./media-storage";

/**
 * Visuels des mises en avant (bandeau sponsorisé) — stockage PRIVÉ, contrôles serveur et format.
 *
 * Format d'affichage : le composant public SponsoredBanner affiche l'image dans une vignette
 * carrée (h-14 w-14, object-cover) et le recadrage commerçant SELF exporte déjà du 800×800.
 * Le bandeau diffusable est donc un carré 1:1 ; 800×800 est la taille de référence des exports.
 */
export const AD_VISUAL_RATIO = 1;
export const AD_VISUAL_EXPORT_PX = 800;
/** Plus petit côté accepté pour un fichier déjà au bon format (sinon il serait flou une fois affiché en grand). */
export const AD_VISUAL_MIN_PX = 400;
export const AD_VISUAL_MAX_PX = 6000;
export const AD_VISUAL_MAX_BYTES = 10 * 1024 * 1024;
export const AD_SOURCE_MAX_IMAGES = 5;

const EXT_BY_MIME: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
export const MIME_BY_EXT: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };

/** Type réel du fichier d'après ses octets (jamais le type annoncé par le navigateur). */
export function sniffImageMime(buffer: Buffer): "image/png" | "image/jpeg" | "image/webp" | null {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}

function pngSize(b: Buffer) {
  if (b.length < 24) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function jpegSize(b: Buffer) {
  let offset = 2;
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return null;
    const marker = b[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) return { height: b.readUInt16BE(offset + 5), width: b.readUInt16BE(offset + 7) };
    offset += 2 + b.readUInt16BE(offset + 2);
  }
  return null;
}

function webpSize(b: Buffer) {
  if (b.length < 30) return null;
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return {
      width: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
      height: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1,
    };
  }
  return null;
}

export type InspectedImage = {
  mime: "image/png" | "image/jpeg" | "image/webp";
  ext: string;
  width: number;
  height: number;
  bytes: number;
};

/** Vérifie type réel, taille et dimensions. Retourne un message d'erreur lisible en cas de refus. */
export function inspectAdImage(buffer: Buffer): { ok: true; image: InspectedImage } | { ok: false; error: string } {
  if (buffer.length === 0) return { ok: false, error: "Fichier vide." };
  if (buffer.length > AD_VISUAL_MAX_BYTES) return { ok: false, error: "Image trop lourde (10 Mo maximum)." };
  const mime = sniffImageMime(buffer);
  if (!mime) return { ok: false, error: "Format non accepté : utilisez un fichier PNG, JPEG ou WebP." };
  let size: { width: number; height: number } | null = null;
  try {
    size = mime === "image/png" ? pngSize(buffer) : mime === "image/jpeg" ? jpegSize(buffer) : webpSize(buffer);
  } catch {
    size = null;
  }
  if (!size || size.width < 1 || size.height < 1) return { ok: false, error: "Image illisible ou corrompue." };
  if (size.width > AD_VISUAL_MAX_PX || size.height > AD_VISUAL_MAX_PX) {
    return { ok: false, error: `Image trop grande (${AD_VISUAL_MAX_PX} px maximum par côté).` };
  }
  return { ok: true, image: { mime, ext: EXT_BY_MIME[mime], width: size.width, height: size.height, bytes: buffer.length } };
}

/** Le fichier a-t-il exactement le format du bandeau public (carré, assez grand pour l'affichage) ? */
export function isExactBannerFormat(width: number, height: number) {
  return width === height * AD_VISUAL_RATIO && Math.min(width, height) >= AD_VISUAL_MIN_PX;
}

export function decodeDataUrl(dataUrl: string): Buffer | null {
  const match = /^data:[\w/+.-]+;base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl.trim());
  if (!match) return null;
  const buffer = Buffer.from(match[1], "base64");
  return buffer.length > 0 ? buffer : null;
}

/* ------------------------------ stockage privé ------------------------------ */

const URL_PREFIX = "/api/media/visuels/";

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export function adVisualUrl(merchantId: string, filename: string) {
  return `${URL_PREFIX}${merchantId}/${filename}`;
}

export function parseAdVisualUrl(url: string | null | undefined): { merchantId: string; filename: string } | null {
  if (!url) return null;
  const match = /^\/api\/media\/visuels\/([\w-]+)\/([\w.-]+)$/.exec(url);
  return match ? { merchantId: match[1], filename: match[2] } : null;
}

export function isAdVisualUrlOfMerchant(url: string | null | undefined, merchantId: string) {
  return parseAdVisualUrl(url)?.merchantId === merchantId;
}

export function adVisualFilePath(merchantId: string, filename: string) {
  if (!/^[\w-]+$/.test(merchantId) || !/^[\w.-]+$/.test(filename) || filename.includes("..")) {
    throw new Error("Chemin invalide.");
  }
  return join(getUploadsRoot(), "ad-visuals", merchantId, filename);
}

export type AdVisualFileKind = "source" | "banniere" | "original" | "google-wallet-hero";

export async function saveAdVisualFile(merchantId: string, kind: AdVisualFileKind, buffer: Buffer, ext: string) {
  const dir = join(getUploadsRoot(), "ad-visuals", merchantId);
  await mkdir(dir, { recursive: true });
  const filename = `${kind}-${Date.now()}-${randomSuffix()}.${ext}`;
  await writeFile(join(dir, filename), buffer);
  return adVisualUrl(merchantId, filename);
}

export async function readAdVisualFileByUrl(url: string) {
  const parsed = parseAdVisualUrl(url);
  if (!parsed) return null;
  try {
    return await readFile(adVisualFilePath(parsed.merchantId, parsed.filename));
  } catch {
    return null;
  }
}

export async function adVisualFileSize(url: string) {
  const parsed = parseAdVisualUrl(url);
  if (!parsed) return null;
  try {
    return (await stat(adVisualFilePath(parsed.merchantId, parsed.filename))).size;
  } catch {
    return null;
  }
}

export async function deleteAdVisualFileByUrl(url: string) {
  const parsed = parseAdVisualUrl(url);
  if (!parsed) return;
  await unlink(adVisualFilePath(parsed.merchantId, parsed.filename)).catch(() => undefined);
}

/**
 * Vérifie côté serveur qu'une URL de fichier téléversé appartient bien au commerce, existe, a le
 * type réel attendu et — si `requireExactFormat` — le format exact du bandeau public.
 */
export async function validateStagedAdFile(
  url: string,
  merchantId: string,
  opts: { requireExactFormat?: boolean } = {},
): Promise<{ ok: true; image: InspectedImage } | { ok: false; error: string }> {
  if (!isAdVisualUrlOfMerchant(url, merchantId)) return { ok: false, error: "Fichier non autorisé pour ce commerce." };
  const buffer = await readAdVisualFileByUrl(url);
  if (!buffer) return { ok: false, error: "Fichier introuvable : renvoyez-le." };
  const inspected = inspectAdImage(buffer);
  if (!inspected.ok) return inspected;
  if (opts.requireExactFormat && !isExactBannerFormat(inspected.image.width, inspected.image.height)) {
    return {
      ok: false,
      error: `Le bandeau doit être carré (format 1:1, au moins ${AD_VISUAL_MIN_PX} px). Cadrez l'image avant de l'envoyer.`,
    };
  }
  return inspected;
}

/* --------------------------------- archive ZIP --------------------------------- */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** Archive ZIP « stockée » (sans compression : les images sont déjà compressées). */
export function buildZip(files: { name: string; data: Buffer }[]) {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const crc = crc32(file.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // noms en UTF-8
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(file.data.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    locals.push(local, name, file.data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(file.data.length, 20);
    central.writeUInt32LE(file.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + file.data.length;
  }
  const centralBuffer = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuffer.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralBuffer, end]);
}

/** Téléversement (étape intermédiaire) : vérifie le type réel/la taille puis stocke dans l'espace privé du commerce. */
export async function stageAdFile(merchantId: string, dataUrl: string, kind: AdVisualFileKind) {
  if (!/^[\w-]+$/.test(merchantId)) return { ok: false as const, error: "Identifiant commerce invalide." };
  const buffer = decodeDataUrl(dataUrl);
  if (!buffer) return { ok: false as const, error: "Fichier invalide." };
  const inspected = inspectAdImage(buffer);
  if (!inspected.ok) return inspected;
  const { image } = inspected;
  if (kind === "banniere" && !isExactBannerFormat(image.width, image.height)) {
    return {
      ok: false as const,
      error: `Le bandeau doit être carré (format 1:1, au moins ${AD_VISUAL_MIN_PX} px). Cadrez l'image avant de l'envoyer.`,
    };
  }
  if (kind === "google-wallet-hero" && (image.width !== 1032 || image.height !== 812)) {
    return {
      ok: false as const,
      error: "Le visuel Google Wallet doit faire exactement 1032 × 812 px.",
    };
  }
  const url = await saveAdVisualFile(merchantId, kind, buffer, image.ext);
  return { ok: true as const, url, width: image.width, height: image.height, bytes: image.bytes, exact: isExactBannerFormat(image.width, image.height) };
}
