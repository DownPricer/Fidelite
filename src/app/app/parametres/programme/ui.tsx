"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";
import { ProgramPreviewCard } from "@/components/merchant/program-preview-card";
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

function ModeIcon({ id, className = "h-[18px] w-[18px]" }: { id: LoyaltyMode; className?: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, className };
  switch (id) {
    case "VISITS":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01" strokeLinecap="round" />
        </svg>
      );
    case "POINTS_BY_AMOUNT":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="5" />
          <circle cx="15" cy="15" r="5" />
        </svg>
      );
    case "FIXED_POINTS":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      );
    case "AMOUNT_TIERS":
      return (
        <svg {...common}>
          <path d="M5 19V13M12 19V9M19 19V5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

const MODES: { id: LoyaltyMode; title: string; hint: string; recommended?: boolean }[] = [
  { id: "VISITS", title: "Passages / visites", hint: "1 achat = 1 passage · idéal restauration, cafés", recommended: true },
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

/**
 * Écran "Programme de fidélité" : mode de progression, règle de gain,
 * limites, aperçu et publication. Suit la maquette
 * fidelo-loyalty-program-redesign-v2 (bandeau "programme publié", 5 étapes,
 * atelier deux colonnes). La gestion des avantages (création / édition /
 * archivage) vit désormais dans avantages/advantages-ui.tsx.
 */
export function ProgramConfigurator({ demo = false }: { demo?: boolean }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<LoyaltyMode>("VISITS");
  const [activeMode, setActiveMode] = useState<LoyaltyMode>("VISITS");
  const [activeRules, setActiveRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [activeVersion, setActiveVersion] = useState<number | null>(null);
  const [rules, setRules] = useState<ProgramRules>(DEFAULT_RULES.VISITS);
  const [rewards, setRewards] = useState<RewardConfig[]>([]);
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
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
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

  function unitForMode(value: LoyaltyMode) {
    return value === "VISITS" || value === "AMOUNT_TIERS" ? "visits" : "points";
  }

  function isCurrentReward(reward: RewardConfig) {
    return reward.thresholdUnit === unitForMode(mode) && !reward.archivedAt;
  }

  const currentRewardCount = rewards.filter(isCurrentReward).length;
  const nextReward = rewards.find((r) => r.isActive && isCurrentReward(r));

  async function saveDraft() {
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

  function goToStep(index: number) {
    setStep(Math.max(0, Math.min(PROGRAM_STEPS.length - 1, index)));
  }

  function primaryFooterAction() {
    if (step === PROGRAM_STEPS.length - 1) {
      void publish(confirmOpen || activeMode !== mode);
    } else {
      goToStep(step + 1);
    }
  }

  return (
    <div className="space-y-5">
      <MerchantPageHeader
        backHref="/app/fidelisation"
        eyebrow="Configuration"
        title="Programme de fidélité"
        subtitle="Définissez comment vos clients progressent. Chaque étape reste modifiable avant la publication."
        action={
          <span className={cn("merchant-status-badge", hasDraft || dirty ? "merchant-status-badge-warn" : "merchant-status-badge-ok")}>
            {dirty ? "Modifications non enregistrées" : hasDraft ? "Brouillon non publié" : "Programme publié"}
          </span>
        }
      />

      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      {/* Bloc "Programme actuellement publié" : construit exclusivement
          depuis data.active (activeMode/activeRules/activeVersion), jamais
          depuis le brouillon, un état local ou une valeur par défaut. */}
      <section className="program-live-strip" aria-label="Programme actuellement publié">
        <div className="program-live-copy">
          <span className="program-live-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]">
              <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
              <path d="M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[var(--ink)]">
              Programme actuellement en ligne : {modeTitle(activeMode)}
              {activeVersion ? ` · v${activeVersion}` : ""}
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
              {publishedEarnDescription(activeMode, activeRules)}
              {publishedMinimumPurchaseLabel(activeRules) ? ` · ${publishedMinimumPurchaseLabel(activeRules)}` : ""}
              {publishedAt
                ? ` · Publié le ${new Date(publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`
                : ""}
            </p>
          </div>
        </div>
        <a href="/app/parametres/avantages" className="shrink-0">
          <Button variant="secondary" className="h-9 px-3 text-xs">Gérer les avantages</Button>
        </a>
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

      <nav className="program-steps-bar" aria-label="Étapes de configuration">
        {PROGRAM_STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => goToStep(i)}
            className={cn("program-step-tab", step === i && "program-step-tab-active")}
          >
            <span className="program-step-tab-number">{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="program-workspace">
        <div className="program-step-card">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">Comment vos clients progressent-ils ?</h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  Choisissez un fonctionnement simple à expliquer en caisse. Vous pourrez modifier les détails à
                  l&apos;étape suivante.
                </p>
              </div>
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
                    <span className="program-mode-option-icon"><ModeIcon id={m.id} /></span>
                    <span className="program-mode-option-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-[11px] w-[11px]">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="mt-2 font-bold text-[var(--ink)]">
                      {m.title}
                      {m.recommended ? <span className="program-recommended-pill">Recommandé</span> : null}
                    </span>
                    <span className="text-xs text-[var(--muted)]">{m.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">Définissez la règle</h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  Réglez précisément ce que le client gagne lors d&apos;une validation.
                </p>
              </div>
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
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">Encadrez les validations</h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  Ces limites réduisent les erreurs sans ralentir le passage en caisse.
                </p>
              </div>
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
                Motif obligatoire pour toute correction manuelle. Délai minimum entre deux scans du même client
                configurable à l&apos;étape Règle.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">Vérifiez le parcours client</h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  L&apos;aperçu à droite reflète en direct le mode et la règle choisis. Utilisez le simulateur pour
                  vérifier un cas concret avant de publier.
                </p>
              </div>
              <div className="space-y-3 rounded-xl border border-[rgba(190,164,255,0.14)] p-4">
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
              <div className="program-publish-list space-y-2">
                <div className="program-checkline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
                  <span>Mode : {modeTitle(mode)}</span>
                </div>
                <div className="program-checkline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]"><path d="M6 12h12M12 6v12" strokeLinecap="round" /></svg>
                  <span>Règle : {publishedEarnDescription(mode, rules)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-[var(--ink)]">Prêt à publier</h2>
                <p className="mt-1 text-xs text-[var(--muted-strong)]">
                  La nouvelle configuration remplacera le programme actuellement visible par vos clients.
                </p>
              </div>
              <div className="program-publish-list space-y-2">
                <div className="program-checkline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Mode : <strong className="text-[var(--ink)]">{modeTitle(mode)}</strong></span>
                </div>
                <div className="program-checkline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>{rewards.filter((r) => r.isActive).length} avantage(s) actif(s)</span>
                </div>
                <div className="program-checkline">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[18px] w-[18px]"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Les soldes clients existants ne seront pas effacés.</span>
                </div>
              </div>
              {confirmOpen ? (
                <div className="rounded-2xl border border-violet-300/20 bg-violet-400/10 p-4">
                  <h4 className="font-black text-[var(--ink)]">Que souhaitez-vous faire des avantages actuels ?</h4>
                  <div className="mt-3 grid gap-2">
                    <label className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <input type="radio" checked={modeDecision === "ARCHIVE_OLD"} onChange={() => setModeDecision("ARCHIVE_OLD")} />
                      <span>Archiver les anciens avantages. Ils ne seront plus proposés aux nouveaux clients et l&apos;historique reste conservé.</span>
                    </label>
                    <label className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <input type="radio" checked={modeDecision === "CONVERT"} onChange={() => setModeDecision("CONVERT")} />
                      <span>Convertir les avantages. Les équivalences ci-dessus seront publiées comme nouveau catalogue.</span>
                    </label>
                  </div>
                  {modeDecision === "CONVERT" ? (
                    <p className="mt-3 text-xs text-[var(--muted-strong)]">
                      Vérifiez chaque nom, seuil, unité, activation et validité sur la page Avantages avant de
                      confirmer.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          <footer className="program-editor-actions">
            <Button variant="ghost" className="h-10 px-4 text-xs" disabled={savingDraft} onClick={() => void saveDraft()}>
              {savingDraft ? "Enregistrement…" : "Enregistrer le brouillon"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-10 px-4 text-xs"
                disabled={step === 0}
                onClick={() => goToStep(step - 1)}
              >
                Précédent
              </Button>
              <Button className="h-10 px-4 text-xs" disabled={publishing} onClick={primaryFooterAction}>
                {step === PROGRAM_STEPS.length - 1
                  ? (publishing ? "Publication…" : "Publier le programme")
                  : "Continuer"}
              </Button>
            </div>
          </footer>
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
                  visitsRequired={nextReward?.threshold ?? 500}
                  rewardLabel={nextReward?.name ?? "Récompense"}
                  cardTemplate={cardTemplate}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--ink)]">
                Prochain : {nextReward?.name ?? "—"}
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
