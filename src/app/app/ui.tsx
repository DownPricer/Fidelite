"use client";

import { useEffect, useState } from "react";
import { AppNav } from "@/components/app-nav";
import { Button, Card } from "@/components/ui";

export function MerchantHome({
  firstName,
  role,
  merchantName,
  canAdmin,
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
    if (!canAdmin) return;
    void fetch("/api/merchant/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setWalletStatus(data.walletStatus === "ready" ? "Google Wallet actif" : "Google Wallet : bientôt disponible");
      })
      .catch(() => undefined);
  }, [canAdmin]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/app/connexion";
  }

  return (
    <main className="px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">{merchantName}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight lg:text-4xl">Bonjour, {firstName}</h1>
          <p className="text-sm font-medium text-muted">{role === "MERCHANT_ADMIN" ? "Administrateur" : "Employé"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => void logout()} className="h-10 px-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2 h-4 w-4">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Déconnexion
          </Button>
        </div>
      </header>

      <section className="grid gap-6">
        <a
          href="/app/caisse"
          className="group relative overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-2xl shadow-primary/20 transition-all hover:opacity-95 active:scale-[0.99] lg:p-12"
        >
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-black tracking-tight lg:text-4xl">Ouvrir le mode caisse</h2>
              <p className="mt-2 font-bold text-white/80">Prêt à scanner et créditer vos clients.</p>
            </div>
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-10 w-10">
                <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </a>

        {canAdmin && stats ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Clients", value: stats.customers, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { label: "Passages (24h)", value: stats.visitsToday, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { label: "Récompenses", value: stats.rewards, icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0h4l-1.5 5h-5l-1.5-5h4z" },
              { label: "Employés", value: stats.employees, icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            ].map((stat) => (
              <Card key={stat.label} className="flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">{stat.label}</span>
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-muted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                      <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-3xl font-black tracking-tight">{stat.value}</p>
              </Card>
            ))}
          </div>
        ) : (
          canAdmin && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-white/50">
                  <div />
                </Card>
              ))}
            </div>
          )
        )}

        {canAdmin && walletStatus && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-emerald-700 shadow-sm shadow-emerald-100/50">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest">{walletStatus}</p>
          </div>
        )}
      </section>
      
      <div className="h-20 lg:hidden" />
    </main>
  );
}
