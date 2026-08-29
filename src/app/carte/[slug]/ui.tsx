"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { InstallPwa } from "@/components/install-pwa";
import { Button } from "@/components/ui";

type Props = {
  firstName: string;
  slug: string;
  merchant: {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    rewardLabel: string;
    visitsRequired: number;
    points: number;
  };
};

export function LoyaltyCardScreen({ firstName, slug, merchant }: Props) {
  const [points, setPoints] = useState(merchant.points);
  const [qr, setQr] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [walletEnabled, setWalletEnabled] = useState(false);
  const [walletBusy, setWalletBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(true);

  const refreshCard = useCallback(async () => {
    const card = await fetch(`/api/customer/card?slug=${encodeURIComponent(slug)}`);
    if (card.ok) {
      const data = await card.json();
      setPoints(data.snapshot.points);
      setWalletEnabled(Boolean(data.walletEnabled));
    }
    const qrRes = await fetch("/api/customer/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (qrRes.ok) {
      const data = await qrRes.json();
      setQr(data.image);
      setUpdatedAt(new Date(data.generatedAt).toLocaleString("fr-FR"));
      setError(null);
    } else {
      const data = await qrRes.json();
      setError(data.error ?? "QR indisponible.");
    }
  }, [slug]);

  useEffect(() => {
    // QR fixe : chargement unique à l’ouverture de la carte.
    void refreshCard();
  }, [refreshCard]);

  async function addWallet() {
    setWalletBusy(true);
    const response = await fetch("/api/customer/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    const data = await response.json();
    setWalletBusy(false);
    if (!response.ok || !data.url) {
      setError("Google Wallet est temporairement indisponible.");
      return;
    }
    window.location.href = data.url;
  }

  const rewardAvailable = points >= merchant.visitsRequired;
  const progress = Math.min(100, (points / merchant.visitsRequired) * 100);

  return (
    <main className="min-h-dvh bg-surface text-ink pb-20">
      <div className="mx-auto max-w-md px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-600 font-bold uppercase text-xs">
              {firstName.slice(0, 1)}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Client</p>
              <p className="text-sm font-bold">{firstName}</p>
            </div>
          </div>
          <Link href="/compte" className="group flex items-center gap-2 text-sm font-bold text-muted hover:text-ink transition-colors">
            <span>Mon compte</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </header>

        {/* La Carte Premium */}
        <article
          className="card-shine relative aspect-[1.6/1] w-full overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl shadow-ink/20"
          style={{ ["--merchant" as string]: merchant.primaryColor }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Carte Fidélité</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">{merchant.name}</h1>
            </div>
            {merchant.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={merchant.logoUrl} alt="" className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md object-cover p-1" />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-md text-xl font-bold">
                {merchant.name.slice(0, 1)}
              </div>
            )}
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter tabular-nums">{points}</span>
              <span className="text-xl font-bold text-white/60">/ {merchant.visitsRequired}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mt-1">Passages cumulés</p>
            
            {/* Barre de progression */}
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
              <div 
                className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </article>

        {rewardAvailable ? (
          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg shadow-emerald-200 animate-pulse">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20 backdrop-blur-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0h4l-1.5 5h-5l-1.5-5h4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Récompense prête !</p>
              <p className="text-lg font-black leading-tight">{merchant.rewardLabel}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4 shadow-premium">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-muted">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-bold text-muted leading-snug">
              Encore <span className="text-ink">{merchant.visitsRequired - points} passages</span> pour débloquer votre cadeau.
            </p>
          </div>
        )}

        {/* Section QR Code */}
        <section className="mt-8 rounded-2xl border border-border/50 bg-white p-8 text-center shadow-premium">
          {showQr ? (
            <>
              <div className="relative mx-auto h-64 w-64 rounded-xl border border-border/40 bg-white p-4">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt="QR de votre carte" className="h-full w-full" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Génération...</p>
                  </div>
                )}
              </div>
              <div className="mt-6 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-ink">QR de votre carte</p>
                </div>
                <p className="text-xs font-medium text-muted">
                  Présentez ce code en caisse — il ne change pas.
                </p>
                <p className="text-xs text-muted">
                  Dernière mise à jour : <span className="font-semibold text-ink">{updatedAt || "–"}</span>
                </p>
              </div>
              <Button className="mt-6 w-full py-3" variant="secondary" onClick={() => setShowQr(false)}>
                Masquer mon QR
              </Button>
            </>
          ) : (
            <div className="py-8">
              <p className="text-sm font-medium text-muted">Votre QR est masqué pour plus de discrétion.</p>
              <Button className="mt-6 w-full py-4" onClick={() => setShowQr(true)}>
                Afficher mon QR
              </Button>
            </div>
          )}
          {error ? <p className="mt-4 text-xs font-bold uppercase tracking-wider text-rose-500">{error}</p> : null}
          <Button className="mt-4 w-full py-3" variant="secondary" onClick={() => void refreshCard()}>
            Actualiser mes points
          </Button>
        </section>

        {/* Actions Wallet / PWA */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          {walletEnabled ? (
            <button
              onClick={() => void addWallet()}
              disabled={walletBusy}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" />
              </svg>
              <span className="font-bold tracking-tight">Ajouter à Google Wallet</span>
            </button>
          ) : null}
          <InstallPwa />
        </div>

        {/* Instructions iPhone PWA */}
        <div className="mt-12 text-center sm:hidden">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 mb-4">Utilisateur iPhone ?</p>
          <div className="flex items-center justify-center gap-6 text-muted">
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[10px] font-bold">1. Partager</span>
            </div>
            <div className="h-px w-8 bg-border" />
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-ink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[10px] font-bold">2. Sur l'écran d'accueil</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
