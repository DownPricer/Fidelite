"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui";
import {
  CompactListRow,
  CompactListShell,
  EmptyState,
  FilterChip,
  InitialsAvatar,
  ListToolbar,
  MerchantPageHeader,
} from "@/components/merchant/merchant-ui";

type Customer = {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  points: number;
  lastActivity: string;
};

const DEMO: Customer[] = [
  { id: "c1", firstName: "Marie", lastName: "Dupont", email: "marie@demo.local", points: 35, lastActivity: new Date().toISOString() },
  { id: "c2", firstName: "Lucas", lastName: "Martin", email: "lucas@demo.local", points: 8, lastActivity: new Date(Date.now() - 86400000).toISOString() },
  { id: "c3", firstName: "Sarah", lastName: "Petit", email: "sarah@demo.local", points: 10, lastActivity: new Date(Date.now() - 172800000).toISOString() },
  { id: "c4", firstName: "Thomas", lastName: "Bernard", email: "thomas@demo.local", points: 2, lastActivity: new Date(Date.now() - 259200000).toISOString() },
];

function formatActivity(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 86400000) return "Aujourd'hui";
  if (diff < 172800000) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function CustomersPanel({ demo = false }: { demo?: boolean }) {
  const [customers, setCustomers] = useState<Customer[]>(demo ? DEMO : []);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort, page: String(page), q: search });
      const res = await fetch(`/api/merchant/customers?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chargement impossible.");
      setCustomers((prev) => (page === 1 ? data.customers : [...prev, ...data.customers]));
      setHasMore(data.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur.");
    } finally {
      setLoading(false);
    }
  }, [demo, sort, page, search]);

  useEffect(() => {
    if (demo) return;
    const t = setTimeout(() => void load(), search ? 250 : 0);
    return () => clearTimeout(t);
  }, [demo, load, search]);

  useEffect(() => {
    if (!demo) setPage(1);
  }, [search, sort, demo]);

  const filteredDemo = useMemo(() => {
    if (!demo) return customers;
    let list = [...DEMO];
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          (c.lastName ?? "").toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }
    if (sort === "points") list.sort((a, b) => b.points - a.points);
    if (sort === "alpha") list.sort((a, b) => a.firstName.localeCompare(b.firstName));
    return list;
  }, [demo, customers, search, sort]);

  const list = demo ? filteredDemo : customers;

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Nom, e-mail ou téléphone"
        sort={
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="merchant-filter-chip bg-transparent"
            aria-label="Tri"
          >
            <option value="recent">Plus récents</option>
            <option value="active">Plus actifs</option>
            <option value="points">Plus de points</option>
            <option value="alpha">Alphabétique</option>
          </select>
        }
      />

      {error ? <p className="mb-4 text-sm text-[var(--danger)]">{error}</p> : null}

      {loading && list.length === 0 ? (
        <CompactListShell>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="compact-list-row animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-4 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </CompactListShell>
      ) : list.length === 0 ? (
        <EmptyState title="Aucun client" hint="Les clients apparaîtront après leur premier scan." />
      ) : (
        <CompactListShell>
          {list.map((c) => (
            <CompactListRow
              key={c.id}
              href={`/app/clients/${c.id}`}
              avatar={<InitialsAvatar name={`${c.firstName} ${c.lastName ?? ""}`} />}
              title={`${c.firstName}${c.lastName ? ` ${c.lastName}` : ""}`}
              subtitle={`${c.points} passages`}
              meta={formatActivity(c.lastActivity)}
            />
          ))}
        </CompactListShell>
      )}

      {!demo && hasMore ? (
        <div className="mt-4 text-center">
          <Button variant="secondary" className="h-10 px-6 text-xs" onClick={() => setPage((p) => p + 1)}>
            Charger plus
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function CustomerDetailPanel({ id, demo = false }: { id: string; demo?: boolean }) {
  const demoCustomer = DEMO.find((c) => c.id === id);
  const [customer, setCustomer] = useState(demoCustomer ?? null);
  const [txs, setTxs] = useState<Array<{ id: string; type: string; pointsDelta: number; createdAt: string; reason?: string }>>(
    demo
      ? [
          { id: "t1", type: "EARN_VISIT", pointsDelta: 1, createdAt: new Date().toISOString() },
          { id: "t2", type: "EARN_VISIT", pointsDelta: 1, createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
      : [],
  );

  useEffect(() => {
    if (demo) return;
    void fetch(`/api/merchant/customers/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.customer) {
          setCustomer(d.customer);
          setTxs(d.transactions ?? []);
        }
      });
  }, [id, demo]);

  if (!customer) {
    return <EmptyState title="Client introuvable" />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel flex items-center gap-4 p-5">
        <InitialsAvatar name={`${customer.firstName} ${customer.lastName ?? ""}`} size="md" />
        <div>
          <h2 className="text-xl font-black text-[var(--ink)]">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-sm text-[var(--muted)]">{customer.email}</p>
          <p className="mt-1 text-sm font-bold text-[var(--violet-bright)]">{customer.points} passages</p>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Historique récent</h3>
        <CompactListShell>
          {txs.map((tx) => (
            <div key={tx.id} className="compact-list-row">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--ink)]">
                  {tx.pointsDelta > 0 ? "+" : ""}
                  {tx.pointsDelta} {tx.type === "REDEEM_REWARD" ? "· Récompense" : "passages"}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {new Date(tx.createdAt).toLocaleString("fr-FR")}
                  {tx.reason ? ` · ${tx.reason}` : ""}
                </p>
              </div>
            </div>
          ))}
        </CompactListShell>
      </section>

      <Link href="/app/clients" className="text-sm font-bold text-[var(--violet-bright)]">
        ← Retour à la liste
      </Link>
    </div>
  );
}
