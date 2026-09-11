"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { GlassBottomSheet } from "./profile/glass-bottom-sheet";
import { ExpandableQrCode } from "./expandable-qr-code";
import type {
  CustomerMerchantRewardProgress,
  MerchantRewardProgressTarget,
} from "@/lib/customer-reward-progress-types";
import { progressLineForTarget } from "@/lib/customer-reward-progress-view";
import { formatUnitCount } from "@/lib/loyalty-labels";
import type { EvaluatedReward } from "@/lib/loyalty-rewards";

export function MerchantRewardProgressPanel({
  slug,
  merchantName,
  initialProgress,
  qrSrc,
  clientNumber,
  preview = false,
  onRefresh,
}: {
  slug: string;
  merchantName: string;
  initialProgress: CustomerMerchantRewardProgress | null;
  qrSrc: string | null;
  clientNumber?: string | null;
  preview?: boolean;
  onRefresh?: () => void;
}) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);
  const [sheetReward, setSheetReward] = useState<EvaluatedReward | null>(null);
  const [confirmPulse, setConfirmPulse] = useState(false);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  const refreshProgress = useCallback(async () => {
    if (preview) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/customer/loyalty/rewards?merchantSlug=${encodeURIComponent(slug)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("rewards");
      const data = (await response.json()) as CustomerMerchantRewardProgress;
      setProgress(data);
      onRefresh?.();
    } catch {
      // conserve l'état actuel
    } finally {
      setLoading(false);
    }
  }, [preview, slug, onRefresh]);

  useEffect(() => {
    if (!confirmPulse) return;
    const timer = window.setTimeout(() => setConfirmPulse(false), 1800);
    return () => window.clearTimeout(timer);
  }, [confirmPulse]);

  useEffect(() => {
    const handler = () => {
      setConfirmPulse(true);
      void refreshProgress();
    };
    window.addEventListener("merchant-reward-progress:refresh", handler);
    return () => window.removeEventListener("merchant-reward-progress:refresh", handler);
  }, [refreshProgress]);

  const target = progress?.nextTarget ?? null;
  const available = progress?.availableRewards ?? [];
  const upcoming = progress?.upcomingRewards ?? [];
  const later = progress?.laterRewards ?? [];

  return (
    <>
      <section className="merchant-reward-progress glass-panel mt-5 p-5" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Prochain avantage</h2>
          {loading ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">Mise à jour…</span>
          ) : null}
        </div>

        {!progress || (!target && available.length === 0) ? (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Aucun prochain avantage configuré chez {merchantName}.
          </p>
        ) : target ? (
          <TargetBlock target={target} reduced={Boolean(reduced)} pulse={confirmPulse} />
        ) : null}

        {available.length > 0 ? (
          <div className="mt-5 border-t border-white/8 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Mes récompenses disponibles
            </h3>
            <ul className="mt-3 space-y-3">
              {available.map((reward) => (
                <li key={reward.id} className="reward-available-row rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{reward.name}</p>
                      {reward.description ? (
                        <p className="mt-1 text-xs text-[var(--muted-strong)]">{reward.description}</p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-[var(--muted)]">{reward.costLabel}</p>
                      {reward.expiresLabel ? (
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">{reward.expiresLabel}</p>
                      ) : null}
                      {reward.conditions.length ? (
                        <ul className="mt-2 space-y-0.5 text-[10px] text-[var(--muted)]">
                          {reward.conditions.map((line) => (
                            <li key={line}>• {line}</li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="mt-2 text-xs font-semibold text-[var(--positive)]">{reward.status}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="reward-use-btn mt-3 w-full rounded-xl px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    onClick={() => setSheetReward(reward)}
                  >
                    Utiliser cet avantage
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {(upcoming.length > 0 || later.length > 0) && target ? (
          <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Prochains paliers</p>
            <ul className="space-y-2">
              {[...upcoming, ...later]
                .filter((reward) => reward.id !== target.id)
                .slice(0, 4)
                .map((reward) => (
                  <li key={reward.id} className="flex items-center justify-between gap-3 text-xs text-[var(--muted-strong)]">
                    <span className="truncate">{reward.name}</span>
                    <span className="shrink-0 tabular-nums">{reward.costLabel}</span>
                  </li>
                ))}
            </ul>
          </div>
        ) : null}
      </section>

      <GlassBottomSheet
        open={sheetReward != null}
        title="Utiliser votre avantage"
        onClose={() => setSheetReward(null)}
      >
        {sheetReward ? (
          <div className="space-y-4 pb-2">
            <div>
              <p className="text-lg font-bold text-[var(--ink)]">{sheetReward.name}</p>
              <p className="mt-1 text-sm text-[var(--muted-strong)]">{merchantName}</p>
            </div>
            {sheetReward.description ? (
              <p className="text-sm text-[var(--ink-soft)]">{sheetReward.description}</p>
            ) : null}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-[var(--ink-soft)]">
              <p>Seuil : {sheetReward.costLabel}</p>
              {progress ? (
                <p className="mt-1">Solde actuel : {formatUnitCount(progress.balance, progress.unit)}</p>
              ) : null}
              {sheetReward.conditions.map((line) => (
                <p key={line} className="mt-1 text-xs text-[var(--muted)]">
                  {line}
                </p>
              ))}
            </div>
            <div className="mx-auto max-w-[220px]">
              <ExpandableQrCode
                qrSrc={qrSrc}
                clientNumber={clientNumber}
                merchantName={merchantName}
                shellClassName="rounded-2xl bg-white p-3"
              />
            </div>
            <p className="text-center text-sm font-medium text-[var(--ink-soft)]">
              Présentez ce QR au commerçant pour utiliser votre avantage.
            </p>
          </div>
        ) : null}
      </GlassBottomSheet>
    </>
  );
}

function TargetBlock({
  target,
  reduced,
  pulse,
}: {
  target: MerchantRewardProgressTarget;
  reduced: boolean;
  pulse: boolean;
}) {
  const toneClass =
    target.visualState === "unlocked"
      ? "reward-progress-unlocked"
      : target.visualState === "almost"
        ? "reward-progress-almost"
        : "reward-progress-normal";

  return (
    <div className={`mt-3 rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <div className="reward-progress-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg" aria-hidden>
          {target.visualState === "unlocked" ? "✓" : "🎁"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            {target.statusHeadline}
          </p>
          <p className="mt-1 text-base font-bold text-[var(--ink)]">{target.name}</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{progressLineForTarget(target)}</p>
          {target.visualState !== "unlocked" ? (
            <p className="mt-1 text-xs text-[var(--muted-strong)]">
              Encore {formatUnitCount(target.remaining, target.unit)}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-medium text-[var(--ink-soft)]">{target.statusText}</p>
        </div>
        <span className="text-sm font-black tabular-nums text-[var(--violet-bright)]">{target.percent} %</span>
      </div>

      <div className="reward-progress-track mt-4 h-2 overflow-hidden rounded-full">
        <motion.div
          className="reward-progress-fill h-full rounded-full"
          initial={false}
          animate={{ width: `${target.percent}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
          data-pulse={pulse ? "1" : "0"}
        />
      </div>
    </div>
  );
}

export function notifyMerchantRewardProgressRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("merchant-reward-progress:refresh"));
}
