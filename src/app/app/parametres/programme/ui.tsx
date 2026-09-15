"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";
import { ProgramPreviewCard } from "@/components/merchant/program-preview-card";
import type { LoyaltyMode } from "@prisma/client";
import type { MerchantCardData } from "@/components/fife-life/types";
import type { ProgramConfig, RewardConfig, ProgramRules } from "@/lib/loyalty-program";
import { DEFAULT_RULES } from "@/lib/loyalty-program";

const STEPS = ["Mode", "Règle", "Avantages", "Limites", "Aperçu", "Publication"];

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

export function ProgramConfigurator({ demo = false }: { demo?: boolean }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<LoyaltyMode>("VISITS");
  const [activeMode, setActiveMode] = useState<LoyaltyMode>("VISITS");
  const [rules, setRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [rewards, setRewards] = useState<RewardConfig[]>([]);
  const [status, setStatus] = useState("ACTIVE");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [simPurchase, setSimPurchase] = useState("28");
  const [simBalance, setSimBalance] = useState("480");
  const [simResult, setSimResult] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modeDecision, setModeDecision] = useState<"ARCHIVE_OLD" | "CONVERT">("ARCHIVE_OLD");
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
    setActiveMode(data.active.mode);
    setRules(src.rules);
    setRewards(src.rewards);
    setStatus(data.status);
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
    if (rewards.filter((reward) => !reward.archivedAt).length > 10) {
      setError("Vous avez atteint la limite de 10 avantages pour ce programme.");
      return;
    }
    if (demo) {
      setOk("Brouillon enregistré (démo).");
      setDirty(false);
      return;
    }
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
  }

  function addReward() {
    if (rewards.filter(isCurrentReward).length >= 10) {
      setError("Vous avez atteint la limite de 10 avantages pour ce programme.");
      return;
    }
    markDirty();
    setRewards((r) => [
      ...r,
      {
        id: `new-${Date.now()}`,
        name: "Nouvelle récompense",
        threshold: 10,
        thresholdUnit: mode === "VISITS" || mode === "AMOUNT_TIERS" ? "visits" : "points",
        rewardType: "CUSTOM",
        isActive: true,
        sortOrder: r.length,
        archivedAt: null,
      },
    ]);
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

  function updateReward(index: number, patch: Partial<RewardConfig>) {
    const next = [...rewards];
    next[index] = { ...next[index]!, ...patch };
    setRewards(next);
    markDirty();
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

  return (
    <div className="space-y-6">
      <MerchantPageHeader
        backHref="/app/parametres"
        eyebrow="Configurateur"
        title="Programme de fidélité"
        subtitle={dirty ? "Modifications non enregistrées" : status === "DRAFT" ? "Brouillon" : "Programme actif"}
      />

      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      <div className="program-config-layout">
        <nav className="program-steps-nav">
          <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider lg:w-full lg:text-xs",
                  step === i ? "bg-[var(--violet)] text-[var(--ink)]" : "bg-white/6 text-[var(--muted)]",
                )}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-6">
      {step === 0 && (
        <div className="space-y-4">
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
          <div className="program-step-card">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Aperçu carte client</p>
            <div className="mt-4 flex justify-center">
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
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="program-step-card space-y-4">
          {mode === "VISITS" && (
            <>
              <Field label="Passages par visite">
                <Input type="number" min={1} value={rules.visitsPerScan ?? 1} onChange={(e) => { setRules({ ...rules, visitsPerScan: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Montant minimum (€)">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Délai minimum entre passages (min)">
                <Input type="number" min={0} value={rules.minIntervalMinutes ?? 0} onChange={(e) => { setRules({ ...rules, minIntervalMinutes: Number(e.target.value) }); markDirty(); }} />
              </Field>
            </>
          )}
          {mode === "POINTS_BY_AMOUNT" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Points gagnés">
                  <Input type="number" min={1} value={rules.pointsPerAmount ?? 1} onChange={(e) => { setRules({ ...rules, pointsPerAmount: Number(e.target.value) }); markDirty(); }} />
                </Field>
                <Field label="Pour montant (€)">
                  <Input type="number" min={0.01} step={0.01} value={rules.amountForPoints ?? 1} onChange={(e) => { setRules({ ...rules, amountForPoints: Number(e.target.value) }); markDirty(); }} />
                </Field>
              </div>
              <Field label="Montant minimum transaction (€)">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Arrondi">
                <select className="merchant-search-input !pl-3" value={rules.rounding ?? "floor"} onChange={(e) => { setRules({ ...rules, rounding: e.target.value as "floor" | "round" }); markDirty(); }}>
                  <option value="floor">À l&apos;unité inférieure</option>
                  <option value="round">Au plus proche</option>
                </select>
              </Field>
            </>
          )}
          {mode === "FIXED_POINTS" && (
            <>
              <Field label="Points par achat">
                <Input type="number" min={1} value={rules.fixedPointsPerPurchase ?? 20} onChange={(e) => { setRules({ ...rules, fixedPointsPerPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
              <Field label="Montant minimum (€)">
                <Input type="number" min={0} value={rules.minPurchase ?? 0} onChange={(e) => { setRules({ ...rules, minPurchase: Number(e.target.value) }); markDirty(); }} />
              </Field>
            </>
          )}
          {mode === "AMOUNT_TIERS" && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--muted)]">Paliers sans trou ni chevauchement.</p>
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
        <div className="space-y-3">
          <div className="program-step-card space-y-1">
            <h2 className="text-base font-black text-[var(--ink)]">Avantages</h2>
            <p className="text-sm text-[var(--muted-strong)]">
              {rewards.filter(isCurrentReward).length} / 10 avantages configurés non archivés.
            </p>
            {rewards.some((reward) => !reward.archivedAt && reward.thresholdUnit !== unitForMode(mode)) ? (
              <p className="mt-2 rounded-xl border border-amber-300/25 bg-amber-400/10 p-3 text-xs font-semibold text-amber-100">
                Certains avantages appartiennent à votre ancien programme. Choisissez un équivalent pour terminer leur conversion.
              </p>
            ) : null}
          </div>
          {rewards.map((r, i) => (
            <div key={r.id} className="program-step-card space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {isCurrentReward(r) ? "Avantage du programme actuel" : "Ancien avantage"} {i + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{r.name}</p>
                </div>
                <span className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-black uppercase",
                  rewardStatus(r) === "Actif" ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100" :
                  rewardStatus(r) === "Futur" ? "border-violet-300/25 bg-violet-400/10 text-violet-100" :
                  "border-white/10 bg-white/5 text-[var(--muted)]",
                )}>{rewardStatus(r)}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Nom">
                  <Input value={r.name} onChange={(e) => updateReward(i, { name: e.target.value })} />
                </Field>
                <Field label={`Seuil (${r.thresholdUnit === "points" ? "points" : "passages"})`}>
                  <Input type="number" min={1} value={r.threshold} onChange={(e) => updateReward(i, { threshold: Number(e.target.value) })} />
                </Field>
                <Field label="Description">
                  <Input value={r.description ?? ""} onChange={(e) => updateReward(i, { description: e.target.value })} />
                </Field>
                <Field label="Unité réelle">
                  <select className="merchant-search-input !pl-3" value={r.thresholdUnit} onChange={(e) => updateReward(i, { thresholdUnit: e.target.value as "visits" | "points" })}>
                    <option value="visits">Passages</option>
                    <option value="points">Points</option>
                  </select>
                </Field>
                <Field label="Début de validité">
                  <Input type="date" value={r.validFrom?.slice(0, 10) ?? ""} onChange={(e) => updateReward(i, { validFrom: e.target.value || null })} />
                </Field>
                <Field label="Fin de validité">
                  <Input type="date" value={r.validUntil?.slice(0, 10) ?? ""} onChange={(e) => updateReward(i, { validUntil: e.target.value || null })} />
                </Field>
                <Field label="Limite par client">
                  <Input type="number" min={0} placeholder="Illimité" value={r.maxUsesPerCustomer ?? ""} onChange={(e) => updateReward(i, { maxUsesPerCustomer: e.target.value ? Number(e.target.value) : null })} />
                </Field>
                <Field label="Limite globale">
                  <Input type="number" min={0} placeholder="Illimité" value={r.globalLimit ?? ""} onChange={(e) => updateReward(i, { globalLimit: e.target.value ? Number(e.target.value) : null })} />
                </Field>
                <Field label="Délai de réutilisation (jours)">
                  <Input type="number" min={0} placeholder="Aucun" value={r.reuseDelayDays ?? ""} onChange={(e) => updateReward(i, { reuseDelayDays: e.target.value ? Number(e.target.value) : null })} />
                </Field>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" className="h-9 px-3 text-xs" disabled={i === 0} onClick={() => moveReward(i, -1)}>Monter</Button>
                <Button variant="secondary" className="h-9 px-3 text-xs" disabled={i === rewards.length - 1} onClick={() => moveReward(i, 1)}>Descendre</Button>
                <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => updateReward(i, { isActive: !r.isActive })}>
                  {r.isActive ? "Désactiver" : "Activer"}
                </Button>
                <Button variant="danger" className="h-9 px-3 text-xs" onClick={() => updateReward(i, { archivedAt: new Date().toISOString(), isActive: false })}>
                  Archiver
                </Button>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full" onClick={addReward}>
            Ajouter un avantage
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="program-step-card space-y-4">
          <Field label="Maximum par client et par jour (0 = illimité)">
            <Input type="number" min={0} value={rules.maxPerDay ?? 0} onChange={(e) => { setRules({ ...rules, maxPerDay: Number(e.target.value) }); markDirty(); }} />
          </Field>
          <Field label="Expiration des points (mois, vide = jamais)">
            <Input type="number" min={0} placeholder="Jamais" value={rules.pointsExpiryMonths ?? ""} onChange={(e) => { setRules({ ...rules, pointsExpiryMonths: e.target.value ? Number(e.target.value) : null }); markDirty(); }} />
          </Field>
          <p className="text-xs leading-relaxed text-[var(--muted-strong)]">
            Motif obligatoire pour toute correction manuelle. Délai minimum entre deux scans du même client configurable à l&apos;étape Règle.
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="program-step-card">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Aperçu client</p>
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
                  visitsRequired={rewards.find((r) => r.isActive)?.threshold ?? 500}
                  rewardLabel={rewards.find((r) => r.isActive)?.name ?? "Récompense"}
                  cardTemplate={cardTemplate}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--ink)]">
                Prochain : {rewards.find((r) => r.isActive)?.name ?? "—"}
              </p>
              <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 bg-[var(--violet)]" />
              </div>
            </div>
          </div>
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

      {step === 5 && (
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
                  Vérifiez chaque nom, seuil, unité, activation et validité dans l'étape Avantages avant de confirmer.
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void saveDraft()}>
              Enregistrer le brouillon
            </Button>
            <Button onClick={() => void publish(confirmOpen || activeMode !== mode)}>
              Publier les modifications
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="ghost" className="h-10 px-4 text-xs" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Précédent
        </Button>
        {step < STEPS.length - 1 ? (
          <Button className="h-10 px-4 text-xs" onClick={() => setStep((s) => s + 1)}>
            Suivant
          </Button>
        ) : null}
      </div>
        </div>
      </div>
    </div>
  );
}
