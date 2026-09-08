"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlassBottomSheet } from "@/components/fife-life/profile/glass-bottom-sheet";
import { QrScanner } from "@/components/qr-scanner";
import { Button, Field, Input } from "@/components/ui";
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
  programMode?: string;
  requirePurchaseAmount?: boolean;
  earnPreviewLabel?: string;
  nextRewardLabel?: string | null;
  unitLabel?: string;
};

type EmployeeProfile = {
  firstName: string;
  merchantName: string;
  merchantLogoUrl?: string | null;
  permissions: StaffPermissions;
};

type Phase =
  | "ready"
  | "camera"
  | "processing"
  | "result"
  | "amount"
  | "reward_confirm"
  | "error";

function statusLabel(phase: Phase, cameraError: string | null) {
  if (cameraError?.includes("Permission refusée")) return "Caméra refusée";
  if (cameraError?.includes("Aucune caméra")) return "Caméra indisponible";
  if (phase === "ready") return "Prêt à scanner";
  if (phase === "camera") return "Analyse du QR…";
  if (phase === "processing") return "Validation serveur…";
  if (phase === "amount") return "Montant de l'achat";
  if (phase === "reward_confirm") return "Confirmer la récompense";
  if (phase === "result") return "Client reconnu";
  if (phase === "error") return "Erreur";
  return "Prêt à scanner";
}

export function EmployeeScanScreen({
  profile,
  demo = false,
  initialView = "scan" as "scan" | "result" | "error",
  initialError = "Ce QR n'est pas reconnu.",
  demoOptions,
}: {
  profile: EmployeeProfile;
  demo?: boolean;
  initialView?: "scan" | "result" | "error";
  initialError?: string;
  demoOptions?: { amountView?: boolean; forceReward?: boolean };
}) {
  const [phase, setPhase] = useState<Phase>(
    demoOptions?.amountView ? "amount" : initialView === "result" ? "result" : initialView === "error" ? "error" : "ready",
  );
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraSession, setCameraSession] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialView === "error" ? initialError : null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(
    initialView === "result" || demoOptions?.amountView
      ? {
          grantId: "demo-grant",
          firstName: "Léa",
          points: demoOptions?.forceReward ? 10 : 7,
          visitsRequired: 10,
          rewardLabel: "1 boisson offerte",
          rewardAvailable: demoOptions?.forceReward ?? true,
          progressLabel: demoOptions?.forceReward ? "10 / 10 passages" : "7 / 10 passages",
          earnPreviewLabel: demoOptions?.amountView ? "Ajouter les points" : "+1 passage",
          requirePurchaseAmount: demoOptions?.amountView ?? false,
          nextRewardLabel: "Encore 3 passages avant « 1 boisson offerte »",
        }
      : null,
  );
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteValue, setPasteValue] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const lastCameraTokenRef = useRef<TokenMemory | null>(null);
  const processingRef = useRef(false);

  const resetScanner = useCallback(() => {
    lastCameraTokenRef.current = null;
    processingRef.current = false;
    setResult(null);
    setError(null);
    setSuccess(null);
    setPurchaseAmount("");
    setCameraActive(false);
    setCameraError(null);
    setPhase("ready");
    setCameraSession((session) => session + 1);
  }, []);

  const submitQr = useCallback(
    async (raw: string, source: "camera" | "manual") => {
      if (processingRef.current || busy) return;

      let token: string;
      try {
        token = readManualToken(raw);
      } catch (err) {
        setPhase("error");
        setError(err instanceof QrInputError ? err.message : "QR invalide.");
        setCameraActive(false);
        return;
      }

      if (source === "camera" && shouldIgnoreInstantDuplicate(lastCameraTokenRef.current, token)) {
        return;
      }
      if (source === "camera") {
        lastCameraTokenRef.current = rememberToken(token);
      }

      processingRef.current = true;
      setBusy(true);
      setError(null);
      setPhase("processing");
      setCameraActive(false);
      setPasteOpen(false);

      if (demo) {
        setBusy(false);
        processingRef.current = false;
        setResult({
          grantId: "demo-grant",
          firstName: "Léa",
          points: 7,
          visitsRequired: 10,
          rewardLabel: "1 boisson offerte",
          rewardAvailable: true,
          progressLabel: "7 / 10 passages",
          earnPreviewLabel: "+1 passage",
        });
        setPhase("result");
        return;
      }

      const { ok, status, data } = await postCaisseScan({ token });
      setBusy(false);
      processingRef.current = false;

      if (!ok) {
        setResult(null);
        setPhase("error");
        if (status === 401) {
          window.location.href = "/employe/connexion";
          return;
        }
        if (status === 403) {
          setError("Compte suspendu ou accès retiré.");
          return;
        }
        if (status === 429) {
          setError(typeof data.error === "string" ? data.error : "Scan trop rapproché.");
          return;
        }
        setError(typeof data.error === "string" ? data.error : "QR invalide.");
        return;
      }

      setResult(data as ScanResult);
      setPhase("result");
    },
    [busy, demo],
  );

  async function act(path: "/api/caisse/earn" | "/api/caisse/redeem", amount?: number) {
    if (!result || busy) return;

    if (demo) {
      setSuccess(
        path.endsWith("earn")
          ? "+1 passage pour Léa. 8 / 10 passages"
          : "Récompense utilisée pour Léa.",
      );
      setResult(null);
      setPhase("ready");
      window.setTimeout(resetScanner, 1200);
      return;
    }

    setBusy(true);
    setError(null);
    setPhase("processing");

    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grantId: result.grantId,
        ...(amount !== undefined ? { purchaseAmount: amount } : {}),
      }),
    });
    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setPhase("error");
      setError(data.error ?? "Action impossible.");
      return;
    }

    setSuccess(
      path.endsWith("earn")
        ? `Gain enregistré pour ${data.firstName}. ${data.snapshot?.progressLabel ?? ""}`
        : `Récompense utilisée pour ${data.firstName}.`,
    );
    setResult(null);
    setPhase("ready");
    window.setTimeout(resetScanner, 1400);
  }

  function startEarn() {
    if (!result) return;
    if (result.requirePurchaseAmount) {
      setPhase("amount");
      return;
    }
    void act("/api/caisse/earn");
  }

  function confirmAmount(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(purchaseAmount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Montant invalide.");
      return;
    }
    void act("/api/caisse/earn", amount);
  }

  function confirmRedeem() {
    if (!result) return;
    setPhase("reward_confirm");
  }

  async function finalizeRedeem() {
    await act("/api/caisse/redeem");
  }

  async function logout() {
    setCameraActive(false);
    setResult(null);
    if (demo) {
      window.location.href = "/employe/exit-demo";
      return;
    }
    await fetch("/api/employe/auth/logout", { method: "POST" });
    window.location.href = "/employe/connexion";
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setPasteValue(text);
    } catch {
      setError("Impossible de lire le presse-papiers.");
    }
  }

  useEffect(() => {
    if (success) {
      const timer = window.setTimeout(() => setSuccess(null), 2400);
      return () => window.clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="obsidian-scene flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--stroke)] bg-[rgba(12,10,24,0.92)] px-4 py-3 backdrop-blur-md safe-top">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[var(--panel-text)]">{profile.merchantName}</p>
          <p className="text-xs text-[var(--muted-text)]">{profile.firstName}</p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-text)] hover:text-[var(--panel-text)]"
        >
          {demo ? "Quitter" : "Déconnexion"}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3 safe-bottom">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--violet-bright)]">
            {statusLabel(phase, cameraError)}
          </p>
          {busy ? <span className="text-xs text-[var(--muted)]">Chargement…</span> : null}
        </div>

        <AnimatePresence mode="wait">
          {phase === "result" && result ? (
            <motion.div key="result" className="flex min-h-0 flex-1 flex-col gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="metric-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Client</p>
                <h2 className="text-3xl font-black text-[var(--ink)]">{result.firstName}</h2>
                <p className="mt-2 text-lg font-bold text-[var(--violet-bright)]">{result.progressLabel}</p>
                {result.nextRewardLabel ? (
                  <p className="mt-1 text-sm text-[var(--muted-strong)]">{result.nextRewardLabel}</p>
                ) : null}
                {result.rewardAvailable ? (
                  <p className="mt-2 text-sm font-semibold text-[var(--positive)]">
                    Récompense disponible : {result.rewardLabel}
                  </p>
                ) : null}
              </div>

              {profile.permissions.addPoints ? (
                <button
                  type="button"
                  className="glass-cta w-full justify-center py-4 text-lg font-black disabled:opacity-50"
                  disabled={busy}
                  onClick={startEarn}
                >
                  {result.earnPreviewLabel ?? "+1 Passage"}
                </button>
              ) : null}

              {result.rewardAvailable && profile.permissions.redeemReward ? (
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-full bg-[var(--positive)] py-3.5 text-base font-black text-[#0b0714] disabled:opacity-50"
                  disabled={busy}
                  onClick={confirmRedeem}
                >
                  Utiliser : {result.rewardLabel}
                </button>
              ) : null}

              <Button variant="ghost" className="mt-auto" onClick={resetScanner}>
                Scanner une autre carte
              </Button>
            </motion.div>
          ) : phase === "amount" && result ? (
            <motion.form key="amount" className="flex flex-1 flex-col gap-4" onSubmit={confirmAmount}>
              <div className="metric-card p-4">
                <p className="text-sm text-[var(--muted-strong)]">Montant de l&apos;achat pour {result.firstName}</p>
              </div>
              <Field label="Montant (€)">
                <Input
                  inputMode="decimal"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="Ex. 24.50"
                  autoFocus
                  required
                />
              </Field>
              <Button type="submit" className="w-full py-4" disabled={busy}>
                Calculer et valider
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPhase("result")}>
                Retour
              </Button>
            </motion.form>
          ) : phase === "reward_confirm" && result ? (
            <motion.div key="reward" className="flex flex-1 flex-col gap-4">
              <div className="metric-card p-4">
                <p className="text-sm text-[var(--muted-strong)]">
                  Confirmer l&apos;utilisation de « {result.rewardLabel} » pour {result.firstName} ?
                </p>
              </div>
              <Button className="w-full py-4" disabled={busy} onClick={() => void finalizeRedeem()}>
                Confirmer la récompense
              </Button>
              <Button variant="ghost" onClick={() => setPhase("result")}>
                Annuler
              </Button>
            </motion.div>
          ) : (
            <motion.div key="scan" className="flex min-h-0 flex-1 flex-col gap-3">
              <div className="relative shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black">
                {cameraActive ? (
                  <QrScanner
                    key={cameraSession}
                    sessionKey={cameraSession}
                    active={cameraActive && !busy}
                    onResult={(text) => void submitQr(text, "camera")}
                    onError={setCameraError}
                  />
                ) : (
                  <div className="flex h-[min(52vh,420px)] min-h-[240px] flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/70">
                    {cameraError ? (
                      <>
                        <p className="font-semibold text-[var(--danger)]">{cameraError}</p>
                        <p className="text-xs text-white/60">
                          Autorisez la caméra dans les réglages du navigateur, puis relancez.
                        </p>
                      </>
                    ) : (
                      <p>Appuyez sur « Autoriser la caméra » pour scanner un QR Fife Life.</p>
                    )}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-white/35" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {!cameraActive ? (
                  <Button
                    className="col-span-2 py-3.5"
                    onClick={() => {
                      setCameraError(null);
                      setCameraActive(true);
                      setPhase("camera");
                      setCameraSession((v) => v + 1);
                    }}
                    disabled={busy}
                  >
                    Autoriser la caméra
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => setCameraSession((v) => v + 1)} disabled={busy}>
                      Relancer
                    </Button>
                    <Button variant="secondary" onClick={() => setCameraActive(false)} disabled={busy}>
                      Pause
                    </Button>
                  </>
                )}
                <Button variant="secondary" className="col-span-2" onClick={() => setPasteOpen(true)} disabled={busy}>
                  Coller un lien
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {success ? <p className="mt-2 text-center text-sm font-bold text-[var(--positive)]">{success}</p> : null}
        {error && phase === "error" ? (
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

      <GlassBottomSheet open={pasteOpen} title="Coller un lien" onClose={() => setPasteOpen(false)}>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submitQr(pasteValue, "manual");
          }}
        >
          <Field label="Lien ou jeton QR">
            <Input
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              placeholder="https://… ou jeton JWT"
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="secondary" onClick={() => void pasteFromClipboard()}>
              Coller
            </Button>
            <Button type="submit" disabled={busy || !pasteValue.trim()}>
              Valider
            </Button>
          </div>
          <Button type="button" variant="ghost" className="w-full" onClick={() => setPasteOpen(false)}>
            Annuler
          </Button>
        </form>
      </GlassBottomSheet>
    </div>
  );
}
