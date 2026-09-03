"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QrScanner, UsbScannerField } from "@/components/qr-scanner";
import { Button } from "@/components/ui";
import {
  postCaisseScan,
  rememberToken,
  shouldIgnoreInstantDuplicate,
  type TokenMemory,
} from "@/lib/scan-session";

type ScanResult = {
  grantId: string;
  firstName: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  rewardAvailable: boolean;
  progressLabel: string;
};

export function CaisseScreen({
  merchantName,
  role,
  demo = false,
}: {
  merchantName: string;
  role: string;
  demo?: boolean;
}) {
  const [scanning, setScanning] = useState(false);
  const [cameraSession, setCameraSession] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const lastCameraTokenRef = useRef<TokenMemory | null>(null);

  const startScan = useCallback(() => {
    lastCameraTokenRef.current = null;
    setError(null);
    setSuccess(null);
    setResult(null);
    setScanning(true);
    setCameraSession((session) => session + 1);
  }, []);

  const submitToken = useCallback(async (token: string, source: "camera" | "manual") => {
    if (source === "camera" && shouldIgnoreInstantDuplicate(lastCameraTokenRef.current, token)) {
      return;
    }
    if (source === "camera") {
      lastCameraTokenRef.current = rememberToken(token);
    }

    setBusy(true);
    setError(null);
    setScanning(false);

    if (demo) {
      setBusy(false);
      setResult({
        grantId: "demo-grant",
        firstName: "Marie",
        points: 7,
        visitsRequired: 10,
        rewardLabel: "1 boisson offerte",
        rewardAvailable: false,
        progressLabel: "7 / 10 passages",
      });
      return;
    }

    const { ok, data } = await postCaisseScan(token);
    setBusy(false);
    if (!ok) {
      setResult(null);
      setError(typeof data.error === "string" ? data.error : "Scan refusé.");
      return;
    }
    setResult(data as ScanResult);
    setSuccess(null);
  }, [demo]);

  async function act(path: "/api/caisse/earn" | "/api/caisse/redeem") {
    if (!result || busy) return;
    if (demo) {
      setSuccess(
        path.endsWith("earn")
          ? "+1 passage pour Marie. 8 / 10 passages"
          : "Récompense utilisée pour Marie (démo).",
      );
      setResult(null);
      setScanning(false);
      return;
    }
    setBusy(true);
    setError(null);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grantId: result.grantId }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Action impossible.");
      return;
    }
    setSuccess(
      path.endsWith("earn")
        ? `+1 passage pour ${data.firstName}. ${data.snapshot.progressLabel}`
        : `Récompense utilisée pour ${data.firstName}.`,
    );
    setResult(null);
    setScanning(false);
  }

  function resetToIdle() {
    lastCameraTokenRef.current = null;
    setResult(null);
    setError(null);
    setSuccess(null);
    setScanning(false);
  }

  return (
    <div className="obsidian-scene flex h-dvh flex-col text-[var(--body-text)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--stroke)] bg-[rgba(12,10,24,0.92)] px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <h1 className="text-lg font-black uppercase tracking-tight text-[var(--panel-text)]">Caisse</h1>
          <p className="truncate text-xs font-medium text-[var(--muted-text)]">{merchantName}</p>
        </div>
        <div className="flex items-center gap-2">
          {scanning && !result ? (
            <button
              type="button"
              className="rounded-lg border border-[var(--border)] bg-[var(--panel-bg)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--panel-text)]"
              onClick={() => setScanning(false)}
            >
              Annuler le scan
            </button>
          ) : null}
          <Link
            href={role === "MERCHANT_ADMIN" ? "/app" : "/app/caisse"}
            className="rounded-lg border border-[var(--border)] bg-[var(--panel-bg)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-text)]"
          >
            Quitter
          </Link>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-4">
        <AnimatePresence initial={false} mode="wait">
          {success && !result ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="shrink-0 text-center text-sm font-bold text-[var(--positive)]"
            >
              {success}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="wait">
          {!result ? (
            <motion.div
              key="idle"
              className="flex min-h-0 flex-1 flex-col gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            >
              {!scanning ? (
                <div className="glass-panel flex shrink-0 flex-col gap-4 p-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Passage caisse</p>
                    <h2 className="mt-1 text-xl font-black text-[var(--ink)]">Scanner un QR Fife Life</h2>
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">Ou saisissez un code client ci-dessous.</p>
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    className="glass-cta w-full justify-center py-3.5 text-sm font-bold"
                    onClick={startScan}
                    disabled={busy}
                  >
                    Activer la caméra
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  key={`camera-${cameraSession}`}
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
                >
                  <QrScanner
                    key={cameraSession}
                    sessionKey={cameraSession}
                    active={scanning}
                    onResult={(text) => void submitToken(text, "camera")}
                  />
                </motion.div>
              )}

              <UsbScannerField onSubmit={(value) => void submitToken(value, "manual")} disabled={busy} />

              {error ? (
                <motion.p
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                  className="shrink-0 text-center text-sm font-bold text-[var(--danger)]"
                >
                  {error}
                </motion.p>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="flex min-h-0 flex-1 flex-col gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            >
              <motion.div
                layout
                className="metric-card shrink-0 p-4 text-[var(--ink)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      Client
                    </p>
                    <h3 className="text-3xl font-black tracking-tight text-[var(--ink)]">
                      {result.firstName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      Statut
                    </p>
                    <p className="text-xl font-black text-[var(--violet-bright)]">
                      {result.progressLabel}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                className="glass-cta w-full justify-center py-4 text-lg font-black disabled:opacity-50"
                disabled={busy}
                onClick={() => void act("/api/caisse/earn")}
              >
                +1 Passage
              </motion.button>
              {result.rewardAvailable ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="flex w-full items-center justify-center rounded-full bg-[var(--positive)] py-3.5 text-base font-black text-[#0b0714] disabled:opacity-50"
                  disabled={busy}
                  onClick={() => void act("/api/caisse/redeem")}
                >
                  Utiliser : {result.rewardLabel}
                </motion.button>
              ) : null}

              <Button variant="ghost" className="mt-auto shrink-0" onClick={resetToIdle}>
                Annuler et scanner un autre client
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
