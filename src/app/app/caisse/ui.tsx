"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
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
}: {
  merchantName: string;
  role: string;
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
    const { ok, data } = await postCaisseScan(token);
    setBusy(false);
    if (!ok) {
      setResult(null);
      setError(typeof data.error === "string" ? data.error : "Scan refusé.");
      return;
    }
    setResult(data as ScanResult);
    setSuccess(null);
  }, []);

  async function act(path: "/api/caisse/earn" | "/api/caisse/redeem") {
    if (!result || busy) return;
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
    <div className="flex h-dvh flex-col bg-[var(--page-bg)] text-[var(--body-text)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--panel-bg)] px-4 py-3">
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
        {success && !result ? (
          <p className="shrink-0 text-center text-sm font-bold text-emerald-800">{success}</p>
        ) : null}

        {!result ? (
          <>
            {!scanning ? (
              <button
                type="button"
                className="flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[var(--teal)] px-6 py-[clamp(1.75rem,6vh,2.75rem)] text-[clamp(1.25rem,3.4vw,1.75rem)] font-black uppercase tracking-tight text-white shadow-sm"
                onClick={startScan}
                disabled={busy}
              >
                Scanner une carte
              </button>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
                <QrScanner
                  key={cameraSession}
                  sessionKey={cameraSession}
                  active={scanning}
                  onResult={(text) => void submitToken(text, "camera")}
                />
              </div>
            )}

            <UsbScannerField onSubmit={(value) => void submitToken(value, "manual")} disabled={busy} />

            {error ? (
              <p role="alert" className="shrink-0 text-center text-sm font-bold text-[var(--danger)]">
                {error}
              </p>
            ) : null}
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--panel-bg)] p-4 text-[var(--panel-text)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Client</p>
                  <h3 className="text-3xl font-black tracking-tight text-[var(--panel-text)]">{result.firstName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-text)]">Statut</p>
                  <p className="text-xl font-black text-[var(--teal)]">{result.progressLabel}</p>
                </div>
              </div>
            </div>

            <button
              className="flex w-full items-center justify-center rounded-2xl bg-[var(--teal)] py-5 text-2xl font-black uppercase text-white disabled:opacity-50"
              disabled={busy}
              onClick={() => void act("/api/caisse/earn")}
            >
              +1 Passage
            </button>
            {result.rewardAvailable ? (
              <button
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-700 py-4 text-lg font-black uppercase text-white disabled:opacity-50"
                disabled={busy}
                onClick={() => void act("/api/caisse/redeem")}
              >
                Utiliser : {result.rewardLabel}
              </button>
            ) : null}

            <Button variant="ghost" className="mt-auto shrink-0" onClick={resetToIdle}>
              Annuler et scanner un autre client
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
