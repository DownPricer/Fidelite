import { describe, expect, it, vi } from "vitest";
import {
  CAISSE_SCAN_PATH,
  INSTANT_DUPLICATE_MS,
  SCANNER_STATE,
  finalizeCameraStart,
  postCaisseScan,
  readManualToken,
  rememberToken,
  safeStopScanner,
  shouldCallStop,
  shouldIgnoreInstantDuplicate,
  withTimeout,
} from "../src/lib/scan-session";

describe("doublons instantanés caméra", () => {
  it("ignore seulement le même jeton issu de la même image", () => {
    const last = rememberToken("same-qr", 1_000);
    expect(shouldIgnoreInstantDuplicate(last, "same-qr", 1_000 + 200)).toBe(true);
    expect(shouldIgnoreInstantDuplicate(last, "same-qr", 1_000 + INSTANT_DUPLICATE_MS + 1)).toBe(false);
    expect(shouldIgnoreInstantDuplicate(last, "other-qr", 1_000 + 200)).toBe(false);
    expect(shouldIgnoreInstantDuplicate(null, "same-qr", 1_000)).toBe(false);
  });
});

describe("cycle de vie caméra", () => {
  it("ne propose stop() que si le scanner est actif", () => {
    expect(shouldCallStop(SCANNER_STATE.NOT_STARTED)).toBe(false);
    expect(shouldCallStop(SCANNER_STATE.UNKNOWN)).toBe(false);
    expect(shouldCallStop(SCANNER_STATE.SCANNING)).toBe(true);
    expect(shouldCallStop(SCANNER_STATE.PAUSED)).toBe(true);
  });

  it("n'appelle jamais stop() sur un scanner déjà arrêté", async () => {
    const stop = vi.fn(async () => {
      throw new Error("Cannot stop, scanner is not running or paused.");
    });
    await expect(
      safeStopScanner({
        getState: () => SCANNER_STATE.NOT_STARTED,
        stop,
      }),
    ).resolves.toBeUndefined();
    expect(stop).not.toHaveBeenCalled();
  });

  it("ouvre / ferme / rouvre dix fois sans exception console", async () => {
    let state = SCANNER_STATE.NOT_STARTED;
    const errors: unknown[] = [];
    const scanner = {
      getState: () => state,
      start: async () => {
        state = SCANNER_STATE.SCANNING;
      },
      stop: async () => {
        if (!shouldCallStop(state)) {
          throw new Error("Cannot stop, scanner is not running or paused.");
        }
        state = SCANNER_STATE.NOT_STARTED;
      },
    };

    for (let i = 0; i < 10; i += 1) {
      let cancelled = false;
      const startPromise = scanner.start();
      const started = await finalizeCameraStart({
        startPromise,
        scanner,
        cancelled: () => cancelled,
      });
      expect(started.started).toBe(true);
      cancelled = true;
      await startPromise.catch((error) => errors.push(error));
      await safeStopScanner(scanner);
      await safeStopScanner(scanner);
    }

    expect(errors).toEqual([]);
    expect(state).toBe(SCANNER_STATE.NOT_STARTED);
  });

  it("n'attend pas indéfiniment un getUserMedia bloqué", async () => {
    await expect(withTimeout(new Promise(() => undefined), 20, "TimeoutError")).rejects.toThrow(
      "TimeoutError",
    );
  });

  it("arrête un démarrage si la session a été annulée", async () => {
    const stop = vi.fn(async () => undefined);
    const scanner = {
      getState: () => SCANNER_STATE.SCANNING,
      stop,
    };
    const result = await finalizeCameraStart({
      startPromise: Promise.resolve(),
      scanner,
      cancelled: () => true,
    });
    expect(result.started).toBe(false);
    expect(stop).toHaveBeenCalledTimes(1);
  });
});

describe("champ manuel et caméra", () => {
  it("utilisent exactement le même endpoint de validation", () => {
    expect(CAISSE_SCAN_PATH).toBe("/api/caisse/scan");
  });

  it("Enter envoie le même jeton que la caméra via postCaisseScan", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ grantId: "grant_manual" }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const cameraToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.camera";
    const typed = `  ${cameraToken}  `;
    const manualToken = readManualToken(typed);
    expect(manualToken).toBe(cameraToken);

    const camera = await postCaisseScan(cameraToken);
    const manual = await postCaisseScan(manualToken);

    expect(camera.data).toEqual(manual.data);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(CAISSE_SCAN_PATH);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(CAISSE_SCAN_PATH);
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(fetchMock.mock.calls[1]?.[1]);

    vi.unstubAllGlobals();
  });
});
