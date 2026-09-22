import { normalizeCustomerNumber } from "./client-number";
import { QrInputError, extractFifeLifeQrToken } from "./qr-input";

export const INSTANT_DUPLICATE_MS = 1_500;

export const SCANNER_STATE = {
  UNKNOWN: 0,
  NOT_STARTED: 1,
  SCANNING: 2,
  PAUSED: 3,
} as const;

export type TokenMemory = {
  text: string;
  at: number;
};

export function shouldIgnoreInstantDuplicate(
  last: TokenMemory | null,
  nextText: string,
  now = Date.now(),
  windowMs = INSTANT_DUPLICATE_MS,
) {
  if (!last) return false;
  return last.text === nextText && now - last.at < windowMs;
}

export function rememberToken(text: string, now = Date.now()): TokenMemory {
  return { text, at: now };
}

export function shouldCallStop(state: number) {
  return state === SCANNER_STATE.SCANNING || state === SCANNER_STATE.PAUSED;
}

export type StoppableScanner = {
  getState: () => number;
  stop: () => Promise<void>;
};

/**
 * N’appelle stop() que si le scanner est réellement en SCANNING/PAUSED.
 * Un scanner arrêté, jamais démarré, ou déjà en cours d’arrêt est ignoré.
 */
export async function safeStopScanner(scanner: StoppableScanner | null) {
  if (!scanner) return;
  try {
    if (!shouldCallStop(scanner.getState())) return;
    await scanner.stop();
  } catch {
    // Déjà arrêté, jamais démarré, ou course critique html5-qrcode.
  }
}

export const CAMERA_START_TIMEOUT_MS = 8_000;

export function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function finalizeCameraStart(input: {
  startPromise: Promise<unknown>;
  scanner: StoppableScanner | null;
  cancelled: () => boolean;
  timeoutMs?: number;
}) {
  try {
    await withTimeout(
      input.startPromise,
      input.timeoutMs ?? CAMERA_START_TIMEOUT_MS,
      "TimeoutError",
    );
  } catch (error) {
    if (input.cancelled()) return { started: false, error: null };
    return { started: false, error };
  }

  if (input.cancelled()) {
    await safeStopScanner(input.scanner);
    return { started: false, error: null };
  }

  return { started: true, error: null };
}

export const CAISSE_SCAN_PATH = "/api/caisse/scan";

export type CaisseScanRequest =
  | { inputType: "QR"; value: string; confirmNewMembership?: boolean }
  | { inputType: "CLIENT_NUMBER"; value: string; confirmNewMembership?: boolean };

export type MembershipConfirmationDetails = {
  firstName: string;
  lastName: string | null;
  merchantName: string;
};

export function isMembershipConfirmationRequired(
  data: Record<string, unknown>,
  status: number,
): MembershipConfirmationDetails | null {
  if (status !== 409 || data.code !== "MEMBERSHIP_CONFIRMATION_REQUIRED") return null;
  return {
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : null,
    merchantName: typeof data.merchantName === "string" ? data.merchantName : "",
  };
}

/** Formate le délai d'attente d'un 429 pour l'affichage ("Patientez 12 s."). */
export function formatRetryAfter(data: Record<string, unknown>): string | null {
  const ms = typeof data.retryAfterMs === "number" ? data.retryAfterMs : null;
  if (ms === null || ms <= 0) return null;
  const seconds = Math.ceil(ms / 1000);
  return `Patientez ${seconds} s.`;
}

export async function postCaisseScan(input: CaisseScanRequest) {
  const response = await fetch(CAISSE_SCAN_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  let data: Record<string, unknown> = {};
  const contentType = response.headers?.get?.("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      data = (await response.json()) as Record<string, unknown>;
    } catch {
      data = { error: "Une erreur est survenue. Réessayez." };
    }
  } else if (!response.ok) {
    data = { error: "Une erreur est survenue. Réessayez." };
  }

  return { ok: response.ok, status: response.status, data };
}

export function resolveCaisseScanError(data: Record<string, unknown>, status: number): string {
  const base =
    typeof data.error === "string" && data.error.trim()
      ? data.error
      : status === 401
        ? "Votre session de caisse a expiré."
        : "Une erreur est survenue. Réessayez.";
  if (status === 429) {
    const retry = formatRetryAfter(data);
    return retry ? `${base} ${retry}` : base;
  }
  return base;
}

export function readManualClientNumber(raw: string) {
  const digits = normalizeCustomerNumber(raw);
  if (digits.length < 4 || digits.length > 8) {
    throw new QrInputError("Numéro client invalide.");
  }
  return digits;
}

export function readManualToken(raw: string) {
  try {
    return extractFifeLifeQrToken(raw);
  } catch (error) {
    if (error instanceof QrInputError) {
      throw error;
    }
    throw new QrInputError("Ce lien n'est pas un QR Fidelo valide.");
  }
}
