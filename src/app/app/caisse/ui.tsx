"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CashierCheckout, type CashierScanResult } from "@/components/caisse/cashier-checkout";
import { QrScanner, ClientNumberField } from "@/components/qr-scanner";
import { DEMO_CLIENT_NUMBER } from "@/lib/demo-visual";
import { resolvePermissions, type StaffPermissions } from "@/lib/staff-permissions";
import {
  postCaisseScan,
  readManualClientNumber,
  rememberToken,
  shouldIgnoreInstantDuplicate,
  type TokenMemory,
} from "@/lib/scan-session";
import { QrInputError } from "@/lib/qr-input";

type ScanResult = CashierScanResult;

const ADMIN_PERMISSIONS = resolvePermissions({
  role: "MERCHANT_ADMIN",
  staffPreset: "CASHIER",
});

export function CaisseScreen({
  merchantName,
  role,
  demo = false,
  permissions = ADMIN_PERMISSIONS,
}: {
  merchantName: string;
  role: string;
  demo?: boolean;
  permissions?: StaffPermissions;
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
        firstName: "Léa",
        lastName: "Martin",
        customerName: "Léa Martin",
        points: 7,
        visitsRequired: 10,
        rewardLabel: "1 boisson offerte",
        rewardAvailable: false,
        progressLabel: "7 / 10 passages",
        earnPreviewLabel: "Valider un passage",
        nextRewardLabel: "Encore 3 passages avant « 1 boisson offerte »",
      });
      return;
    }

    const { ok, data } = await postCaisseScan({ token });
    setBusy(false);
    if (!ok) {
      setResult(null);
      setError(typeof data.error === "string" ? data.error : "Scan refusé.");
      return;
    }
    setResult(data as ScanResult);
    setSuccess(null);
  }, [demo]);

  const submitClientNumber = useCallback(
    async (raw: string) => {
      let clientNumber: string;
      try {
        clientNumber = readManualClientNumber(raw);
      } catch (err) {
        setError(err instanceof QrInputError ? err.message : "Numéro client invalide.");
        return;
      }

      setBusy(true);
      setError(null);
      setScanning(false);

      if (demo && clientNumber === DEMO_CLIENT_NUMBER) {
        setBusy(false);
        setResult({
          grantId: "demo-grant",
          firstName: "Léa",
          lastName: "Martin",
          customerName: "Léa Martin",
          points: 7,
          visitsRequired: 10,
          rewardLabel: "1 boisson offerte",
          rewardAvailable: false,
          progressLabel: "7 / 10 passages",
          earnPreviewLabel: "Valider un passage",
        });
        return;
      }

      const { ok, data } = await postCaisseScan({ clientNumber });
      setBusy(false);
      if (!ok) {
        setResult(null);
        setError(typeof data.error === "string" ? data.error : "Client introuvable.");
        return;
      }
      setResult(data as ScanResult);
      setSuccess(null);
    },
    [demo],
  );

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

      <div className="merchant-page-shell mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 lg:max-w-7xl lg:px-8 lg:py-6">
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
                    <p className="mt-1 text-sm text-[var(--muted-strong)]">Ou saisissez le numéro client ci-dessous.</p>
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
                  className="flex shrink-0 flex-col gap-3"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <QrScanner
                      key={cameraSession}
                      sessionKey={cameraSession}
                      active={scanning}
                      onResult={(text) => void submitToken(text, "camera")}
                    />
                  </div>
                </motion.div>
              )}

              <div className="shrink-0 space-y-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Entrer le numéro du client</p>
                <ClientNumberField
                  disabled={busy}
                  onSubmit={(value) => void submitClientNumber(value)}
                />
              </div>

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
              className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
            >
              <CashierCheckout result={result} permissions={permissions} demo={demo} onReset={resetToIdle} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
