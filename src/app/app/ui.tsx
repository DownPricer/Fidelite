"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export function MerchantHome({
  firstName,
  merchantName,
}: {
  firstName: string;
  role: string;
  merchantName: string;
  canAdmin: boolean;
}) {
  const [stats, setStats] = useState<{
    customers: number;
    visitsToday: number;
    rewards: number;
    employees: number;
  } | null>(null);
  const [walletStatus, setWalletStatus] = useState<string>("");

  useEffect(() => {
    void fetch("/api/merchant/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setWalletStatus(data.walletStatus === "ready" ? "Google Wallet actif" : "Google Wallet : bientôt disponible");
      })
      .catch(() => undefined);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

  return (
    <main className="px-6 py-8 lg:px-12 lg:py-12">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">{merchantName}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight lg:text-4xl">Bonjour, {firstName}</h1>
          <p className="text-sm font-medium text-muted">Administrateur</p>
        </div>
        <Button variant="secondary" onClick={() => void logout()} className="h-10 px-4">
          Déconnexion
        </Button>
      </header>

      <section className="mb-10 overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/25 lg:p-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Action principale</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight lg:text-4xl">Prêt à enregistrer une visite ?</h2>
        <p className="mt-3 max-w-xl text-base font-medium text-white/85">
          Scannez le QR de la carte client pour créditer un passage ou valider une récompense.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/app/caisse"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-5 text-lg font-black text-primary shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {scanIcon}
            Scanner une carte
          </Link>
          <Link
            href="/app/caisse"
            className="text-sm font-bold text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Ouvrir la caisse →
          </Link>
        </div>
      </section>

      {stats ? (
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {[
            { label: "Clients", value: stats.customers },
            { label: "Passages (24h)", value: stats.visitsToday },
            { label: "Récompenses", value: stats.rewards },
            { label: "Employés", value: stats.employees },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">{stat.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight">{stat.value}</p>
            </div>
          ))}
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse bg-white" />
          ))}
        </div>
      )}

      {walletStatus ? (
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-widest">{walletStatus}</p>
        </div>
      ) : null}
    </main>
  );
}

const scanIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
    <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
