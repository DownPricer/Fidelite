"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Field, Input, cn } from "@/components/ui";
import { MerchantPageHeader } from "@/components/merchant/merchant-ui";
import type { LoyaltyMode } from "@prisma/client";
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

  const load = useCallback(async () => {
    if (demo) {
      setMode(DEMO_CONFIG.mode);
      setRules(DEMO_CONFIG.rules);
      setRewards(DEMO_CONFIG.rewards);
      return;
    }
    const res = await fetch("/api/merchant/program");
    const data = await res.json();
    if (!res.ok) return;
    const src = data.draft ?? data.active;
    setMode(src.mode);
    setRules(src.rules);
    setRewards(src.rewards);
    setStatus(data.status);
  }, [demo]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setRules(DEFAULT_RULES[mode]);
  }, [mode]);

  function markDirty() {
    setDirty(true);
    setOk(null);
  }

  async function saveDraft() {
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
      body: JSON.stringify({ confirmImpact: confirmed }),
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
      },
    ]);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <MerchantPageHeader
        backHref="/app/parametres"
        eyebrow="Configurateur"
        title="Programme de fidélité"
        subtitle={dirty ? "Modifications non enregistrées" : status === "DRAFT" ? "Brouillon" : "Programme actif"}
      />

      {error ? <Alert>{error}</Alert> : null}
      {ok ? <Alert tone="ok">{ok}</Alert> : null}

      <div className="flex gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
              step === i ? "bg-[var(--violet)] text-[var(--ink)]" : "bg-white/6 text-[var(--muted)]",
            )}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-3">
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
          {rewards.map((r, i) => (
            <div key={r.id} className="program-step-card space-y-2">
              <Field label="Nom">
                <Input value={r.name} onChange={(e) => {
                  const next = [...rewards];
                  next[i] = { ...r, name: e.target.value };
                  setRewards(next);
                  markDirty();
                }} />
              </Field>
              <Field label="Seuil">
                <Input type="number" value={r.threshold} onChange={(e) => {
                  const next = [...rewards];
                  next[i] = { ...r, threshold: Number(e.target.value) };
                  setRewards(next);
                  markDirty();
                }} />
              </Field>
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
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--violet)]/20 text-2xl font-black text-[var(--violet-bright)]">FL</div>
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
            <Alert>Changement de mode détecté. Confirmez pour appliquer aux prochaines transactions.</Alert>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void saveDraft()}>
              Enregistrer le brouillon
            </Button>
            <Button onClick={() => void publish(confirmOpen)}>
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
  );
}
