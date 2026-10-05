"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Card } from "@/components/ui";

type Item = {
  id: string;
  statusLabel: string;
  planLabel: string;
  businessName: string;
  email: string;
  createdAt: string;
  codeUsedAt: string | null;
  merchantId: string | null;
};

export function SignupRequestsHome({ firstName }: { firstName: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/super-admin/signup-requests");
        const data = (await res.json()) as { items?: Item[]; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Chargement impossible.");
          return;
        }
        setItems(data.items ?? []);
      } catch {
        setError("Chargement impossible.");
      }
    })();
  }, []);

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--ink)]">Demandes d&apos;inscription</h1>
          <p className="mt-1 text-sm text-[var(--muted-text)]">Parcours bêta commerçant : examen, code d&apos;accès et suivi du paiement.</p>
        </div>
        {error ? <Alert>{error}</Alert> : null}
        <div className="space-y-3">
          {items.map((item) => (
            <Link key={item.id} href={`/super-admin/demandes-inscription/${item.id}`}>
              <Card className="p-4 transition hover:border-[var(--violet-bright)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[var(--ink)]">{item.businessName}</p>
                    <p className="text-sm text-[var(--muted-text)]">{item.email} · {item.planLabel}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold uppercase tracking-widest text-[var(--violet-bright)]">{item.statusLabel}</p>
                    <p className="text-[var(--muted-text)]">{new Date(item.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {items.length === 0 && !error ? <p className="text-sm text-[var(--muted-text)]">Aucune demande pour le moment.</p> : null}
        </div>
      </div>
    </SuperAdminShell>
  );
}
