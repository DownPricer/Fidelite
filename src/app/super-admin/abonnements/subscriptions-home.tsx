"use client";

import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Card } from "@/components/ui";

export function SubscriptionsPage({ firstName }: { firstName: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [pending, setPending] = useState<string | null>(null);

  function load() {
    void fetch("/api/super-admin/subscriptions").then((r) => r.json()).then((d) => setRows(d.subscriptions ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleInsight(merchantId: string, enabled: boolean) {
    setPending(merchantId);
    try {
      await fetch(`/api/super-admin/merchants/${merchantId}/insight`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      load();
    } finally {
      setPending(null);
    }
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-black text-[var(--ink)]">Abonnements</h1>
        <p className="text-sm text-[var(--muted-text)]">Données contractuelles saisies manuellement — aucun PSP connecté.</p>
        <Card className="overflow-hidden p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-widest text-[var(--muted-text)]">
              <tr>
                <th className="px-4 py-3">Commerce</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Montant</th>
                <th className="px-4 py-3">MRR</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Fidelo Insight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5">
                  <td className="px-4 py-2">{row.merchant.name}</td>
                  <td className="px-4 py-2">{row.plan}</td>
                  <td className="px-4 py-2">{row.amount} {row.currency} / {row.frequency === "MONTHLY" ? "mois" : "an"}</td>
                  <td className="px-4 py-2">{row.mrr.toFixed(2)} €</td>
                  <td className="px-4 py-2">{row.status}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      disabled={pending === row.merchantId}
                      onClick={() => toggleInsight(row.merchantId, !row.insightEnabled)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${row.insightEnabled ? "bg-[var(--violet-bright)] text-white" : "border border-white/15 text-[var(--muted-text)]"} disabled:opacity-50`}
                    >
                      {row.insightEnabled ? "Activé" : row.insightRequestedAt ? "Demandé — activer" : "Désactivé"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </SuperAdminShell>
  );
}
