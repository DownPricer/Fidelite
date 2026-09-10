"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MerchantCardScanResult } from "@/components/fife-life/merchant-card-scan-result";
import { AmountField } from "@/components/caisse/amount-field";
import { Button } from "@/components/ui";
import { commitCaisseTransaction, newIdempotencyKey, previewCaisseTransaction } from "@/lib/caisse-client";
import type { LoyaltyTransactionView } from "@/lib/loyalty-commit";
import type { EvaluatedReward } from "@/lib/loyalty-rewards";
import type { NextBenefitView } from "@/lib/loyalty-engine";
import { scanResultToMerchantCard } from "@/lib/scan-result-card";
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
    <article className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-[var(--ink)]">{reward.name}</h3>
          {reward.description ? (
            <p className="mt-1 text-sm text-[var(--muted-strong)]">{reward.description}</p>
          ) : null}
        </div>
        <span className={`shrink-0 text-xs font-bold uppercase ${statusClass(reward.status)}`}>{reward.status}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-[var(--ink)]">Coût : {reward.costLabel}</p>
      <p className="text-xs text-[var(--muted)]">{reward.merchantName}</p>
      {reward.expiresLabel ? <p className="text-xs text-[var(--muted)]">{reward.expiresLabel}</p> : null}
      {reward.conditions.length ? (
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-[var(--muted-strong)]">
          {reward.conditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {reward.reason && !reward.available ? (
        <p className="mt-2 text-xs font-semibold text-[var(--muted-strong)]">{reward.reason}</p>
      ) : null}
      {reward.available ? (
        <Button className="mt-3 w-full py-3" disabled={disabled} onClick={() => onUse(reward)}>
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
  const [earnKey] = useState(() => newIdempotencyKey());
  const redeemKeyRef = useRef(newIdempotencyKey());
  const earnDoneRef = useRef(false);

  const parsedAmount = useMemo(() => (amount.trim() ? tryParsePurchaseAmountToCents(amount) : null), [amount]);
  const amountCents = parsedAmount?.ok ? parsedAmount.cents : undefined;
  const view = success ?? preview;
  const rewards = view?.rewards ?? result.rewards ?? [];
  const nextBenefit = view?.nextBenefit ?? result.nextBenefit ?? null;
  const customerLabel = result.customerName || [result.firstName, result.lastName].filter(Boolean).join(" ");
  const progressLabel = view?.progressLabel ?? result.progressLabel;
  const cardPayload = scanResultToMerchantCard({
    ...result,
    firstName: customerLabel,
    points: view?.points ?? result.points,
    visitsRequired: view?.visitsRequired ?? result.visitsRequired,
    rewardLabel: view?.rewardLabel ?? result.rewardLabel,
  });

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

  const blockDetails = view?.block?.details ?? [];
  const earnLabel = view?.primaryActionLabel ?? result.earnPreviewLabel ?? "Valider";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-x-hidden">
      {cardPayload ? (
        <MerchantCardScanResult
          card={cardPayload.card}
          clientName={customerLabel}
          merchant={cardPayload.merchant}
        />
      ) : (
        <div className="metric-card min-w-0 p-4">
          <h2 className="truncate text-3xl font-black text-[var(--ink)]">{customerLabel}</h2>
          <p className="mt-2 text-lg font-bold text-[var(--violet-bright)]">{progressLabel}</p>
        </div>
      )}

      <div className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Solde actuel</p>
        <p className="mt-1 text-xl font-black text-[var(--ink)]">{progressLabel}</p>
      </div>

      {phase !== "reward_confirm" ? (
        <>
          <AmountField value={amount} onChange={setAmount} disabled={busy || earnDoneRef.current} />

          {previewing ? <p className="text-sm text-[var(--muted)]">Calcul du gain…</p> : null}

          {view?.previewLines.length ? (
            <div className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
              {view.previewLines.map((line) => (
                <p key={line} className="text-sm font-semibold text-[var(--ink)]">
                  {line}
                </p>
              ))}
              {view.ruleApplied ? (
                <p className="mt-2 text-xs text-[var(--muted)]">Règle : {view.ruleApplied}</p>
              ) : null}
            </div>
          ) : null}

          {view?.block ? (
            <div role="alert" className="rounded-2xl border border-[var(--danger)]/40 bg-[rgba(241,93,116,0.08)] p-4">
              <p className="font-black text-[var(--danger)]">{view.block.title}</p>
              {blockDetails.length
                ? blockDetails.map((line) => (
                    <p key={line} className="mt-1 text-sm text-[var(--ink)]">
                      {line}
                    </p>
                  ))
                : (
                    <p className="mt-1 text-sm text-[var(--ink)]">{view.block.message}</p>
                  )}
            </div>
          ) : null}

          {phase === "success" && success ? (
            <div className="rounded-2xl border border-[var(--positive)]/40 bg-[rgba(56,217,169,0.1)] p-4">
              <p className="text-lg font-black text-[var(--positive)]">{success.successTitle}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{success.successMessage}</p>
            </div>
          ) : null}

          {permissions.addPoints && !earnDoneRef.current ? (
            <button
              type="button"
              className="glass-cta w-full justify-center py-4 text-lg font-black disabled:opacity-50"
              disabled={busy || previewing || Boolean(view?.block)}
              onClick={() => void commitEarn()}
            >
              {busy ? "Validation…" : earnLabel}
            </button>
          ) : null}
        </>
      ) : selectedReward ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
            <p className="text-sm text-[var(--muted-strong)]">Confirmer l&apos;utilisation</p>
            <p className="mt-2 text-xl font-black text-[var(--ink)]">{customerLabel}</p>
            <p className="mt-1 font-semibold">{selectedReward.name}</p>
            <p className="text-sm">Coût : {selectedReward.costLabel}</p>
            <p className="text-sm">Solde actuel : {view?.points ?? result.points} {view?.unitLabel ?? result.unitLabel}</p>
            <p className="text-sm">
              Nouveau solde : {(view?.points ?? result.points) - selectedReward.cost} {view?.unitLabel ?? result.unitLabel}
            </p>
          </div>
          <Button className="w-full py-4" disabled={busy} onClick={() => void confirmRedeem()}>
            {busy ? "Validation…" : "Confirmer l'utilisation"}
          </Button>
          <Button variant="ghost" className="w-full" disabled={busy} onClick={() => setPhase(success ? "success" : "checkout")}>
            Annuler
          </Button>
        </div>
      ) : null}

      {phase !== "reward_confirm" ? (
        <>
          <section className="min-w-0 space-y-2">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--violet-bright)]">
              Avantages disponibles
            </h3>
            {rewards.length ? (
              rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  disabled={busy || !permissions.redeemReward}
                  onUse={askRedeem}
                />
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">Aucun avantage configuré pour ce commerce.</p>
            )}
          </section>

          <section className="min-w-0 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-raised)] p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--violet-bright)]">
              Prochain avantage
            </h3>
            {nextBenefit ? (
              <div className="mt-2 space-y-1 text-sm text-[var(--ink)]">
                <p className="font-black">{nextBenefit.name}</p>
                <p>{nextBenefit.progressLabel}</p>
                <p>{nextBenefit.missingLabel}</p>
                {nextBenefit.euroEstimate ? <p>{nextBenefit.euroEstimate}</p> : null}
                {nextBenefit.remainingPurchases ? (
                  <p>
                    Encore {nextBenefit.remainingPurchases} achat
                    {nextBenefit.remainingPurchases > 1 ? "s" : ""} similaire
                    {nextBenefit.remainingPurchases > 1 ? "s" : ""} avant le prochain avantage
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">
                {result.nextRewardLabel ?? "Aucun prochain avantage pour le moment."}
              </p>
            )}
          </section>
        </>
      ) : null}

      {error ? (
        <p role="alert" className="whitespace-pre-line text-sm font-bold text-[var(--danger)]">
          {error}
        </p>
      ) : null}

      <Button variant="ghost" className="mt-auto w-full shrink-0" onClick={onReset} disabled={busy}>
        Scanner un autre client
      </Button>
    </div>
  );
}
