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
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{merchantName}</p>
          <h1 className="text-3xl font-semibold">Bonjour {firstName}</h1>
          <p className="text-sm text-slate-500">{role === "MERCHANT_ADMIN" ? "Administrateur" : "Employé"}</p>
        </div>
        <Button variant="ghost" onClick={() => void logout()}>
          Déconnexion
        </Button>
      </div>
      <AppNav admin={canAdmin} />
      <a
        href="/app/caisse"
        className="mt-8 block rounded-[2rem] bg-teal-700 px-6 py-8 text-center text-2xl font-semibold text-white shadow-lg"
      >
        Ouvrir le mode caisse
      </a>
      {canAdmin && stats ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Card>
            <p className="text-sm text-slate-500">Clients</p>
            <p className="text-3xl font-semibold">{stats.customers}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Passages aujourd’hui</p>
            <p className="text-3xl font-semibold">{stats.visitsToday}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Récompenses</p>
            <p className="text-3xl font-semibold">{stats.rewards}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Employés actifs</p>
            <p className="text-3xl font-semibold">{stats.employees}</p>
          </Card>
        </div>
      ) : null}
      {canAdmin ? <p className="mt-4 text-sm text-slate-500">{walletStatus}</p> : null}
    </main>
  );
}
