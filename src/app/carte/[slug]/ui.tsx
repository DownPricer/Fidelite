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
    void refreshCard();
    const timer = window.setInterval(() => void refreshCard(), 50_000);
    return () => window.clearInterval(timer);
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

  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Bonjour {firstName}</p>
        <Link href="/compte" className="text-sm underline">
          Mon compte
        </Link>
      </div>

      <article
        className="card-shine mt-5 overflow-hidden rounded-[2rem] p-6 text-white shadow-xl"
        style={{ ["--merchant" as string]: merchant.primaryColor }}
      >
        <div className="flex items-center justify-between">
          {merchant.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={merchant.logoUrl} alt="" className="h-12 w-12 rounded-2xl bg-white object-cover" />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-xl font-bold">
              {merchant.name.slice(0, 1)}
            </div>
          )}
          <p className="text-sm text-white/80">Carte fidélité</p>
        </div>
        <h1 className="mt-6 text-3xl font-semibold">{merchant.name}</h1>
        <p className="mt-4 text-4xl font-semibold tabular-nums">
          {points} <span className="text-xl font-medium text-white/80">/ {merchant.visitsRequired}</span>
        </p>
        <p className="mt-1 text-white/80">passages</p>
        {rewardAvailable ? (
          <p className="mt-4 rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium">
            Récompense disponible : {merchant.rewardLabel}
          </p>
        ) : (
          <p className="mt-4 text-sm text-white/80">{merchant.visitsRequired} passages = {merchant.rewardLabel}</p>
        )}
      </article>

      <section className="mt-6 rounded-[2rem] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt="QR temporaire de la carte" className="mx-auto h-56 w-56" />
        ) : (
          <div className="mx-auto grid h-56 w-56 place-items-center text-sm text-slate-500">
            Préparation du QR…
          </div>
        )}
        <p className="mt-3 text-sm text-slate-500">QR temporaire, renouvelé automatiquement.</p>
        <p className="text-xs text-slate-400">Dernière actualisation : {updatedAt || "—"}</p>
        {error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
        <Button className="mt-4 w-full" variant="secondary" onClick={() => void refreshCard()}>
          Actualiser
        </Button>
      </section>

      <div className="mt-5 space-y-3">
        {walletEnabled ? (
          <Button className="w-full" onClick={() => void addWallet()} disabled={walletBusy}>
            {walletBusy ? "Ouverture…" : "Ajouter à Google Wallet"}
          </Button>
        ) : null}
        <InstallPwa />
      </div>
    </main>
  );
}
