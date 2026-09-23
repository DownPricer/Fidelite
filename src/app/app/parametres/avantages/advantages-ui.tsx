"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, cn } from "@/components/ui";
import { ConfirmDialog, EmptyState, MerchantPageHeader, StatusBadge } from "@/components/merchant/merchant-ui";
import { RewardFormDialog, RewardTypeIcon } from "../reward-form-dialog";
import type { LoyaltyMode } from "@prisma/client";
import type { ProgramRules, RewardConfig } from "@/lib/loyalty-program";
import { DEFAULT_RULES } from "@/lib/loyalty-program";

const DEMO_CONFIG: { mode: LoyaltyMode; rules: ProgramRules; rewards: RewardConfig[] } = {
  mode: "POINTS_BY_AMOUNT",
  rules: { pointsPerAmount: 1, amountForPoints: 1, minPurchase: 0, rounding: "floor" },
  rewards: [
    { id: "r1", name: "Boisson offerte", description: "Au choix parmi les boissons classiques.", threshold: 500, thresholdUnit: "points", rewardType: "FREE_PRODUCT", isActive: true, sortOrder: 0 },
    { id: "r2", name: "5 € de réduction", description: "Réduction sur l'ensemble du panier.", threshold: 1000, thresholdUnit: "points", rewardType: "FIXED_DISCOUNT", value: 5, isActive: true, sortOrder: 1 },
  ],
};

type HistoricalEntitlement = {
  id: string;
  rewardName: string;
  rewardDescription: string | null;
  threshold: number;
  thresholdUnit: "visits" | "points";
  expiresAt: string | null;
  historicalBalance: number;
};

/**
 * Écran "Avantages" : gestion des récompenses (catalogue, seuils, limites,
 * archivage). Extrait de l'ancien ProgramConfigurator (view="advantages")
 * pour suivre la maquette fidelo-advantages-redesign-v2 sans mélanger la
 * logique de configuration du programme (mode / règle / limites), qui reste
 * dans programme/ui.tsx.
 */
export function AdvantagesEditor({ demo = false }: { demo?: boolean }) {
  const [mode, setMode] = useState<LoyaltyMode>("VISITS");
  const [rules, setRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [rewards, setRewards] = useState<RewardConfig[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rewardConfirm, setRewardConfirm] = useState<{ index: number; kind: "deactivate" | "delete" } | null>(null);
  const [rewardEditor, setRewardEditor] = useState<{ mode: "create" | "edit"; index: number | null } | null>(null);
  const [advantagesTab, setAdvantagesTab] = useState<"active" | "scheduled" | "archived">("active");
  const [reorderMode, setReorderMode] = useState(false);
  const [openRewardMenu, setOpenRewardMenu] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [historicalEntitlements, setHistoricalEntitlements] = useState<HistoricalEntitlement[]>([]);
  const [merchantSlug, setMerchantSlug] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (demo) {
      setMode(DEMO_CONFIG.mode);
      setRules(DEMO_CONFIG.rules);
      setRewards(DEMO_CONFIG.rewards);
      return;
    }
    const [programRes, dashboardRes] = await Promise.all([
      fetch("/api/merchant/program"),
      fetch("/api/merchant/dashboard"),
    ]);
    const data = await programRes.json();
    if (!programRes.ok) return;
    const src = data.draft ?? data.active;
    setMode(src.mode);
    setRules(src.rules);
    setRewards(src.rewards);
    setHistoricalEntitlements(data.historicalEntitlements ?? []);
    if (dashboardRes.ok) {
      const dashboardData = await dashboardRes.json();
      setMerchantSlug(dashboardData.merchant?.slug ?? null);
    }
  }, [demo]);

  useEffect(() => {
    void load();
  }, [load]);

  function markDirty() {
    setDirty(true);
    setOk(null);
  }

  async function saveDraft() {
    if (rewards.filter(isCurrentReward).length > 10) {
      setError("Vous avez atteint la limite de 10 avantages pour ce programme.");
      return;
    }
    if (demo) {
      setOk("Brouillon enregistré (démo).");
      setDirty(false);
      return;
    }
    setSavingDraft(true);
    setError(null);
    try {
      const res = await fetch("/api/merchant/program", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, rules, rewards }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Enregistrement impossible.");
        return;
      }
      setError(null);
      setOk("Brouillon enregistré.");
      setDirty(false);
    } finally {
      setSavingDraft(false);
    }
  }

  async function publish() {
    if (dirty) await saveDraft();
    if (demo) {
      setOk("Programme publié (démo).");
      setConfirmOpen(false);
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/merchant/program?action=publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.requiresConfirmation) {
        setConfirmOpen(true);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Publication impossible.");
        return;
      }
      setOk("Programme publié avec succès.");
      setConfirmOpen(false);
      setDirty(false);
      void load();
    } finally {
      setPublishing(false);
    }
  }

  function openCreateReward() {
    if (rewards.filter(isCurrentReward).length >= 10) {
      setError("Vous avez atteint la limite de 10 avantages pour ce programme.");
      return;
    }
    setError(null);
    setRewardEditor({ mode: "create", index: null });
  }

  function openEditReward(index: number) {
    setRewardEditor({ mode: "edit", index });
  }

  function handleRewardSave(values: RewardConfig) {
    if (rewardEditor?.mode === "create") {
      if (rewards.filter(isCurrentReward).length >= 10) {
        setError("Vous avez atteint la limite de 10 avantages pour ce programme.");
        return;
      }
      markDirty();
      setRewards((r) => [
        ...r,
        { ...values, thresholdUnit: unitForMode(mode), sortOrder: r.length, archivedAt: null },
      ]);
      setOk("Avantage créé. Enregistrez le brouillon ou publiez pour l'appliquer.");
    } else if (rewardEditor?.mode === "edit" && rewardEditor.index !== null) {
      updateReward(rewardEditor.index, { ...values, thresholdUnit: unitForMode(mode) });
      setOk("Avantage mis à jour. Enregistrez le brouillon ou publiez pour l'appliquer.");
    }
    setRewardEditor(null);
  }

  function unitForMode(value: LoyaltyMode) {
    return value === "VISITS" || value === "AMOUNT_TIERS" ? "visits" : "points";
  }

  function isCurrentReward(reward: RewardConfig) {
    return reward.thresholdUnit === unitForMode(mode) && !reward.archivedAt;
  }

  function rewardStatus(reward: RewardConfig) {
    const now = Date.now();
    if (reward.archivedAt) return "Archivé";
    if (!reward.isActive) return "Désactivé";
    if (reward.validUntil && new Date(reward.validUntil).getTime() < now) return "Expiré";
    if (reward.validFrom && new Date(reward.validFrom).getTime() > now) return "Futur";
    return "Actif";
  }

  function rewardPeriod(reward: RewardConfig) {
    const from = reward.validFrom ? new Date(reward.validFrom).toLocaleDateString("fr-FR") : null;
    const until = reward.validUntil ? new Date(reward.validUntil).toLocaleDateString("fr-FR") : null;
    if (!from && !until) return "Sans expiration";
    if (from && until) return `${from} → ${until}`;
    if (from) return `À partir du ${from}`;
    return `Jusqu'au ${until}`;
  }

  function rewardLimitSummary(reward: RewardConfig) {
    const parts = [];
    if (reward.maxUsesPerCustomer) parts.push(`${reward.maxUsesPerCustomer} / client`);
    if (reward.globalLimit) parts.push(`${reward.globalLimit} au total`);
    if (reward.reuseDelayDays) parts.push(`${reward.reuseDelayDays} j avant réutilisation`);
    if (reward.minPurchase) parts.push(`${reward.minPurchase} € min.`);
    return parts.length ? parts.join(" · ") : "1 utilisation par client";
  }

  const visibleConfiguredRewards = rewards.filter((reward) => !reward.archivedAt);
  const archivedConfiguredRewards = rewards.filter((reward) => Boolean(reward.archivedAt));
  const activeTabRewards = visibleConfiguredRewards.filter((reward) => rewardStatus(reward) !== "Futur");
  const scheduledTabRewards = visibleConfiguredRewards.filter((reward) => rewardStatus(reward) === "Futur");
  const currentRewardCount = visibleConfiguredRewards.filter(isCurrentReward).length;
  const activeRewardCount = visibleConfiguredRewards.filter(
    (reward) => isCurrentReward(reward) && rewardStatus(reward) === "Actif",
  ).length;
  const scheduledRewardCount = visibleConfiguredRewards.filter(
    (reward) => isCurrentReward(reward) && rewardStatus(reward) === "Futur",
  ).length;
  const hasOldProgramRewards = visibleConfiguredRewards.some((reward) => !isCurrentReward(reward));

  function updateReward(index: number, patch: Partial<RewardConfig>) {
    const next = [...rewards];
    next[index] = { ...next[index]!, ...patch };
    setRewards(next);
    markDirty();
  }

  async function deleteReward(index: number) {
    const reward = rewards[index];
    if (!reward) return;
    if (demo || reward.id.startsWith("new-")) {
      setRewards((items) => items.filter((_, i) => i !== index).map((item, i) => ({ ...item, sortOrder: i })));
      markDirty();
      setOk("Avantage retiré du brouillon.");
      return;
    }
    const res = await fetch("/api/merchant/program?action=delete-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardId: reward.id }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Suppression impossible.");
      return;
    }
    if (data.archived) {
      updateReward(index, { archivedAt: new Date().toISOString(), isActive: false });
    } else {
      setRewards((items) => items.filter((_, i) => i !== index).map((item, i) => ({ ...item, sortOrder: i })));
      markDirty();
    }
    setOk(data.message ?? "Avantage supprimé.");
  }

  function moveReward(index: number, direction: -1 | 1) {
    const next = [...rewards];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index]!;
    next[index] = next[target]!;
    next[target] = current;
    setRewards(next.map((reward, i) => ({ ...reward, sortOrder: i })));
    markDirty();
  }

  function toggleReorder() {
    setReorderMode((v) => !v);
  }

  function renderRewardCard(reward: RewardConfig, position: number | null, allowReorder: boolean) {
    const index = rewards.indexOf(reward);
    const statusLabel = rewardStatus(reward);
    const isOldProgram = !isCurrentReward(reward);
    const menuOpen = openRewardMenu === reward.id;
    return (
      <article key={reward.id} className="advantages-reward-card flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="advantages-reward-visual">
          <RewardTypeIcon type={reward.rewardType} />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-black text-[var(--ink)]">{reward.name}</p>
                <StatusBadge
                  tone={
                    statusLabel === "Actif" ? "ok" : statusLabel === "Futur" ? "warn" : statusLabel === "Expiré" ? "danger" : "muted"
                  }
                >
                  {statusLabel}
                </StatusBadge>
                {isOldProgram ? <StatusBadge tone="muted">Ancien programme</StatusBadge> : null}
                {position !== null ? <span className="text-[10px] font-bold text-[var(--muted)]">#{position}</span> : null}
              </div>
              <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.description || "Aucune description"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--muted-strong)]">
            <span><strong className="text-[var(--ink-soft)]">{reward.threshold} {reward.thresholdUnit === "points" ? "points" : "passages"}</strong></span>
            <span>{rewardLimitSummary(reward)}</span>
            <span>{rewardPeriod(reward)}</span>
          </div>
          {allowReorder ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" className="h-8 px-2.5 text-xs" disabled={index === 0} onClick={() => moveReward(index, -1)}>Monter</Button>
              <Button variant="secondary" className="h-8 px-2.5 text-xs" disabled={index === rewards.length - 1} onClick={() => moveReward(index, 1)}>Descendre</Button>
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start">
          <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => openEditReward(index)}>
            Modifier
          </Button>
          <div className="advantages-reward-menu">
            <button
              type="button"
              className="advantages-icon-btn"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Plus d'actions"
              onClick={(e) => {
                e.stopPropagation();
                setOpenRewardMenu(menuOpen ? null : reward.id);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <circle cx="5" cy="12" r="1.4" />
                <circle cx="12" cy="12" r="1.4" />
                <circle cx="19" cy="12" r="1.4" />
              </svg>
            </button>
            {menuOpen ? (
              <div className="advantages-reward-menu-panel" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="advantages-reward-menu-item"
                  onClick={() => {
                    setOpenRewardMenu(null);
                    reward.isActive
                      ? setRewardConfirm({ index, kind: "deactivate" })
                      : updateReward(index, { isActive: true, thresholdUnit: unitForMode(mode) });
                  }}
                >
                  {reward.isActive ? "Désactiver" : "Activer"}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="advantages-reward-menu-item advantages-reward-menu-item-danger"
                  onClick={() => {
                    setOpenRewardMenu(null);
                    setRewardConfirm({ index, kind: "delete" });
                  }}
                >
                  Supprimer / Archiver
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  const tabs: { id: "active" | "scheduled" | "archived"; label: string; items: RewardConfig[]; empty: string; hint?: string }[] = [
    { id: "active", label: "Actifs", items: activeTabRewards, empty: "Aucun avantage actif pour le moment.", hint: "Créez un avantage pour donner une raison de revenir." },
    { id: "scheduled", label: "Programmés", items: scheduledTabRewards, empty: "Aucun avantage programmé.", hint: "Un avantage avec une date de début future apparaîtra ici." },
    { id: "archived", label: "Archivés", items: archivedConfiguredRewards, empty: "Aucun avantage archivé.", hint: "Les avantages retirés seront conservés ici avec leur historique." },
  ];
  const activeTabDef = tabs.find((t) => t.id === advantagesTab) ?? tabs[0]!;
  const confirmingReward = rewardConfirm ? rewards[rewardConfirm.index] : null;
  const editingReward = rewardEditor?.mode === "edit" && rewardEditor.index !== null ? (rewards[rewardEditor.index] ?? null) : null;

  return (
    <div className="space-y-5" onClick={() => setOpenRewardMenu(null)}>
      <MerchantPageHeader
        backHref="/app/fidelisation"
        eyebrow="Programme de fidélité"
        title="Avantages"
        subtitle="Créez des récompenses simples à comprendre et classez-les dans l'ordre où vos clients les débloquent."
        action={
          <Button onClick={(e) => { e.stopPropagation(); openCreateReward(); }} className="h-10 px-4 text-xs">
            Créer un avantage
          </Button>
        }
      />

      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      <section className="advantages-stats-bar" aria-label="Résumé des avantages">
        <div className="advantages-stat">
          <p className="advantages-stat-value">{activeRewardCount}</p>
          <p className="advantages-stat-label">Avantages actifs</p>
        </div>
        <div className="advantages-stat">
          <p className="advantages-stat-value">{scheduledRewardCount}</p>
          <p className="advantages-stat-label">Programmés</p>
        </div>
        <div className="advantages-stat">
          <p className="advantages-stat-value">{currentRewardCount}/10</p>
          <p className="advantages-stat-label">Emplacements utilisés</p>
        </div>
        {activeTabRewards.length > 1 ? (
          <Button
            variant={reorderMode ? "primary" : "secondary"}
            className="ml-auto h-9 px-3 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toggleReorder();
            }}
          >
            Réorganiser
          </Button>
        ) : null}
      </section>

      {hasOldProgramRewards ? (
        <p className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-3 text-xs font-semibold text-amber-100">
          Certains avantages appartiennent à votre ancien programme (badge « Ancien programme »). Choisissez un
          équivalent pour terminer leur conversion.
        </p>
      ) : null}

      <nav className="advantages-tabs" role="tablist" aria-label="État des avantages">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={advantagesTab === tab.id}
            className={cn("advantages-tab", advantagesTab === tab.id && "advantages-tab-active")}
            onClick={(e) => {
              e.stopPropagation();
              setAdvantagesTab(tab.id);
              setReorderMode(false);
            }}
          >
            {tab.label}
            <span className="advantages-tab-count">{tab.items.length}</span>
          </button>
        ))}
      </nav>

      {activeTabDef.id === "active" ? (
        <div className="advantages-toolbar">
          <span className="advantages-toolbar-note">Le premier avantage sera proposé en priorité.</span>
          {activeTabDef.items.length > 1 ? (
            <button
              type="button"
              className="advantages-icon-btn !w-auto gap-1.5 px-3 text-xs font-bold"
              onClick={(e) => {
                e.stopPropagation();
                toggleReorder();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <circle cx="9" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="18" r="1" />
                <circle cx="15" cy="6" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="18" r="1" />
              </svg>
              {reorderMode ? "Terminer" : "Changer l'ordre"}
            </button>
          ) : null}
        </div>
      ) : null}

      <section className="advantages-list space-y-3" role="tabpanel">
        {activeTabDef.items.length ? (
          activeTabDef.items.map((reward, i) =>
            renderRewardCard(reward, activeTabDef.id === "active" ? i + 1 : null, activeTabDef.id === "active" && reorderMode),
          )
        ) : (
          <EmptyState title={activeTabDef.empty} hint={activeTabDef.hint} />
        )}
      </section>

      {historicalEntitlements.length ? (
        <section className="space-y-3">
          <h2 className="text-base font-black text-[var(--ink)]">Droits clients conservés</h2>
          <div className="grid gap-3">
            {historicalEntitlements.map((entitlement) => (
              <div key={entitlement.id} className="program-step-card text-sm">
                <p className="font-bold text-[var(--ink)]">{entitlement.rewardName}</p>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">{entitlement.rewardDescription || "Ancien programme"}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {entitlement.threshold} {entitlement.thresholdUnit === "points" ? "points" : "passages"} · {entitlement.expiresAt ? `Expire le ${new Date(entitlement.expiresAt).toLocaleDateString("fr-FR")}` : "Sans expiration"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="advantages-savebar">
        <div className="advantages-savebar-copy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="advantages-savebar-icon h-[18px] w-[18px]">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.3 2.3L16 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-[13px] font-bold text-[var(--ink)]">{dirty ? "Modifications non enregistrées" : "Votre programme est à jour"}</p>
            <p className="text-xs text-[var(--muted-strong)]">
              {dirty ? "Enregistrez le brouillon ou publiez pour appliquer vos changements." : "Les avantages affichés sont visibles par vos clients."}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {merchantSlug ? (
            <Link href={`/carte/${merchantSlug}`} target="_blank" rel="noreferrer">
              <Button variant="ghost" className="h-9 px-3 text-xs">Voir côté client</Button>
            </Link>
          ) : null}
          <Button variant="secondary" className="h-9 px-3 text-xs" disabled={savingDraft} onClick={() => void saveDraft()}>
            {savingDraft ? "Enregistrement…" : "Enregistrer le brouillon"}
          </Button>
          <Button className="h-9 px-3 text-xs" disabled={publishing} onClick={() => void publish()}>
            {publishing ? "Publication…" : "Publier les modifications"}
          </Button>
        </div>
      </div>

      <RewardFormDialog
        open={rewardEditor !== null}
        reward={editingReward}
        unit={unitForMode(mode)}
        onCancel={() => setRewardEditor(null)}
        onSave={handleRewardSave}
      />
      <ConfirmDialog
        open={rewardConfirm !== null}
        title={
          rewardConfirm?.kind === "delete"
            ? `Supprimer « ${confirmingReward?.name ?? "cet avantage"} » ?`
            : `Désactiver « ${confirmingReward?.name ?? "cet avantage"} » ?`
        }
        description={
          rewardConfirm?.kind === "delete"
            ? "S'il n'a jamais été utilisé, il sera supprimé définitivement. S'il possède un historique, il sera archivé afin de conserver les transactions et les droits déjà attribués."
            : "Les clients ne pourront plus l'obtenir tant qu'il reste désactivé. Vous pourrez le réactiver à tout moment."
        }
        confirmLabel={rewardConfirm?.kind === "delete" ? "Supprimer" : "Désactiver"}
        tone={rewardConfirm?.kind === "delete" ? "danger" : "default"}
        onCancel={() => setRewardConfirm(null)}
        onConfirm={() => {
          if (!rewardConfirm) return;
          if (rewardConfirm.kind === "delete") {
            void deleteReward(rewardConfirm.index);
          } else {
            updateReward(rewardConfirm.index, { isActive: false });
          }
          setRewardConfirm(null);
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Publier malgré le changement de mode ?"
        description="Le programme actif a changé de mode depuis ce brouillon. Rendez-vous sur la page Programme de fidélité pour choisir comment traiter les anciens avantages avant de publier."
        confirmLabel="Compris"
        cancelLabel="Fermer"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  );
}

