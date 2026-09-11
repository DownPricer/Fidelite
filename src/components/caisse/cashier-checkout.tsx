"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AmountField } from "@/components/caisse/amount-field";
import { Button } from "@/components/ui";
import { commitCaisseTransaction, newIdempotencyKey, previewCaisseTransaction } from "@/lib/caisse-client";
import type { LoyaltyTransactionView } from "@/lib/loyalty-commit";
import type { EvaluatedReward } from "@/lib/loyalty-rewards";
import type { NextBenefitView } from "@/lib/loyalty-engine";
import { tryParsePurchaseAmountToCents } from "@/lib/money";
import type { StaffPermissions } from "@/lib/staff-permissions";
import type { CardTemplateConfig } from "@/lib/card-template-schema";
import type { LoyaltyMode } from "@prisma/client";

export type CashierScanResult = {
  grantId: string;
  firstName: string;
  lastName?: string;
  customerName?: string;
  points: number;
  visitsRequired: number;
  rewardLabel: string;
  rewardAvailable: boolean;
  progressLabel: string;
  programMode?: string;
  requirePurchaseAmount?: boolean;
  earnPreviewLabel?: string;
  nextRewardLabel?: string | null;
  unitLabel?: string;
  rewards?: EvaluatedReward[];
  nextBenefit?: NextBenefitView | null;
  merchant?: {
    name: string;
    slug: string;
    logoUrl: string | null;
    primaryColor: string;
  };
  cardTemplate?: {
    backgroundUrl?: string | null;
    config: CardTemplateConfig;
    loyaltyMode: LoyaltyMode;
  } | null;
};

type Phase = "checkout" | "reward_confirm" | "success";

function statusClass(status: EvaluatedReward["status"]) {
  if (status === "Disponible") return "text-[var(--positive)]";
  if (status === "Expiré" || status === "Indisponible") return "text-[var(--danger)]";
  return "text-[var(--muted-strong)]";
}

function RewardCard({
  reward,
  disabled,
  onUse,
}: {
  reward: EvaluatedReward;
  disabled?: boolean;
  onUse: (reward: EvaluatedReward) => void;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-[var(--ink)]">{reward.name}</h3>
          {reward.description ? (
            <p className="mt-0.5 text-xs text-[var(--muted-strong)]">{reward.description}</p>
          ) : null}
        </div>
        <span className={`shrink-0 text-[10px] font-bold uppercase ${statusClass(reward.status)}`}>
          {reward.status}
        </span>
      </div>
      <p className="mt-1.5 text-xs font-semibold text-[var(--ink)]">Coût : {reward.costLabel}</p>
      {reward.reason && !reward.available ? (
        <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.reason}</p>
      ) : null}
      {reward.available ? (
        <Button className="mt-2 w-full py-2.5 text-sm" disabled={disabled} onClick={() => onUse(reward)}>
          Utiliser cet avantage
        </Button>
      ) : null}
    </article>
  );
}

export function CashierCheckout({
  result,
  permissions,
  demo = false,
  onReset,
}: {
  result: CashierScanResult;
  permissions: StaffPermissions;
  demo?: boolean;
  onReset: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("checkout");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<LoyaltyTransactionView | null>(null);
  const [success, setSuccess] = useState<LoyaltyTransactionView | null>(null);
  const [selectedReward, setSelectedReward] = useState<EvaluatedReward | null>(null);
  const [highlightRewards, setHighlightRewards] = useState(false);
  const [earnKey] = useState(() => newIdempotencyKey());
  const redeemKeyRef = useRef(newIdempotencyKey());
  const earnDoneRef = useRef(false);
  const rewardsSectionRef = useRef<HTMLElement>(null);

  const parsedAmount = useMemo(() => (amount.trim() ? tryParsePurchaseAmountToCents(amount) : null), [amount]);
  const amountCents = parsedAmount?.ok ? parsedAmount.cents : undefined;
  const view = success ?? preview;
  const rewards = view?.rewards ?? result.rewards ?? [];
  const availableRewards = rewards.filter((reward) => reward.available);
  const unavailableRewards = rewards.filter((reward) => !reward.available);
  const nextBenefit = view?.nextBenefit ?? result.nextBenefit ?? null;
  const customerLabel = result.customerName || [result.firstName, result.lastName].filter(Boolean).join(" ");
  const progressLabel = view?.progressLabel ?? result.progressLabel;

  useEffect(() => {
    if (demo || earnDoneRef.current || phase !== "checkout") return;
    const handle = window.setTimeout(async () => {
      if (result.requirePurchaseAmount && amountCents === undefined) {
        setPreview(null);
        return;
      }
      if (amount.trim() && !parsedAmount?.ok) return;
      setPreviewing(true);
      const response = await previewCaisseTransaction({
        grantId: result.grantId,
        action: "EARN",
        purchaseAmountCents: amountCents,
      });
      setPreviewing(false);
      if (response.ok) {
        setPreview(response.data);
        setError(null);
      } else {
        setPreview(null);
        setError(response.data.error ?? "Aperçu impossible.");
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [amount, amountCents, demo, parsedAmount?.ok, phase, result.grantId, result.requirePurchaseAmount]);

  useEffect(() => {
    if (phase !== "success" || availableRewards.length === 0) return;
    setHighlightRewards(true);
    const timer = window.setTimeout(() => setHighlightRewards(false), 1400);
    return () => window.clearTimeout(timer);
  }, [phase, availableRewards.length, success?.points]);

  async function commitEarn() {
    if (busy || earnDoneRef.current) return;
    if (result.requirePurchaseAmount && amountCents === undefined) {
      setError("Indiquez le montant de l'achat.");
      return;
    }
    if (amount.trim() && !parsedAmount?.ok) {
      setError(parsedAmount && !parsedAmount.ok ? parsedAmount.error : "Montant invalide.");
      return;
    }

    if (demo) {
      earnDoneRef.current = true;
      setSuccess({
        ok: true,
        action: "EARN",
        committed: true,
        firstName: result.firstName,
        lastName: result.lastName ?? "",
        customerName: customerLabel,
        points: result.points + 1,
        previousPoints: result.points,
        visitsRequired: result.visitsRequired,
        rewardLabel: result.rewardLabel,
        progressLabel: `${result.points + 1} / ${result.visitsRequired} passages`,
        unitLabel: result.unitLabel ?? "passages",
        programMode: (result.programMode as LoyaltyMode) ?? "VISITS",
        purchaseAmountCents: amountCents ?? 0,
        purchaseAmountLabel: null,
        earned: 1,
        earnLabel: "+1 passage",
        newBalanceLabel: `${result.points + 1} / ${result.visitsRequired} passages`,
        ruleApplied: "Démo",
        block: null,
        previewLines: ["+1 passage"],
        primaryActionLabel: "Valider un passage",
        amountRequired: false,
        nextTierHint: null,
        appliedTierLabel: null,
        rewards: result.rewards ?? [],
        nextBenefit: result.nextBenefit ?? null,
        unlockedRewards: [],
        successTitle: "Passage validé",
        successMessage: `Nouveau solde : ${result.points + 1} / ${result.visitsRequired} passages`,
        snapshot: { progressLabel: `${result.points + 1} / ${result.visitsRequired} passages`, rewardAvailable: false },
        merchantName: result.merchant?.name ?? "",
        grantExpiresAt: new Date().toISOString(),
      });
      setPhase("success");
      return;
    }

    setBusy(true);
    setError(null);
    const response = await commitCaisseTransaction({
      grantId: result.grantId,
      action: "EARN",
      purchaseAmountCents: amountCents,
      idempotencyKey: earnKey,
    });
    setBusy(false);
    if (!response.ok) {
      setError(response.data.error ?? "Validation impossible.");
      return;
    }
    earnDoneRef.current = true;
    setSuccess(response.data);
    setPhase("success");
  }

  function askRedeem(reward: EvaluatedReward) {
    redeemKeyRef.current = newIdempotencyKey();
    setSelectedReward(reward);
    setPhase("reward_confirm");
  }

  async function confirmRedeem() {
    if (!selectedReward || busy) return;
    if (demo) {
      setSuccess((current) =>
        current
          ? {
              ...current,
              points: Math.max(0, current.points - selectedReward.cost),
              successTitle: "Avantage utilisé",
              successMessage: `Nouveau solde : ${Math.max(0, current.points - selectedReward.cost)} ${current.unitLabel}`,
            }
          : current,
      );
      setPhase("success");
      return;
    }
    setBusy(true);
    setError(null);
    const response = await commitCaisseTransaction({
      grantId: result.grantId,
      action: "REDEEM",
      purchaseAmountCents: amountCents,
      rewardId: selectedReward.id,
      idempotencyKey: redeemKeyRef.current,
    });
    setBusy(false);
    if (!response.ok) {
      setError(response.data.error ?? "Utilisation impossible.");
      setPhase("checkout");
      return;
    }
    setSuccess(response.data);
    setSelectedReward(null);
    setPhase("success");
  }

  function scrollToRewards() {
    rewardsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setHighlightRewards(true);
    window.setTimeout(() => setHighlightRewards(false), 1400);
  }

  const earnLabel = view?.primaryActionLabel ?? result.earnPreviewLabel ?? "Valider";
  const previewLine = view?.previewLines?.[0] ?? null;
  const blockMessage = view?.block
    ? view.block.details?.[0] ?? view.block.message
    : null;
  const canSubmit =
    permissions.addPoints &&
    !earnDoneRef.current &&
    !busy &&
    !previewing &&
    !view?.block &&
    !(result.requirePurchaseAmount && amountCents === undefined) &&
    !(amount.trim() && parsedAmount && !parsedAmount.ok);

  return (
    <div className="cashier-checkout flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-x-hidden pb-2">
      <header className="cashier-checkout__header flex min-w-0 items-center gap-2 rounded-xl border border-[var(--stroke)] bg-[var(--surface-raised)] px-3 py-2">
        {result.merchant?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.merchant.logoUrl}
            alt=""
            className="h-8 w-8 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
            style={{ backgroundColor: result.merchant?.primaryColor ?? "var(--violet)" }}
          >
            {(result.merchant?.name ?? customerLabel).slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-[var(--ink)]">{customerLabel}</p>
          {result.merchant?.name ? (
            <p className="truncate text-xs text-[var(--muted-strong)]">{result.merchant.name}</p>
          ) : null}
        </div>
      </header>

      {phase === "reward_confirm" && selectedReward ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
            <p className="text-sm text-[var(--muted-strong)]">Confirmer l&apos;utilisation</p>
            <p className="mt-2 text-xl font-black text-[var(--ink)]">{customerLabel}</p>
            <p className="mt-1 font-semibold">{selectedReward.name}</p>
            <p className="text-sm">Coût : {selectedReward.costLabel}</p>
            <p className="text-sm">
              Solde actuel : {view?.points ?? result.points} {view?.unitLabel ?? result.unitLabel}
            </p>
          </div>
          <Button className="w-full py-4" disabled={busy} onClick={() => void confirmRedeem()}>
            {busy ? "Validation…" : "Confirmer l'utilisation"}
          </Button>
          <Button variant="ghost" className="w-full" disabled={busy} onClick={() => setPhase(success ? "success" : "checkout")}>
            Annuler
          </Button>
        </div>
      ) : (
        <>
          <div className="cashier-checkout__primary sticky top-0 z-10 space-y-2 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)]/95 p-3 backdrop-blur-sm">
            <AmountField
              value={amount}
              onChange={setAmount}
              disabled={busy || earnDoneRef.current}
              compact
            />

            {previewing ? (
              <p className="text-xs font-semibold text-[var(--muted)]">Vérification…</p>
            ) : previewLine ? (
              <p className="text-sm font-semibold text-[var(--violet-bright)]">{previewLine}</p>
            ) : null}

            {phase === "success" && success ? (
              <p className="text-sm font-black text-[var(--positive)]">
                {success.successTitle} · {success.successMessage}
              </p>
            ) : null}

            {blockMessage ? (
              <p className="text-xs font-semibold text-[var(--danger)]">{blockMessage}</p>
            ) : null}

            {permissions.addPoints && !earnDoneRef.current ? (
              <button
                type="button"
                className="glass-cta w-full justify-center py-3.5 text-base font-black disabled:opacity-50"
                disabled={!canSubmit}
                onClick={() => void commitEarn()}
              >
                {busy ? "Validation…" : earnLabel}
              </button>
            ) : null}
          </div>

          {availableRewards.length > 0 ? (
            <button
              type="button"
              className="cashier-rewards-widget w-full rounded-2xl border border-[var(--positive)]/35 bg-[rgba(56,217,169,0.12)] px-4 py-3 text-left backdrop-blur-sm"
              onClick={scrollToRewards}
            >
              <p className="text-sm font-black text-[var(--positive)]">
                🎁 {availableRewards.length} avantage{availableRewards.length > 1 ? "s" : ""} disponible
                {availableRewards.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs font-semibold text-[var(--ink)]">Voir les avantages ↓</p>
            </button>
          ) : null}

          <section
            ref={rewardsSectionRef}
            id="cashier-rewards-section"
            className={`min-w-0 space-y-3 scroll-mt-24 ${highlightRewards ? "cashier-rewards-highlight rounded-2xl" : ""}`}
          >
            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Solde actuel</p>
              <p className="mt-1 text-lg font-black text-[var(--ink)]">{progressLabel}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[var(--violet-bright)]">
                Avantages disponibles
              </h3>
              {availableRewards.length ? (
                availableRewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    disabled={busy || !permissions.redeemReward}
                    onUse={askRedeem}
                  />
                ))
              ) : (
                <p className="text-xs text-[var(--muted)]">Aucun avantage utilisable pour le moment.</p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-3">
              <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[var(--violet-bright)]">
                Prochain avantage
              </h3>
              {nextBenefit ? (
                <div className="mt-2 space-y-0.5 text-xs text-[var(--ink)]">
                  <p className="font-black">{nextBenefit.name}</p>
                  <p>{nextBenefit.progressLabel}</p>
                  <p>{nextBenefit.missingLabel}</p>
                  {nextBenefit.euroEstimate ? <p>{nextBenefit.euroEstimate}</p> : null}
                </div>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {result.nextRewardLabel ?? "Aucun prochain avantage pour le moment."}
                </p>
              )}
            </div>

            {unavailableRewards.length ? (
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted-strong)]">
                  Autres avantages
                </h3>
                {unavailableRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} disabled onUse={askRedeem} />
                ))}
              </div>
            ) : null}
          </section>
        </>
      )}

      {error ? (
        <p role="alert" className="text-xs font-bold text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <Button variant="ghost" className="mt-auto w-full shrink-0" onClick={onReset} disabled={busy}>
        Scanner un autre client
      </Button>
    </div>
  );
}
