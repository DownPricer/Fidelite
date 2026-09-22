"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { ConfirmDialog, EmptyState, MerchantPageHeader, StatusBadge } from "@/components/merchant/merchant-ui";
import { ProgramPreviewCard } from "@/components/merchant/program-preview-card";
import { RewardFormDialog, rewardTypeLabel } from "../reward-form-dialog";
import type { LoyaltyMode } from "@prisma/client";
import type { MerchantCardData } from "@/components/fife-life/types";
import type { ProgramConfig, RewardConfig, ProgramRules } from "@/lib/loyalty-program";
import { DEFAULT_RULES } from "@/lib/loyalty-program";

const PROGRAM_STEPS = ["Mode", "Règle", "Limites", "Aperçu", "Publication"];

function modeTitle(value: LoyaltyMode) {
  return MODES.find((m) => m.id === value)?.title ?? value;
}

/**
 * Description de la règle de gain pour le bloc "Programme actuellement
 * publié". Construite localement (plutôt que réutiliser
 * programEarnDescription du lib partagé) pour ne pas toucher un texte déjà
 * utilisé ailleurs et pour éviter le "(s)" littéral de ce dernier.
 */
function publishedEarnDescription(value: LoyaltyMode, rules: ProgramRules): string {
  switch (value) {
    case "VISITS": {
      const perScan = Math.max(1, Math.trunc(rules.visitsPerScan ?? 1));
      return perScan === 1 ? "1 passage par validation" : `${perScan} passages par validation`;
    }
    case "POINTS_BY_AMOUNT": {
      const pts = Math.max(1, Math.trunc(rules.pointsPerAmount ?? 1));
      const amount = (rules.amountForPoints ?? 1).toLocaleString("fr-FR");
      return pts === 1 ? `1 point pour ${amount} € d'achat` : `${pts} points pour ${amount} € d'achat`;
    }
    case "FIXED_POINTS": {
      const pts = Math.max(0, Math.trunc(rules.fixedPointsPerPurchase ?? 0));
      return pts === 1 ? "1 point par achat" : `${pts} points par achat`;
    }
    case "AMOUNT_TIERS":
      return "Gain selon le palier de montant";
    default:
      return "";
  }
}

function publishedMinimumPurchaseLabel(rules: ProgramRules): string | null {
  const min = rules.minPurchase ?? 0;
  if (min <= 0) return null;
  return `Minimum d'achat : ${min.toLocaleString("fr-FR")} €`;
}

const MODES: { id: LoyaltyMode; title: string; hint: string }[] = [
  { id: "VISITS", title: "Passages / visites", hint: "1 achat = 1 passage · idéal restauration, cafés" },
  { id: "POINTS_BY_AMOUNT", title: "Points selon montant", hint: "Ex : 1 € = 1 point" },
  { id: "FIXED_POINTS", title: "Points fixes par achat", hint: "Ex : 20 points par visite" },
  { id: "AMOUNT_TIERS", title: "Paliers de montant", hint: "Plus le panier est élevé, plus le gain augmente" },
];

const DEMO_CONFIG: ProgramConfig = {
  mode: "POINTS_BY_AMOUNT",
  rules: { pointsPerAmount: 1, amountForPoints: 1, minPurchase: 0, rounding: "floor" },
  rewards: [
    { id: "r1", name: "Boisson offerte", threshold: 500, thresholdUnit: "points", rewardType: "FREE_PRODUCT", isActive: true, sortOrder: 0 },
    { id: "r2", name: "5 € de réduction", threshold: 1000, thresholdUnit: "points", rewardType: "FIXED_DISCOUNT", value: 5, isActive: true, sortOrder: 1 },
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

export function ProgramConfigurator({
  demo = false,
  view = "program",
}: {
  demo?: boolean;
  view?: "program" | "advantages";
}) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<LoyaltyMode>("VISITS");
  const [activeMode, setActiveMode] = useState<LoyaltyMode>("VISITS");
  const [activeRules, setActiveRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [activeVersion, setActiveVersion] = useState<number | null>(null);
  const [rules, setRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [rewards, setRewards] = useState<RewardConfig[]>([]);
  const [status, setStatus] = useState("ACTIVE");
  const [hasDraft, setHasDraft] = useState(false);
  const [impact, setImpact] = useState<{ customers: number; totalPoints: number; rewardsUnlocked: number } | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [simPurchase, setSimPurchase] = useState("28");
  const [simBalance, setSimBalance] = useState("480");
  const [simResult, setSimResult] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modeDecision, setModeDecision] = useState<"ARCHIVE_OLD" | "CONVERT">("ARCHIVE_OLD");
  const [rewardConfirm, setRewardConfirm] = useState<{ index: number; kind: "deactivate" | "delete" } | null>(null);
  const [rewardEditor, setRewardEditor] = useState<{ mode: "create" | "edit"; index: number | null } | null>(null);
  const [advantagesTab, setAdvantagesTab] = useState<"active" | "scheduled" | "archived">("active");
  const [reorderMode, setReorderMode] = useState(false);
  const [openRewardMenu, setOpenRewardMenu] = useState<string | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [historicalEntitlements, setHistoricalEntitlements] = useState<HistoricalEntitlement[]>([]);
  const [cardTemplate, setCardTemplate] = useState<MerchantCardData["cardTemplate"]>(null);
  const [templateVersion, setTemplateVersion] = useState<number | null>(null);
  const [templateFallbackNotice, setTemplateFallbackNotice] = useState<string | null>(null);
  const [merchantMeta, setMerchantMeta] = useState<{
    id: string;
    name: string;
    logoUrl: string | null;
    primaryColor: string;
  }>({
    id: "preview",
    name: "Mon commerce",
    logoUrl: null,
    primaryColor: "#8557ff",
  });

  const loadPreviewTemplate = useCallback(
    async (selectedMode: LoyaltyMode) => {
      if (demo) return;
      const res = await fetch(`/api/merchant/card-template?mode=${selectedMode}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setCardTemplate(null);
        setTemplateVersion(null);
        setTemplateFallbackNotice("Aucune carte publiée pour ce mode.");
        return;
      }
      setCardTemplate(data.template ?? null);
      setTemplateVersion(data.templateVersion ?? null);
      if (data.usedFallback) {
        setTemplateFallbackNotice("Aucune carte publiée pour ce mode — aperçu de la carte générale");
      } else if (!data.template) {
        setTemplateFallbackNotice("Aucune carte publiée pour ce mode.");
      } else {
        setTemplateFallbackNotice(null);
      }
    },
    [demo],
  );

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
    // Le bloc "Programme actuellement publié" est construit exclusivement
    // depuis data.active — jamais depuis le brouillon ni un état local.
    setActiveMode(data.active.mode);
    setActiveRules(data.active.rules);
    setActiveVersion(typeof data.version === "number" ? data.version : null);
    setHasDraft(Boolean(data.draft));
    setRules(src.rules);
    setRewards(src.rewards);
    setHistoricalEntitlements(data.historicalEntitlements ?? []);
    setStatus(data.status);
    setImpact(data.impact ?? null);
    setPublishedAt(data.publishedAt ?? null);
    if (dashboardRes.ok) {
      const dashboardData = await dashboardRes.json();
      setMerchantMeta({
        id: dashboardData.merchant?.id ?? "preview",
        name: dashboardData.merchant?.name ?? "Mon commerce",
        logoUrl: dashboardData.merchant?.logoUrl ?? null,
        primaryColor: dashboardData.merchant?.primaryColor ?? "#8557ff",
      });
    }
    await loadPreviewTemplate(src.mode);
  }, [demo, loadPreviewTemplate]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setRules(DEFAULT_RULES[mode]);
  }, [mode]);

  useEffect(() => {
    void loadPreviewTemplate(mode);
  }, [mode, loadPreviewTemplate]);

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

  async function runSimulate() {
    const payload = {
      purchaseAmount: Number(simPurchase) || 0,
      currentBalance: Number(simBalance) || 0,
      mode,
      rules,
      rewards,
    };
    if (demo) {
      const earned = mode === "POINTS_BY_AMOUNT" ? Math.floor(Number(simPurchase) || 0) : 1;
      const nb = (Number(simBalance) || 0) + earned;
      setSimResult(`Achat de ${simPurchase} € → +${earned} points → nouveau solde : ${nb} points`);
      return;
    }
    const res = await fetch("/api/merchant/program?action=simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) setSimResult(data.label);
  }

  async function publish(confirmed = false) {
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
        body: JSON.stringify(
          confirmed
            ? {
                modeChangeDecision:
                  modeDecision === "CONVERT"
                    ? { action: "CONVERT", rewards: rewards.filter((reward) => !reward.archivedAt) }
                    : { action: "ARCHIVE_OLD" },
              }
            : {},
        ),
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
    return parts.length ? parts.join(" · ") : "Aucune limite";
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

  function renderRewardCard(reward: RewardConfig, position: number | null, allowReorder: boolean) {
    const index = rewards.indexOf(reward);
    const statusLabel = rewardStatus(reward);
    const isOldProgram = !isCurrentReward(reward);
    const menuOpen = openRewardMenu === reward.id;
    return (
      <div key={reward.id} className="advantages-reward-card space-y-3">
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
            </div>
            <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.description || "Aucune description"}</p>
          </div>
          <div className="advantages-reward-menu">
            <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => openEditReward(index)}>
              Modifier
            </Button>
          </div>
        </div>
        <div className="grid gap-2 text-xs text-[var(--muted-strong)] sm:grid-cols-2">
          <p><strong className="text-[var(--ink-soft)]">Type :</strong> {rewardTypeLabel(reward.rewardType)}</p>
          <p><strong className="text-[var(--ink-soft)]">Seuil :</strong> {reward.threshold} {reward.thresholdUnit === "points" ? "points" : "passages"}</p>
          <p><strong className="text-[var(--ink-soft)]">Validité :</strong> {rewardPeriod(reward)}</p>
          <p><strong className="text-[var(--ink-soft)]">Position :</strong> {position !== null ? `#${position}` : "—"}</p>
          <p className="sm:col-span-2"><strong className="text-[var(--ink-soft)]">Utilisations :</strong> {rewardLimitSummary(reward)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {allowReorder ? (
            <>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={index === 0} onClick={() => moveReward(index, -1)}>Monter</Button>
              <Button variant="secondary" className="h-9 px-3 text-xs" disabled={index === rewards.length - 1} onClick={() => moveReward(index, 1)}>Descendre</Button>
            </>
          ) : null}
          <div className="advantages-reward-menu ml-auto">
            <Button
              variant="ghost"
              className="h-9 px-3 text-xs"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.stopPropagation();
                setOpenRewardMenu(menuOpen ? null : reward.id);
              }}
            >
              Plus d’actions ⋯
            </Button>
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
      </div>
    );
  }

  function renderAdvantagesEditor() {
    const tabs: { id: "active" | "scheduled" | "archived"; label: string; items: RewardConfig[]; empty: string }[] = [
      { id: "active", label: "Actifs", items: activeTabRewards, empty: "Aucun avantage actif pour le moment." },
      { id: "scheduled", label: "Programmés", items: scheduledTabRewards, empty: "Aucun avantage programmé." },
      { id: "archived", label: "Archivés", items: archivedConfiguredRewards, empty: "Aucun avantage archivé." },
    ];
    const activeTabDef = tabs.find((t) => t.id === advantagesTab) ?? tabs[0]!;

    return (
      <div className="space-y-5" onClick={() => setOpenRewardMenu(null)}>
        <div className="campaign-quota-grid">
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Avantages actifs</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{activeRewardCount}</p>
          </div>
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Avantages programmés</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{scheduledRewardCount}</p>
          </div>
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Emplacements utilisés</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{currentRewardCount}/10</p>
          </div>
        </div>

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

        <div className="advantages-toolbar">
          <Button variant="secondary" className="h-9 px-3 text-xs" onClick={openCreateReward}>
            Créer un avantage
          </Button>
          {activeTabDef.id === "active" && activeTabDef.items.length > 1 ? (
            <Button
              variant={reorderMode ? "primary" : "ghost"}
              className="h-9 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setReorderMode((v) => !v);
              }}
            >
              {reorderMode ? "Terminer la réorganisation" : "Réorganiser"}
            </Button>
          ) : null}
        </div>

        <section className="space-y-3" role="tabpanel">
          {activeTabDef.items.length ? (
            activeTabDef.items.map((reward, i) =>
              renderRewardCard(reward, activeTabDef.id === "active" ? i + 1 : null, activeTabDef.id === "active" && reorderMode),
            )
          ) : (
            <EmptyState title={activeTabDef.empty} />
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-[var(--ink)]">Droits clients conservés</h2>
          {historicalEntitlements.length ? (
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
          ) : (
            <p className="program-step-card text-sm text-[var(--muted-strong)]">Aucun droit historique disponible.</p>
          )}
        </section>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={savingDraft} onClick={() => void saveDraft()}>
            {savingDraft ? "Enregistrement…" : "Enregistrer le brouillon"}
          </Button>
          <Button disabled={publishing} onClick={() => void publish(confirmOpen || activeMode !== mode)}>
            {publishing ? "Publication…" : "Publier les modifications"}
          </Button>
        </div>
      </div>
    );
  }

  if (view === "advantages") {
    const confirmingReward = rewardConfirm ? rewards[rewardConfirm.index] : null;
    const editingReward = rewardEditor?.mode === "edit" && rewardEditor.index !== null ? (rewards[rewardEditor.index] ?? null) : null;
    return (
      <div className="space-y-6">
        <MerchantPageHeader
          backHref="/app/fidelisation"
          eyebrow="Programme de fidélité"
          title="Avantages"
          subtitle={dirty ? "Modifications non enregistrées" : `${currentRewardCount}/10 avantages`}
        />
        <p className="text-sm text-[var(--muted-strong)]">
          Un avantage est débloqué automatiquement dès qu&apos;un client atteint le seuil défini. Créez-en plusieurs pour
          récompenser la fidélité par paliers.
        </p>
        {error ? <Alert>{error}</Alert> : null}
        {ok ? <Alert tone="ok">{ok}</Alert> : null}
        {renderAdvantagesEditor()}
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        backHref="/app/fidelisation"
        eyebrow="Configurateur"
        title="Programme de fidélité"
        subtitle={dirty ? "Modifications non enregistrées" : hasDraft ? "Brouillon" : "Programme actif"}
      />

      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      <p className="text-sm text-[var(--muted-strong)]">
        Choisissez comment vos clients gagnent des points ou passages, réglez les limites, puis publiez : vos clients
        ne voient les changements qu&apos;une fois le programme publié.
      </p>

      {/* Bloc "Programme actuellement publié" : construit exclusivement
          depuis data.active (activeMode/activeRules/activeVersion), jamais
          depuis le brouillon, un état local ou une valeur par défaut. */}
      <section className="program-step-card space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Programme actuellement publié</p>
        <p className="text-lg font-black text-[var(--ink)]">{modeTitle(activeMode)}</p>
        <p className="text-sm text-[var(--muted-strong)]">Version {activeVersion ?? "—"}</p>
        <p className="text-sm text-[var(--muted-strong)]">{publishedEarnDescription(activeMode, activeRules)}</p>
        {publishedMinimumPurchaseLabel(activeRules) ? (
          <p className="text-sm text-[var(--muted-strong)]">{publishedMinimumPurchaseLabel(activeRules)}</p>
        ) : null}
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--positive)]">Statut : Publié</p>
        {publishedAt ? (
          <p className="text-xs text-[var(--muted)]">
            Dernière publication : {new Date(publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        ) : null}
      </section>

      {impact ? (
        <div className="campaign-quota-grid">
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Clients inscrits</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{impact.customers}</p>
          </div>
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Points/passages cumulés</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{impact.totalPoints}</p>
          </div>
          <div className="metric-card p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Récompenses débloquées</p>
            <p className="mt-1 text-xl font-black text-[var(--ink)]">{impact.rewardsUnlocked}</p>
          </div>
        </div>
      ) : null}

      {hasDraft ? (
        <section className="rounded-xl border border-amber-300/25 bg-amber-400/10 p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-black text-amber-100">Brouillon non publié</h2>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-100">
              Brouillon
            </span>
          </div>
          <p className="text-xs text-amber-100/90">
            Ce brouillon n&apos;est pas encore visible par les clients.
            Le programme actuellement publié reste « {modeTitle(activeMode)} ».
          </p>
        </section>
      ) : null}

      <Link
        href="/app/parametres/avantages"
        className="program-step-card flex flex-col gap-3 transition hover:border-[var(--violet)]/40 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Avantages configurés</p>
          <p className="mt-1 text-lg font-black text-[var(--ink)]">{currentRewardCount}/10</p>
        </div>
        <span className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-bold text-[var(--violet-bright)]">
          Gérer les avantages
        </span>
      </Link>

      <nav className="program-steps-bar" aria-label="Étapes de configuration">
        {PROGRAM_STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn("program-step-tab", step === i && "program-step-tab-active")}
          >
            <span className="program-step-tab-number">{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="program-workspace">
        <div className="space-y-6">
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted-strong)]">
            Le mode définit ce que vos clients cumulent à chaque achat : des passages (une visite = un cran) ou des
            points (proportionnels au montant dépensé, ou fixes par achat).
          </p>
          {hasDraft ? (
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Brouillon non publié — mode sélectionné dans le formulaire
            </p>
          ) : null}
          <div className="program-mode-grid space-y-3 lg:space-y-0">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  markDirty();
                }}
                className={cn("program-mode-option", mode === m.id && "program-mode-option-active")}
              >
                <span className="font-bold text-[var(--ink)]">{m.title}</span>
                <span className="text-xs text-[var(--muted)]">{m.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="program-step-card space-y-4">
          {mode === "VISITS" && (
            <>
              <Field label="Passages par visite" hint="Nombre de passages ajoutés à chaque validation en caisse.">
                <Input type="number" min={1} value={rules.visitsPerScan ?? 1} onChange={(e) => { setRules({ ...rules, visitsPerScan: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Montant minimum (€)" hint="0 = aucun montant minimum pour valider un passage.">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Délai minimum entre passages (min)" hint="Empêche de valider deux passages trop rapprochés pour le même client. 0 = aucun délai.">
                <Input type="number" min={0} value={rules.minIntervalMinutes ?? 0} onChange={(e) => { setRules({ ...rules, minIntervalMinutes: Number(e.target.value) }); markDirty(); }} />
              </Field>
            </>
          )}
          {mode === "POINTS_BY_AMOUNT" && (
            <>
              <p className="text-xs text-[var(--muted-strong)]">
                Ex : 1 point gagné pour chaque tranche de 1 € dépensée.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Points gagnés">
                  <Input type="number" min={1} value={rules.pointsPerAmount ?? 1} onChange={(e) => { setRules({ ...rules, pointsPerAmount: Number(e.target.value) }); markDirty(); }} />
                </Field>
                <Field label="Pour montant (€)">
                  <Input type="number" min={0.01} step={0.01} value={rules.amountForPoints ?? 1} onChange={(e) => { setRules({ ...rules, amountForPoints: Number(e.target.value) }); markDirty(); }} />
                </Field>
              </div>
              <Field label="Montant minimum transaction (€)" hint="0 = tous les achats font gagner des points.">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Arrondi" hint="Comment arrondir les points quand le calcul tombe entre deux valeurs.">
                <select className="merchant-search-input !pl-3" value={rules.rounding ?? "floor"} onChange={(e) => { setRules({ ...rules, rounding: e.target.value as "floor" | "round" }); markDirty(); }}>
                  <option value="floor">À l&apos;unité inférieure</option>
                  <option value="round">Au plus proche</option>
                </select>
              </Field>
            </>
          )}
          {mode === "FIXED_POINTS" && (
            <>
              <Field label="Points par achat" hint="Ex : 20 points offerts, quel que soit le montant dépensé.">
                <Input type="number" min={1} value={rules.fixedPointsPerPurchase ?? 20} onChange={(e) => { setRules({ ...rules, fixedPointsPerPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Montant minimum (€)" hint="0 = tous les achats font gagner des points.">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
            </>
          )}
          {mode === "AMOUNT_TIERS" && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--muted-strong)]">
                Plus le panier est élevé, plus le gain augmente. Définissez des tranches de montant sans trou ni
                chevauchement (Min €, Max € et Gain pour chaque palier).
              </p>
              {(rules.amountTiers ?? []).map((tier, i) => (
                <div key={tier.id} className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="Min €" value={tier.minAmount} onChange={(e) => {
                    const tiers = [...(rules.amountTiers ?? [])];
                    tiers[i] = { ...tier, minAmount: Number(e.target.value) };
                    setRules({ ...rules, amountTiers: tiers });
                    markDirty();
                  }} />
                  <Input type="number" placeholder="Max €" value={tier.maxAmount ?? ""} onChange={(e) => {
                    const tiers = [...(rules.amountTiers ?? [])];
                    tiers[i] = { ...tier, maxAmount: e.target.value ? Number(e.target.value) : null };
                    setRules({ ...rules, amountTiers: tiers });
                    markDirty();
                  }} />
                  <Input type="number" placeholder="Gain" value={tier.earnValue} onChange={(e) => {
                    const tiers = [...(rules.amountTiers ?? [])];
                    tiers[i] = { ...tier, earnValue: Number(e.target.value) };
                    setRules({ ...rules, amountTiers: tiers });
                    markDirty();
                  }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="program-step-card space-y-4">
          <Field
            label="Maximum par client et par jour (0 = illimité)"
            hint="Limite le nombre de gains qu'un même client peut cumuler en une journée."
          >
            <Input type="number" min={0} value={rules.maxPerDay ?? 0} onChange={(e) => { setRules({ ...rules, maxPerDay: Number(e.target.value) }); markDirty(); }} />
          </Field>
          <Field
            label="Expiration des points (mois, vide = jamais)"
            hint="Après ce délai depuis leur obtention, les points ou passages non utilisés sont perdus."
          >
            <Input type="number" min={0} placeholder="Jamais" value={rules.pointsExpiryMonths ?? ""} onChange={(e) => { setRules({ ...rules, pointsExpiryMonths: e.target.value ? Number(e.target.value) : null }); markDirty(); }} />
          </Field>
          <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
            Motif obligatoire pour toute correction manuelle. Délai minimum entre deux scans du même client configurable à l&apos;étape Règle.
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted-strong)]">
            L&apos;aperçu à droite reflète en direct le mode et la règle choisis. Utilisez le simulateur pour vérifier un
            cas concret avant de publier.
          </p>
          <div className="program-step-card space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Tester mon programme</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Montant achat (€)">
                <Input value={simPurchase} onChange={(e) => setSimPurchase(e.target.value)} />
              </Field>
              <Field label="Solde actuel">
                <Input value={simBalance} onChange={(e) => setSimBalance(e.target.value)} />
              </Field>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => void runSimulate()}>
              Simuler
            </Button>
            {simResult ? <p className="text-sm font-semibold text-[var(--positive)]">{simResult}</p> : null}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="program-step-card space-y-4">
          <h3 className="font-black text-[var(--ink)]">Récapitulatif avant publication</h3>
          <ul className="space-y-2 text-sm text-[var(--muted-strong)]">
            <li>Mode : <strong className="text-[var(--ink)]">{MODES.find((m) => m.id === mode)?.title}</strong></li>
            <li>{rewards.filter((r) => r.isActive).length} avantage(s) actif(s)</li>
            <li>Les soldes clients existants ne seront pas effacés.</li>
          </ul>
          {confirmOpen ? (
            <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4">
              <h4 className="font-black text-[var(--ink)]">Que souhaitez-vous faire des avantages actuels ?</h4>
              <div className="mt-3 grid gap-2">
                <label className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <input type="radio" checked={modeDecision === "ARCHIVE_OLD"} onChange={() => setModeDecision("ARCHIVE_OLD")} />
                  <span>Archiver les anciens avantages. Ils ne seront plus proposés aux nouveaux clients et l'historique reste conservé.</span>
                </label>
                <label className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <input type="radio" checked={modeDecision === "CONVERT"} onChange={() => setModeDecision("CONVERT")} />
                  <span>Convertir les avantages. Les équivalences ci-dessus seront publiées comme nouveau catalogue.</span>
                </label>
              </div>
              {modeDecision === "CONVERT" ? (
                <p className="mt-3 text-xs text-[var(--muted-strong)]">
                  Vérifiez chaque nom, seuil, unité, activation et validité sur la page Avantages avant de confirmer.
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={savingDraft} onClick={() => void saveDraft()}>
              {savingDraft ? "Enregistrement…" : "Enregistrer le brouillon"}
            </Button>
            <Button disabled={publishing} onClick={() => void publish(confirmOpen || activeMode !== mode)}>
              {publishing ? "Publication…" : "Publier les modifications"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3 pt-2">
        <Button
          variant="ghost"
          className="h-10 px-4 text-xs"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Précédent
        </Button>
        {step !== PROGRAM_STEPS.length - 1 ? (
          <Button className="h-10 px-4 text-xs" onClick={() => setStep((s) => Math.min(PROGRAM_STEPS.length - 1, s + 1))}>
            Suivant
          </Button>
        ) : null}
      </div>
        </div>

        <aside className="program-preview-panel">
          <div className="program-step-card">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Aperçu côté client</p>
            <div className="mt-4 flex flex-col items-center">
              <div className="w-full max-w-sm">
                <ProgramPreviewCard
                  merchantId={merchantMeta.id}
                  merchantName={merchantMeta.name}
                  logoUrl={merchantMeta.logoUrl}
                  primaryColor={merchantMeta.primaryColor}
                  loyaltyMode={mode}
                  templateVersion={templateVersion}
                  fallbackNotice={templateFallbackNotice}
                  points={Number(simBalance) || 320}
                  visitsRequired={rewards.find((r) => r.isActive && isCurrentReward(r))?.threshold ?? 500}
                  rewardLabel={rewards.find((r) => r.isActive && isCurrentReward(r))?.name ?? "Récompense"}
                  cardTemplate={cardTemplate}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--ink)]">
                Prochain : {rewards.find((r) => r.isActive && isCurrentReward(r))?.name ?? "—"}
              </p>
            </div>
            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-strong)]">Progression</span>
                <span className="font-bold text-[var(--ink)]">{modeTitle(mode)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-strong)]">Avantages actifs</span>
                <span className="font-bold text-[var(--ink)]">{currentRewardCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted-strong)]">Modification</span>
                <span className="font-bold text-[var(--ink)]">Non visible avant publication</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
