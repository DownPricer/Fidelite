"use client";


import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Field, Input, PasswordInput } from "@/components/ui";
import { GlassBottomSheet } from "@/components/fife-life/profile/glass-bottom-sheet";
import {
  CompactListHeader,
  CompactListRow,
  CompactListShell,
  EmptyState,
  FilterChip,
  InitialsAvatar,
  ListToolbar,
  StatusBadge,
} from "@/components/merchant/merchant-ui";

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
  joinedAt: string;
};

const DEMO: Employee[] = [
  {
    id: "e0",
    firstName: "Hugo",
    lastName: "Bernard",
    email: "employe@cafe-demo.local",
    roleLabel: "Employé",
    staffPreset: "CASHIER",
    status: "Actif",
    lastActivityAt: new Date().toISOString(),
    joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "e1",
    firstName: "Sam",
    lastName: "Durand",
    email: "sam@cafe-demo.local",
    roleLabel: "Employé",
    staffPreset: "MANAGER",
    status: "Actif",
    lastActivityAt: new Date().toISOString(),
    joinedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "e2",
    firstName: "Noa",
    lastName: "Petit",
    email: "noa@cafe-demo.local",
    roleLabel: "Employé",
    staffPreset: "CASHIER",
    status: "Actif",
    lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
    joinedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "e3",
    firstName: "Léa",
    lastName: "Robert",
    email: "lea@cafe-demo.local",
    roleLabel: "Employé",
    staffPreset: "CASHIER",
    status: "Invitation en attente",
    lastActivityAt: null,
    joinedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function statusTone(status: string): "ok" | "warn" | "muted" | "danger" {
  if (status === "Actif") return "ok";
  if (status === "Invitation en attente") return "warn";
  if (status === "Suspendu") return "danger";
  return "muted";
}

function statusBadgeLabel(status: string) {
  if (status === "Invitation en attente") return "En attente";
  return status;
}

function formatActivity(iso: string | null, joinedAt?: string) {
  if (iso) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 3600000) return "À l'instant";
    if (diff < 86400000) return "Aujourd'hui";
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
  if (joinedAt) {
    return `Créé le ${new Date(joinedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
  }
  return "—";
}

export function EmployeesPanel({ demo = false }: { demo?: boolean }) {
  const [employees, setEmployees] = useState<Employee[]>(demo ? DEMO : []);
  const [activeCount, setActiveCount] = useState(demo ? 3 : 0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginUrl, setLoginUrl] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
        (filter === "suspended" && e.status === "Suspendu") ||
        (filter === "removed" && e.status === "Accès retiré");
      return matchQ && matchF;
    });
  }, [demo, employees, search, filter]);

  async function createEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setError(null);
    setSuccess(null);
    setLoginUrl(null);
    setFormError(null);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const passwordConfirm = String(form.get("passwordConfirm") ?? "");

    if (password !== passwordConfirm) {
      setFormError("Les mots de passe ne correspondent pas.");
      setCreating(false);
      return;
    }

    if (demo) {
      setSheetOpen(false);
      setSuccess("Le compte employé a été créé. Il peut maintenant se connecter.");
      setLoginUrl(`${window.location.origin}/employe/connexion`);
      event.currentTarget.reset();
      setCreating(false);
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
        password,
        passwordConfirm,
        staffPreset: "CASHIER",
      }),
    });
    const data = await res.json();
    setCreating(false);

    if (!res.ok) {
      setFormError(data.error ?? "Création impossible.");
      return;
    }

    setSheetOpen(false);
    setSuccess("Le compte employé a été créé. Il peut maintenant se connecter.");
    if (data.employeeLoginUrl) setLoginUrl(data.employeeLoginUrl as string);
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

      {success ? (
        <div className="mb-4">
          <Alert tone="ok">{success}</Alert>
        </div>
      ) : null}
      {loginUrl ? (
        <div className="mb-4">
          <Alert tone="ok">
            Connexion employé :{" "}
            <a href={loginUrl} className="break-all font-semibold underline">
              {loginUrl}
            </a>
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
              ["removed", "Accès retirés"],
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
        <CompactListShell columns={4}>
          <CompactListHeader columns={["Employé", "Rôle", "Statut", "Activité"]} />
          {list.map((e) => (
            <CompactListRow
              key={e.id}
              href={`/app/employes/${e.id}`}
              avatar={<InitialsAvatar name={`${e.firstName} ${e.lastName ?? ""}`} />}
              title={`${e.firstName} ${e.lastName ?? ""}`}
              subtitle={e.email}
              meta={formatActivity(e.lastActivityAt, e.joinedAt)}
              badge={
                <div className="flex flex-col items-end gap-1">
                  <span className="hidden text-[10px] text-[var(--muted)] md:inline">{e.roleLabel}</span>
                  <StatusBadge tone={statusTone(e.status)}>{statusBadgeLabel(e.status)}</StatusBadge>
                </div>
              }
              desktopBadge={<StatusBadge tone={statusTone(e.status)}>{statusBadgeLabel(e.status)}</StatusBadge>}
            />
          ))}
        </CompactListShell>
      )}

      <GlassBottomSheet open={sheetOpen} title="Nouvel employé" onClose={() => !creating && setSheetOpen(false)}>
        <form className="space-y-4" onSubmit={(e) => void createEmployee(e)}>
          {formError ? <Alert>{formError}</Alert> : null}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <Input name="firstName" required disabled={creating} autoComplete="off" />
            </Field>
            <Field label="Nom">
              <Input name="lastName" disabled={creating} autoComplete="off" />
            </Field>
          </div>
          <Field label="E-mail">
            <Input name="email" type="email" required disabled={creating} autoComplete="off" />
          </Field>
          <Field label="Téléphone" hint="Facultatif">
            <Input name="phone" type="tel" disabled={creating} autoComplete="off" />
          </Field>
          <Field label="Mot de passe" hint="8 caractères minimum">
            <PasswordInput name="password" required minLength={8} disabled={creating} autoComplete="new-password" />
          </Field>
          <Field label="Confirmer le mot de passe">
            <PasswordInput name="passwordConfirm" required minLength={8} disabled={creating} autoComplete="new-password" />
          </Field>
          <Button type="submit" className="w-full" disabled={creating}>
            {creating ? "Création..." : "Créer le compte employé"}
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
  const [editOpen, setEditOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState(false);

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

  async function patchEmployee(body: Record<string, unknown>) {
    setPendingAction(true);
    setActionError(null);
    setActionSuccess(null);
    const res = await fetch(`/api/merchant/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setPendingAction(false);
    if (!res.ok) {
      setActionError(data.error ?? "Action impossible.");
      return data;
    }
    if (data.employee) setEmployee(data.employee);
    return data;
  }

  async function suspend() {
    if (!confirm("Suspendre cet employé ? Son accès sera bloqué et ses sessions révoquées.")) return;
    if (demo) return;
    await patchEmployee({ isActive: false });
    window.location.reload();
  }

  async function resendInvite() {
    if (demo) return;
    if (!confirm("Renvoyer l'invitation ? L'ancien lien sera invalidé.")) return;
    const data = await patchEmployee({ invitationStatus: "PENDING" });
    if (data?.invitationSent) {
      setActionSuccess("Invitation renvoyée par e-mail.");
    }
  }

  async function revokeSessions() {
    if (demo || !confirm("Révoquer toutes les sessions actives de cet employé ?")) return;
    setPendingAction(true);
    await fetch(`/api/merchant/employees/${id}/revoke-sessions`, { method: "POST" });
    setPendingAction(false);
    setActionSuccess("Sessions révoquées.");
  }

  async function reactivate() {
    if (demo) return;
    if (!confirm("Réactiver cet employé ?")) return;
    await patchEmployee({ isActive: true });
    window.location.reload();
  }

  async function cancelInvite() {
    if (demo || !confirm("Annuler cette invitation ?")) return;
    await fetch(`/api/merchant/employees/${id}`, { method: "DELETE" });
    window.location.href = "/app/employes";
  }

  async function removeAccess() {
    if (demo || !confirm("Retirer définitivement l'accès de cet employé ? Son historique sera conservé.")) return;
    await fetch(`/api/merchant/employees/${id}`, { method: "DELETE" });
    window.location.href = "/app/employes";
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await patchEmployee({
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: form.get("phone"),
      inviteMessage: form.get("inviteMessage"),
    });
    setEditOpen(false);
    setActionSuccess("Informations mises à jour.");
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
    <div className="merchant-detail-grid space-y-6">
      <div className="space-y-6">
        {actionError ? <Alert>{actionError}</Alert> : null}
        {actionSuccess ? <Alert tone="ok">{actionSuccess}</Alert> : null}

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <InitialsAvatar name={`${employee.firstName} ${employee.lastName ?? ""}`} size="md" />
            <div>
              <p className="text-lg font-bold text-[var(--ink)]">
                {employee.firstName} {employee.lastName ?? ""}
              </p>
              <p className="text-sm text-[var(--muted-strong)]">{employee.email}</p>
              <p className="text-xs text-[var(--muted)]">{employee.roleLabel}</p>
            </div>
          </div>
          <StatusBadge tone={statusTone(employee.status)}>{employee.status}</StatusBadge>
        </div>

        <div className="merchant-stats-row">
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
            <>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void resendInvite()}>
                Renvoyer l&apos;invitation
              </Button>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => setEditOpen(true)}>
                Modifier
              </Button>
              <Button variant="ghost" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void cancelInvite()}>
                Annuler l&apos;invitation
              </Button>
              <Button variant="danger" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void removeAccess()}>
                Retirer l&apos;accès
              </Button>
            </>
          ) : null}
          {employee.status === "Actif" ? (
            <>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => setEditOpen(true)}>
                Modifier
              </Button>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void revokeSessions()}>
                Révoquer les sessions
              </Button>
              <Button variant="danger" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void suspend()}>
                Suspendre
              </Button>
              <Button variant="ghost" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void removeAccess()}>
                Retirer l&apos;accès
              </Button>
            </>
          ) : null}
          {employee.status === "Suspendu" ? (
            <>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void reactivate()}>
                Réactiver
              </Button>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void revokeSessions()}>
                Révoquer les sessions
              </Button>
              <Button variant="danger" className="h-9 px-3 text-xs" disabled={pendingAction} onClick={() => void removeAccess()}>
                Retirer l&apos;accès
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {employee.status !== "Invitation en attente" ? (
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
          <CompactListShell layout="stack">
            {history.map((tx) => (
              <button
                key={tx.id}
                type="button"
                className="compact-list-row w-full text-left"
                onClick={() => setSelectedTx(tx)}
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">{txLine(tx)}</p>
                  <p className="text-xs text-[var(--muted)]">{new Date(tx.createdAt).toLocaleString("fr-FR")}</p>
                </div>
              </button>
            ))}
          </CompactListShell>
        </section>
      ) : null}

      <GlassBottomSheet open={editOpen} title="Modifier l'employé" onClose={() => setEditOpen(false)}>
        <form className="space-y-4" onSubmit={(e) => void saveProfile(e)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom">
              <Input name="firstName" defaultValue={employee.firstName} required />
            </Field>
            <Field label="Nom">
              <Input name="lastName" defaultValue={employee.lastName ?? ""} />
            </Field>
          </div>
          <Field label="E-mail">
            <Input name="email" type="email" defaultValue={employee.email} required />
          </Field>
          <Field label="Téléphone">
            <Input name="phone" type="tel" defaultValue={employee.phone ?? ""} />
          </Field>
          {employee.status === "Invitation en attente" ? (
            <Field label="Message d'invitation">
              <Input name="inviteMessage" defaultValue="" placeholder="Message personnalisé" />
            </Field>
          ) : null}
          <Button type="submit" className="w-full" disabled={pendingAction}>
            Enregistrer
          </Button>
        </form>
      </GlassBottomSheet>

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
