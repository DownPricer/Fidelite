"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SuperAdminShell } from "@/components/super-admin/layout-shell";
import { Alert, Button, Card, Input, cn } from "@/components/ui";

type MerchantRow = {
  id: string;
  name: string;
  legalName: string | null;
  slug: string;
  logoUrl: string | null;
  primaryColor: string;
  status: string;
  ownerName: string | null;
  loyaltyMode: string | null;
  plan: string | null;
  customers: number;
  lastActivityAt: string | null;
  monthlyContractual: number;
  createdAt: string;
};

export function MerchantsListPage({ firstName }: { firstName: string }) {
  const [rows, setRows] = useState<MerchantRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const response = await fetch(`/api/super-admin/merchants?${params}`);
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Chargement impossible.");
      return;
    }
    setError(null);
    setRows(data.merchants);
    setPages(data.pagination.pages);
  }, [page, q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function quickAction(id: string, action: "suspend" | "reactivate" | "archive") {
    const password = window.prompt("Confirmez votre mot de passe super-admin :");
    if (!password) return;
    const response = await fetch(`/api/super-admin/merchants/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Action impossible.");
      return;
    }
    void load();
  }

  return (
    <SuperAdminShell firstName={firstName}>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--ink)]">Commerces</h1>
            <p className="text-sm text-[var(--muted-text)]">Recherche, filtres et actions rapides.</p>
          </div>
          <Link href="/super-admin/commerces/nouveau">
            <Button>Créer un commerce</Button>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <Input placeholder="Rechercher nom, slug, e-mail, téléphone…" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} />
          <select
            className="rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            <option value="">Tous statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="TRIAL">Essai</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="ARCHIVED">Archivé</option>
            <option value="DRAFT">Brouillon</option>
          </select>
          <Button variant="secondary" onClick={() => void load()}>Actualiser</Button>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-widest text-[var(--muted-text)]">
                <tr>
                  <th className="px-4 py-3">Commerce</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Fidélité</th>
                  <th className="px-4 py-3">Clients</th>
                  <th className="px-4 py-3">MRR contr.</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--muted-text)]">Chargement…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--muted-text)]">Aucun commerce trouvé.</td></tr>
                ) : rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl text-sm font-black text-white" style={{ backgroundColor: row.primaryColor }}>
                          {row.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={row.logoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
                          ) : row.name.slice(0, 1)}
                        </div>
                        <div>
                          <Link href={`/super-admin/commerces/${row.id}`} className="font-bold text-[var(--ink)] hover:text-[var(--violet-bright)]">{row.name}</Link>
                          <p className="text-xs text-[var(--muted-text)]">/{row.slug}{row.legalName && row.legalName !== row.name ? ` · ${row.legalName}` : ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-1 text-[10px] font-black uppercase", row.status === "ACTIVE" ? "bg-green-500/10 text-green-300" : "bg-white/10 text-[var(--muted-text)]")}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">{row.loyaltyMode ?? "—"}<br /><span className="text-[var(--muted-text)]">{row.plan ?? "—"}</span></td>
                    <td className="px-4 py-3">{row.customers}</td>
                    <td className="px-4 py-3">{row.monthlyContractual.toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/super-admin/commerces/${row.id}`} className="text-xs font-semibold text-[var(--violet-bright)]">Fiche</Link>
                        {row.status === "ACTIVE" || row.status === "TRIAL" ? (
                          <button type="button" className="text-xs text-[var(--danger)]" onClick={() => void quickAction(row.id, "suspend")}>Suspendre</button>
                        ) : (
                          <button type="button" className="text-xs" onClick={() => void quickAction(row.id, "reactivate")}>Réactiver</button>
                        )}
                        <button type="button" className="text-xs" onClick={() => void quickAction(row.id, "archive")}>Archiver</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Précédent</Button>
          <span className="text-xs text-[var(--muted-text)]">Page {page} / {pages}</span>
          <Button variant="secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Suivant</Button>
        </div>
      </div>
    </SuperAdminShell>
  );
}
