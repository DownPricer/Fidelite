"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QrScanner } from "@/components/qr-scanner";
import { Button } from "@/components/ui";
import {
  postCaisseScan,
  readManualToken,
  rememberToken,
  shouldIgnoreInstantDuplicate,
  type TokenMemory,
} from "@/lib/scan-session";
import type { StaffPermissions } from "@/lib/staff-permissions";
import { QrInputError } from "@/lib/qr-input";

type ScanResult = {
  grantId: string;
  firstName: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  rewardAvailable: boolean;
  progressLabel: string;
};

type EmployeeProfile = {
  firstName: string;
  merchantName: string;
  merchantLogoUrl?: string | null;
  permissions: StaffPermissions;
};

export function EmployeeScanScreen({
  profile,
  demo = false,
  initialView = "scan" as "scan" | "paste" | "result" | "error",
  initialError = "Ce lien n'est pas un QR Fife Life valide.",
}: {
  profile: EmployeeProfile;
  demo?: boolean;
  initialView?: "scan" | "paste" | "result" | "error";
  initialError?: string;
}) {
  const [scanning, setScanning] = useState(initialView === "scan");
  const [cameraSession, setCameraSession] = useState(0);
  const [pasteOpen, setPasteOpen] = useState(initialView === "paste");
  const [pasteValue, setPasteValue] = useState(initialView === "paste" ? "https://evil.example/not-a-qr" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialView === "error" ? initialError : null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(
    initialView === "result"
      ? {
          grantId: "demo-grant",
          firstName: "Léa",
          points: 7,
          visitsRequired: 10,
          rewardLabel: "1 boisson offerte",
          rewardAvailable: true,
          progressLabel: "7 / 10 passages",
        }
      : null,
  );
  const lastCameraTokenRef = useRef<TokenMemory | null>(null);

  const resetScanner = useCallback(() => {
    lastCameraTokenRef.current = null;
    setResult(null);
    setError(null);
    setSuccess(null);
    setPasteOpen(false);
    setPasteValue("");
    setScanning(true);
    setCameraSession((session) => session + 1);
  }, []);

  const submitToken = useCallback(
    async (raw: string, source: "camera" | "manual") => {
      let token: string;
      try {
        token = readManualToken(raw);
      } catch (err) {
        setError(err instanceof QrInputError ? err.message : "QR invalide.");
        return;
      }

      if (source === "camera" && shouldIgnoreInstantDuplicate(lastCameraTokenRef.current, token)) {
        return;
      }
      if (source === "camera") {
        lastCameraTokenRef.current = rememberToken(token);
      }

      setBusy(true);
      setError(null);
      setScanning(false);
      setPasteOpen(false);

      if (demo) {
        setBusy(false);
        setResult({
          grantId: "demo-grant",
          firstName: "Léa",
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
    },
    [demo],
  );

  async function act(path: "/api/caisse/earn" | "/api/caisse/redeem") {
    if (!result || busy) return;
    if (demo) {
      setSuccess(
        path.endsWith("earn")
          ? "+1 passage pour Marie. 8 / 10 passages"
          : "Récompense utilisée pour Marie.",
      );
      setResult(null);
      setTimeout(resetScanner, 1200);
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
        ? `+1 passage pour ${data.firstName}. ${data.snapshot?.progressLabel ?? ""}`
        : `Récompense utilisée pour ${data.firstName}.`,
    );
    setResult(null);
    setTimeout(resetScanner, 1400);
  }

  async function logout() {
    if (demo) {
      window.location.href = "/employe/exit-demo";
      return;
    }
    await fetch("/api/employe/auth/logout", { method: "POST" });
    window.location.href = "/employe/connexion";
  }

  useEffect(() => {
    if (success) {
      const timer = window.setTimeout(() => setSuccess(null), 2400);
      return () => window.clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="obsidian-scene flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--stroke)] bg-[rgba(12,10,24,0.92)] px-4 py-3 backdrop-blur-md">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[var(--panel-text)]">{profile.merchantName}</p>
          <p className="text-xs text-[var(--muted-text)]">{profile.firstName}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-text)] hover:text-[var(--panel-text)]"
        >
          Déconnexion
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="result"
              className="flex min-h-0 flex-1 flex-col gap-3"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="metric-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Client</p>
                <h2 className="text-3xl font-black text-[var(--ink)]">{result.firstName}</h2>
                <p className="mt-2 text-lg font-bold text-[var(--violet-bright)]">{result.progressLabel}</p>
                {result.rewardAvailable ? (
                  <p className="mt-1 text-sm text-[var(--positive)]">Récompense disponible : {result.rewardLabel}</p>
                ) : null}
              </div>

              {profile.permissions.addPoints ? (
                <button
                  type="button"
                  className="glass-cta w-full justify-center py-4 text-lg font-black disabled:opacity-50"
                  disabled={busy}
                  onClick={() => void act("/api/caisse/earn")}
                >
                  +1 Passage
                </button>
              ) : null}

              {result.rewardAvailable && profile.permissions.redeemReward ? (
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-full bg-[var(--positive)] py-3.5 text-base font-black text-[#0b0714] disabled:opacity-50"
                  disabled={busy}
                  onClick={() => void act("/api/caisse/redeem")}
                >
                  Utiliser : {result.rewardLabel}
                </button>
              ) : null}

              <Button variant="ghost" className="mt-auto" onClick={resetScanner}>
                Scanner un autre client
              </Button>
            </motion.div>
          ) : pasteOpen ? (
            <motion.div
              key="paste"
              className="flex min-h-0 flex-1 flex-col gap-3"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm font-semibold text-[var(--ink)]">Coller un lien ou un code QR</p>
              <textarea
                value={pasteValue}
                onChange={(event) => setPasteValue(event.target.value)}
                className="min-h-[120px] flex-1 rounded-2xl border border-[var(--border)] bg-[var(--panel-bg)] p-4 text-sm text-[var(--panel-text)] outline-none"
                placeholder="Collez ici le lien ou le contenu du QR Fife Life"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={() => setPasteOpen(false)}>
                  Retour caméra
                </Button>
                <Button
                  variant="primary"
                  disabled={busy || !pasteValue.trim()}
                  onClick={() => void submitToken(pasteValue, "manual")}
                >
                  Valider
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scan"
              className="flex min-h-0 flex-1 flex-col gap-3"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative shrink-0">
                <div className="qr-scanner-shell max-h-[min(42vh,280px)] overflow-hidden rounded-3xl border border-white/10 bg-black">
                  {scanning ? (
                    <QrScanner
                      key={cameraSession}
                      sessionKey={cameraSession}
                      active={scanning && !busy}
                      onResult={(text) => void submitToken(text, "camera")}
                    />
                  ) : (
                    <div className="flex h-[min(42vh,280px)] min-h-[12rem] items-center justify-center text-sm text-white/70">
                      {busy ? "Traitement..." : "Caméra en pause"}
                    </div>
                  )}
                </div>
                <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-white/35" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => setCameraSession((value) => value + 1)}>
                  Relancer caméra
                </Button>
                <Button variant="secondary" onClick={() => setPasteOpen(true)}>
                  Coller un lien
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {success ? (
          <p className="mt-2 text-center text-sm font-bold text-[var(--positive)]">{success}</p>
        ) : null}
        {error ? (
          <div className="mt-2 space-y-2">
            <p role="alert" className="text-center text-sm font-bold text-[var(--danger)]">
              {error}
            </p>
            <Button variant="ghost" className="w-full" onClick={resetScanner}>
              Prêt à scanner
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
