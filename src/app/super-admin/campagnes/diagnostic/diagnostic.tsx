"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Card } from "@/components/ui";

type Check = { key: string; ok: boolean; label: string; detail: string };
type Item = {
  id: string;
  status: string;
  fundingMode: "TEST" | "LIVE" | null;
  merchant: { id: string; name: string; city: string | null; postalCode: string | null };
  testMerchant: boolean;
  delivery: { deliverable: boolean; simulated: boolean; eligibleCustomers: number; checks: Check[] } | null;
};

/** Diagnostic de diffusion de toutes les mises en avant : la cause exacte d'une publicité invisible. */
export function DiagnosticPage({ firstName }: { firstName: string }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/super-admin/visuels/diagnostic", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Chargement impossible.");
        setItems(data.items);
        setMode(data.stripeMode);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur."));
  }, []);

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/super-admin/campagnes" className="text-xs font-bold text-[var(--muted-text)] hover:underline">
          ← Campagnes
        </Link>
        <h1 className="text-2xl font-black text-[var(--ink)]">Diagnostic de diffusion</h1>
        <p className="text-sm text-[var(--muted-text)]">
          Pour chaque mise en avant validée ou programmée : pourquoi elle apparaît, ou non, chez les clients.
        </p>
        {error ? <Alert>{error}</Alert> : null}
        {mode ? (
          <Card className="p-4 text-sm">
            Mode Stripe du déploiement : <b>{mode === "TEST" ? "TEST — les campagnes payées maintenant sont des SIMULATIONS, jamais affichées aux vrais clients" : "RÉEL"}</b>
          </Card>
        ) : null}
        {items?.length === 0 ? <p className="text-sm text-[var(--muted-text)]">Aucune mise en avant validée ou programmée.</p> : null}
        {items?.map((item) => (
          <Card key={item.id} className="space-y-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link href={`/super-admin/campagnes/fiche/${item.id}`} className="text-sm font-black text-[var(--ink)] underline">
                  {item.merchant.name}
                </Link>
                <p className="text-xs text-[var(--muted-text)]">
                  {item.status} · financement : {item.fundingMode ?? "quota / réel"}
                  {item.testMerchant ? " · commerce de test" : ""}
                </p>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold text-[var(--ink)]">
                {item.delivery?.simulated ? "Simulée (test)" : item.delivery?.deliverable ? "Diffusable" : "Non diffusée"}
              </span>
            </div>
            <ul className="space-y-1 text-xs">
              {item.delivery?.checks.map((check) => (
                <li key={check.key} className={check.ok ? "text-[var(--muted-text)]" : "font-bold text-[var(--danger)]"}>
                  {check.ok ? "✓" : "✗"} {check.label} — {check.detail}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </SuperAdminShell>
  );
}
