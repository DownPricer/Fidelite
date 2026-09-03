"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { GlassBottomSheet } from "@/components/fife-life/profile/glass-bottom-sheet";
import {
  CompactListRow,
  CompactListShell,
  EmptyState,
  FilterChip,
  InitialsAvatar,
  ListToolbar,
  MerchantPageHeader,
  StatusBadge,
} from "@/components/merchant/merchant-ui";
import { PERMISSION_LABELS, type PermissionKey, type StaffPermissions } from "@/lib/staff-permissions";

type Employee = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone?: string | null;
  roleLabel: string;
  staffPreset: "MANAGER" | "CASHIER" | "CUSTOM";
  status: string;
  lastActivityAt: string | null;
  permissions: StaffPermissions;
};

const DEMO: Employee[] = [
  {
    id: "e1",
    firstName: "Sam",
    lastName: "Durand",
    email: "sam@cafe-demo.local",
    roleLabel: "Responsable",
    staffPreset: "MANAGER",
    status: "Actif",
    lastActivityAt: new Date().toISOString(),
    permissions: {} as StaffPermissions,
  },
  {
    id: "e2",
    firstName: "Noa",
    lastName: "Petit",
    email: "noa@cafe-demo.local",
    roleLabel: "Employé de caisse",
    staffPreset: "CASHIER",
    status: "Actif",
    lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
    permissions: {} as StaffPermissions,
  },
  {
    id: "e3",
    firstName: "Léa",
    lastName: "Robert",
    email: "lea@cafe-demo.local",
    roleLabel: "Employé de caisse",
    staffPreset: "CASHIER",
    status: "Invitation en attente",
    lastActivityAt: null,
    permissions: {} as StaffPermissions,
  },
];

function statusTone(status: string): "ok" | "warn" | "muted" | "danger" {
  if (status === "Actif") return "ok";
  if (status === "Invitation en attente") return "warn";
  if (status === "Suspendu") return "danger";
  return "muted";
}

function formatActivity(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 3600000) return "À l'instant";
  if (diff < 86400000) return "Aujourd'hui";
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function EmployeesPanel({ demo = false }: { demo?: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>(demo ? DEMO : []);
  const [activeCount, setActiveCount] = useState(demo ? 2 : 0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (demo) return;
    const params = new URLSearchParams({ q: search, filter });
    const res = await fetch(`/api/merchant/employees?${params}`);
    const data = await res.json();
    if (res.ok) {
      setEmployees(data.employees);
      setActiveCount(data.activeCount);
    }
  }, [demo, search, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const list = useMemo(() => {
    if (!demo) return employees;
    const q = search.toLowerCase();
    return DEMO.filter((e) => {
      const matchQ =
        !q ||
        e.firstName.toLowerCase().includes(q) ||
        (e.lastName ?? "").toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q);
      const matchF =
        filter === "all" ||
        (filter === "active" && e.status === "Actif") ||
        (filter === "pending" && e.status === "Invitation en attente") ||
        (filter === "suspended" && e.status === "Suspendu");
      return matchQ && matchF;
    });
  }, [demo, employees, search, filter]);

  async function createEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const staffPreset = form.get("staffPreset") as "MANAGER" | "CASHIER";
    const permissions: Partial<StaffPermissions> = {};
    for (const key of Object.keys(PERMISSION_LABELS) as PermissionKey[]) {
      if (form.get(`perm_${key}`) === "on") permissions[key] = true;
    }

    if (demo) {
      setSheetOpen(false);
      return;
    }

    const res = await fetch("/api/merchant/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        staffPreset,
        permissions,
        inviteMessage: form.get("inviteMessage"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Création impossible.");
      return;
    }
    setError(null);
    setSheetOpen(false);
    if (data.temporaryPassword) setTempPassword(data.temporaryPassword);
    event.currentTarget.reset();
    void load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted-strong)]">
          <span className="font-bold text-[var(--ink)]">{activeCount}</span> employés actifs
        </p>
        <Button className="h-10 px-4 text-xs" onClick={() => setSheetOpen(true)}>
          Nouvel employé
        </Button>
      </div>

      {tempPassword ? (
        <div className="mb-4">
          <Alert tone="ok">
            Mot de passe temporaire : <strong>{tempPassword}</strong>
          </Alert>
        </div>
      ) : null}
      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Nom ou e-mail"
        filters={
          <>
            {[
              ["all", "Tous"],
              ["active", "Actifs"],
              ["pending", "En attente"],
              ["suspended", "Suspendus"],
            ].map(([k, label]) => (
              <FilterChip key={k} active={filter === k} onClick={() => setFilter(k)}>
                {label}
              </FilterChip>
            ))}
          </>
        }
      />

      {list.length === 0 ? (
        <EmptyState title="Aucun employé" hint="Ajoutez votre première personne à l'équipe." />
      ) : (
        <CompactListShell>
          {list.map((e) => (
            <CompactListRow
              key={e.id}
              href={`/app/employes/${e.id}`}
              avatar={<InitialsAvatar name={`${e.firstName} ${e.lastName ?? ""}`} />}
              title={`${e.firstName} ${e.lastName ?? ""}`}
              subtitle={e.roleLabel}
              meta={formatActivity(e.lastActivityAt)}
              badge={<StatusBadge tone={statusTone(e.status)}>{e.status}</StatusBadge>}
            />
          ))}
        </CompactListShell>
      )}

      <GlassBottomSheet open={sheetOpen} title="Nouvel employé" onClose={() => setSheetOpen(false)}>
        <form className="space-y-4" onSubmit={(e) => void createEmployee(e)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <Input name="firstName" required />
            </Field>
            <Field label="Nom">
              <Input name="lastName" />
            </Field>
          </div>
          <Field label="E-mail">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Téléphone" hint="Facultatif">
            <Input name="phone" type="tel" />
          </Field>
          <Field label="Rôle">
            <select name="staffPreset" className="merchant-search-input !pl-3" defaultValue="CASHIER">
              <option value="MANAGER">Responsable</option>
              <option value="CASHIER">Employé de caisse</option>
            </select>
          </Field>
          <Field label="Message d'invitation" hint="Facultatif">
            <Input name="inviteMessage" placeholder="Bienvenue dans l'équipe !" />
          </Field>
          <details className="rounded-xl border border-white/10 p-3">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              Permissions
            </summary>
            <div className="mt-3 space-y-2">
              {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name={`perm_${key}`} defaultChecked={key === "caisse" || key === "addPoints"} />
                  {PERMISSION_LABELS[key]}
                </label>
              ))}
            </div>
          </details>
          <Button type="submit" className="w-full">
            Envoyer l&apos;invitation
          </Button>
        </form>
      </GlassBottomSheet>
    </div>
  );
}

export function EmployeeDetailPanel({ id, demo = false }: { id: string; demo?: boolean }) {
  const demoEmployee = DEMO.find((e) => e.id === id);
  const [employee, setEmployee] = useState(demoEmployee ?? null);
  const [stats, setStats] = useState({ scansToday: 3, earns: 42, redeems: 5, corrections: 1 });
  const [history, setHistory] = useState<
    Array<{
      id: string;
      type: string;
      pointsDelta: number;
      customerFirstName: string;
      customerLastName?: string | null;
      purchaseAmount?: number | null;
      rewardName?: string | null;
      reason?: string | null;
      createdAt: string;
    }>
  >(
    demo
      ? [
          { id: "h1", type: "EARN_VISIT", pointsDelta: 35, customerFirstName: "Marie", customerLastName: "Dupont", purchaseAmount: 28, createdAt: new Date().toISOString() },
          { id: "h2", type: "EARN_VISIT", pointsDelta: 1, customerFirstName: "Lucas", customerLastName: "Martin", createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: "h3", type: "REDEEM_REWARD", pointsDelta: -10, customerFirstName: "Sarah", customerLastName: "Petit", rewardName: "Pizza offerte", createdAt: new Date(Date.now() - 7200000).toISOString() },
          { id: "h4", type: "ADJUSTMENT", pointsDelta: -50, customerFirstName: "Thomas", customerLastName: "Bernard", reason: "Correction", createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]
      : [],
  );
  const [histFilter, setHistFilter] = useState("all");
  const [histSearch, setHistSearch] = useState("");
  const [selectedTx, setSelectedTx] = useState<(typeof history)[0] | null>(null);

  useEffect(() => {
    if (demo) return;
    void fetch(`/api/merchant/employees/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.employee) {
          setEmployee(d.employee);
          setStats(d.stats);
        }
      });
    const params = new URLSearchParams({ type: histFilter, q: histSearch });
    void fetch(`/api/merchant/employees/${id}/history?${params}`)
      .then((r) => r.json())
      .then((d) => setHistory(d.transactions ?? []));
  }, [id, demo, histFilter, histSearch]);

  if (!employee) return <EmptyState title="Employé introuvable" />;

  async function suspend() {
    if (!confirm("Suspendre cet employé ? Son accès sera bloqué.")) return;
    if (demo) return;
    await fetch(`/api/merchant/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: false }),
    });
    window.location.reload();
  }

  async function resendInvite() {
    if (demo) return;
    await fetch(`/api/merchant/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationStatus: "PENDING" }),
    });
    alert("Invitation renvoyée.");
  }

  function txLine(tx: (typeof history)[0]) {
    const name = `${tx.customerFirstName}${tx.customerLastName ? ` ${tx.customerLastName}` : ""}`;
    if (tx.type === "REDEEM_REWARD") return `${name} · Récompense « ${tx.rewardName ?? "offerte"} » utilisée`;
    if (tx.type === "ADJUSTMENT") return `${name} · ${tx.pointsDelta > 0 ? "+" : "−"}${Math.abs(tx.pointsDelta)} · Correction`;
    if (tx.type === "CANCEL") return `${name} · Scan annulé`;
    const sign = tx.pointsDelta > 0 ? "+" : "−";
    const extra = tx.purchaseAmount ? ` · Achat ${tx.purchaseAmount} €` : tx.pointsDelta === 1 ? " · +1 passage" : "";
    return `${name} · ${sign}${Math.abs(tx.pointsDelta)} points${extra}`;
  }

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        backHref="/app/employes"
        title={`${employee.firstName} ${employee.lastName ?? ""}`}
        subtitle={`${employee.roleLabel} · ${employee.status}`}
      />

      <div className="flex items-center gap-4">
        <InitialsAvatar name={`${employee.firstName} ${employee.lastName ?? ""}`} size="md" />
        <StatusBadge tone={statusTone(employee.status)}>{employee.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Scans auj.", stats.scansToday],
          ["Attribués", stats.earns],
          ["Récompenses", stats.redeems],
          ["Corrections", stats.corrections],
        ].map(([label, val]) => (
          <div key={label as string} className="merchant-stat-pill">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">{label}</p>
            <p className="text-xl font-black text-[var(--ink)]">{val}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {employee.status === "Invitation en attente" ? (
          <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => void resendInvite()}>
            Renvoyer l&apos;invitation
          </Button>
        ) : null}
        {employee.status === "Actif" ? (
          <Button variant="danger" className="h-9 px-3 text-xs" onClick={() => void suspend()}>
            Suspendre
          </Button>
        ) : null}
      </div>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Historique complet</h3>
        <ListToolbar
          search={histSearch}
          onSearchChange={setHistSearch}
          searchPlaceholder="Client"
          filters={
            <>
              {[
                ["all", "Tout"],
                ["earns", "Gains"],
                ["rewards", "Récompenses"],
                ["corrections", "Corrections"],
                ["cancels", "Annulations"],
              ].map(([k, label]) => (
                <FilterChip key={k} active={histFilter === k} onClick={() => setHistFilter(k)}>
                  {label}
                </FilterChip>
              ))}
            </>
          }
        />
        <CompactListShell>
          {history.map((tx) => (
            <button
              key={tx.id}
              type="button"
              className="compact-list-row w-full text-left"
              onClick={() => setSelectedTx(tx)}
            >
              <div className="flex-1">
                <p className={cn("text-sm font-semibold", tx.type === "EARN_VISIT" && "text-[var(--positive)]", tx.type === "REDEEM_REWARD" && "text-[var(--danger)]", tx.type === "ADJUSTMENT" && "text-[var(--warning)]")}>
                  {txLine(tx)}
                </p>
                <p className="text-xs text-[var(--muted)]">{new Date(tx.createdAt).toLocaleString("fr-FR")}</p>
              </div>
            </button>
          ))}
        </CompactListShell>
      </section>

      <GlassBottomSheet open={!!selectedTx} title="Détail transaction" onClose={() => setSelectedTx(null)}>
        {selectedTx ? (
          <dl className="space-y-3 text-sm">
            <div><dt className="text-[var(--muted)]">Identifiant</dt><dd className="font-mono text-xs">{selectedTx.id}</dd></div>
            <div><dt className="text-[var(--muted)]">Client</dt><dd>{selectedTx.customerFirstName} {selectedTx.customerLastName}</dd></div>
            <div><dt className="text-[var(--muted)]">Date</dt><dd>{new Date(selectedTx.createdAt).toLocaleString("fr-FR")}</dd></div>
            {selectedTx.purchaseAmount ? <div><dt className="text-[var(--muted)]">Montant</dt><dd>{selectedTx.purchaseAmount} €</dd></div> : null}
            <div><dt className="text-[var(--muted)]">Variation</dt><dd>{selectedTx.pointsDelta > 0 ? "+" : ""}{selectedTx.pointsDelta}</dd></div>
            {selectedTx.reason ? <div><dt className="text-[var(--muted)]">Motif</dt><dd>{selectedTx.reason}</dd></div> : null}
          </dl>
        ) : null}
      </GlassBottomSheet>
    </div>
  );
}
