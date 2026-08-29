"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { QrScanner, UsbScannerField } from "@/components/qr-scanner";
import { Alert, Button, Card } from "@/components/ui";

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
  firstName,
  merchantName,
  role,
}: {
  firstName: string;
  merchantName: string;
  role: string;
}) {
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const submitToken = useCallback(async (token: string) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    setScanning(false);
    const response = await fetch("/api/caisse/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) {
      setResult(null);
      setError(data.error ?? "Scan refusé.");
      return;
    }
    setResult(data);
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
        ? `+1 passage pour ${data.firstName}. Total : ${data.snapshot.progressLabel}`
        : `Récompense utilisée pour ${data.firstName}.`,
    );
    setResult(null);
  }

  return (
    <main className="min-h-dvh bg-ink text-white selection:bg-primary selection:text-white">
      {/* Header POS */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
              <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase">Mode Caisse</h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase leading-none">{merchantName} — {firstName}</p>
          </div>
        </div>
        <Link
          href={role === "MERCHANT_ADMIN" ? "/app" : "/app/caisse"}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          Quitter
        </Link>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {!result && !scanning && (
          <div className="flex flex-col items-center justify-center gap-10 text-center">
            <div className="w-full max-w-lg space-y-4">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-4 rounded-2xl bg-primary px-8 py-8 text-2xl font-black uppercase tracking-tight text-white shadow-2xl shadow-primary/40 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                onClick={() => setScanning(true)}
                disabled={busy}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-10 w-10 shrink-0">
                  <path d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Scanner une carte
              </button>
              <p className="text-sm font-medium text-white/50">
                Appuyez pour activer la caméra et lire le QR du client.
              </p>
            </div>

            <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-6 text-left">
              <UsbScannerField variant="dark" onSubmit={(value) => void submitToken(value)} disabled={busy} />
            </div>
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-full overflow-hidden rounded-[2rem] border-4 border-primary bg-black shadow-2xl shadow-primary/20">
              <QrScanner variant="dark" active={scanning} onResult={(text) => void submitToken(text)} />
            </div>
            <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-6">
              <UsbScannerField variant="dark" onSubmit={(value) => void submitToken(value)} disabled={busy} />
            </div>
            <Button className="w-full bg-white/10 text-white border-white/10 hover:bg-white/20" onClick={() => setScanning(false)}>
              Annuler le scan
            </Button>
          </div>
        )}

        {(error || success) && !result && !scanning && (
          <div className="mt-8 animate-in fade-in zoom-in duration-300">
            {error && (
              <div className="flex items-center gap-4 rounded-2xl bg-rose-500/20 p-6 border border-rose-500/30 text-rose-200 shadow-lg shadow-rose-950/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-8 w-8 shrink-0 text-rose-500">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-lg font-bold italic leading-tight">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/20 p-8 border border-emerald-500/30 text-emerald-100 shadow-lg shadow-emerald-950/50">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-8 w-8">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Opération réussie</p>
                  <p className="text-2xl font-black italic tracking-tight">{success}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-500">
            <div className="rounded-3xl bg-white/5 p-8 border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Client identifié</p>
                  <h3 className="text-4xl font-black tracking-tight">{result.firstName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Statut actuel</p>
                  <p className="text-2xl font-black text-primary">{result.progressLabel}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <button
                  className="flex w-full items-center justify-center gap-4 rounded-2xl bg-primary py-8 text-3xl font-black uppercase italic tracking-tighter text-white shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  disabled={busy}
                  onClick={() => void act("/api/caisse/earn")}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="h-10 w-10">
                    <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  +1 Passage
                </button>

                {result.rewardAvailable ? (
                  <button
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-6 text-xl font-black uppercase tracking-tight text-white shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    disabled={busy}
                    onClick={() => void act("/api/caisse/redeem")}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-6 w-6">
                      <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0h4l-1.5 5h-5l-1.5-5h4z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Utiliser : {result.rewardLabel}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-4 text-white/20 italic font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Récompense non disponible</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button className="bg-transparent border-white/10 text-white/40 hover:text-white" onClick={() => setResult(null)}>
              Annuler et fermer
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
