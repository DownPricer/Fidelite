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

export async function postCaisseScan(token: string) {
  const response = await fetch(CAISSE_SCAN_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = (await response.json()) as Record<string, unknown>;
  return { ok: response.ok, status: response.status, data };
}

export function readManualToken(raw: string) {
  return raw.trim();
}
